/**
 * Repository layer — the only module that writes SQL. Route handlers call these
 * functions and never touch the client directly (keeps transport/storage apart).
 */
import { db, ready } from '@/lib/db';
import type { Length, Mode } from '@/lib/llm';

export interface CvMeta {
  id: number;
  filename: string;
  hash: string;
  size: number;
  created_at: string;
}
export interface CvRecord extends CvMeta {
  mime: string;
  content: string;
  bytes: Uint8Array;
}
export interface Letter {
  id: number;
  cv_hash: string;
  mode: Mode;
  length: Length;
  company: string;
  role: string;
  prompt: string;
  model: string;
  source: string;
  content: string;
  created_at: string;
}

export async function getCurrentCvMeta(): Promise<CvMeta | null> {
  await ready();
  const r = await db().execute(
    `SELECT id, filename, hash, size, created_at FROM cvs WHERE is_current = 1 ORDER BY id DESC LIMIT 1`,
  );
  return (r.rows[0] as unknown as CvMeta) ?? null;
}

export async function getCurrentCv(): Promise<CvRecord | null> {
  await ready();
  const r = await db().execute(
    `SELECT id, filename, mime, hash, size, content, bytes, created_at FROM cvs WHERE is_current = 1 ORDER BY id DESC LIMIT 1`,
  );
  const row = r.rows[0] as Record<string, unknown> | undefined;
  if (!row) return null;
  return {
    id: Number(row.id),
    filename: String(row.filename),
    mime: String(row.mime),
    hash: String(row.hash),
    size: Number(row.size),
    content: String(row.content),
    created_at: String(row.created_at),
    bytes: row.bytes as Uint8Array,
  };
}

/** Insert + mark current in one transaction. Returns the new id. */
export async function insertCv(input: {
  filename: string;
  mime: string;
  bytes: Uint8Array;
  content: string;
  hash: string;
  size: number;
}): Promise<number> {
  await ready();
  const c = db();
  await c.execute(`UPDATE cvs SET is_current = 0 WHERE is_current = 1`);
  const r = await c.execute({
    sql: `INSERT INTO cvs (filename, mime, bytes, content, hash, size, is_current)
          VALUES (?, ?, ?, ?, ?, ?, 1)`,
    args: [input.filename, input.mime, input.bytes, input.content, input.hash, input.size],
  });
  return Number(r.lastInsertRowid);
}

/** Rows are array-like in @libsql/client, so a `length` column would be shadowed
 *  by Row.length — the column is `len` in SQL and mapped to the semantic name here. */
function rowToLetter(row: Record<string, unknown>): Letter {
  return {
    id: Number(row.id),
    cv_hash: String(row.cv_hash),
    mode: row.mode as Mode,
    length: (row.len as Length) ?? 'long',
    company: String(row.company ?? ''),
    role: String(row.role ?? ''),
    prompt: String(row.prompt ?? ''),
    model: String(row.model ?? ''),
    source: String(row.source ?? ''),
    content: String(row.content ?? ''),
    created_at: String(row.created_at),
  };
}

export async function listLetters(): Promise<Letter[]> {
  await ready();
  const r = await db().execute(
    `SELECT id, cv_hash, mode, len, company, role, prompt, model, source, content, created_at
     FROM cover_letters ORDER BY id DESC LIMIT 100`,
  );
  return r.rows.map((row) => rowToLetter(row as Record<string, unknown>));
}

export async function getLetter(id: number): Promise<Letter | null> {
  await ready();
  const r = await db().execute({
    sql: `SELECT id, cv_hash, mode, len, company, role, prompt, model, source, content, created_at
          FROM cover_letters WHERE id = ?`,
    args: [id],
  });
  const row = r.rows[0] as Record<string, unknown> | undefined;
  return row ? rowToLetter(row) : null;
}

/** Cached generic letter for a given CV hash + length (change-detection / no wasted regen). */
export async function findCachedGeneric(cvHash: string, length: Length): Promise<Letter | null> {
  await ready();
  const r = await db().execute({
    sql: `SELECT id, cv_hash, mode, len, company, role, prompt, model, source, content, created_at
          FROM cover_letters WHERE cv_hash = ? AND mode = 'generic' AND len = ? AND source = 'llm'
          ORDER BY id DESC LIMIT 1`,
    args: [cvHash, length],
  });
  const row = r.rows[0] as Record<string, unknown> | undefined;
  return row ? rowToLetter(row) : null;
}

export async function insertLetter(input: {
  cvId: number | null;
  cvHash: string;
  mode: Mode;
  length: Length;
  company: string;
  role: string;
  prompt: string;
  model: string;
  source: string;
  content: string;
}): Promise<number> {
  await ready();
  const r = await db().execute({
    sql: `INSERT INTO cover_letters (cv_id, cv_hash, mode, len, company, role, prompt, model, source, content)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      input.cvId,
      input.cvHash,
      input.mode,
      input.length,
      input.company,
      input.role,
      input.prompt,
      input.model,
      input.source,
      input.content,
    ],
  });
  return Number(r.lastInsertRowid);
}

export async function deleteLetter(id: number): Promise<void> {
  await ready();
  await db().execute({ sql: `DELETE FROM cover_letters WHERE id = ?`, args: [id] });
}
