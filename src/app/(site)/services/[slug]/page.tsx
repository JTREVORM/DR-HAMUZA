import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AlertTriangle, ArrowRight, Check, MessageCircle, Phone } from 'lucide-react';

import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/ui/JsonLd';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { DisclaimerSection } from '@/components/home/DisclaimerSection';

import { getServiceBySlug, getServices, getSettings } from '@/lib/queries';
import { breadcrumbSchema, buildMetadata, serviceSchema } from '@/lib/seo';
import { contactPhones, renderRichText, telHref, whatsappHref } from '@/lib/utils';

export const revalidate = 600;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [settings, service] = await Promise.all([getSettings(), getServiceBySlug(slug)]);
  if (!service) return { title: 'Service not found' };

  return buildMetadata({
    settings,
    title: service.seo_title || `${service.title} — Traditional Consultation in Uganda`,
    description: service.seo_description || service.short_description,
    path: `/services/${service.slug}`,
    image: service.cover_image,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [settings, service, services] = await Promise.all([
    getSettings(),
    getServiceBySlug(slug),
    getServices(),
  ]);

  if (!service) notFound();

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const wa = whatsappHref(
    settings.whatsapp || settings.phone,
    `Hello Dr Salongo Hamuza, I visited your website and would like to inquire about a consultation regarding ${service.title}.`
  );

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.title, path: `/services/${service.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          serviceSchema({
            settings,
            name: service.title,
            description: service.short_description,
            path: `/services/${service.slug}`,
          }),
        ]}
      />

      <PageHero
        eyebrow="Consultation area"
        title={service.title}
        intro={service.description || service.short_description}
        crumbs={crumbs}
        image={service.cover_image}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          {contactPhones(settings).map((number) => (
            <a key={number} href={telHref(number)} className="btn-gold">
              <Phone className="h-4 w-4" aria-hidden />
              Call {number}
            </a>
          ))}
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            <MessageCircle className="h-4 w-4" aria-hidden />
            Ask about this
          </a>
        </div>
      </PageHero>

      <article className="bg-cream-50 py-20 lg:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Body */}
            <div className="lg:col-span-8">
              {service.cover_image ? (
                <Reveal className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl shadow-deep">
                  <Image
                    src={service.cover_image}
                    alt={service.title}
                    fill
                    sizes="(max-width:1024px) 100vw, 66vw"
                    className="object-cover"
                    priority
                  />
                </Reveal>
              ) : null}

              <Reveal>
                <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-gold-300 bg-gold-50 text-gold-700">
                  <ServiceIcon name={service.icon} className="h-6 w-6" />
                </span>
              </Reveal>

              <Reveal delay={0.06}>
                <div
                  className="prose-brand mt-8"
                  dangerouslySetInnerHTML={{ __html: renderRichText(service.body) }}
                />
              </Reveal>

              {service.notice ? (
                <Reveal delay={0.1}>
                  <aside className="mt-10 rounded-2xl border-l-4 border-gold-500 bg-gold-50/70 p-6 sm:p-7">
                    <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-700">
                      <AlertTriangle className="h-4 w-4" aria-hidden />
                      Please note
                    </p>
                    <p className="mt-3 text-[0.94rem] leading-[1.9] text-forest-800/85">
                      {service.notice}
                    </p>
                  </aside>
                </Reveal>
              ) : null}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="space-y-6 lg:sticky lg:top-32">
                {service.bullet_points?.length ? (
                  <Reveal className="rounded-2xl border border-earth-200 bg-cream-100 p-7">
                    <h2 className="font-display text-lg text-forest-900">
                      This consultation covers
                    </h2>
                    <ul className="mt-5 space-y-3.5">
                      {service.bullet_points.map((point) => (
                        <li key={point} className="flex gap-3 text-[0.9rem] leading-[1.75] text-forest-800/80">
                          <Check
                            className="mt-1 h-4 w-4 shrink-0 text-gold-600"
                            aria-hidden
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ) : null}

                <Reveal
                  delay={0.08}
                  className="rounded-2xl border border-gold-400/40 bg-gradient-to-br from-forest-900 to-forest-950 p-7"
                >
                  <h2 className="font-display text-lg text-cream-100">
                    Speak about this personally
                  </h2>
                  <p className="mt-3 text-[0.88rem] leading-[1.8] text-cream-200/70">
                    Describe your situation in your own words. You can decide afterwards whether
                    you wish to come.
                  </p>
                  <div className="mt-5 space-y-2.5">
                    {contactPhones(settings).map((number) => (
                      <a key={number} href={telHref(number)} className="btn-gold w-full">
                        <Phone className="h-4 w-4" aria-hidden />
                        Call {number}
                      </a>
                    ))}
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp w-full"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden />
                      WhatsApp
                    </a>
                    <Link href="/contact" className="btn-outline-gold w-full">
                      {settings.consultation_cta}
                    </Link>
                  </div>
                </Reveal>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* --------------------------------------------------------- related */}
      {related.length ? (
        <section className="relative overflow-hidden bg-forest-950 py-20 lg:py-24">
          <div aria-hidden className="pattern-diamond absolute inset-0 opacity-55" />
          <div className="container relative z-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow-light">
                  <span aria-hidden className="h-px w-8 bg-gold-400/70" />
                  Also consider
                </p>
                <h2 className="heading-md mt-4 text-cream-100">Other Consultation Areas</h2>
              </div>
              <Link href="/services" className="btn-outline-gold">
                All services
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => (
                <Reveal key={item.slug} delay={(i % 3) * 0.08}>
                  <ServiceCard service={item} tone="dark" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <DisclaimerSection settings={settings} />
    </>
  );
}
