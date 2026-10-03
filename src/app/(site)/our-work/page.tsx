import type { Metadata } from 'next';
import Link from 'next/link';
import { Images, MessageCircle, Phone } from 'lucide-react';

import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/ui/JsonLd';
import { EmptyState } from '@/components/ui/EmptyState';
import { WorkCard } from '@/components/cards/WorkCard';
import { ConsultationCTA } from '@/components/home/ConsultationCTA';

import { getSettings, getWorkPosts } from '@/lib/queries';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { contactPhones, telHref, whatsappHref } from '@/lib/utils';

export const revalidate = 300;

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Our Work', path: '/our-work' },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: 'Our Work — Traditional Practice & Activities in Uganda',
    description:
      'Photographs, videos and records of the traditional practice, consultations, gatherings and community activities of Dr Salongo Hamuza in Uganda.',
    path: '/our-work',
  });
}

export default async function OurWorkPage() {
  const [settings, posts] = await Promise.all([getSettings(), getWorkPosts()]);
  const wa = whatsappHref(settings.whatsapp || settings.phone, settings.whatsapp_message);

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <PageHero
        eyebrow="Our work"
        title="Traditional Practice, Consultations & Community Activities"
        intro="A visual record of the work of Dr Salongo Hamuza — traditional practice, gatherings, community activities and the daily life of the homestead. Everything published here appears with the permission of the people involved."
        crumbs={CRUMBS}
        image={posts[0]?.cover_image}
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
            WhatsApp Now
          </a>
        </div>
      </PageHero>

      <section className="bg-cream-50 py-20 lg:py-24">
        <div className="container">
          {posts.length ? (
            <>
              {categories.length > 1 ? (
                <Reveal className="mb-12 flex flex-wrap items-center gap-2.5">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-forest-800/50">
                    Categories
                  </span>
                  {categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full border border-earth-200 bg-cream-100 px-3.5 py-1.5 text-[0.76rem] text-forest-800/80"
                    >
                      {category}
                    </span>
                  ))}
                </Reveal>
              ) : null}

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <Reveal key={post.id} delay={(i % 3) * 0.07}>
                    <WorkCard post={post} priority={i < 3} />
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={<Images className="h-6 w-6" />}
              title="Work posts are being prepared"
              description="Photographs and records of recent traditional practice, consultations and community activities will appear here shortly. In the meantime you can reach Dr Salongo Hamuza directly."
              action={
                <Link href="/contact" className="btn-gold">
                  {settings.consultation_cta}
                </Link>
              }
            />
          )}
        </div>
      </section>

      <ConsultationCTA settings={settings} />
    </>
  );
}
