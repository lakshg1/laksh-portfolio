'use client';

import { useEffect, useRef, useState } from 'react';
import { SKINS, type Skin } from '@/content/skin';

/**
 * Nav dropdown for switching skins. Uses the same per-browser override as
 * /studio (localStorage), so choices never affect other visitors.
 *
 * TO HIDE THIS FROM THE PUBLIC SITE: comment out the <SkinPicker /> line in
 * Nav.tsx — nothing else references this component. /studio keeps working.
 */
const GROUPS: { label: string; skins: Skin[] }[] = [
  { label: 'Core', skins: ['fog', 'plain'] },
  { label: 'Characters', skins: ['panther', 'spider', 'ironman', 'thor', 'cap', 'doom', 'breakingbad', 'peaky', 'starwars', 'minions', 'got'] },
  { label: 'Cinema', skins: ['oppenheimer', 'dune', 'interstellar', 'matrix', 'f1', 'ghibli'] },
  { label: 'Companies', skins: ['netflix', 'hotstar', 'instagram', 'whatsapp', 'meta', 'microsoft', 'atlassian', 'google', 'stripe', 'uber', 'amazon', 'apple', 'airbnb', 'spotify'] },
];

export function SkinPicker() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('fog');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActive(document.documentElement.getAttribute('data-skin') ?? 'fog');
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function apply(skin: Skin) {
    document.documentElement.setAttribute('data-skin', skin);
    try { localStorage.setItem('skin-override', skin); } catch {}
    setActive(skin);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch skin"
        className="flex h-[34px] items-center gap-[6px] rounded-[2px] border border-line2 px-[10px] font-mono text-[10.5px] uppercase tracking-[0.08em] text-tx2 transition-colors hover:border-accent hover:text-accent"
      >
        <span className="inline-block h-[10px] w-[10px] rounded-full bg-accent" />
        {active}
        <span className="text-[8px]">▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-[42px] z-[200] max-h-[70vh] w-[240px] overflow-y-auto rounded-[3px] border border-line bg-surface p-2 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
        >
          {GROUPS.map((g) => (
            <div key={g.label} className="mb-1">
              <div className="px-2 py-[6px] font-mono text-[9px] uppercase tracking-[0.18em] text-tx3">
                {g.label}
              </div>
              {g.skins.map((s) => (
                <button
                  key={s}
                  role="option"
                  aria-selected={active === s}
                  onClick={() => apply(s)}
                  className={`block w-full rounded-[2px] px-2 py-[7px] text-left font-mono text-[11px] uppercase tracking-[0.06em] transition-colors ${
                    active === s ? 'bg-accent/10 text-accent' : 'text-tx2 hover:bg-panel hover:text-tx'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          ))}
          <div className="border-t border-line px-2 pb-1 pt-2 font-mono text-[9px] leading-relaxed text-tx3">
            Applies in this browser only. Full picker at /studio.
          </div>
        </div>
      )}
    </div>
  );
}
