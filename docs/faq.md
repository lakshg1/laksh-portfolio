# FAQ — Why is it built this way?

Design-decision answers for future-me (and anyone reading the code). Companion
docs: [`cv-cover-letter-flow.md`](cv-cover-letter-flow.md) (architecture &
limitations), [`turso-setup.md`](turso-setup.md) (database ops).

## Why Ollama at all, when Groq/Gemini are configured?

Ollama was the starting point: free, private (the CV never leaves the machine),
and no API key to manage. It remains the default provider because it's the only
one that works with zero external accounts. Its weaknesses are why the hosted
providers were added: it's unreachable from Vercel (it lives on localhost), dies
with the laptop, and large local models can hang while cold-loading into RAM.
In practice: **Ollama for offline/private tinkering, Groq or Gemini for
anything deployed.**

## Why Groq and Gemini specifically?

Both have genuinely usable free tiers and both speak the OpenAI-compatible
Chat Completions API, which the app's single LLM seam (`src/lib/llm.ts`)
already talks. Groq is the recommended default — very fast Llama-70B
inference, generous free rate limits, fine quality for a 300-word letter.
Gemini is the fallback/alternative; note its default model is the rolling
alias `gemini-flash-latest` because Google retires pinned versions
(`gemini-2.5-flash` already 404s for new keys). Privacy caveat: free hosted
tiers may train on inputs, and a CV is personal data — acceptable trade-off
for my own CV, but it's why the provider is a one-line env switch rather than
hardcoded.

## Why one "LLM seam" instead of per-provider SDKs?

`llm.ts` is the only file that talks to a model; everything else calls
`generate()`. Because every provider accepts the same OpenAI-shaped request,
adding one is ~10 lines in a switch statement — no SDK dependencies, no
provider types leaking into routes. This also makes the degradation rule
trivial to enforce in one place: any failure (endpoint down, missing key,
empty response) falls back to a deterministic template, marked
`source: "template"` so the UI can flag it. The feature never hard-fails.

## Why Turso for the database?

Constraints, in order: (1) Vercel's filesystem is read-only and ephemeral, so
"just use a SQLite file" doesn't survive deployment; (2) the data is tiny (one
CV blob + some letters), so a fat Postgres instance is overkill; (3) I wanted
the local-dev story to stay a zero-setup file on disk. Turso is hosted libSQL —
*the same SQLite dialect* — so one client (`@libsql/client`) serves both modes
and the switch is purely `DATABASE_URL`. Alternatives considered: Vercel
Postgres/Neon (heavier, different dialect, needs migrations tooling),
Vercel KV/Blob (no relational queries for the cache lookups), keeping
everything in-repo (can't write at runtime).

## Why no migrations tool (Alembic/Drizzle/Prisma)?

The schema is two tables owned by one small app. `ready()` runs idempotent
`CREATE TABLE IF NOT EXISTS` before every query, and the one column added
later (`len`) ships as a try/catch `ALTER TABLE`. That's the entire migration
story, and it works identically on a fresh file DB and on Turso. A migrations
framework earns its complexity when there are many tables, many environments,
or destructive changes — none apply here. If the schema ever grows real
history, Drizzle is the natural fit for this stack.

## Why is the whole PDF stored as a BLOB in the database?

So production has no filesystem dependency at all: `/api/cv` can serve the
exact uploaded bytes from the DB row. One CV is ~75KB — SQLite handles blobs
that size effortlessly. The local `public/resume.pdf` mirror exists only so
the static-download flow keeps working in dev without the DB.

## Why hash-based change detection?

The CV's SHA-256 is its identity. Re-uploading the same file is a no-op, and
the generic-letter cache is keyed on (CV hash, length) — so an unchanged CV
never wastes an LLM call, and any edit to the PDF automatically invalidates
the cache. Content-addressing gives both behaviors for free with zero
bookkeeping.

## Why is auth a signed cookie instead of sessions/NextAuth?

One admin user, password from env. A stateless HMAC-signed cookie needs no
session table, no adapter, works on serverless, and survives server restarts.
NextAuth would add providers/adapters/config for a login page with exactly one
account. Known trade-off (documented in the flow doc): no login rate limiting —
mitigated by a long password, and acceptable for a personal tool guarding
non-catastrophic data.

## Why is /admin noindexed-but-public rather than IP-locked?

Same philosophy as /studio: obscurity plus a real gate where it matters. The
route itself reveals nothing (a password form); every API behind it checks the
cookie. IP allowlists break the "use it from any device" goal that motivated
the whole feature.

## Why does the fallback template exist at all? Isn't a canned letter useless?

It converts "the LLM is down" from an error page into a degraded-but-working
result, clearly labeled in the UI and in the DB (`source: "template"`).
Deliberately *not* cached, so a later retry with a healthy LLM regenerates
properly. The cost of keeping it honest: template retries insert duplicate
rows (known limitation #2 in the flow doc).

## Why short/long as the only length control, not a word-count slider?

Two honest use cases exist: a skimmable ~140-word note (most applications) and
a fuller ~300-word letter (when asked for one). A slider implies precision
LLMs can't reliably deliver and multiplies the cache dimensions. Two enum
values keep the cache key clean — (CV hash, length) — and the UI to one
segmented control.

## Why is the DB column called `len` instead of `length`?

Bug found in testing: `@libsql/client` rows are *array-like* objects, so a
column named `length` is shadowed by the built-in `Row.length` property (you
get the column count instead of the value — silently). The SQL column is
`len`; the repo layer maps it back to the semantic `length` field at the API
boundary. See `rowToLetter()` in `src/lib/repo.ts`.

## Why does the admin UI live in one client component with fetch calls?

It's a single-user internal tool: one file (`AdminClient.tsx`), plain
`fetch`, `useState` — no data-fetching library, no global store, no server
components with streaming. The public site is where the engineering budget
goes; the admin panel optimizes for being obvious to edit in six months. It
does, however, share the site's design tokens, so it stays visually part of
the product.

## Why .doc download instead of PDF?

The Word-XML trick (an HTML file with a `.doc` extension and Office
namespaces) is ~20 lines and produces a file recruiters can open and *edit* —
which is what actually happens to cover letters. Client-side PDF generation
would add a heavy dependency for a worse editing story. Copy-paste covers the
rest.
