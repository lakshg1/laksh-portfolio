'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

type Mode = 'generic' | 'targeted';
type Length = 'short' | 'long';
interface CvMeta { id: number; filename: string; hash: string; size: number; created_at: string }
interface Letter {
  id: number; mode: Mode; length: Length; company: string; role: string; prompt: string;
  model: string; source: string; content: string; created_at: string;
}

const CONTACT = {
  name: 'Laksh Gupta',
  role: 'AI Backend Engineer | LLM Systems | Python | Golang',
  line1: 'Bengaluru, India | +91 96365 46575 | lakshgupta253@gmail.com',
  email: 'lakshgupta253@gmail.com',
  linkedin: 'https://linkedin.com/in/lakshg1',
  github: 'https://github.com/lakshg1',
  site: 'https://lakshgupta.vercel.app',
};

/* ---------- shared class strings (site design tokens) ---------- */
const C = {
  card: 'border border-line bg-surface p-6',
  label: 'mb-2 mt-4 block font-mono text-[10.5px] uppercase tracking-[0.22em] text-tx3',
  sectionTitle: 'font-mono text-[11px] uppercase tracking-[0.26em] text-accent',
  input:
    'w-full rounded-[2px] border border-line bg-panel px-3 py-2.5 text-[14px] text-tx ' +
    'placeholder:text-tx3 focus:border-accent focus:outline-none transition-colors',
  primary:
    'mt-4 w-full rounded-[2px] border border-accent bg-accent px-[15px] py-[10px] font-mono ' +
    'text-[11px] font-medium uppercase tracking-[0.1em] text-btntx transition-opacity ' +
    'hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40',
  ghost:
    'rounded-[2px] border border-line2 px-3 py-[7px] font-mono text-[10.5px] uppercase ' +
    'tracking-[0.1em] text-tx2 transition-colors hover:border-accent hover:text-accent',
  segment: 'flex rounded-[2px] border border-line bg-panel p-[3px]',
  segBtn:
    'flex-1 rounded-[1px] py-2 font-mono text-[11px] uppercase tracking-[0.12em] ' +
    'transition-colors cursor-pointer',
};

/** fetch + tolerant JSON. A dev server mid-compile (or a dropped connection)
 *  can return an empty or non-JSON body — never let that crash the page. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function j(input: RequestInfo, init?: RequestInit): Promise<any> {
  try {
    const res = await fetch(input, init);
    const text = await res.text();
    let data: Record<string, unknown> = {};
    try { data = text ? JSON.parse(text) : {}; } catch { /* non-JSON body */ }
    if (!res.ok && !data.error) data.error = `Request failed (${res.status})`;
    return data;
  } catch {
    return { error: 'Network error — is the dev server running?' };
  }
}

function Seg<T extends string>({ value, options, onChange }: {
  value: T; options: [T, string][]; onChange: (v: T) => void;
}) {
  return (
    <div className={C.segment}>
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`${C.segBtn} ${v === value ? 'bg-accent text-btntx' : 'text-tx3 hover:text-tx'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function AdminClient() {
  const [phase, setPhase] = useState<'loading' | 'login' | 'ready' | 'unconfigured'>('loading');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const [cv, setCv] = useState<CvMeta | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cvMsg, setCvMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<Mode>('generic');
  const [length, setLength] = useState<Length>('short');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [prompt, setPrompt] = useState('');
  const [force, setForce] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [current, setCurrent] = useState<Letter | null>(null);
  const [banner, setBanner] = useState('');
  const [letters, setLetters] = useState<Letter[]>([]);

  const loadMe = useCallback(async () => {
    const r = await j('/api/admin/me');
    if (r.error && r.configured === undefined) { setErr(r.error); return setPhase('login'); }
    if (!r.configured) return setPhase('unconfigured');
    setPhase(r.authenticated ? 'ready' : 'login');
  }, []);

  const loadData = useCallback(async () => {
    const [c, l] = await Promise.all([
      j('/api/admin/cv'),
      j('/api/admin/cover-letters'),
    ]);
    setCv(c.cv ?? null);
    setLetters(l.letters ?? []);
  }, []);

  useEffect(() => { loadMe(); }, [loadMe]);
  useEffect(() => { if (phase === 'ready') loadData(); }, [phase, loadData]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const r = await j('/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!r.error) { setPassword(''); setPhase('ready'); }
    else setErr(r.error || 'Login failed');
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setPhase('login');
  }

  async function upload() {
    const f = fileRef.current?.files?.[0];
    if (!f) { setCvMsg('Choose a PDF first.'); return; }
    setUploading(true); setCvMsg('');
    const fd = new FormData();
    fd.append('file', f);
    const r = await j('/api/admin/cv', { method: 'POST', body: fd });
    setUploading(false);
    if (r.error) { setCvMsg(r.error); return; }
    setCv(r.cv ?? null);
    setCvMsg(r.changed ? `Updated. Extracted ${r.textExtracted} chars of text.` : (r.message || 'No change.'));
    if (fileRef.current) fileRef.current.value = '';
  }

  async function generate() {
    setGenerating(true); setBanner(''); setCurrent(null);
    const r = await j('/api/admin/cover-letters', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, length, company, role, prompt, force }),
    });
    setGenerating(false);
    if (r.error) { setBanner(r.error); return; }
    setCurrent(r.letter);
    setBanner(
      r.cached ? 'Reused cached letter (same CV, same length). Tick "force regenerate" for a fresh one.'
      : r.fallback ? 'LLM endpoint unreachable — used the built-in template. Check LLM_PROVIDER and its API key.'
      : `Generated with ${r.letter.model}.`,
    );
    loadData();
  }

  async function view(id: number) {
    const r = await j(`/api/admin/cover-letters/${id}`);
    if (r.letter) { setCurrent(r.letter); setBanner(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }
  async function remove(id: number) {
    await fetch(`/api/admin/cover-letters/${id}`, { method: 'DELETE' });
    if (current?.id === id) setCurrent(null);
    loadData();
  }

  function letterHtml(l: Letter) {
    const paras = l.content.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    return `<div class="name">${CONTACT.name}</div>
      <div class="role">${CONTACT.role}</div>
      <div class="contact">Bengaluru, India | +91 96365 46575 | <a href="mailto:${CONTACT.email}">${CONTACT.email}</a></div>
      <div class="contact"><a href="${CONTACT.linkedin}">linkedin.com/in/lakshg1</a> | <a href="${CONTACT.github}">github.com/lakshg1</a> | <a href="${CONTACT.site}">lakshgupta.vercel.app</a></div>
      <div class="meta">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      ${paras}<p>Sincerely,<br>${CONTACT.name}</p>`;
  }
  function downloadDoc(l: Letter) {
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1a1a1a;line-height:1.5}.name{font-size:18pt;font-weight:bold}.role{font-size:10pt}.contact{font-size:9pt}.meta{margin:16pt 0}a{color:#2b5cad;text-decoration:none}p{margin:10pt 0}@page{margin:1in}</style></head><body>${letterHtml(l)}</body></html>`;
    const blob = new Blob(['﻿', html], { type: 'application/msword' });
    const tag = (l.company || l.mode).replace(/[^\w]+/g, '_');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Laksh_Gupta_Cover_Letter_${tag}.doc`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ---------- render ---------- */
  if (phase === 'loading')
    return <Shell><p className="font-mono text-[12px] uppercase tracking-[0.22em] text-tx3">Loading…</p></Shell>;

  if (phase === 'unconfigured')
    return (
      <Shell>
        <div className={`${C.card} max-w-[460px]`}>
          <h2 className={C.sectionTitle}>Set a password</h2>
          <p className="mt-3 text-[14.5px] text-tx2">
            Add <code className="font-mono text-[13px] text-accent">ADMIN_PASSWORD</code> to your{' '}
            <code className="font-mono text-[13px] text-accent">.env.local</code> (and to Vercel env vars), then reload.
          </p>
        </div>
      </Shell>
    );

  if (phase === 'login')
    return (
      <Shell>
        <form onSubmit={login} className={`${C.card} mx-auto mt-[12vh] max-w-[400px]`}>
          <div className={C.sectionTitle}>Admin</div>
          <h1 className="mb-5 mt-1 font-serif text-[34px] font-normal tracking-[-0.015em]">Sign in</h1>
          <input
            type="password" value={password} autoFocus placeholder="Password"
            onChange={(e) => setPassword(e.target.value)} className={C.input}
          />
          {err && <p className="mt-2 text-[13px] text-accent">{err}</p>}
          <button type="submit" className={C.primary}>Enter</button>
          <Link
            href="/"
            className="mt-5 block text-center font-mono text-[10.5px] uppercase tracking-[0.18em] text-tx3 transition-colors hover:text-accent"
          >
            ← Back to site
          </Link>
        </form>
      </Shell>
    );

  return (
    <Shell>
      {/* header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <Link href="/" className={`${C.sectionTitle} transition-opacity hover:opacity-75`}>
            Laksh.Gupta — Admin
          </Link>
          <h1 className="mt-1 font-serif text-[clamp(30px,4vw,44px)] font-normal tracking-[-0.015em]">
            Cover Letter <em className="text-accent">Studio</em>
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/" className={C.ghost}>← Home</Link>
          <button onClick={logout} className={C.ghost}>Log out</button>
        </div>
      </div>

      <div className="grid items-start gap-5 md:grid-cols-[minmax(300px,380px)_1fr]">
        {/* left column: controls */}
        <div className="space-y-5">
          <div className={C.card}>
            <h2 className={C.sectionTitle}>01 — Current CV</h2>
            {cv ? (
              <div className="mt-3 text-[13.5px] leading-relaxed text-tx2">
                <span className="font-medium text-tx">{cv.filename}</span><br />
                {(cv.size / 1024).toFixed(0)} KB · uploaded {new Date(cv.created_at + 'Z').toLocaleString()}<br />
                <span className="font-mono text-[11px] text-tx3">hash {cv.hash.slice(0, 12)}…</span>
              </div>
            ) : <p className="mt-3 text-[13.5px] text-tx3">No CV uploaded yet.</p>}
            <input
              ref={fileRef} type="file" accept="application/pdf"
              className={`${C.input} mt-4 file:mr-3 file:cursor-pointer file:rounded-[2px] file:border-0 file:bg-panel file:px-3 file:py-1.5 file:font-mono file:text-[10.5px] file:uppercase file:tracking-[0.1em] file:text-tx2`}
            />
            <button onClick={upload} disabled={uploading} className={C.primary}>
              {uploading ? 'Uploading…' : 'Upload / replace CV'}
            </button>
            {cvMsg && <p className="mt-3 text-[13px] text-tx2">{cvMsg}</p>}
          </div>

          <div className={C.card}>
            <h2 className={`${C.sectionTitle} mb-4`}>02 — Generate</h2>

            <label className={`${C.label} mt-0`}>Audience</label>
            <Seg value={mode} options={[['generic', 'Generic'], ['targeted', 'Targeted']]} onChange={setMode} />

            <label className={C.label}>Length</label>
            <Seg value={length} options={[['short', 'Short · ~140w'], ['long', 'Long · ~300w']]} onChange={setLength} />

            {mode === 'targeted' && (
              <>
                <label className={C.label}>Company</label>
                <input value={company} onChange={(e) => setCompany(e.target.value)} className={C.input} placeholder="Company name" />
                <label className={C.label}>Role title</label>
                <input value={role} onChange={(e) => setRole(e.target.value)} className={C.input} placeholder="Backend Engineer" />
                <label className={C.label}>Company / job prompt</label>
                <textarea
                  value={prompt} onChange={(e) => setPrompt(e.target.value)}
                  className={`${C.input} min-h-[90px] resize-y`}
                  placeholder="Paste the JD or notes: what they build, must-have skills, tone…"
                />
              </>
            )}

            {mode === 'generic' && (
              <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-[13px] text-tx2">
                <input type="checkbox" checked={force} onChange={(e) => setForce(e.target.checked)} className="accent-[var(--color-accent)]" />
                Force regenerate (ignore cache)
              </label>
            )}

            <button onClick={generate} disabled={generating || !cv} className={C.primary}>
              {generating ? 'Generating…' : 'Generate letter'}
            </button>
            {!cv && <p className="mt-3 text-[13px] text-tx3">Upload a CV first.</p>}
          </div>
        </div>

        {/* right column: output + history */}
        <div className="space-y-5">
          {banner && (
            <div className="border-l-2 border-accent bg-panel px-4 py-3 text-[13px] text-tx2">{banner}</div>
          )}
          {current ? (
            <div className={C.card}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-tx3">
                  {current.mode}{current.company ? ` · ${current.company}` : ''} · {current.length} · {current.source}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.writeText(current.content)} className={C.ghost}>Copy</button>
                  <button onClick={() => downloadDoc(current)} className={C.ghost}>Download Word</button>
                </div>
              </div>
              <div className="whitespace-pre-wrap font-serif text-[17.5px] leading-[1.75] text-tx">
                {current.content}
              </div>
            </div>
          ) : (
            <div className={`${C.card} text-[13.5px] text-tx3`}>Your generated letter will appear here.</div>
          )}

          <div className={C.card}>
            <h2 className={`${C.sectionTitle} mb-2`}>03 — History</h2>
            {letters.length === 0 && <p className="mt-2 text-[13.5px] text-tx3">Nothing yet.</p>}
            {letters.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-b-0">
                <div className="min-w-0">
                  <span className="text-[14px] font-medium text-tx">
                    {l.mode === 'targeted' ? (l.company || 'Targeted') : 'Generic'}
                  </span>
                  <span className="ml-2 font-mono text-[11px] text-tx3">
                    {l.length} · {l.source === 'template' ? 'template' : l.model} · {new Date(l.created_at + 'Z').toLocaleDateString()}
                  </span>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => view(l.id)} className={C.ghost}>View</button>
                  <button onClick={() => remove(l.id)} className={`${C.ghost} hover:border-accent hover:text-accent`}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-tx">
      <div className="mx-auto max-w-[1120px] px-[34px] pb-24 pt-10 max-[780px]:px-5">{children}</div>
    </div>
  );
}
