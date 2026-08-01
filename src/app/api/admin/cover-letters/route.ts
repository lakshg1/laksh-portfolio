/**
 * Cover letters.
 *   GET  → { letters: [...] }
 *   POST → { mode, company?, role?, prompt?, force? } → generate + store.
 *
 * Caching / change-detection: a `generic` letter is reused for the same CV hash
 * unless `force` is set or the CV changed (new hash ⇒ cache miss ⇒ regenerate).
 * `targeted` letters are always generated (company-specific).
 */
import { isAdmin, unauthorized } from '@/lib/guard';
import { getCurrentCv, listLetters, insertLetter, findCachedGeneric } from '@/lib/repo';
import { generate, type Length, type Mode } from '@/lib/llm';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  return Response.json({ letters: await listLetters() });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const mode: Mode = body.mode === 'targeted' ? 'targeted' : 'generic';
  const length: Length = body.length === 'long' ? 'long' : 'short';
  const company = String(body.company ?? '').trim();
  const role = String(body.role ?? '').trim();
  const prompt = String(body.prompt ?? '').trim();
  const force = Boolean(body.force);

  const cv = await getCurrentCv();
  if (!cv || !cv.content) {
    return Response.json(
      { error: 'Upload a CV first (and make sure text could be extracted from it).' },
      { status: 400 },
    );
  }

  // Cache hit: unchanged CV + generic + same length + not forced.
  if (mode === 'generic' && !force) {
    const cached = await findCachedGeneric(cv.hash, length);
    if (cached) return Response.json({ letter: cached, cached: true });
  }

  const result = await generate({ cvText: cv.content, mode, length, company, role, prompt });
  const id = await insertLetter({
    cvId: cv.id,
    cvHash: cv.hash,
    mode,
    length,
    company,
    role,
    prompt,
    model: result.model,
    source: result.source,
    content: result.content,
  });

  return Response.json({
    letter: {
      id,
      cv_hash: cv.hash,
      mode,
      length,
      company,
      role,
      prompt,
      model: result.model,
      source: result.source,
      content: result.content,
      created_at: new Date().toISOString(),
    },
    cached: false,
    fallback: result.source === 'template',
  });
}
