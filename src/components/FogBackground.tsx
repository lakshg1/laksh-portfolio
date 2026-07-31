'use client';

import { useEffect, useRef } from 'react';

/**
 * Animated fog backdrop (Vanta.js FOG over three.js), themed to match
 * the site palette: warm coral haze in light mode, cold steel-blue smoke
 * in dark mode. Loads lazily after paint so it costs nothing on first render,
 * and is skipped entirely for visitors who prefer reduced motion.
 */
const FOG_THEMES: Record<string, { light: Record<string, number>; dark: Record<string, number> }> = {
  fog: {
    light: { highlightColor: 0xffc8c8, midtoneColor: 0xf5caca, lowlightColor: 0xe6bcb5, baseColor: 0xffffff },
    dark: { highlightColor: 0xa4b8d6, midtoneColor: 0xbbe4e5, lowlightColor: 0xaeacc5, baseColor: 0x030303 },
  },
  panther: {
    light: { highlightColor: 0xcfc4f5, midtoneColor: 0xb9aef0, lowlightColor: 0xa99dd6, baseColor: 0xffffff },
    dark: { highlightColor: 0x6d54c9, midtoneColor: 0x4a3d8f, lowlightColor: 0x2b2547, baseColor: 0x030305 },
  },
  spider: {
    light: { highlightColor: 0xffadad, midtoneColor: 0xa8bef5, lowlightColor: 0x7d99e0, baseColor: 0xfdfdff },
    dark: { highlightColor: 0xe03d4d, midtoneColor: 0x24408f, lowlightColor: 0x101c47, baseColor: 0x030309 },
  },
  ironman: {
    light: { highlightColor: 0xffd9a8, midtoneColor: 0xf5b9a8, lowlightColor: 0xe0a98f, baseColor: 0xffffff },
    dark: { highlightColor: 0xd4552f, midtoneColor: 0xa8741f, lowlightColor: 0x5c1f1a, baseColor: 0x060303 },
  },
  thor: {
    light: { highlightColor: 0xc4d6f0, midtoneColor: 0xa8bcd6, lowlightColor: 0x9aabc4, baseColor: 0xffffff },
    dark: { highlightColor: 0x7fa8d6, midtoneColor: 0x4a5a78, lowlightColor: 0x2b3247, baseColor: 0x030407 },
  },
  cap: {
    light: { highlightColor: 0xb9cdf0, midtoneColor: 0xf0b9bd, lowlightColor: 0xa9b9d6, baseColor: 0xffffff },
    dark: { highlightColor: 0x3d5c9e, midtoneColor: 0x8f2f3a, lowlightColor: 0x1f2b47, baseColor: 0x03040a },
  },
  doom: {
    light: { highlightColor: 0xb9e0c9, midtoneColor: 0xa8c4b0, lowlightColor: 0x9ab4a4, baseColor: 0xffffff },
    dark: { highlightColor: 0x3d8f5f, midtoneColor: 0x2b5c47, lowlightColor: 0x1a3328, baseColor: 0x030503 },
  },
  breakingbad: {
    light: { highlightColor: 0xd6e8a8, midtoneColor: 0xc4d68f, lowlightColor: 0xb0c487, baseColor: 0xffffff },
    dark: { highlightColor: 0x5c8f3d, midtoneColor: 0x3d6b2b, lowlightColor: 0x22401a, baseColor: 0x030502 },
  },
  peaky: {
    light: { highlightColor: 0xe0d0b0, midtoneColor: 0xd0bc9a, lowlightColor: 0xbfa989, baseColor: 0xfffdf8 },
    dark: { highlightColor: 0x8f7040, midtoneColor: 0x5c4a2b, lowlightColor: 0x33291a, baseColor: 0x040303 },
  },
  starwars: {
    light: { highlightColor: 0xf0dfa8, midtoneColor: 0xe0cd96, lowlightColor: 0xccb87f, baseColor: 0xfffefa },
    dark: { highlightColor: 0x4a5a8f, midtoneColor: 0x2b3357, lowlightColor: 0x14182e, baseColor: 0x020203 },
  },
  minions: {
    light: { highlightColor: 0xffe8a8, midtoneColor: 0xf5d98f, lowlightColor: 0xe0c47a, baseColor: 0xfffef5 },
    dark: { highlightColor: 0x9a852f, midtoneColor: 0x4a5a8f, lowlightColor: 0x2b2f47, baseColor: 0x040402 },
  },
  got: {
    light: { highlightColor: 0xc9dae8, midtoneColor: 0xafc4d4, lowlightColor: 0xd4a9a0, baseColor: 0xffffff },
    dark: { highlightColor: 0x4a6b8f, midtoneColor: 0x8f3d2b, lowlightColor: 0x1a2733, baseColor: 0x020304 },
  },
  netflix: {
    light: { highlightColor: 0xffa8a8, midtoneColor: 0xf08088, lowlightColor: 0xd9636e, baseColor: 0xfffafa },
    dark: { highlightColor: 0xb3121b, midtoneColor: 0x730a10, lowlightColor: 0x38050a, baseColor: 0x000000 },
  },
  hotstar: {
    light: { highlightColor: 0xa8c9f5, midtoneColor: 0x8fb4ec, lowlightColor: 0xf0b380, baseColor: 0xfcfdff },
    dark: { highlightColor: 0x1f4f99, midtoneColor: 0x13306b, lowlightColor: 0x8f5c1f, baseColor: 0x04060f },
  },
  instagram: {
    light: { highlightColor: 0xffb3d5, midtoneColor: 0xc9a3f5, lowlightColor: 0xffcf9e, baseColor: 0xfffcfe },
    dark: { highlightColor: 0xc42a8c, midtoneColor: 0x6b3db3, lowlightColor: 0xb35c1f, baseColor: 0x08040f },
  },
  whatsapp: {
    light: { highlightColor: 0xa8e8c4, midtoneColor: 0x8fdcb0, lowlightColor: 0x76c99a, baseColor: 0xfbfffc },
    dark: { highlightColor: 0x179952, midtoneColor: 0x0e6b3a, lowlightColor: 0x06381f, baseColor: 0x020503 },
  },
  meta: {
    light: { highlightColor: 0x9ec2ff, midtoneColor: 0xb3a8ff, lowlightColor: 0x86b0f7, baseColor: 0xfbfcff },
    dark: { highlightColor: 0x1a5ad1, midtoneColor: 0x2b2b9e, lowlightColor: 0x10307a, baseColor: 0x030510 },
  },
  microsoft: {
    light: { highlightColor: 0x9cc9f0, midtoneColor: 0xa8e0a0, lowlightColor: 0xf5d98f, baseColor: 0xfdfdfc },
    dark: { highlightColor: 0x1f5c8f, midtoneColor: 0x2b7a38, lowlightColor: 0x8f6f1f, baseColor: 0x050505 },
  },
  atlassian: {
    light: { highlightColor: 0x9cc2ff, midtoneColor: 0x82b0f7, lowlightColor: 0x6b9be8, baseColor: 0xfbfdff },
    dark: { highlightColor: 0x1f5cd1, midtoneColor: 0x12408f, lowlightColor: 0x0a2452, baseColor: 0x030711 },
  },
  google: {
    light: { highlightColor: 0xa8c9f7, midtoneColor: 0xf7b3a8, lowlightColor: 0xf7e08f, baseColor: 0xfdfdfb },
    dark: { highlightColor: 0x2b5cd1, midtoneColor: 0xb33a26, lowlightColor: 0xb3941f, baseColor: 0x040404 },
  },
  stripe: {
    light: { highlightColor: 0xb9b3ff, midtoneColor: 0xa89eff, lowlightColor: 0x8f86f0, baseColor: 0xfcfcff },
    dark: { highlightColor: 0x5c54e8, midtoneColor: 0x3d38b3, lowlightColor: 0x232066, baseColor: 0x040412 },
  },
  uber: {
    light: { highlightColor: 0xb3e0c9, midtoneColor: 0x9ad1b5, lowlightColor: 0x86c2a4, baseColor: 0xfcfdfc },
    dark: { highlightColor: 0x09994f, midtoneColor: 0x0a6b38, lowlightColor: 0x053d20, baseColor: 0x020302 },
  },
};

const FOG_BASE = {
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200,
  minWidth: 200,
  blurFactor: 0.65,
  speed: 2.0,
  zoom: 1.0,
};

function currentTheme(): 'light' | 'dark' {
  return document.documentElement.getAttribute('data-t') === 'dark' ? 'dark' : 'light';
}

/**
 * Skins that deliberately have NO fog. Fog is a cinematic texture — right for
 * storm/smoke/ember personas, wrong for product brands and the plain mode.
 * These get bespoke backdrops from SkinEffects instead.
 */
const FOGLESS = new Set([
  'plain', 'netflix', 'hotstar', 'instagram', 'whatsapp', 'meta',
  'microsoft', 'atlassian', 'google', 'stripe', 'uber',
]);

function currentSkin(): string {
  const s = document.documentElement.getAttribute('data-skin');
  return s && s in FOG_THEMES ? s : 'fog';
}

export function FogBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let effect: import('vanta/dist/vanta.fog.min').VantaEffect | null = null;
    let fogFactory: ((o: Record<string, unknown>) => import('vanta/dist/vanta.fog.min').VantaEffect) | null = null;
    let three: unknown = null;
    let disposed = false;

    /** Create, retune or destroy the fog to match the current skin + theme. */
    const sync = async () => {
      if (FOGLESS.has(document.documentElement.getAttribute('data-skin') ?? '')) {
        effect?.destroy();
        effect = null;
        return;
      }
      if (!fogFactory) {
        const [mod, THREE] = await Promise.all([
          import('vanta/dist/vanta.fog.min'),
          import('three'),
        ]);
        if (disposed) return;
        fogFactory = mod.default;
        three = THREE;
      }
      if (disposed || !ref.current) return;
      const opts = FOG_THEMES[currentSkin()][currentTheme()];
      if (effect) {
        effect.setOptions(opts);
      } else {
        effect = fogFactory({ el: ref.current, THREE: three, ...FOG_BASE, ...opts });
      }
    };

    void sync();
    const observer = new MutationObserver(() => void sync());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-t', 'data-skin'],
    });

    return () => {
      disposed = true;
      observer.disconnect();
      effect?.destroy();
    };
  }, []);

  return <div ref={ref} aria-hidden className="absolute inset-0" />;
}
