export function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-[2px] border border-line px-[9px] py-[4px] font-mono text-[9.5px] uppercase tracking-[0.09em] text-tx3">
      {children}
    </span>
  );
}

export function TagRow({ items }: { items: readonly string[] }) {
  return (
    <div className="mt-[13px] flex flex-wrap gap-[6px]">
      {items.map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </div>
  );
}
