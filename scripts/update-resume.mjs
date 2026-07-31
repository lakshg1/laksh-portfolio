/**
 * Swap in a new résumé and stamp today's date.
 *
 *   npm run resume ~/Downloads/Laksh_Gupta_Resume_Hybrid.pdf
 *
 * Copies the PDF to public/resume.pdf and rewrites `resumeUpdated`
 * in src/content/site.ts so the site always shows an honest date.
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';

const src = process.argv[2];

if (!src) {
  console.error('\nUsage: npm run resume <path-to-pdf>\n');
  process.exit(1);
}
if (!existsSync(src)) {
  console.error(`\nNo file at: ${src}\n`);
  process.exit(1);
}
if (extname(src).toLowerCase() !== '.pdf') {
  console.error('\nrésumé must be a .pdf — recruiters and ATS both expect it.\n');
  process.exit(1);
}

const dest = resolve('public/resume.pdf');
copyFileSync(src, dest);

const stamp = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const sitePath = resolve('src/content/site.ts');
const before = readFileSync(sitePath, 'utf8');
const after = before.replace(/resumeUpdated: '[^']*'/, `resumeUpdated: '${stamp}'`);

if (before === after) {
  console.warn('Copied the PDF, but could not find resumeUpdated in site.ts — update it by hand.');
} else {
  writeFileSync(sitePath, after);
}

const kb = Math.round(readFileSync(dest).length / 1024);
console.log(`\n  résumé updated → public/resume.pdf (${kb} KB)`);
console.log(`  date stamped   → ${stamp}`);
console.log('\n  Next:  git add -A && git commit -m "chore: update résumé" && git push\n');
