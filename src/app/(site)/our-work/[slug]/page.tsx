import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarDays, MapPin, Tag } from 'lucide-react';

import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/ui/JsonLd';
import { MasonryGallery } from '@/components/ui/MasonryGallery';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { WorkCard } from '@/components/cards/WorkCard';
import { ConsultationCTA } from '@/components/home/ConsultationCTA';

import { getSettings, getWorkPostBySlug, getWorkPosts } from '@/lib/queries';
import { articleSchema, breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { detectVideoSource, formatDate, renderRichText } from '@/lib/utils';

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getWorkPosts(50);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [settings, post] = await Promise.all([getSettings(), getWorkPostBySlug(slug)]);
  if (!post) return { title: 'Work post not found' };

  return buildMetadata({
    settings,
    title: post.seo_title || post.title,
    description: post.seo_description || post.short_description,
    path: `/our-work/${post.slug}`,
    image: post.cover_image,
    type: 'article',
    publishedTime: post.published_at,
    tags: post.tags,
  });
}

export default async function WorkPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [settings, post, all] = await Promise.all([
    getSettings(),
    getWorkPostBySlug(slug),
    getWorkPosts(12),
  ]);

  if (!post) notFound();

  const related = all.filter((p) => p.id !== post.id).slice(0, 3);
  const date = formatDate(post.event_date || post.published_at || post.created_at);

  const images = (post.work_media ?? [])
    .filter((m) => m.media_type === 'image')
    .map((m) => ({
      url: m.url,
      caption: m.caption,
      alt: m.alt_text || `${post.title} — ${settings.site_name}`,
    }));

  const videos = (post.work_media ?? []).filter((m) => m.media_type === 'video');

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Our Work', path: '/our-work' },
    { name: post.title, path: `/our-work/${post.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          articleSchema({
            settings,
            title: post.title,
            description: post.short_description,
            path: `/our-work/${post.slug}`,
            image: post.cover_image,
            publishedTime: post.published_at,
          }),
        ]}
      />

      <PageHero
        eyebrow={post.category || 'Our work'}
        title={post.title}
        intro={post.short_description}
        crumbs={crumbs}
        image={post.cover_image}
      >
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.82rem] text-cream-200/70">
          {date ? (
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gold-400" aria-hidden />
              {date}
            </span>
          ) : null}
          {post.location ? (
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-400" aria-hidden />
              {post.location}
            </span>
          ) : null}
        </div>
      </PageHero>

      <article className="bg-cream-50 py-20 lg:py-24">
        <div className="container">
          {post.cover_image ? (
            <Reveal className="relative mx-auto mb-12 aspect-[16/9] max-w-5xl overflow-hidden rounded-2xl shadow-deep">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                sizes="(max-width:1024px) 100vw, 1100px"
                className="object-cover"
                priority
              />
            </Reveal>
          ) : null}

          {post.description ? (
            <Reveal delay={0.05} className="mx-auto max-w-3xl">
              <div
                className="prose-brand"
                dangerouslySetInnerHTML={{ __html: renderRichText(post.description) }}
              />
            </Reveal>
          ) : null}

          {post.video_url ? (
            <Reveal delay={0.08} className="mx-auto mt-14 max-w-4xl">
              <VideoPlayer
                video={{
                  id: post.id,
                  slug: post.slug,
                  title: post.title,
                  description: post.short_description,
                  source: detectVideoSource(post.video_url),
                  video_url: post.video_url,
                  thumbnail_url: post.cover_image,
                  duration: '',
                  category: post.category,
                  tags: post.tags,
                  is_published: true,
                  is_featured: false,
                  seo_title: '',
                  seo_description: '',
                  published_at: post.published_at,
                  created_at: post.created_at,
                }}
              />
            </Reveal>
          ) : null}

          {videos.length ? (
            <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
              {videos.map((media) => (
                <Reveal key={media.id}>
                  <video
                    className="w-full rounded-2xl border border-earth-200 bg-black"
                    controls
                    playsInline
                    preload="none"
                    poster={post.cover_image || undefined}
                  >
                    <source src={media.url} />
                    Your browser does not support embedded video.
                  </video>
                  {media.caption ? (
                    <p className="mt-2.5 text-[0.82rem] text-forest-800/65">{media.caption}</p>
                  ) : null}
                </Reveal>
              ))}
            </div>
          ) : null}

          {images.length ? (
            <div className="mt-16">
              <Reveal className="mb-8 text-center">
                <p className="eyebrow justify-center">Photographs</p>
                <h2 className="heading-md mt-3 text-forest-900">From this occasion</h2>
              </Reveal>
              <MasonryGallery items={images} columnsClassName="columns-2 sm:columns-3 lg:columns-4" />
            </div>
          ) : null}

          {post.tags?.length ? (
            <Reveal className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center gap-2.5">
              <Tag className="h-4 w-4 text-gold-600" aria-hidden />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-earth-200 bg-cream-100 px-3 py-1 text-[0.74rem] text-forest-800/75"
                >
                  {tag}
                </span>
              ))}
            </Reveal>
          ) : null}
        </div>
      </article>

      {related.length ? (
        <section className="bg-cream-100 py-20 lg:py-24">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">
                  <span aria-hidden className="h-px w-8 bg-gold-500/70" />
                  More
                </p>
                <h2 className="heading-md mt-4 text-forest-900">Other Recent Work</h2>
              </div>
              <Link href="/our-work" className="btn-outline-forest">
                All work
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => (
                <Reveal key={item.id} delay={(i % 3) * 0.08}>
                  <WorkCard post={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ConsultationCTA settings={settings} />
    </>
  );
}
