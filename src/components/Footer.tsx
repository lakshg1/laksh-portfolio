import { site } from '@/content/site';

export function Footer() {
  return (
    <footer className="border-t border-line py-[25px]">
      <div className="mx-auto flex max-w-[1120px] flex-wrap justify-between gap-[10px] px-[34px] font-mono text-[10.5px] tracking-[0.06em] text-tx3 max-[780px]:px-5">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Next.js · Vercel</span>
      </div>
    </footer>
  );
}
