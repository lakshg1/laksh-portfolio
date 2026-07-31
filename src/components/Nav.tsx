import { site } from '@/content/site';
import { ThemeToggle } from './ThemeToggle';
import { SkinPicker } from './SkinPicker';

const links = [
  ['#systems', 'Systems'],
  ['#pipeline', 'Pipeline'],
  ['#capabilities', 'Capabilities'],
  ['#experience', 'Experience'],
  ['#contact', 'Contact'],
] as const;

export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-[100] border-b border-line bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex h-[62px] max-w-[1120px] items-center justify-between gap-4 px-[34px] max-[780px]:px-5">
        <a href="#" className="font-mono text-[12.5px] tracking-[0.09em]">
          {site.firstName.toUpperCase()}
          <b className="font-medium text-accent">.</b>
          {site.lastName.toUpperCase()}
        </a>
        <div className="flex gap-[22px] font-mono text-[11px] uppercase tracking-[0.13em] text-tx3 max-[900px]:hidden">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="transition-colors duration-200 hover:text-accent">
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-[9px]">
          {/* SKIN PICKER — comment out the next line to hide it from visitors.
              /studio keeps working either way. */}
          <SkinPicker />
          <ThemeToggle />
          <a
            href={site.resumePath}
            download={site.resumeFilename}
            className="inline-flex items-center gap-[7px] rounded-[2px] border border-accent bg-accent px-[15px] py-[9px] font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-btntx transition-opacity duration-200 hover:opacity-85"
          >
            ↓ Résumé
          </a>
        </div>
      </div>
    </nav>
  );
}
