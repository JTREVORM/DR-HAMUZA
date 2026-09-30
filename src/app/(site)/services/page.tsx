import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';

import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/ui/JsonLd';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { ApproachSection } from '@/components/home/ApproachSection';
import { DisclaimerSection } from '@/components/home/DisclaimerSection';

import { getServices, getSettings } from '@/lib/queries';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/env';
import { telHref, whatsappHref } from '@/lib/utils';

export const revalidate = 600;

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: 'Consultation Services — Traditional Healer in Uganda',
    description:
      'The consultation areas offered by Dr Salongo Hamuza in Uganda: relationship and family matters, business and career, fertility, children and education, travel, and general traditional consultation.',
    path: '/services',
  });
}

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const wa = whatsappHref(settings.whatsapp || settings.phone, settings.whatsapp_message);

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Consultation areas',
    itemListElement: services.map((service, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: service.title,
      url: `${SITE_URL}/services/${service.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(CRUMBS), itemList]} />

      <PageHero
        eyebrow="Consultation areas"
        title="Traditional & Spiritual Consultation Services"
        intro="Dr Salongo Hamuza receives people carrying many different concerns. Each area below has its own page explaining what the consultation covers, how it is held, and — just as importantly — what is not offered."
        crumbs={CRUMBS}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <a href={telHref(settings.phone)} className="btn-gold">
            <Phone className="h-4 w-4" aria-hidden />
            Call {settings.phone}
          </a>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp Now
          </a>
        </div>
      </PageHero>

      <section className="relative bg-cream-100 py-20 lg:py-24">
        <div aria-hidden className="pattern-weave absolute inset-0 opacity-60" />
        <div className="container relative z-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={(i % 3) * 0.07}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-14">
            <div className="rounded-2xl border border-gold-300/60 bg-cream-50 p-8 text-center sm:p-10">
              <h2 className="heading-md text-forest-900">
                Is your concern not listed here?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[0.98rem] leading-[1.9] text-forest-800/80">
                These are the areas people ask about most often, not a complete list. If what you
                are carrying does not appear above, you are welcome to telephone and describe it.
                You will be told honestly whether a traditional consultation is appropriate for
                it.
              </p>
              <Link
                href="/services/general-traditional-consultation"
                className="btn-forest mt-7"
              >
                General traditional consultation
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <ApproachSection />
      <DisclaimerSection settings={settings} />
    </>
  );
}
