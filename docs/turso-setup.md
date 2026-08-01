# Turso — Setup & Maintenance

Turso is the hosted libSQL (SQLite-compatible) database this app uses in
production, because Vercel's filesystem is read-only. Locally the app uses a
plain SQLite file (`data/portfolio.db`) and needs none of this. Free "Starter"
plan is ample: one ~75KB CV blob + a few KB per letter vs. 9GB storage and
1B row-reads/month.

One database serves all environments that point at it — there is no
schema/migration step ever: the app runs `CREATE TABLE IF NOT EXISTS` before
every query (`src/lib/db.ts → ready()`).

## One-time: create the database

### Option A — dashboard (no CLI)

1. [turso.tech](https://turso.tech) → sign up with GitHub (free, no card).
2. Create Database → name `portfolio` → region nearest your users/Vercel
   (e.g. `aws-ap-south-1`, Mumbai).
3. Copy the **URL** (`libsql://portfolio-<org>.turso.io`).
4. Database → **Create Token** → copy it (a long JWT — treat as a password).

### Option B — CLI

```bash
# install (macOS — note the trust steps, Homebrew requires them for 3rd-party taps)
brew tap tursodatabase/tap && brew trust tursodatabase/tap
brew install tursodatabase/tap/turso

turso auth login                     # GitHub OAuth in the browser
turso db create portfolio --location aws-ap-south-1
turso db show portfolio --url        # → DATABASE_URL
turso db tokens create portfolio     # → DATABASE_AUTH_TOKEN
```

## Wiring the credentials

| Where | How |
|---|---|
| **Vercel (prod)** | Project → Settings → Environment Variables → add `DATABASE_URL` + `DATABASE_AUTH_TOKEN` (Production) → redeploy. Env changes only apply to *new* deployments. |
| **A dev machine (isolated)** | Nothing — leave `DATABASE_URL` unset; the app falls back to `file:./data/portfolio.db`. |
| **A dev machine (shared with prod)** | Put the same two vars in that machine's `.env.local`. All devices + prod then share one DB — no file transfer needed. ⚠ Local actions (e.g. Delete in /admin) then hit real prod data. |

## Setting up a brand-new machine — full checklist

1. `git clone` the repo, `npm install`.
2. Create `.env.local` (gitignored — transfer via AirDrop / password-manager
   secure note, or retype; it's ~8 lines):
   - `ADMIN_PASSWORD`, `ADMIN_SECRET`
   - `LLM_PROVIDER` + `GROQ_API_KEY` / `GEMINI_API_KEY`
   - optionally `DATABASE_URL` + `DATABASE_AUTH_TOKEN` (shared-DB mode above)
3. `npm run dev` → `/admin` → upload the CV (skip if sharing the prod DB —
   it's already there).

## Maintenance

| Cadence | Task |
|---|---|
| When a device/key may be compromised | **Rotate the token**: `turso db tokens create portfolio` → update Vercel + any `.env.local` → old token can be invalidated with `turso db tokens invalidate portfolio` (invalidates ALL tokens for the db — re-issue everywhere after). |
| Occasionally | **Backup**: `turso db shell portfolio .dump > backup.sql` — plain SQL text, restorable anywhere SQLite runs. The CV PDF itself lives in the `cvs.bytes` blob and is included. |
| Occasionally | **Prune history**: old CV versions accumulate (every upload inserts a row; nothing deletes them). `turso db shell portfolio "DELETE FROM cvs WHERE is_current = 0"` if size ever matters. Letters can be deleted from the /admin UI. |
| Rarely | **Usage check**: dashboard → Usage, or `turso db inspect portfolio`. This app will never approach free-tier limits in normal use. |

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Prod letters/uploads 500 with auth errors | Token expired/invalidated or env var not applied — re-issue token, update Vercel, **redeploy**. |
| `/admin` works locally, empty in prod | Local and prod are different databases (expected in isolated mode) — upload the CV once in prod, or switch to shared-DB mode. |
| `SQLITE_BUSY` / write conflicts | Two writers racing (e.g. two devices generating simultaneously in shared mode) — retry; this app's write volume makes it vanishingly rare. |
| CLI says not logged in on a new machine | `turso auth login` again — auth is per-machine. |
| **Local `next dev` can't reach Turso**: `TypeError: fetch failed … expected non-null body source`, while a plain `node -e` script with the same URL+token connects fine | Known local-dev issue on very new Node majors (seen on Node 25.6 with Next 15.5; `serverExternalPackages` + a `cache:'no-store'` fetch didn't cure it). **Workarounds:** keep local dev on the file DB (comment out `DATABASE_URL` in `.env.local` — recommended), or run the dev server on Node 20/22 LTS via nvm. Vercel builds run Node 20/22, so production is not affected the same way — but verify `/admin` right after the first deploy, and if prod logs ever show this error, pin the Node version in Vercel → Settings → General → Node.js Version. |
