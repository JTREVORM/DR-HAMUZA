import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';

import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { PatternDivider } from '@/components/ui/PatternDivider';
import type { CornerstonePage } from '@/content/cornerstone';
import type { Service, SiteSettings, VideoItem } from '@/lib/types';
import { contactPhones, fillPhoneToken, telHref, whatsappHref } from '@/lib/utils';

/** Renders **bold** spans without allowing any raw HTML through. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-semibold text-forest-900">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/**
 * The body shared by the cornerstone pages. The H1 is rendered by `PageHero`
 * above this, so everything here starts at H2 and the heading order stays
 * honest.
 */
export function CornerstoneArticle({
  page,
  settings,
  services,
  video,
}: {
  page: CornerstonePage;
  settings: SiteSettings;
  services: Service[];
  video: VideoItem | null;
}) {
  const wa = whatsappHref(settings.whatsapp || settings.phone, settings.whatsapp_message);
  const related = page.relatedServices
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s));

  // The video is dropped into the middle of the page so the reading is broken
  // up by the real thing rather than by decoration.
  const breakAfter = Math.min(2, Math.max(1, page.sections.length - 2));

  return (
    <>
      <article className="bg-cream-50 py-20 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {page.sections.map((section, index) => (
              <div key={section.heading}>
                <Reveal className={index === 0 ? '' : 'mt-14'}>
                  <h2 className="font-display text-2xl leading-tight text-forest-900 sm:text-3xl">
                    {section.heading}
                  </h2>
                  <span
                    aria-hidden
                    className="mt-4 block h-[3px] w-16 rounded-full bg-gold-sheen"
                  />

                  <div className="mt-6 space-y-5 text-[1.03rem] leading-[1.9] text-forest-800/90">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>
                        <RichText text={paragraph} />
                      </p>
                    ))}
                  </div>

                  {section.points?.length ? (
                    <ul className="mt-7 space-y-3.5">
                      {section.points.map((point) => (
                        <li key={point} className="flex items-start gap-3.5">
                          <span
                            aria-hidden
                            className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-500"
                          />
                          <span className="text-[0.98rem] leading-[1.85] text-forest-800/85">
                            <RichText text={point} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Reveal>

                {video && index === breakAfter ? (
                  <Reveal className="mt-14">
                    <VideoPlayer video={video} />
                    <p className="mt-4 text-center text-[0.85rem] text-forest-800/65">
                      {video.title} — filmed during traditional work in Uganda.
                    </p>
                  </Reveal>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* ------------------------------------------------------------- FAQ */}
      {page.faqs.length ? (
        <section className="bg-cream-100 py-20 lg:py-24">
          <div className="container">
            <SectionHeading
              eyebrow="Questions"
              title="Frequently Asked Questions"
              intro="The questions people most often ask before making contact."
            />
            <div className="mx-auto mt-14 max-w-3xl space-y-4">
              {page.faqs.map((faq, i) => (
                <Reveal key={faq.question} delay={(i % 3) * 0.05}>
                  <details className="group rounded-2xl border border-earth-200/80 bg-cream-50 p-6 shadow-card transition hover:border-gold-300 open:border-gold-300">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-display text-[1.12rem] leading-snug text-forest-900">
                      <h3 className="font-display text-[1.12rem] font-normal leading-snug">
                        {faq.question}
                      </h3>
                      <span
                        aria-hidden
                        className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-400/60 text-gold-700 transition group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-4 text-[0.98rem] leading-[1.9] text-forest-800/85">
                      {fillPhoneToken(faq.answer, settings)}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* -------------------------------------------------- related services */}
      {related.length ? (
        <section className="bg-cream-50 py-20 lg:py-24">
          <div className="container">
            <SectionHeading
              eyebrow="Consultation areas"
              title="Related Consultation Areas"
              intro="The matters most often brought to Dr Salongo Hamuza. If yours is not listed, you are still welcome to make contact."
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((service, i) => (
                <Reveal key={service.slug} delay={(i % 4) * 0.07}>
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1} className="mt-12 text-center">
              <Link href="/services" className="btn-outline-forest">
                View all consultation areas
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* -------------------------------------------- read next / internal */}
      <section className="relative overflow-hidden bg-forest-900 py-20 lg:py-24">
        <div aria-hidden className="pattern-diamond absolute inset-0 opacity-55" />
        <div className="container relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              {page.image ? (
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-gold-500/25 shadow-deep">
                  <Image
                    src={page.image}
                    alt={`Dr Salongo Hamuza, traditional healer in Uganda, during traditional work`}
                    fill
                    sizes="(max-width: 1024px) 90vw, 36vw"
                    className="object-cover"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-forest-950/70 to-transparent"
                  />
                </div>
              ) : null}
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-7">
              <p className="eyebrow-light">
                <span aria-hidden className="h-px w-8 bg-gold-400/70" />
                Continue reading
              </p>
              <h2 className="heading-lg mt-4 text-cream-100">Speak With Dr Salongo Hamuza</h2>
              <PatternDivider tone="dark" className="mt-6 max-w-xs" />

              <p className="mt-7 text-[1.02rem] leading-[1.9] text-cream-200/80">
                You do not need to prepare anything or fill in any form. A telephone call or a
                WhatsApp message describing your situation in your own words is enough to begin,
                and you can decide afterwards whether you wish to come.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                {contactPhones(settings).map((number) => (
                  <a key={number} href={telHref(number)} className="btn-gold">
                    <Phone className="h-4 w-4" aria-hidden />
                    Call {number}
                  </a>
                ))}
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WhatsApp Now
                </a>
                <Link href="/contact" className="btn-outline-gold">
                  {settings.consultation_cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>

              <nav aria-label="Related pages" className="mt-10">
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-gold-400/70">
                  More about the practice
                </p>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {[
                    { href: '/about', label: 'About Dr Salongo Hamuza' },
                    { href: '/traditional-healer-uganda', label: 'Traditional healing in Uganda' },
                    { href: '/traditional-doctor-uganda', label: 'Traditional doctors and herbs' },
                    { href: '/videos', label: 'Watch the work on video' },
                    { href: '/our-work', label: 'Recent work and activities' },
                    { href: '/witch-doctor-uganda', label: 'A note on terminology' },
                  ]
                    .filter((link) => link.href !== `/${page.slug}`)
                    .slice(0, 5)
                    .map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="inline-flex items-center gap-2 text-[0.92rem] text-cream-200/80 underline decoration-gold-500/40 underline-offset-4 transition hover:text-gold-200 hover:decoration-gold-400"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </nav>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
