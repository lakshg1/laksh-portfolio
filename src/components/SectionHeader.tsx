/** Numbered section header: 01 / WHAT I'VE BUILT / Systems */
export function SectionHeader({ num, label, title }: { num: string; label: string; title: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-baseline gap-[18px] border-b border-line pb-[18px]">
      <span className="font-mono text-[11px] tracking-[0.1em] text-accent">{num}</span>
      <span className="font-mono text-[12.5px] uppercase tracking-[0.22em] text-tx3">{label}</span>
      <h2 className="ml-auto font-serif text-[clamp(32px,4.8vw,50px)] font-normal tracking-[-0.015em] max-[780px]:ml-0">
        {title}
      </h2>
    </div>
  );
}
