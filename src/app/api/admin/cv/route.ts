/**
 * CV upload + current-CV metadata.
 *   GET  → { cv: meta | null }
 *   POST → multipart form-data with `file` (PDF). Extracts text, hashes,
 *          stores, marks current. If the hash matches the current CV, it is a
 *          no-op ({ changed: false }) — this is the change-detection gate.
 */
import { isAdmin, unauthorized } from '@/lib/guard';
import { getCurrentCvMeta, insertCv } from '@/lib/repo';
import { hashBytes, pdfToText } from '@/lib/cv';
import { stampLocalResume } from '@/lib/localResume';

export const runtime = 'nodejs';

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  return Response.json({ cv: await getCurrentCvMeta() });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) {
    return Response.json({ error: 'Attach a PDF as `file`' }, { status: 400 });
  }
  if (file.type && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return Response.json({ error: 'CV must be a PDF' }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const hash = hashBytes(bytes);

  const current = await getCurrentCvMeta();
  if (current && current.hash === hash) {
    return Response.json({ changed: false, cv: current, message: 'Identical to current CV — nothing to update.' });
  }

  const content = await pdfToText(bytes);
  const id = await insertCv({
    filename: file.name || 'resume.pdf',
    mime: 'application/pdf',
    bytes,
    content,
    hash,
    size: bytes.byteLength,
  });

  // Local dev only: also refresh public/resume.pdf + the site's date stamp so the
  // existing static download flow stays in sync. No-op on Vercel (read-only FS).
  const stamped = await stampLocalResume(bytes);

  return Response.json({
    changed: true,
    cv: await getCurrentCvMeta(),
    id,
    textExtracted: content.length,
    stampedLocally: stamped,
  });
}
