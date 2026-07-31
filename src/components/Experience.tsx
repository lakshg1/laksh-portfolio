import { experience } from '@/content/experience';
import { SectionHeader } from './SectionHeader';
import { TagRow } from './Tag';
import { Reveal } from './Reveal';

export function Experience() {
  return (
    <section id="experience" className="py-[112px]">
      <div className="mx-auto max-w-[1120px] px-[34px] max-[780px]:px-5">
        <Reveal>
          <SectionHeader num="04" label="Where I've worked" title="Experience" />
        </Reveal>
        {experience.map((role) => (
          <Reveal key={role.company}>
            <div className="grid grid-cols-[186px_1fr] gap-[34px] border-b border-line py-8 transition-all duration-300 hover:bg-gradient-to-r hover:from-accent/5 hover:to-transparent hover:pl-[13px] max-[780px]:grid-cols-1 max-[780px]:gap-[13px]">
              <div>
                <div className="mb-[5px] text-[16.5px]">{role.company}</div>
                <div className="font-mono text-[10.5px] tracking-[0.06em] text-tx3">{role.dates}</div>
                <div className="font-mono text-[10.5px] tracking-[0.06em] text-tx3">{role.location}</div>
              </div>
              <div>
                {role.titles.map((t) => (
                  <div key={t.title} className="mb-2">
                    <div className="mb-[13px] flex flex-wrap items-baseline gap-x-3">
                      <span className="font-mono text-[12.5px] tracking-[0.05em] text-accent">{t.title}</span>
                      {t.dates && role.titles.length > 1 && (
                        <span className="font-mono text-[10px] italic text-tx3">{t.dates}</span>
                      )}
                    </div>
                    <ul>
                      {t.bullets.map((b, i) => (
                        <li
                          key={i}
                          className="rich relative mb-[9px] pl-[18px] text-[14.5px] text-tx2 before:absolute before:left-0 before:top-[10px] before:h-px before:w-[5px] before:bg-tx3"
                          dangerouslySetInnerHTML={{ __html: b }}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
                {role.note && (
                  <div className="relative mt-3 pl-[18px] font-mono text-[10px] tracking-[0.07em] text-accent2 before:absolute before:left-0 before:content-['↑']">
                    {role.note}
                  </div>
                )}
                <TagRow items={role.tech} />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
