/**
 * Public, prod-safe CV download — streams the current CV from the DB. Useful on
 * Vercel where public/resume.pdf can't be rewritten at runtime. Point the site's
 * résumé link here (or keep /resume.pdf for local). No auth: it's your public CV.
 */
import { getCurrentCv } from '@/lib/repo';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const cv = await getCurrentCv().catch((e) => {
    console.error('[api/cv] DB read failed, falling back to static file:', e);
    return null;
  });
  // Fallback to the committed static file so the button never 404s (e.g. a fresh
  // prod deploy before the first upload).
  if (!cv) return Response.redirect(new URL('/resume.pdf', req.url), 307);
  return new Response(Buffer.from(cv.bytes), {
    headers: {
      'Content-Type': cv.mime || 'application/pdf',
      'Content-Disposition': `inline; filename="${cv.filename || 'resume.pdf'}"`,
      'Cache-Control': 'public, max-age=300',
    },
  });
}
