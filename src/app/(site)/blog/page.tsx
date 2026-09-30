import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';

import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/ui/JsonLd';
import { EmptyState } from '@/components/ui/EmptyState';
import { BlogCard } from '@/components/cards/BlogCard';
import { ConsultationCTA } from '@/components/home/ConsultationCTA';

import { getBlogCategories, getBlogPosts, getSettings } from '@/lib/queries';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

export const revalidate = 300;

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Insights', path: '/blog' },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: 'Insights & Articles — Traditional Practice in Uganda',
    description:
      'Articles from Dr Salongo Hamuza on traditional practice, Ugandan cultural traditions, family and relationship guidance, traditional herbs and community activities.',
    path: '/blog',
  });
}

export default async function BlogPage() {
  const [settings, posts, categories] = await Promise.all([
    getSettings(),
    getBlogPosts(),
    getBlogCategories(),
  ]);

  const [lead, ...rest] = posts;
  const usedCategories = categories.filter((c) => posts.some((p) => p.category_id === c.id));

  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <PageHero
        eyebrow="Insights"
        title="Writing on Traditional Practice & Ugandan Culture"
        intro="Articles on traditional practice, cultural traditions, family and relationship guidance, traditional herbs and the work of the homestead."
        crumbs={CRUMBS}
        image={lead?.cover_image}
      />

      <section className="bg-cream-50 py-20 lg:py-24">
        <div className="container">
          {posts.length ? (
            <>
              {usedCategories.length ? (
                <Reveal className="mb-12 flex flex-wrap items-center gap-2.5">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-forest-800/50">
                    Topics
                  </span>
                  {usedCategories.map((category) => (
                    <span
                      key={category.id}
                      className="rounded-full border border-earth-200 bg-cream-100 px-3.5 py-1.5 text-[0.76rem] text-forest-800/80"
                    >
                      {category.name}
                    </span>
                  ))}
                </Reveal>
              ) : null}

              {/* Lead article */}
              {lead ? (
                <Reveal className="mb-14">
                  <article className="card-premium group grid overflow-hidden lg:grid-cols-2">
                    <Link
                      href={`/blog/${lead.slug}`}
                      className="relative block aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[22rem]"
                    >
                      {lead.cover_image ? (
                        <Image
                          src={lead.cover_image}
                          alt={lead.title}
                          fill
                          sizes="(max-width:1024px) 100vw, 50vw"
                          className="lift-img object-cover"
                          priority
                        />
                      ) : (
                        <span className="pattern-weave absolute inset-0 flex items-center justify-center bg-cream-200">
                          <BookOpen className="h-10 w-10 text-earth-400" aria-hidden />
                        </span>
                      )}
                    </Link>

                    <div className="flex flex-col justify-center p-8 lg:p-12">
                      <span className="eyebrow">
                        <span aria-hidden className="h-px w-8 bg-gold-500/70" />
                        Latest article
                      </span>
                      <h2 className="mt-4 font-display text-2xl leading-snug text-forest-900 transition group-hover:text-gold-700 sm:text-3xl">
                        <Link href={`/blog/${lead.slug}`}>{lead.title}</Link>
                      </h2>
                      <p className="mt-4 text-[0.98rem] leading-[1.9] text-forest-800/80">
                        {lead.excerpt}
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.76rem] text-forest-800/55">
                        {lead.published_at ? (
                          <time dateTime={lead.published_at}>{formatDate(lead.published_at)}</time>
                        ) : null}
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-gold-600" aria-hidden />
                          {lead.reading_minutes} min read
                        </span>
                      </div>
                      <Link href={`/blog/${lead.slug}`} className="btn-forest mt-8 self-start">
                        Read article
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ) : null}

              {rest.length ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <Reveal key={post.id} delay={(i % 3) * 0.07}>
                      <BlogCard post={post} />
                    </Reveal>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              icon={<BookOpen className="h-6 w-6" />}
              title="Articles are being prepared"
              description="Writing on traditional practice, Ugandan cultural traditions and the matters people bring to consultation will appear here shortly."
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
