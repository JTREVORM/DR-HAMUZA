import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Leaf, MessageCircle, Phone, ShieldCheck } from 'lucide-react';

import { PageHero } from '@/components/layout/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Counter } from '@/components/ui/Counter';
import { Logo } from '@/components/ui/Logo';
import { MasonryGallery } from '@/components/ui/MasonryGallery';
import { JsonLd } from '@/components/ui/JsonLd';
import { DisclaimerSection } from '@/components/home/DisclaimerSection';
import { ApproachSection } from '@/components/home/ApproachSection';

import { getGalleries, getSettings } from '@/lib/queries';
import { breadcrumbSchema, buildMetadata, personSchema } from '@/lib/seo';
import { renderRichText, telHref, whatsappHref } from '@/lib/utils';
import { TRUST_POINTS } from '@/content/site-defaults';

export const revalidate = 600;

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: `About ${settings.site_name} — Traditional Healer in Uganda`,
    description: `${settings.site_name} is a ${settings.tagline.toLowerCase()} from Uganda offering traditional and spiritual consultation. Learn about his practice, approach and the matters people bring to him.`,
    path: '/about',
    type: 'profile',
  });
}

export default async function AboutPage() {
  const [settings, galleries] = await Promise.all([getSettings(), getGalleries()]);

  const images = galleries
    .flatMap((g) =>
      (g.gallery_images ?? []).map((i) => ({
        url: i.url,
        caption: i.caption || g.title,
        alt: i.alt_text || `${g.title} — ${settings.site_name}`,
      }))
    )
    .slice(0, 9);

  const stats = [
    settings.years_experience && {
      value: settings.years_experience,
      label: 'Years in traditional practice',
    },
    settings.clients_served && {
      value: settings.clients_served,
      label: 'People received in consultation',
    },
    settings.languages_spoken && { value: settings.languages_spoken, label: 'Languages spoken' },
  ].filter(Boolean) as { value: string; label: string }[];

  const wa = whatsappHref(settings.whatsapp || settings.phone, settings.whatsapp_message);

  return (
    <>
      <JsonLd data={[personSchema(settings), breadcrumbSchema(CRUMBS)]} />

      <PageHero
        eyebrow="About"
        title={`${settings.site_name} — ${settings.tagline}`}
        intro={settings.short_description}
        crumbs={CRUMBS}
        image={images[0]?.url}
      />

      {/* ---------------------------------------------------- introduction */}
      <section className="relative bg-cream-50 py-20 lg:py-28">
        <div className="container">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <div className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-4 -top-4 h-24 w-24 rounded-tl-3xl border-l-2 border-t-2 border-gold-400/60"
                  />
                  <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-deep">
                    {images[0] ? (
                      <Image
                        src={images[0].url}
                        alt={`${settings.site_name}, ${settings.tagline}`}
                        fill
                        sizes="(max-width:1024px) 100vw, 40vw"
                        className="lift-img object-cover"
                        priority
                      />
                    ) : (
                      <div className="pattern-diamond flex h-full items-center justify-center bg-gradient-to-br from-forest-800 to-forest-950 p-10">
                        <Logo
                          src={settings.logo_url}
                          alt=""
                          size={320}
                          className="!h-auto !w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {stats.length ? (
                  <div className="mt-6 grid gap-3">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-earth-200 bg-cream-100 px-5 py-4"
                      >
                        <Counter
                          value={stat.value}
                          className="block font-display text-2xl text-forest-900"
                        />
                        <span className="mt-0.5 block text-[0.78rem] text-forest-800/65">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-6 rounded-2xl border border-gold-300/50 bg-gradient-to-br from-forest-900 to-forest-950 p-6">
                  <p className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-gold-400">
                    Speak with him directly
                  </p>
                  <p className="mt-3 font-display text-2xl text-cream-100">{settings.phone}</p>
                  <div className="mt-5 space-y-2.5">
                    <a href={telHref(settings.phone)} className="btn-gold w-full">
                      <Phone className="h-4 w-4" aria-hidden />
                      Call now
                    </a>
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp w-full"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow">
                  <span aria-hidden className="h-px w-8 bg-gold-500/70" />
                  His practice
                </p>
                <h2 className="heading-lg mt-4 text-forest-900">
                  A traditional healer from Uganda
                </h2>
                <span aria-hidden className="mt-6 block h-[3px] w-20 rounded-full bg-gold-sheen" />
              </Reveal>

              <Reveal delay={0.08}>
                <div className="prose-brand mt-8">
                  <p className="text-[1.08rem] leading-[1.95] text-forest-800">
                    {settings.about_short}
                  </p>

                  {settings.about_long ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: renderRichText(settings.about_long) }}
                    />
                  ) : (
                    <>
                      <h2>What people bring to him</h2>
                      <p>
                        The matters that arrive at Dr Salongo Hamuza&rsquo;s door are the matters
                        of ordinary life. A marriage that has grown cold. A household that no
                        longer sits together. A business that swallows every shilling and returns
                        nothing. A child whose reports say the same thing every term. A journey
                        that has been planned for years and never moves.
                      </p>
                      <p>
                        Some visitors come because they have tried everything else. Others come
                        because their family has always come, and consulting an elder is simply
                        what one does before a decision. Both are received in the same way.
                      </p>

                      <h2>How the work is carried out</h2>
                      <p>
                        Traditional healing in Uganda is not a hurried practice. It rests on
                        listening, on patience, and on a body of understanding carried from one
                        generation to the next. Dr Salongo Hamuza works within that tradition.
                      </p>
                      <p>
                        A consultation begins with the visitor speaking. Nothing is diagnosed
                        before the story has been heard, and no one is told what their problem is
                        before they have described it themselves. Questions follow, and then
                        guidance according to traditional practice. What is said in the room stays
                        in the room.
                      </p>

                      <h2>What is offered, and what is not</h2>
                      <p>
                        This is stated plainly because honesty matters more here than anywhere
                        else. What is offered is traditional consultation: a private conversation,
                        held with care, with guidance given according to traditional
                        understanding.
                      </p>
                      <p>
                        What is not offered is a guarantee. No outcome is promised — not in money,
                        not in health, not in another person&rsquo;s decisions. Nothing unlawful
                        is offered, and no request to cause harm to another person is ever
                        accepted.
                      </p>
                      <p>
                        Where a matter belongs with a doctor, a hospital, the police, a lawyer or
                        a school, you will be told so. That is not a refusal to help; it is part
                        of helping properly.
                      </p>

                      <h2>Who is welcome</h2>
                      <p>
                        People come from many parts of Uganda and from many faiths and
                        backgrounds. Nobody is asked to set aside their beliefs in order to be
                        received, and nobody is judged for what they bring.
                      </p>
                    </>
                  )}
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="mt-10 rounded-2xl border border-gold-300/60 bg-gold-50/60 p-7">
                  <p className="flex items-center gap-2 font-display text-lg text-forest-900">
                    <ShieldCheck className="h-5 w-5 text-gold-700" aria-hidden />
                    Consultation is private
                  </p>
                  <p className="mt-3 text-[0.94rem] leading-[1.9] text-forest-800/80">
                    Nothing said in a consultation is repeated, and no name, photograph or story
                    appears on this website unless the person concerned has given permission for
                    it first.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- values */}
      <section className="relative overflow-hidden bg-forest-950 py-20 lg:py-24">
        <div aria-hidden className="pattern-diamond absolute inset-0 opacity-55" />
        <div className="container relative z-10">
          <SectionHeading
            eyebrow="Values"
            title="The Principles Behind the Practice"
            intro="These are the commitments every visitor can expect, whatever brings them here."
            tone="dark"
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST_POINTS.map((point, i) => (
              <Reveal key={point.title} delay={(i % 3) * 0.08} as="article" className="card-dark p-7">
                <Leaf className="h-6 w-6 text-gold-400" aria-hidden />
                <h3 className="mt-4 font-display text-[1.18rem] text-cream-100">{point.title}</h3>
                <p className="mt-3 text-[0.92rem] leading-[1.85] text-cream-200/70">
                  {point.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ApproachSection />

      {/* ------------------------------------------------------- gallery */}
      {images.length > 1 ? (
        <section className="bg-cream-50 py-20 lg:py-24">
          <div className="container">
            <SectionHeading
              eyebrow="In practice"
              title="Images From the Practice"
              intro="Photographs of traditional items, herbs, gatherings and daily work, published with permission."
            />
            <div className="mt-14">
              <MasonryGallery items={images} columnsClassName="columns-2 sm:columns-3" />
            </div>
            <Reveal delay={0.1} className="mt-10 text-center">
              <Link href="/gallery" className="btn-outline-forest">
                Open the full gallery
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}

      <DisclaimerSection settings={settings} />
    </>
  );
}
