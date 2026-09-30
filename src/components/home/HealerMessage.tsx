import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';
import { Logo } from '@/components/ui/Logo';
import { PatternDivider } from '@/components/ui/PatternDivider';
import { PORTRAIT_STILL } from '@/content/videos';
import type { SiteSettings } from '@/lib/types';

/**
 * Dr Salongo Hamuza's own statement. The client asked for this text to be
 * published exactly as supplied, so it is rendered verbatim and is never
 * reformatted, corrected or truncated.
 *
 * It is a long passage, so it is set beside his portrait — a frame taken from
 * his own recorded message — rather than left as a wall of type across the
 * full width of the page.
 */
export function HealerMessage({
  settings,
  portrait = PORTRAIT_STILL,
}: {
  settings: SiteSettings;
  portrait?: string;
}) {
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
          <h2 id="healer-message-heading" className="heading-lg mt-4 text-cream-100">
            A Message From Dr Salongo Hamuza
          </h2>
          <PatternDivider tone="dark" className="mx-auto mt-6 max-w-xs" />
        </Reveal>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="mx-auto w-full max-w-sm lg:col-span-4 lg:mx-0 lg:sticky lg:top-28">
            <div className="relative">
              <span
                aria-hidden
                className="absolute -left-3 -top-3 h-24 w-24 rounded-tl-3xl border-l-2 border-t-2 border-gold-400/50"
              />
              <span
                aria-hidden
                className="absolute -bottom-3 -right-3 h-24 w-24 rounded-br-3xl border-b-2 border-r-2 border-gold-400/50"
              />
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-gold-500/25 shadow-deep">
                <Image
                  src={portrait}
                  alt={`${settings.site_name}, ${settings.tagline}`}
                  fill
                  sizes="(max-width: 1024px) 80vw, 24rem"
                  className="object-cover object-top"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent"
                />
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block font-display text-lg text-cream-100">
                    {settings.site_name}
                  </span>
                  <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.22em] text-gold-300/80">
                    {settings.tagline}
                  </span>
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-8">
            <blockquote className="relative rounded-3xl border border-gold-500/30 bg-forest-950/55 p-7 shadow-deep backdrop-blur-sm sm:p-11">
              <span
                aria-hidden
                className="absolute -top-5 left-8 font-display text-7xl leading-none text-gold-400/45"
              >
                &ldquo;
              </span>
              <p className="relative whitespace-pre-line font-serif text-[1.02rem] font-medium leading-[2.05] tracking-[0.015em] text-cream-100/95 sm:text-[1.12rem] sm:leading-[2.1]">
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
      </div>
    </section>
  );
}
