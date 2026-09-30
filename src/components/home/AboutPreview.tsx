import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Leaf } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Logo } from '@/components/ui/Logo';
import type { SiteSettings } from '@/lib/types';

export function AboutPreview({
  settings,
  images,
}: {
  settings: SiteSettings;
  images: string[];
}) {
  const portrait = images[0];
  const secondary = images.slice(1, 3);

  return (
    <section className="relative overflow-hidden bg-cream-50 py-20 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-16 h-96 w-96 rounded-full bg-gold-200/25 blur-3xl"
      />

      <div className="container relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Portrait area */}
          <Reveal className="lg:col-span-5">
            <div className="relative">
              <span
                aria-hidden
                className="absolute -left-4 -top-4 h-28 w-28 rounded-tl-3xl border-l-2 border-t-2 border-gold-400/60"
              />
              <span
                aria-hidden
                className="absolute -bottom-4 -right-4 h-28 w-28 rounded-br-3xl border-b-2 border-r-2 border-gold-400/60"
              />

              <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-deep">
                {portrait ? (
                  <Image
                    src={portrait}
                    alt={`${settings.site_name}, ${settings.tagline}`}
                    fill
                    sizes="(max-width:1024px) 100vw, 40vw"
                    className="lift-img object-cover"
                  />
                ) : (
                  <div className="pattern-diamond flex h-full w-full items-center justify-center bg-gradient-to-br from-forest-800 to-forest-950 p-10">
                    <Logo src={settings.logo_url} alt="" size={300} className="!h-auto !w-full" />
                  </div>
                )}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-forest-950/55 to-transparent"
                />
              </div>

              {secondary.length ? (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {secondary.map((src, i) => (
                    <div
                      key={src}
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-earth-200"
                    >
                      <Image
                        src={src}
                        alt={`${settings.site_name} — traditional practice ${i + 1}`}
                        fill
                        sizes="(max-width:1024px) 50vw, 20vw"
                        className="lift-img object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>

          {/* Copy */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">
                <span aria-hidden className="h-px w-8 bg-gold-500/70" />
                About
              </p>
              <h2 className="heading-lg mt-4 text-forest-900">
                Dr Salongo Hamuza, {settings.tagline}
              </h2>
              <span aria-hidden className="mt-6 block h-[3px] w-20 rounded-full bg-gold-sheen" />
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-7 text-[1.02rem] leading-[1.95] text-forest-800/85">
                {settings.about_short}
              </p>

              <div className="mt-8 space-y-5">
                {[
                  {
                    title: 'Traditional practice, held with care',
                    body: 'The work follows traditional Ugandan understanding, carried from one generation to the next. It is offered patiently and with respect for whatever beliefs a visitor brings with them.',
                  },
                  {
                    title: 'Listening before anything else',
                    body: 'Nobody is told what their problem is. Each consultation begins with the visitor describing the situation in their own words, for as long as they need.',
                  },
                  {
                    title: 'Honest about its limits',
                    body: 'Guidance is offered; results are never promised. Where a matter belongs with a doctor, the police, a teacher or a lawyer, that is said plainly and without hesitation.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-300 bg-gold-50 text-gold-700">
                      <Leaf className="h-4 w-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block font-display text-[1.05rem] text-forest-900">
                        {item.title}
                      </span>
                      <span className="mt-1.5 block text-[0.93rem] leading-[1.85] text-forest-800/75">
                        {item.body}
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/about" className="btn-forest">
                  Read the full story
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/services" className="btn-outline-forest">
                  Consultation areas
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
