# CV Upload & Cover Letter Generation — Flow, Dependencies, Limitations

_Last verified: 2026-08-01, by an end-to-end test against the local dev server._

## What this feature does

An admin-only pipeline: upload a CV (PDF) → extract its text → generate cover
letters from it with an LLM → cache and list them. Lives entirely under
`/admin` (UI) and `/api/admin/*` (routes).

## The flow

```
                       ┌─────────────────────────────────────────────┐
                       │                /admin (UI)                  │
                       └───────┬─────────────────────┬───────────────┘
                               │                     │
                 POST /api/admin/cv        POST /api/admin/cover-letters
                               │                     │
       ┌───────────────────────▼──────┐   ┌──────────▼──────────────────────┐
       │ 1. auth guard (HMAC cookie)  │   │ 1. auth guard                   │
       │ 2. read PDF bytes            │   │ 2. load current CV (text+hash)  │
       │ 3. SHA-256 hash              │   │ 3. generic + not forced?        │
       │ 4. hash == current CV?       │   │    → look up cached LLM letter  │
       │    → no-op (change gate)     │   │    → hit? return it, done       │
       │ 5. pdfToText (unpdf/pdf.js)  │   │ 4. call LLM (OpenAI-compatible) │
       │ 6. INSERT into cvs           │   │    → unreachable? template      │
       │    (blob + text + hash)      │   │      fallback, marked as such   │
       │ 7. local dev: mirror to      │   │ 5. INSERT into cover_letters    │
       │    public/resume.pdf + stamp │   │                                 │
       └──────────────────────────────┘   └─────────────────────────────────┘
```

Key files:

| File | Role |
|---|---|
| `src/lib/db.ts` | libSQL client + idempotent schema (`cvs`, `cover_letters`) |
| `src/lib/repo.ts` | All SQL: insert/read CVs, letters, generic-letter cache lookup |
| `src/lib/cv.ts` | PDF → text (unpdf) + SHA-256 content hashing |
| `src/lib/llm.ts` | Single LLM seam — OpenAI-compatible Chat Completions, swap by env |
| `src/lib/auth.ts` / `guard.ts` | Stateless HMAC-signed admin cookie (serverless-safe) |
| `src/lib/localResume.ts` | Dev-only mirror of upload → `public/resume.pdf` + date stamp |

Change detection is hash-based: the CV's SHA-256 is its identity. Re-uploading
an identical PDF is a no-op; a `generic` letter is reused for the same CV hash
until the CV changes or `force` is passed. `targeted` letters (company/role
specific) are always freshly generated.

## Deployment dependencies

The DB layer is **libSQL** — one client, two modes, chosen purely by env:

| Env | Local dev | Production (Vercel) |
|---|---|---|
| `DATABASE_URL` | default `file:./data/portfolio.db` (SQLite file) | **required**: `libsql://<db>.turso.io` |
| `DATABASE_AUTH_TOKEN` | unused | **required** (Turso token) |
| `ADMIN_PASSWORD` | required for /admin | **required** (503 without it) |
| `ADMIN_SECRET` | optional cookie-signing key | recommended (falls back to password) |
| `LLM_PROVIDER` | `ollama` (default) \| `groq` \| `gemini` | pick a hosted one for prod |
| `OLLAMA_BASE_URL` / `OLLAMA_MODEL` | ollama mode only | unusable on Vercel (localhost) |
| `GROQ_API_KEY` / `GROQ_MODEL` | groq mode (default model `llama-3.3-70b-versatile`) | free tier at console.groq.com |
| `GEMINI_API_KEY` / `GEMINI_MODEL` | gemini mode (default model `gemini-flash-latest`, a rolling alias — pinned versions get retired) | free tier at aistudio.google.com |
| `OPENAI_API_KEY` | optional bearer for custom ollama-mode endpoints | — |

Hard truths for deploy:

- **File-mode SQLite cannot work on Vercel** — the filesystem is read-only and
  ephemeral. Without Turso (or another hosted libSQL), uploads fail/vanish.
  Turso's free tier is ample for this workload.
- Schema is self-creating (`CREATE TABLE IF NOT EXISTS` before every query).
  No migration tooling — fine at this size, see limitations.
- The LLM default (`localhost:11434`) is meaningless in production. Without a
  reachable endpoint every letter silently degrades to the deterministic
  template (`source: "template"` in the response — the UI can tell, but nothing
  shouts about it).

## Known limitations & bugs (as designed/found today)

1. **[FIXED 2026-08-01] Uploaded PDF blob was stored empty.** pdf.js (inside
   `unpdf`) *detaches* the `Uint8Array`'s underlying buffer during parsing,
   and `insertCv()` ran after it — so `cvs.bytes` got a 0-byte blob and the
   dev-only `public/resume.pdf` mirror was clobbered too. Hashing still
   worked (computed first), which masked the bug. Fix shipped in
   `src/lib/cv.ts`: the extractor now parses a copy (`bytes.slice()`).
2. **Template fallbacks are never cached** (`findCachedGeneric` filters
   `source = 'llm'`). Deliberate — but the consequence is every retry while
   the LLM is down inserts a new identical template row. Rows accumulate.
3. **[FIXED 2026-08-01] Generic template contained placeholders.** The
   fallback now writes a sendable generic opening instead of literal
   `[Role Title]` / `[Company Name]` brackets.
4. **Change-detection can trap you.** Because identity is the file hash, once
   a CV row exists (even a corrupt one, per bug 1), re-uploading the same PDF
   is refused as "identical". There is no delete-CV endpoint; recovery means
   touching the DB by hand.
5. **`maxDuration = 120` needs a paid Vercel plan.** Hobby caps function
   execution well below that; a slow model will 504.
6. **No login rate limiting.** `ADMIN_PASSWORD` can be brute-forced at
   `/api/admin/login`; the HMAC cookie is solid but the front door is open.
   Mitigate with a long password and/or Vercel WAF rules.
7. **PDFs live as blobs in the DB row.** Fine for one CV; listing endpoints
   select metadata only, but Turso free-tier row/DB size limits apply if this
   ever holds many versions (every upload keeps the old rows; nothing prunes).
8. **Privacy**: the full CV text is sent to whatever LLM endpoint is
   configured. Free hosted tiers typically reserve the right to train on
   inputs — a CV is personal data; choose the provider accordingly.

## LLM options (all plug in via env only — the seam is OpenAI-compatible)

| Option | Cost | Notes |
|---|---|---|
| Local Ollama (current) | free | Model name must exist: `ollama list` — e.g. set `OLLAMA_MODEL=qwen3-coder:latest`; dies with the laptop; not reachable from Vercel |
| Cloudflare Tunnel → home Ollama | free | Exposes local Ollama to prod; private, but only up when your machine is |
| Groq free tier | free | Very fast Llama models; OpenAI-compatible; generous free RPM for this use |
| Google Gemini (OpenAI-compat endpoint) | free tier | Good quality (Flash); free tier may use data for training |
| OpenRouter `:free` models | free | One key, many models; availability varies |
| Any paid API (OpenAI/Anthropic-via-proxy/Mistral) | ~cents | Best quality + no training on data (per API terms) |

Swap = change `LLM_PROVIDER` and set that provider's key. No code change.
Both Groq and Gemini were verified end-to-end in-app on 2026-08-01.

## Letter length

`POST /api/admin/cover-letters` accepts `length: 'short' | 'long'`
(default `short`). Short ⇒ 2 paragraphs, 110–160 words; long ⇒ 3–4
paragraphs, ~250–320 words. The generic-letter cache is keyed per
(CV hash, length), so short and long variants cache independently.
DB note: the column is `len`, not `length` — @libsql/client rows are
array-like and a `length` column gets shadowed by `Row.length`.

## Deploying to Vercel — checklist

1. Push the repo to GitHub and import it in Vercel (framework auto-detects
   Next.js; no build config needed).
2. Create a free DB at turso.tech → copy its `libsql://…` URL and create an
   auth token (`turso db tokens create <db>` or via dashboard).
3. In Vercel → Project → Settings → Environment Variables, add:
   - `DATABASE_URL` = `libsql://<db>.turso.io`
   - `DATABASE_AUTH_TOKEN` = the Turso token
   - `ADMIN_PASSWORD` = a long random string
   - `ADMIN_SECRET` = a different long random string (cookie signing)
   - `LLM_PROVIDER` = `groq` (or `gemini`)
   - `GROQ_API_KEY` / `GEMINI_API_KEY` = your key(s)
4. Deploy, open `/admin` on the deployed URL, log in, upload the CV once
   (the prod DB starts empty — schema self-creates on first request).
5. Watch the Hobby-plan function timeout: this route asks for
   `maxDuration = 120`, Hobby caps lower. Groq/Gemini respond in seconds so
   it's fine in practice; only slow self-hosted endpoints would 504.

## Moving local state to another machine

Nothing gitignored is required to *run* elsewhere — prod state lives in
Turso and env vars live in Vercel. For local dev on a second device you
need exactly two things:

| What | Why | How to move |
|---|---|---|
| `.env.local` | all secrets/config | AirDrop / private message to yourself / a password manager secure note — never commit it, never email it in plaintext if avoidable. Or just re-create it: it's ~8 lines. |
| `data/portfolio.db` | local CV + letter history | optional — copy the single file the same way, or skip it and re-upload the CV on the new machine (schema self-creates) |

Alternative that avoids file transfer entirely: point local dev at the same
Turso DB by putting the prod `DATABASE_URL`/`DATABASE_AUTH_TOKEN` in the new
machine's `.env.local` — then all devices share one database.
