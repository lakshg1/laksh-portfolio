/**
 * Storage layer — libSQL (SQLite).
 *
 * Local dev  : a plain file at ./data/portfolio.db (see DATABASE_URL default).
 * Production : point DATABASE_URL at a hosted Turso database (libSQL) so writes
 *              persist on Vercel's read-only filesystem. Same client, same SQL.
 *
 * Env:
 *   DATABASE_URL         file:./data/portfolio.db  (default)  |  libsql://<db>.turso.io
 *   DATABASE_AUTH_TOKEN  required only for Turso
 */
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createClient, type Client } from '@libsql/client';

let _client: Client | null = null;
let _ready: Promise<void> | null = null;

function url(): string {
  return process.env.DATABASE_URL || 'file:./data/portfolio.db';
}

export function db(): Client {
  if (_client) return _client;
  const u = url();
  // One-time connection log — says which storage is live. Host/path only, never credentials.
  try {
    console.log(
      u.startsWith('file:')
        ? `[db] using LOCAL SQLite file → ${u.slice('file:'.length)}`
        : `[db] using TURSO (remote) → ${new URL(u).host}`,
    );
  } catch {
    console.error(`[db] DATABASE_URL is not a parseable URL (length ${u.length}) — check .env.local for quotes/spaces`);
  }
  // For local file: DBs, make sure the parent directory exists first.
  if (u.startsWith('file:')) {
    try {
      mkdirSync(dirname(u.slice('file:'.length)), { recursive: true });
    } catch {
      /* ignore */
    }
  }
  _client = createClient({
    url: u,
    authToken: process.env.DATABASE_AUTH_TOKEN, // ignored for file: urls
    // Next.js monkey-patches global fetch for its cache; that patch breaks the
    // streaming POST bodies libsql sends to Turso ("expected non-null body
    // source"). Opting every DB request out of the cache bypasses the patch.
    fetch: (input: RequestInfo | URL, init?: RequestInit) =>
      fetch(input, { ...init, cache: 'no-store' }),
  });
  return _client;
}

/** Idempotent schema creation. Cheap to call before every query. */
export function ready(): Promise<void> {
  if (_ready) return _ready;
  _ready = (async () => {
    const c = db();
    await c.batch(
      [
        `CREATE TABLE IF NOT EXISTS cvs (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          filename    TEXT NOT NULL,
          mime        TEXT NOT NULL DEFAULT 'application/pdf',
          bytes       BLOB NOT NULL,
          content     TEXT NOT NULL DEFAULT '',
          hash        TEXT NOT NULL,
          size        INTEGER NOT NULL DEFAULT 0,
          is_current  INTEGER NOT NULL DEFAULT 0,
          created_at  TEXT NOT NULL DEFAULT (datetime('now'))
        )`,
        `CREATE TABLE IF NOT EXISTS cover_letters (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          cv_id       INTEGER,
          cv_hash     TEXT NOT NULL,
          mode        TEXT NOT NULL DEFAULT 'generic',
          len         TEXT NOT NULL DEFAULT 'long',
          company     TEXT NOT NULL DEFAULT '',
          role        TEXT NOT NULL DEFAULT '',
          prompt      TEXT NOT NULL DEFAULT '',
          model       TEXT NOT NULL DEFAULT '',
          source      TEXT NOT NULL DEFAULT 'llm',
          content     TEXT NOT NULL,
          created_at  TEXT NOT NULL DEFAULT (datetime('now'))
        )`,
        `CREATE INDEX IF NOT EXISTS idx_cvs_current ON cvs (is_current)`,
        `CREATE INDEX IF NOT EXISTS idx_letters_hash ON cover_letters (cv_hash, mode)`,
      ],
      'write',
    );
    // DBs created before the len column existed: add it in place.
    // (SQLite has no ADD COLUMN IF NOT EXISTS — a duplicate-column error means done.)
    // Named `len`, not `length`: @libsql/client rows are array-like, and a column
    // called `length` is shadowed by the built-in Row.length property.
    try {
      await c.execute(`ALTER TABLE cover_letters ADD COLUMN len TEXT NOT NULL DEFAULT 'long'`);
    } catch {
      /* column already present */
    }
  })();
  return _ready;
}
