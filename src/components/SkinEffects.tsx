'use client';

import { useEffect, useState } from 'react';

/**
 * Per-skin atmosphere over the hero fog. Design rule: one ambient layer
 * plus at most one timed "event" per skin — enough personality to be felt,
 * never enough to compete with the name. Everything is pointer-events-none
 * and disappears under prefers-reduced-motion (globals.css).
 *
 *   fog         — drifting dust motes
 *   panther     — kinetic energy ripples (vibranium absorbing impact)
 *   spider      — corner web + a spider descending on a thread
 *   ironman     — pulsing arc-reactor glow + gold repulsor streak
 *   thor        — lightning strikes
 *   cap         — slow-rotating concentric shield rings
 *   doom        — pulsing emerald vignette + rising embers
 *   breakingbad — beaker bubbles rising through the fog
 *   peaky       — falling ash + old-film flicker
 *   starwars    — twinkling starfield + shooting star
 *   minions     — goggle-ringed bubbles bobbing upward
 *   got         — snow falling on the left, embers rising on the right
 */
export function SkinEffects() {
  const [skin, setSkin] = useState<string | null>(null);

  useEffect(() => {
    const read = () => setSkin(document.documentElement.getAttribute('data-skin') ?? 'fog');
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-skin'] });
    return () => mo.disconnect();
  }, []);

  switch (skin) {
    case 'fog': return <Motes />;
    case 'panther': return <Ripples />;
    case 'spider': return <Web />;
    case 'ironman': return <ArcReactor />;
    case 'thor': return <Lightning />;
    case 'cap': return <ShieldRings />;
    case 'doom': return <DoomAura />;
    case 'breakingbad': return <Bubbles />;
    case 'peaky': return <AshAndFlicker />;
    case 'starwars': return <Starfield />;
    case 'minions': return <GoggleBubbles />;
    case 'got': return <IceAndFire />;
    case 'netflix': return <Beams />;
    case 'hotstar': return <SunAndShimmer />;
    case 'instagram': return <GradientWalk />;
    case 'whatsapp': return <ChatBubbles />;
    case 'meta': return <OrbitingOrbs />;
    case 'microsoft': return <Quadrants />;
    case 'atlassian': return <Peaks />;
    case 'google': return <PrimaryOrbs />;
    case 'stripe': return <Ribbons />;
    case 'uber': return <RouteLines />;
    case 'oppenheimer': return <AshAndBloom />;
    case 'dune': return <SandDrift />;
    case 'interstellar': return <Gargantua />;
    case 'matrix': return <DigitalRain />;
    case 'f1': return <SpeedLines />;
    case 'ghibli': return <Seeds />;
    case 'amazon': return <DeliveryArc />;
    case 'apple': return <Spotlight />;
    case 'airbnb': return <WarmOrbs />;
    case 'spotify': return <Equalizer />;
    case 'plain':
    case null:
      return null;
    default:
      return <Motes />;
  }
}

/** Fires `render` with a fresh key at a random interval. */
function useRandomEvent(minMs: number, maxMs: number) {
  const [event, setEvent] = useState<{ id: number; r: number } | null>(null);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    let dead = false;
    const loop = () => {
      t = setTimeout(() => {
        if (dead) return;
        setEvent({ id: Date.now(), r: Math.random() });
        loop();
      }, minMs + Math.random() * (maxMs - minMs));
    };
    loop();
    return () => { dead = true; clearTimeout(t); };
  }, [minMs, maxMs]);
  return event;
}

const Layer = ({ children }: { children: React.ReactNode }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>{children}</div>
);

/* fog — six dust motes drifting diagonally, barely there. */
const MOTES = [
  { left: '12%', top: '30%', d: 26, delay: 0 }, { left: '28%', top: '62%', d: 32, delay: 4 },
  { left: '47%', top: '22%', d: 29, delay: 9 }, { left: '63%', top: '70%', d: 35, delay: 2 },
  { left: '78%', top: '38%', d: 27, delay: 12 }, { left: '90%', top: '55%', d: 31, delay: 6 },
];
function Motes() {
  return (
    <Layer>
      {MOTES.map((m, i) => (
        <span key={i} className="fx-mote" style={{ left: m.left, top: m.top, animationDuration: `${m.d}s`, animationDelay: `${m.delay}s` }} />
      ))}
    </Layer>
  );
}

/* panther — expanding violet energy rings at random positions. */
function Ripples() {
  const e = useRandomEvent(4000, 8000);
  if (!e) return null;
  return (
    <Layer>
      <span key={e.id} className="fx-ripple" style={{ left: `${15 + e.r * 65}%`, top: `${25 + (e.r * 7919 % 1) * 45}%` }} />
    </Layer>
  );
}

/* spider — faint corner web, plus a spider that descends and retracts. */
function Web() {
  const e = useRandomEvent(7000, 13000);
  return (
    <Layer>
      <svg className="absolute -right-6 -top-6 h-64 w-64 opacity-[0.07]" viewBox="0 0 200 200" fill="none" stroke="currentColor">
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M200,0 Q${140 - i * 26},${60 + i * 26} ${200 - (i + 1) * 38},${(i + 1) * 38}`} strokeWidth="1" fill="none" />
        ))}
        {[30, 60, 90, 120, 150].map((a) => (
          <line key={a} x1="200" y1="0" x2={200 - 200 * Math.cos((a * Math.PI) / 180)} y2={200 * Math.sin((a * Math.PI) / 180)} strokeWidth="0.8" />
        ))}
      </svg>
      {e && (
        <span key={e.id} className="fx-spider" style={{ left: `${20 + e.r * 60}%` }}>
          <span className="fx-spider-thread" />
          <span className="fx-spider-body" />
        </span>
      )}
    </Layer>
  );
}

/* ironman — arc-reactor glow breathing low center, gold streak flying by. */
function ArcReactor() {
  const e = useRandomEvent(6000, 11000);
  return (
    <Layer>
      <span className="fx-arc" />
      {e && <span key={e.id} className="fx-streak" style={{ top: `${12 + e.r * 30}%` }} />}
    </Layer>
  );
}

/* thor — flash + jagged bolt. */
function Lightning() {
  const e = useRandomEvent(4500, 11000);
  if (!e) return null;
  return (
    <div key={e.id} className="thor-flash pointer-events-none absolute inset-0" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(190,215,255,0.28),transparent_65%)]" />
      <svg className="absolute top-0 h-[70%] w-auto" style={{ left: `${12 + e.r * 70}%` }} viewBox="0 0 60 400" fill="none">
        <path d="M30 0 L22 90 L38 110 L18 210 L34 228 L14 330 L26 342 L20 400" stroke="#cfe0ff" strokeWidth="2.5" strokeLinejoin="round" opacity="0.9" />
        <path d="M30 0 L22 90 L38 110 L18 210 L34 228 L14 330 L26 342 L20 400" stroke="#ffffff" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* cap — three concentric rings, counter-rotating very slowly. */
function ShieldRings() {
  return (
    <Layer>
      <span className="fx-ring" style={{ width: '46vmin', height: '46vmin', animationDuration: '70s' }} />
      <span className="fx-ring fx-ring-rev" style={{ width: '62vmin', height: '62vmin', animationDuration: '95s' }} />
      <span className="fx-ring" style={{ width: '78vmin', height: '78vmin', animationDuration: '120s' }} />
    </Layer>
  );
}

/* doom — vignette pulse + rising embers. */
const EMBERS = [
  { left: '8%', d: 11, delay: 0 }, { left: '22%', d: 14, delay: 3 }, { left: '38%', d: 10, delay: 6 },
  { left: '55%', d: 15, delay: 1.5 }, { left: '71%', d: 12, delay: 4.5 }, { left: '86%', d: 13, delay: 7.5 },
];
function DoomAura() {
  return (
    <Layer>
      <div className="doom-vignette absolute inset-0" />
      {EMBERS.map((e, i) => (
        <span key={i} className="doom-ember" style={{ left: e.left, animationDuration: `${e.d}s`, animationDelay: `${e.delay}s` }} />
      ))}
    </Layer>
  );
}

/* breakingbad — beaker bubbles wobbling upward. */
const BUBBLES = [
  { left: '10%', size: 7, d: 13, delay: 0 }, { left: '24%', size: 5, d: 16, delay: 5 },
  { left: '41%', size: 8, d: 12, delay: 2 }, { left: '58%', size: 4, d: 17, delay: 8 },
  { left: '73%', size: 6, d: 14, delay: 4 }, { left: '88%', size: 5, d: 15, delay: 10 },
];
function Bubbles() {
  return (
    <Layer>
      {BUBBLES.map((b, i) => (
        <span key={i} className="fx-bubble" style={{ left: b.left, width: b.size, height: b.size, animationDuration: `${b.d}s`, animationDelay: `${b.delay}s` }} />
      ))}
    </Layer>
  );
}

/* peaky — ash falling + old-film flicker. */
const ASH = [
  { left: '15%', d: 14, delay: 0 }, { left: '32%', d: 18, delay: 6 }, { left: '49%', d: 15, delay: 3 },
  { left: '64%', d: 19, delay: 9 }, { left: '80%', d: 16, delay: 1 }, { left: '93%', d: 17, delay: 12 },
];
function AshAndFlicker() {
  return (
    <Layer>
      <div className="fx-flicker absolute inset-0" />
      {ASH.map((a, i) => (
        <span key={i} className="fx-ash" style={{ left: a.left, animationDuration: `${a.d}s`, animationDelay: `${a.delay}s` }} />
      ))}
    </Layer>
  );
}

/* starwars — deterministic starfield + occasional shooting star. */
const STARS = Array.from({ length: 26 }, (_, i) => ({
  left: `${(i * 37) % 97 + 1.5}%`,
  top: `${(i * 53) % 88 + 4}%`,
  d: 2.4 + ((i * 7) % 10) * 0.5,
  delay: ((i * 11) % 20) * 0.35,
}));
function Starfield() {
  const e = useRandomEvent(5000, 11000);
  return (
    <Layer>
      {STARS.map((s, i) => (
        <span key={i} className="fx-star" style={{ left: s.left, top: s.top, animationDuration: `${s.d}s`, animationDelay: `${s.delay}s` }} />
      ))}
      {e && <span key={e.id} className="fx-shooting" style={{ top: `${8 + e.r * 35}%` }} />}
    </Layer>
  );
}

/* minions — goggle-ringed yellow bubbles bobbing upward. */
const GOGGLES = [
  { left: '12%', size: 22, d: 18, delay: 0 }, { left: '34%', size: 15, d: 22, delay: 7 },
  { left: '56%', size: 26, d: 20, delay: 3 }, { left: '76%', size: 17, d: 24, delay: 11 },
  { left: '90%', size: 13, d: 21, delay: 15 },
];
function GoggleBubbles() {
  return (
    <Layer>
      {GOGGLES.map((g, i) => (
        <span key={i} className="fx-goggle" style={{ left: g.left, width: g.size, height: g.size, animationDuration: `${g.d}s`, animationDelay: `${g.delay}s` }} />
      ))}
    </Layer>
  );
}

/* got — snow falls on the left half, embers rise on the right. Ice and fire. */
const SNOW = [
  { left: '4%', d: 13, delay: 0 }, { left: '13%', d: 17, delay: 5 }, { left: '23%', d: 14, delay: 2 },
  { left: '33%', d: 18, delay: 8 }, { left: '42%', d: 15, delay: 4 },
];
const GOT_EMBERS = [
  { left: '58%', d: 12, delay: 1 }, { left: '69%', d: 15, delay: 6 },
  { left: '80%', d: 11, delay: 3 }, { left: '91%', d: 14, delay: 9 },
];
function IceAndFire() {
  return (
    <Layer>
      {SNOW.map((s, i) => (
        <span key={`s${i}`} className="fx-snow" style={{ left: s.left, animationDuration: `${s.d}s`, animationDelay: `${s.delay}s` }} />
      ))}
      {GOT_EMBERS.map((e, i) => (
        <span key={`e${i}`} className="fx-got-ember" style={{ left: e.left, animationDuration: `${e.d}s`, animationDelay: `${e.delay}s` }} />
      ))}
    </Layer>
  );
}

/* ---------- Company backdrops (fogless — each brand's own language) ---------- */

function Beams() {
  return (
    <Layer>
      <span className="bx-beam" style={{ animationDuration: '17s' }} />
      <span className="bx-beam" style={{ animationDuration: '23s', animationDelay: '8s' }} />
    </Layer>
  );
}

function SunAndShimmer() {
  return (
    <Layer>
      <span className="bx-sun" />
      <span className="bx-shimmer" />
    </Layer>
  );
}

function GradientWalk() {
  return (
    <Layer>
      <div className="bx-insta" />
    </Layer>
  );
}

const CHATS = [
  { left: '10%', size: 26, d: 16, delay: 0 }, { left: '30%', size: 16, d: 20, delay: 6 },
  { left: '52%', size: 30, d: 18, delay: 2 }, { left: '72%', size: 18, d: 22, delay: 10 },
  { left: '88%', size: 22, d: 19, delay: 4 },
];
function ChatBubbles() {
  return (
    <Layer>
      {CHATS.map((c, i) => (
        <span key={i} className="bx-chat" style={{ left: c.left, width: c.size, height: c.size, animationDuration: `${c.d}s`, animationDelay: `${c.delay}s` }} />
      ))}
    </Layer>
  );
}

function OrbitingOrbs() {
  return (
    <Layer>
      <div className="bx-orbit-frame">
        <span className="bx-orb" style={{ left: 0, top: 0, background: 'color-mix(in srgb, var(--color-accent) 26%, transparent)' }} />
        <span className="bx-orb" style={{ right: 0, bottom: 0, background: 'color-mix(in srgb, var(--color-accent2) 24%, transparent)' }} />
      </div>
    </Layer>
  );
}

const QUADS = [
  { left: '0%', top: '0%', c: '#f25022', delay: 0 }, { right: '0%', top: '0%', c: '#7fba00', delay: 2.2 },
  { left: '0%', bottom: '0%', c: '#00a4ef', delay: 4.4 }, { right: '0%', bottom: '0%', c: '#ffb900', delay: 6.6 },
] as const;
function Quadrants() {
  return (
    <Layer>
      {QUADS.map((q, i) => (
        <span key={i} className="bx-quad" style={{ ...('left' in q ? { left: q.left } : {}), ...('right' in q ? { right: q.right } : {}), ...('top' in q ? { top: q.top } : {}), ...('bottom' in q ? { bottom: q.bottom } : {}), background: q.c, animationDelay: `${q.delay}s` }} />
      ))}
    </Layer>
  );
}

function Peaks() {
  return (
    <Layer>
      <span className="bx-peak" style={{ left: '-8%' }} />
      <span className="bx-peak" style={{ right: '-12%', animationDelay: '5s', opacity: 0.7 }} />
    </Layer>
  );
}

const GORBS = [
  { left: '12%', top: '18%', c: '#4285f4', anim: 'bx-drift-a', d: 16 },
  { left: '68%', top: '14%', c: '#ea4335', anim: 'bx-drift-b', d: 19 },
  { left: '22%', top: '62%', c: '#fbbc05', anim: 'bx-drift-b', d: 21 },
  { left: '70%', top: '58%', c: '#34a853', anim: 'bx-drift-a', d: 18 },
];
function PrimaryOrbs() {
  return (
    <Layer>
      {GORBS.map((g, i) => (
        <span key={i} className="bx-gorb" style={{ left: g.left, top: g.top, background: g.c, animation: `${g.anim} ${g.d}s ease-in-out infinite` }} />
      ))}
    </Layer>
  );
}

const RIBBONS = [
  { top: '8%', from: 'var(--color-accent)', delay: 0 },
  { top: '38%', from: 'var(--color-accent2)', delay: 4 },
  { top: '68%', from: 'var(--color-accent)', delay: 8 },
];
function Ribbons() {
  return (
    <Layer>
      <div className="bx-ribbon-frame">
        {RIBBONS.map((r, i) => (
          <span key={i} className="bx-ribbon" style={{ top: r.top, background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${r.from} 20%, transparent), transparent)`, animationDelay: `${r.delay}s` }} />
        ))}
      </div>
    </Layer>
  );
}

const ROUTES = [
  { top: '26%', d: 9, delay: 0 }, { top: '52%', d: 12, delay: 4 }, { top: '76%', d: 10, delay: 7 },
];
function RouteLines() {
  return (
    <Layer>
      {ROUTES.map((r, i) => (
        <span key={i} className="bx-line" style={{ top: r.top }}>
          <span className="bx-dot" style={{ animationDuration: `${r.d}s`, animationDelay: `${r.delay}s` }} />
        </span>
      ))}
    </Layer>
  );
}

/* ---------- Wave 3 ---------- */

function AshAndBloom() {
  const e = useRandomEvent(12000, 24000);
  return (
    <Layer>
      {ASH.map((a, i) => (
        <span key={i} className="fx-ash" style={{ left: a.left, animationDuration: `${a.d}s`, animationDelay: `${a.delay}s` }} />
      ))}
      {e && <span key={e.id} className="fx-bloom" />}
    </Layer>
  );
}

const SAND = [
  { top: '22%', d: 12, delay: 0 }, { top: '38%', d: 16, delay: 4 }, { top: '55%', d: 11, delay: 8 },
  { top: '68%', d: 15, delay: 2 }, { top: '82%', d: 13, delay: 6 }, { top: '30%', d: 18, delay: 10 },
];
function SandDrift() {
  return (
    <Layer>
      {SAND.map((g, i) => (
        <span key={i} className="fx-sand" style={{ top: g.top, animationDuration: `${g.d}s`, animationDelay: `${g.delay}s` }} />
      ))}
    </Layer>
  );
}

function Gargantua() {
  return (
    <Layer>
      {STARS.map((st, i) => (
        <span key={i} className="fx-star" style={{ left: st.left, top: st.top, animationDuration: `${st.d}s`, animationDelay: `${st.delay}s` }} />
      ))}
      <span className="fx-accretion" />
    </Layer>
  );
}

const GLYPHS = 'アカサタナハマヤラワ0123456789';
const RAIN = Array.from({ length: 14 }, (_, i) => ({
  left: `${3 + i * 7}%`,
  d: 7 + ((i * 5) % 9),
  delay: ((i * 3) % 11) * 0.8,
  text: Array.from({ length: 22 }, (_, j) => GLYPHS[(i * 7 + j * 3) % GLYPHS.length]).join(''),
}));
function DigitalRain() {
  return (
    <Layer>
      {RAIN.map((c, i) => (
        <span key={i} className="mx-col" style={{ left: c.left, animationDuration: `${c.d}s`, animationDelay: `${c.delay}s` }}>
          {c.text}
        </span>
      ))}
    </Layer>
  );
}

function SpeedLines() {
  const e = useRandomEvent(1600, 3800);
  return (
    <Layer>
      <span className="f1-stripe" style={{ left: '18%' }} />
      <span className="f1-stripe" style={{ left: '21%', opacity: 0.07 }} />
      {e && <span key={e.id} className="f1-line" style={{ top: `${15 + e.r * 60}%` }} />}
    </Layer>
  );
}

const SEEDS = [
  { left: '12%', d: 17, delay: 0 }, { left: '30%', d: 21, delay: 6 }, { left: '48%', d: 15, delay: 3 },
  { left: '66%', d: 23, delay: 9 }, { left: '84%', d: 19, delay: 12 },
];
function Seeds() {
  return (
    <Layer>
      {SEEDS.map((g, i) => (
        <span key={i} className="gh-seed" style={{ left: g.left, animationDuration: `${g.d}s`, animationDelay: `${g.delay}s` }} />
      ))}
    </Layer>
  );
}

function DeliveryArc() {
  return (
    <Layer>
      <span className="az-arc" />
      {MOTES.slice(0, 4).map((m, i) => (
        <span key={i} className="fx-mote" style={{ left: m.left, top: m.top, animationDuration: `${m.d}s`, animationDelay: `${m.delay}s` }} />
      ))}
    </Layer>
  );
}

function Spotlight() {
  return (
    <Layer>
      <span className="ap-light" />
    </Layer>
  );
}

function WarmOrbs() {
  return (
    <Layer>
      <div className="bx-orbit-frame" style={{ animationDuration: '58s' }}>
        <span className="bx-orb" style={{ left: 0, top: 0, background: 'color-mix(in srgb, var(--color-accent) 24%, transparent)' }} />
        <span className="bx-orb" style={{ right: 0, bottom: 0, background: 'color-mix(in srgb, var(--color-accent2) 22%, transparent)' }} />
      </div>
    </Layer>
  );
}

const BARS = Array.from({ length: 30 }, (_, i) => ({
  left: `${2 + i * 3.2}%`,
  h: 6 + ((i * 13) % 16),
  d: 1.6 + ((i * 7) % 10) * 0.22,
  delay: ((i * 5) % 12) * 0.15,
}));
function Equalizer() {
  return (
    <Layer>
      {BARS.map((b, i) => (
        <span key={i} className="sp-bar" style={{ left: b.left, height: `${b.h}vh`, animationDuration: `${b.d}s`, animationDelay: `${b.delay}s` }} />
      ))}
    </Layer>
  );
}
