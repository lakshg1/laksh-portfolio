import { site } from '@/content/site';

export function Ticker() {
  const items = [...site.ticker, ...site.ticker];
  return (
    <div className="overflow-hidden border-y border-line bg-surface py-[15px]">
      <div className="ticker-track font-mono text-[11px] uppercase tracking-[0.16em] text-tx3">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-[34px]">
            {t} <i className="not-italic text-accent">·</i>
          </span>
        ))}
      </div>
    </div>
  );
}
