/**
 * Local-dev convenience: mirror an uploaded CV into public/resume.pdf and stamp
 * `resumeUpdated` in src/content/site.ts — same effect as `npm run resume`, so
 * the existing static download keeps working. Silently skipped in production
 * (Vercel's filesystem is read-only), where /api/cv serves the CV from the DB.
 */
import { writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export async function stampLocalResume(bytes: Uint8Array): Promise<boolean> {
  if (process.env.VERCEL) return false;
  try {
    await writeFile(resolve(process.cwd(), 'public/resume.pdf'), bytes);
    const stamp = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const sitePath = resolve(process.cwd(), 'src/content/site.ts');
    const before = await readFile(sitePath, 'utf8');
    const after = before.replace(/resumeUpdated: '[^']*'/, `resumeUpdated: '${stamp}'`);
    if (before !== after) await writeFile(sitePath, after);
    return true;
  } catch {
    return false;
  }
}
