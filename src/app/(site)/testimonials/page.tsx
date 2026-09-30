import type { Metadata } from 'next';
import Link from 'next/link';
import { Info, MessageSquareQuote } from 'lucide-react';

import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/ui/JsonLd';
import { EmptyState } from '@/components/ui/EmptyState';
import { TestimonialCard } from '@/components/cards/TestimonialCard';
import { ConsultationCTA } from '@/components/home/ConsultationCTA';

import { getSettings, getTestimonials } from '@/lib/queries';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

export const revalidate = 300;

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Testimonials', path: '/testimonials' },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: 'Testimonials & Experiences — Dr Salongo Hamuza',
    description:
      'Experiences shared by people who consulted Dr Salongo Hamuza, traditional healer in Uganda. Published only with permission. Individual experiences differ.',
    path: '/testimonials',
  });
}

export default async function TestimonialsPage() {
  const [settings, testimonials] = await Promise.all([getSettings(), getTestimonials()]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <PageHero
        eyebrow="Experiences"
        title="What People Have Shared"
        intro="Some of the people who have consulted Dr Salongo Hamuza chose to describe their experience afterwards. Their words appear here only because they gave permission for them to be published."
        crumbs={CRUMBS}
      />

      <section className="bg-cream-50 py-20 lg:py-24">
        <div className="container">
          <Reveal className="mx-auto mb-14 max-w-3xl rounded-2xl border border-gold-300/60 bg-gold-50/60 p-6 sm:p-7">
            <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-700">
              <Info className="h-4 w-4" aria-hidden />
              Please read first
            </p>
            <p className="mt-3 text-[0.92rem] leading-[1.9] text-forest-800/85">
              Individual experiences differ from one person to another. What appears below
              describes how those particular people felt about their own consultation. It is not a
              promise, a prediction or a guarantee of any outcome for anybody else, and it is not
              a claim that any condition was treated or cured.
            </p>
          </Reveal>

          {testimonials.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, i) => (
                <Reveal key={testimonial.id} delay={(i % 3) * 0.07}>
                  <TestimonialCard testimonial={testimonial} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<MessageSquareQuote className="h-6 w-6" />}
              title="No experiences published yet"
              description="Testimonials appear here only once the person who gave them has approved their publication. None have been published so far."
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
