import type { Metadata } from 'next';
import { Clock, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';

import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/ui/JsonLd';
import { ContactForm } from '@/components/ContactForm';
import { DisclaimerSection } from '@/components/home/DisclaimerSection';

import { getSettings } from '@/lib/queries';
import { breadcrumbSchema, buildMetadata, localBusinessSchema } from '@/lib/seo';
import { telHref, whatsappHref } from '@/lib/utils';

export const revalidate = 600;

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: 'Contact Dr Salongo Hamuza — Traditional Healer in Uganda',
    description: `Contact Dr Salongo Hamuza, ${settings.tagline.toLowerCase()} in Uganda, on ${settings.phone}. Call, send a WhatsApp message, or use the confidential enquiry form.`,
    path: '/contact',
  });
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const [settings, params] = await Promise.all([getSettings(), searchParams]);
  const wa = whatsappHref(settings.whatsapp || settings.phone, settings.whatsapp_message);

  return (
    <>
      <JsonLd data={[breadcrumbSchema(CRUMBS), localBusinessSchema(settings)]} />

      <PageHero
        eyebrow="Contact"
        title="Speak With Dr Salongo Hamuza"
        intro="You can telephone directly, send a WhatsApp message, or write using the form below. Describe your situation in your own words — there is nothing to prepare beforehand, and every enquiry is treated in confidence."
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

      <section className="bg-cream-50 py-20 lg:py-24">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Form */}
            <Reveal className="lg:col-span-7">
              <div className="rounded-2xl border border-earth-200 bg-cream-100 p-7 shadow-card sm:p-10">
                <h2 className="heading-md text-forest-900">Send a Confidential Enquiry</h2>
                <p className="mt-3.5 text-[0.95rem] leading-[1.85] text-forest-800/75">
                  Fields marked with an asterisk are required. If your matter is urgent, please
                  telephone rather than write.
                </p>
                <div className="mt-8">
                  <ContactForm defaultType={params.service} />
                </div>
              </div>
            </Reveal>

            {/* Details */}
            <div className="lg:col-span-5">
              <div className="space-y-6 lg:sticky lg:top-32">
                <Reveal className="rounded-2xl border border-gold-400/40 bg-gradient-to-br from-forest-900 to-forest-950 p-7">
                  <h2 className="font-display text-xl text-cream-100">Reach him directly</h2>

                  <a
                    href={telHref(settings.phone)}
                    className="group mt-6 flex items-center gap-4 rounded-xl border border-gold-500/25 p-4 transition hover:border-gold-400 hover:bg-gold-400/8"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 transition group-hover:bg-gold-400 group-hover:text-forest-950">
                      <Phone className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[0.62rem] uppercase tracking-[0.2em] text-gold-400/80">
                        Telephone
                      </span>
                      <span className="mt-0.5 block font-display text-xl text-cream-100">
                        {settings.phone}
                      </span>
                    </span>
                  </a>

                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-3 flex items-center gap-4 rounded-xl border border-gold-500/25 p-4 transition hover:border-gold-400 hover:bg-gold-400/8"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1FA855]/20 text-[#4BD583] transition group-hover:bg-[#1FA855] group-hover:text-white">
                      <MessageCircle className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[0.62rem] uppercase tracking-[0.2em] text-gold-400/80">
                        WhatsApp
                      </span>
                      <span className="mt-0.5 block font-display text-lg text-cream-100">
                        Send a message
                      </span>
                    </span>
                  </a>

                  {settings.email ? (
                    <a
                      href={`mailto:${settings.email}`}
                      className="group mt-3 flex items-center gap-4 rounded-xl border border-gold-500/25 p-4 transition hover:border-gold-400 hover:bg-gold-400/8"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 transition group-hover:bg-gold-400 group-hover:text-forest-950">
                        <Mail className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.62rem] uppercase tracking-[0.2em] text-gold-400/80">
                          Email
                        </span>
                        <span className="mt-0.5 block truncate text-[0.95rem] text-cream-100">
                          {settings.email}
                        </span>
                      </span>
                    </a>
                  ) : null}

                  {settings.location ? (
                    <div className="mt-3 flex items-center gap-4 rounded-xl border border-gold-500/25 p-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-300">
                        <MapPin className="h-5 w-5" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-[0.62rem] uppercase tracking-[0.2em] text-gold-400/80">
                          Service area
                        </span>
                        <span className="mt-0.5 block text-[0.95rem] text-cream-100">
                          {settings.location}
                        </span>
                      </span>
                    </div>
                  ) : null}
                </Reveal>

                {settings.business_hours.length ? (
                  <Reveal
                    delay={0.08}
                    className="rounded-2xl border border-earth-200 bg-cream-100 p-7"
                  >
                    <h2 className="flex items-center gap-2 font-display text-lg text-forest-900">
                      <Clock className="h-4 w-4 text-gold-600" aria-hidden />
                      Consultation Hours
                    </h2>
                    <ul className="mt-4 divide-y divide-earth-200/80 text-[0.88rem]">
                      {settings.business_hours.map((hour) => (
                        <li key={hour.day} className="flex justify-between gap-6 py-2.5">
                          <span className="text-forest-900">{hour.day}</span>
                          <span className="text-forest-800/65">{hour.hours}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ) : null}

                <Reveal
                  delay={0.12}
                  className="rounded-2xl border border-gold-300/60 bg-gold-50/60 p-7"
                >
                  <p className="flex items-center gap-2 font-display text-base text-forest-900">
                    <ShieldCheck className="h-4 w-4 text-gold-700" aria-hidden />
                    Your privacy
                  </p>
                  <p className="mt-3 text-[0.88rem] leading-[1.85] text-forest-800/80">
                    What you write is used only to respond to your enquiry. Nothing is published,
                    sold or shared, and no name or story appears anywhere on this website without
                    permission given first.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>

          {settings.map_embed_url ? (
            <Reveal delay={0.1} className="mt-16">
              <div className="overflow-hidden rounded-2xl border border-earth-200 shadow-card">
                <iframe
                  src={settings.map_embed_url}
                  title={`Location of ${settings.site_name}`}
                  className="h-[380px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      <DisclaimerSection settings={settings} />
    </>
  );
}
