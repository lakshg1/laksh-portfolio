import { site } from '@/content/site';
import { FogBackground } from './FogBackground';
import { RoleRotator } from './RoleRotator';
import { SkinEffects } from './SkinEffects';

/**
 * Minimal centered hero: eyebrow · name · one line · two actions.
 * The headline metrics live in the Systems panels where they have context —
 * the hero's only job is identity.
 */
export function Hero() {
  return (
    <header className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-[62px]">
      <FogBackground />
      <SkinEffects />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      <div className="relative z-10 mx-auto w-full max-w-[820px] px-[34px] text-center max-[780px]:px-5">
        <div className="mb-7 font-mono text-[11px] uppercase tracking-[0.32em] text-tx2">
          <RoleRotator />
        </div>
        <h1 className="mb-8 font-serif text-[clamp(58px,10vw,124px)] font-light leading-[0.94] tracking-[-0.025em]">
          {site.firstName} <em className="italic text-accent">{site.lastName}</em>
        </h1>
        <p
          className="rich mx-auto mb-11 max-w-[560px] text-[17.5px] text-tx2"
          dangerouslySetInnerHTML={{ __html: site.lede }}
        />
        <div className="flex flex-wrap justify-center gap-[13px]">
          <a
            href="#systems"
            className="inline-flex items-center gap-[7px] rounded-[2px] border border-tx bg-tx px-[22px] py-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-bg transition-opacity hover:opacity-80"
          >
            View my work →
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-[7px] rounded-[2px] border border-line2 bg-bg/40 px-[22px] py-3 font-mono text-[11px] uppercase tracking-[0.1em] backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
          >
            Get in touch
          </a>
        </div>
      </div>
    </header>
  );
}
