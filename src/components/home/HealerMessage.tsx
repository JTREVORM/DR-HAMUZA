import { Reveal } from '@/components/ui/Reveal';
import { Logo } from '@/components/ui/Logo';
import { PatternDivider } from '@/components/ui/PatternDivider';
import type { SiteSettings } from '@/lib/types';

/**
 * Dr Salongo Hamuza's own statement. The client asked for this text to be
 * published exactly as supplied, so it is rendered verbatim and is never
 * reformatted, corrected or truncated.
 */
export function HealerMessage({ settings }: { settings: SiteSettings }) {
  return (
    <section
      aria-labelledby="healer-message-heading"
      className="relative overflow-hidden bg-forest-900 py-20 lg:py-28"
    >
      <div aria-hidden className="pattern-diamond absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-gold-400/8 blur-[110px]"
      />

      <div className="container relative z-10">
        <Reveal className="mx-auto max-w-4xl text-center">
          <Logo
            src={settings.logo_url}
            alt=""
            size={96}
            className="mx-auto drop-shadow-[0_10px_34px_rgba(228,179,44,0.3)]"
          />
          <p className="eyebrow-light mt-7 justify-center">In his own words</p>
          <h2
            id="healer-message-heading"
            className="heading-lg mt-4 text-cream-100"
          >
            A Message From Dr Salongo Hamuza
          </h2>
          <PatternDivider tone="dark" className="mx-auto mt-6 max-w-xs" />
        </Reveal>

        <Reveal delay={0.12} className="mx-auto mt-10 max-w-4xl">
          <blockquote className="relative rounded-3xl border border-gold-500/30 bg-forest-950/55 p-7 shadow-deep backdrop-blur-sm sm:p-11">
            <span
              aria-hidden
              className="absolute -top-5 left-8 font-display text-7xl leading-none text-gold-400/45"
            >
              &ldquo;
            </span>
            <p className="relative font-serif text-[1.05rem] font-medium leading-[2.05] tracking-[0.015em] text-cream-100/95 sm:text-[1.2rem] sm:leading-[2.1]">
              {settings.healer_message}
            </p>
            <footer className="mt-8 border-t border-gold-500/25 pt-6">
              <cite className="not-italic">
                <span className="block font-display text-lg text-gold-300">
                  Dr Salongo Hamuza
                </span>
                <span className="mt-1 block text-[0.7rem] uppercase tracking-[0.24em] text-cream-200/55">
                  {settings.tagline}
                </span>
              </cite>
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
