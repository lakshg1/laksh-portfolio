'use client';

import { useState } from 'react';
import { pipeline, pipelineMeta } from '@/content/pipeline';
import { SectionHeader } from './SectionHeader';
import { TagRow } from './Tag';
import { Reveal } from './Reveal';

/**
 * The architecture diagram lays itself out from the stage count:
 * add or remove a stage in content/pipeline.ts and the geometry adapts.
 */
const VIEW_W = 1000;
const NODE_H = 56;
const NODE_Y = 44;
const MID_Y = NODE_Y + NODE_H / 2;

export function Pipeline() {
  const [active, setActive] = useState(0);
  const d = pipeline[active];

  const n = pipeline.length;
  const nodeW = Math.min(120, (VIEW_W - (n - 1) * 40) / n);
  const gap = (VIEW_W - n * nodeW) / Math.max(1, n - 1);
  const xs = pipeline.map((_, i) => i * (nodeW + gap));

  return (
    <section id="pipeline" className="py-[112px]">
      <div className="mx-auto max-w-[1120px] px-[34px] max-[780px]:px-5">
        <Reveal>
          <SectionHeader num="02" label="Signature architecture" title={pipelineMeta.heading} />
          <p className="mb-10 max-w-[690px] text-[15.5px] text-tx2">{pipelineMeta.intro}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-[4px] border border-line bg-surface p-[34px] max-[780px]:p-5">
            <div className="mb-[14px] flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-tx3">
                {pipelineMeta.label}
              </div>
              <div className="flex items-center gap-[7px] font-mono text-[10px] uppercase tracking-[0.1em] text-accent2">
                <span className="live-dot h-[6px] w-[6px] rounded-full bg-accent2" />
                {pipelineMeta.badge}
              </div>
            </div>

            <svg viewBox={`0 0 ${VIEW_W} 176`} className="h-auto w-full" role="img" aria-label="Ingestion pipeline diagram">
              <defs>
                <marker id="ar" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7z" fill="currentColor" opacity=".45" />
                </marker>
              </defs>

              {xs.slice(0, -1).map((x, i) => (
                <line
                  key={i}
                  x1={x + nodeW}
                  y1={MID_Y}
                  x2={xs[i + 1] - 4}
                  y2={MID_Y}
                  stroke="var(--color-line2)"
                  strokeWidth="1"
                  markerEnd="url(#ar)"
                />
              ))}

              {[0, 1.2, 2.5].map((begin, i) => (
                <circle key={i} r={3.2 - i * 0.55} fill={i === 1 ? 'var(--color-accent2)' : 'var(--color-accent)'} opacity={1 - i * 0.25}>
                  <animateMotion dur="4.4s" begin={`${begin}s`} repeatCount="indefinite" path={`M18,${MID_Y} H${VIEW_W - 20}`} />
                </circle>
              ))}

              {pipeline.map((st, i) => {
                const on = i === active;
                return (
                  <g key={st.id} onClick={() => setActive(i)} className="cursor-pointer" role="button" aria-label={st.title} tabIndex={0}>
                    <rect
                      x={xs[i]}
                      y={NODE_Y}
                      width={nodeW}
                      height={NODE_H}
                      rx="3"
                      fill={on ? 'color-mix(in srgb, var(--color-accent) 9%, var(--color-panel))' : 'var(--color-panel)'}
                      stroke={on ? 'var(--color-accent)' : 'var(--color-line2)'}
                      style={{ transition: 'all .25s' }}
                    />
                    <text x={xs[i] + nodeW / 2} y={NODE_Y + 24} textAnchor="middle" fill={on ? 'var(--color-accent)' : 'var(--color-tx)'} fontFamily="var(--font-mono)" fontSize="11">
                      {st.short}
                    </text>
                    <text x={xs[i] + nodeW / 2} y={NODE_Y + 41} textAnchor="middle" fill="var(--color-tx3)" fontFamily="var(--font-mono)" fontSize="8.5">
                      {st.caption}
                    </text>
                  </g>
                );
              })}

              <line x1="6" y1="120" x2={VIEW_W - 6} y2="120" stroke="var(--color-line2)" strokeDasharray="2 4" opacity=".6" />
              <text x="6" y="138" fill="var(--color-tx3)" fontFamily="var(--font-mono)" fontSize="9">
                {pipelineMeta.rail}
              </text>
            </svg>

            <div className="mt-6 min-h-[112px] border-t border-line pt-[22px]">
              <h4 className="mb-[7px] text-[17px] font-normal">
                {d.title}
                <em className="ml-[10px] font-mono text-[10.5px] uppercase not-italic tracking-[0.1em] text-accent">
                  {d.meta}
                </em>
              </h4>
              <p className="mb-3 max-w-[680px] text-[14.5px] text-tx2">{d.body}</p>
              <TagRow items={d.tech} />
            </div>
            <div className="mt-[14px] font-mono text-[10px] tracking-[0.08em] text-tx3">
              ↑ Click any stage to inspect the engineering
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
