import { stack } from '@/content/stack';
import { SectionHeader } from './SectionHeader';
import { Reveal } from './Reveal';

export function Stack() {
  return (
    <section id="stack" className="py-[112px]">
      <div className="mx-auto max-w-[1120px] px-[34px] max-[780px]:px-5">
        <Reveal>
          <SectionHeader num="05" label="Toolkit" title="Stack" />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-7">
            {stack.map((g) => (
              <div key={g.title}>
                <div className="mb-3 border-b border-line pb-[9px] font-mono text-[10.5px] uppercase tracking-[0.15em] text-accent">
                  {g.title}
                </div>
                <p className="text-[13.5px] leading-[1.95] text-tx2">{g.items}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
