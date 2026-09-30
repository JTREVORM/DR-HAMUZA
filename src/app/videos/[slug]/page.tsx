import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, Tag } from 'lucide-react';

import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/ui/JsonLd';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { VideoCard } from '@/components/cards/VideoCard';
import { ConsultationCTA } from '@/components/home/ConsultationCTA';

import { getSettings, getVideoBySlug, getVideos } from '@/lib/queries';
import { breadcrumbSchema, buildMetadata, videoSchema } from '@/lib/seo';
import { SITE_URL } from '@/lib/env';
import { absoluteUrl, formatDate, videoEmbedUrl, videoThumbnail } from '@/lib/utils';

export const revalidate = 300;

export async function generateStaticParams() {
  const videos = await getVideos(50);
  return videos.map((video) => ({ slug: video.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [settings, video] = await Promise.all([getSettings(), getVideoBySlug(slug)]);
  if (!video) return { title: 'Video not found' };

  return buildMetadata({
    settings,
    title: video.seo_title || video.title,
    description:
      video.seo_description ||
      video.description ||
      `Watch ${video.title} — ${settings.site_name}, ${settings.tagline} in Uganda.`,
    path: `/videos/${video.slug}`,
    image: videoThumbnail(video),
    type: 'article',
    publishedTime: video.published_at,
    tags: video.tags,
  });
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [settings, video, videos] = await Promise.all([
    getSettings(),
    getVideoBySlug(slug),
    getVideos(12),
  ]);

  if (!video) notFound();

  const related = videos.filter((v) => v.id !== video.id).slice(0, 3);
  const thumb = videoThumbnail(video);

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Videos', path: '/videos' },
    { name: video.title, path: `/videos/${video.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          videoSchema({
            name: video.title,
            description:
              video.description || `${video.title} — ${settings.site_name}, ${settings.tagline}.`,
            thumbnailUrl: thumb ? absoluteUrl(SITE_URL, thumb) : undefined,
            uploadDate: video.published_at || video.created_at,
            embedUrl: videoEmbedUrl(video),
          }),
        ]}
      />

      <PageHero
        eyebrow={video.category || 'Video'}
        title={video.title}
        crumbs={crumbs}
      >
        {video.published_at ? (
          <p className="mt-6 inline-flex items-center gap-2 text-[0.82rem] text-cream-200/70">
            <CalendarDays className="h-4 w-4 text-gold-400" aria-hidden />
            {formatDate(video.published_at)}
          </p>
        ) : null}
      </PageHero>

      <section className="relative overflow-hidden bg-forest-950 py-16 lg:py-20">
        <div aria-hidden className="pattern-diamond absolute inset-0 opacity-50" />
        <div className="container relative z-10">
          <Reveal className="mx-auto max-w-5xl">
            <VideoPlayer video={video} priority />
          </Reveal>

          {video.description ? (
            <Reveal delay={0.08} className="mx-auto mt-10 max-w-3xl">
              <p className="whitespace-pre-line text-[1.0rem] leading-[1.9] text-cream-200/80">
                {video.description}
              </p>
            </Reveal>
          ) : null}

          {video.tags?.length ? (
            <Reveal className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center gap-2.5">
              <Tag className="h-4 w-4 text-gold-400" aria-hidden />
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gold-500/25 px-3 py-1 text-[0.74rem] text-cream-200/70"
                >
                  {tag}
                </span>
              ))}
            </Reveal>
          ) : null}

          <Reveal delay={0.12} className="mt-12 text-center">
            <Link href="/videos" className="btn-outline-gold">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              All videos
            </Link>
          </Reveal>

          {related.length ? (
            <div className="mt-20 border-t border-gold-500/15 pt-14">
              <h2 className="mb-10 text-center font-display text-2xl text-cream-100">
                More Videos
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item, i) => (
                  <Reveal key={item.id} delay={(i % 3) * 0.08}>
                    <VideoCard video={item} />
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <ConsultationCTA settings={settings} />
    </>
  );
}
