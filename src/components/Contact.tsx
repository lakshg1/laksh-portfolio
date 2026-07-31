import { site } from '@/content/site';
import { Reveal } from './Reveal';

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-[120px] text-center">
      <div className="blob blob-2 left-[32%] top-[-14%] opacity-65" />
      <div className="relative mx-auto max-w-[1120px] px-[34px] max-[780px]:px-5">
        <Reveal>
          <div className="mb-[22px] flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.26em] text-accent">
            06 · Let&apos;s connect
          </div>
          <h2
            className="mb-4 font-serif text-[clamp(32px,4.8vw,50px)] font-normal tracking-[-0.015em]"
            dangerouslySetInnerHTML={{ __html: site.contactHeading }}
          />
          <p className="mb-8 text-[15.5px] text-tx2">{site.availability}</p>
          <div className="flex flex-wrap justify-center gap-[13px]">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-[7px] rounded-[2px] border border-accent bg-accent px-[15px] py-[9px] font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-btntx transition-opacity hover:opacity-85"
            >
              ✉ {site.email}
            </a>
            <a href={site.links.linkedin} className="inline-flex items-center rounded-[2px] border border-line2 px-[15px] py-[9px] font-mono text-[11px] uppercase tracking-[0.1em] transition-colors hover:border-accent hover:text-accent">
              LinkedIn
            </a>
            <a href={site.links.github} className="inline-flex items-center rounded-[2px] border border-line2 px-[15px] py-[9px] font-mono text-[11px] uppercase tracking-[0.1em] transition-colors hover:border-accent hover:text-accent">
              GitHub
            </a>
            <a
              href={site.resumePath}
              download={site.resumeFilename}
              className="inline-flex items-center rounded-[2px] border border-line2 px-[15px] py-[9px] font-mono text-[11px] uppercase tracking-[0.1em] transition-colors hover:border-accent hover:text-accent"
            >
              ↓ Résumé · {site.resumeUpdated}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
