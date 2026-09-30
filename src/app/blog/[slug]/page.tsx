import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, Clock, Tag, User } from 'lucide-react';

import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/ui/JsonLd';
import { BlogCard } from '@/components/cards/BlogCard';
import { ConsultationCTA } from '@/components/home/ConsultationCTA';
import { DisclaimerSection } from '@/components/home/DisclaimerSection';

import {
  getBlogPostBySlug,
  getBlogPosts,
  getRelatedBlogPosts,
  getSettings,
} from '@/lib/queries';
import { articleSchema, breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { formatDate, renderRichText } from '@/lib/utils';

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getBlogPosts(50);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [settings, post] = await Promise.all([getSettings(), getBlogPostBySlug(slug)]);
  if (!post) return { title: 'Article not found' };

  return buildMetadata({
    settings,
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.cover_image,
    type: 'article',
    publishedTime: post.published_at,
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [settings, post] = await Promise.all([getSettings(), getBlogPostBySlug(slug)]);

  if (!post) notFound();

  const related = await getRelatedBlogPosts(post, 3);

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Insights', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          articleSchema({
            settings,
            title: post.title,
            description: post.excerpt,
            path: `/blog/${post.slug}`,
            image: post.cover_image,
            publishedTime: post.published_at,
            author: post.author_name,
          }),
        ]}
      />

      <PageHero
        eyebrow={post.blog_categories?.name || 'Insights'}
        title={post.title}
        intro={post.excerpt}
        crumbs={crumbs}
        image={post.cover_image}
      >
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.82rem] text-cream-200/70">
          <span className="inline-flex items-center gap-2">
            <User className="h-4 w-4 text-gold-400" aria-hidden />
            {post.author_name}
          </span>
          {post.published_at ? (
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gold-400" aria-hidden />
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            </span>
          ) : null}
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-gold-400" aria-hidden />
            {post.reading_minutes} min read
          </span>
        </div>
      </PageHero>

      <article className="bg-cream-50 py-20 lg:py-24">
        <div className="container">
          {post.cover_image ? (
            <Reveal className="relative mx-auto mb-12 aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl shadow-deep">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                sizes="(max-width:1024px) 100vw, 900px"
                className="object-cover"
                priority
              />
            </Reveal>
          ) : null}

          <Reveal delay={0.05} className="mx-auto max-w-3xl">
            <div
              className="prose-brand"
              dangerouslySetInnerHTML={{ __html: renderRichText(post.content) }}
            />

            {post.tags?.length ? (
              <div className="mt-12 flex flex-wrap items-center gap-2.5 border-t border-earth-200 pt-8">
                <Tag className="h-4 w-4 text-gold-600" aria-hidden />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-earth-200 bg-cream-100 px-3 py-1 text-[0.74rem] text-forest-800/75"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-10">
              <Link href="/blog" className="btn-outline-forest">
                <ArrowLeft className="h-4 w-4" aria-hidden />
                All articles
              </Link>
            </div>
          </Reveal>
        </div>
      </article>

      {related.length ? (
        <section className="bg-cream-100 py-20 lg:py-24">
          <div className="container">
            <h2 className="mb-12 text-center font-display text-2xl text-forest-900 sm:text-3xl">
              Related Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => (
                <Reveal key={item.id} delay={(i % 3) * 0.08}>
                  <BlogCard post={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ConsultationCTA settings={settings} />
      <DisclaimerSection settings={settings} />
    </>
  );
}
