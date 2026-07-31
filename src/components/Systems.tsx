'use client';

import { useState } from 'react';
import { systems } from '@/content/systems';
import { SectionHeader } from './SectionHeader';
import { TagRow } from './Tag';
import { Reveal } from './Reveal';

export function Systems() {
  const [active, setActive] = useState(0);
  const s = systems[active];

  return (
    <section id="systems" className="py-[112px]">
      <div className="mx-auto max-w-[1120px] px-[34px] max-[780px]:px-5">
        <Reveal>
          <SectionHeader num="01" label="What I've built" title="Systems" />
          <p className="mb-10 max-w-[690px] text-[15.5px] text-tx2">
            Four production systems across three different problem domains — AI retrieval,
            real-time distributed services, and infrastructure automation. Switch between them.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Systems">
            {systems.map((sys, i) => (
              <button
                key={sys.id}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`flex flex-col items-start gap-1 rounded-[2px] border px-4 py-[11px] text-left font-mono text-[11px] uppercase tracking-[0.09em] transition-all duration-200 ${
                  i === active
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-line bg-surface text-tx3 hover:border-line2 hover:text-tx2'
                }`}
              >
                {sys.tab}
                <em className="text-[9px] normal-case not-italic tracking-[0.05em] opacity-70">
                  {sys.domain}
                </em>
              </button>
            ))}
          </div>

          <div className="rounded-[4px] border border-line bg-surface p-8 max-[780px]:p-5" role="tabpanel">
            <div className="mb-[22px] flex flex-wrap items-start justify-between gap-[18px]">
              <div>
                <h3 className="mb-[5px] font-serif text-[26px] font-normal">{s.name}</h3>
                <div className="font-mono text-[10.5px] tracking-[0.07em] text-tx3">{s.context}</div>
              </div>
              <span className="whitespace-nowrap rounded-[2px] border border-line2 px-[10px] py-[5px] font-mono text-[9.5px] uppercase tracking-[0.1em] text-tx2">
                {s.badge}
              </span>
            </div>

            <p className="mb-6 max-w-[710px] text-[15px] text-tx2">{s.summary}</p>

            <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-px overflow-hidden rounded-[3px] border border-line bg-line">
              {s.stats.map((st) => (
                <div key={st.label} className="bg-panel px-[17px] py-[15px]">
                  <div className="font-mono text-[17px] font-medium">{st.value}</div>
                  <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-tx3">
                    {st.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line pt-[22px]">
              <div className="mb-[13px] font-mono text-[10px] uppercase tracking-[0.15em] text-tx3">
                Engineering notes
              </div>
              <ul>
                {s.notes.map((n, i) => (
                  <li
                    key={i}
                    className="rich relative mb-[10px] pl-[19px] text-[14.5px] text-tx2 before:absolute before:left-0 before:top-[9px] before:h-px before:w-[6px] before:bg-accent"
                    dangerouslySetInnerHTML={{ __html: n }}
                  />
                ))}
              </ul>
              <TagRow items={s.tech} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
