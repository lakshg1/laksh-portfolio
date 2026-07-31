'use client';

import { useEffect, useState } from 'react';
import { SKINS, type Skin } from '@/content/skin';

const MOODS: Record<Skin, string> = {
  fog: 'Coral haze / steel smoke',
  plain: 'Professional — zero motion',
  panther: 'Vibranium violet',
  spider: 'Red and blue + web',
  ironman: 'Red and gold + arc reactor',
  thor: 'Storm blue + lightning',
  cap: 'Navy and silver + shield rings',
  doom: 'Emerald + embers',
  breakingbad: 'Chem green + bubbles',
  peaky: 'Sepia + falling ash',
  starwars: 'Space + starfield',
  minions: 'Banana + goggles',
  got: 'Ice and fire',
  netflix: 'Red on black',
  hotstar: 'Navy + saffron',
  instagram: 'Sunset gradient',
  whatsapp: 'Chat green',
  meta: 'Blue-violet',
  microsoft: 'Four-color pastel',
  atlassian: 'Product blue',
  google: 'Muted primaries',
  stripe: 'Blurple',
  uber: 'Mono + safety green',
};

/**
 * /studio — the secret skin switcher. Not linked anywhere, noindexed.
 * Choices persist in THIS browser only (localStorage); every other visitor
 * keeps seeing the deployed default from content/skin.ts.
 */
export default function Studio() {
  const [active, setActive] = useState<string | null>(null);
  const [deployed, setDeployed] = useState<string>('');

  useEffect(() => {
    setDeployed(document.documentElement.getAttribute('data-skin') ?? 'fog');
    try {
      setActive(localStorage.getItem('skin-override'));
    } catch {}
  }, []);

  function apply(skin: Skin) {
    document.documentElement.setAttribute('data-skin', skin);
    try { localStorage.setItem('skin-override', skin); } catch {}
    setActive(skin);
  }

  function reset() {
    try { localStorage.removeItem('skin-override'); } catch {}
    setActive(null);
    window.location.href = '/';
  }

  return (
    <main className="mx-auto min-h-screen max-w-[860px] px-[34px] pb-24 pt-24 max-[780px]:px-5">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.26em] text-accent">
        Studio · not linked · not indexed
      </div>
      <h1 className="mb-3 font-serif text-[44px] font-light tracking-[-0.02em]">Skin switcher</h1>
      <p className="mb-2 max-w-[560px] text-[14.5px] text-tx2">
        Applies instantly and persists <b className="font-normal text-tx">in this browser only</b> —
        every other visitor still sees the deployed default.
      </p>
      <p className="mb-8 font-mono text-[10.5px] uppercase tracking-[0.1em] text-tx3">
        Deployed default: {deployed || '…'} · Your override: {active ?? 'none'}
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
        {SKINS.map((s) => (
          <button
            key={s}
            onClick={() => apply(s)}
            className={`flex flex-col items-start gap-1 rounded-[2px] border px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] transition-all ${
              active === s
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-line bg-surface text-tx2 hover:border-line2'
            }`}
          >
            {s}
            <em className="text-[9px] normal-case not-italic tracking-normal text-tx3">{MOODS[s]}</em>
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="/"
          className="inline-flex items-center rounded-[2px] border border-accent bg-accent px-[18px] py-[10px] font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-btntx transition-opacity hover:opacity-85"
        >
          View site with this skin →
        </a>
        <button
          onClick={reset}
          className="inline-flex items-center rounded-[2px] border border-line2 px-[18px] py-[10px] font-mono text-[11px] uppercase tracking-[0.1em] text-tx2 transition-colors hover:border-accent hover:text-accent"
        >
          Reset to deployed default
        </button>
      </div>
    </main>
  );
}
