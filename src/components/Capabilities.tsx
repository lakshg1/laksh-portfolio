import { capabilities } from '@/content/capabilities';
import { SectionHeader } from './SectionHeader';
import { Reveal } from './Reveal';

export function Capabilities() {
  return (
    <section id="capabilities" className="py-[112px]">
      <div className="mx-auto max-w-[1120px] px-[34px] max-[780px]:px-5">
        <Reveal>
          <SectionHeader num="03" label="How I work" title="Capabilities" />
          <p className="mb-10 max-w-[690px] text-[15.5px] text-tx2">
            Six areas I&apos;ve owned end to end, and where each was earned. Most were learned by
            being the person responsible when they broke.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-px overflow-hidden rounded-[4px] border border-line bg-line">
            {capabilities.map((c, i) => (
              <div key={c.title} className="bg-surface p-[26px] transition-colors duration-300 hover:bg-panel">
                <div className="mb-[11px] flex items-baseline justify-between">
                  <span className="text-[16.5px] font-normal">{c.title}</span>
                  <span className="font-mono text-[10px] text-tx3">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="mb-[14px] text-[13.5px] text-tx2">{c.body}</p>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-tx3">
                  Earned at <span className="text-accent2">{c.earnedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
