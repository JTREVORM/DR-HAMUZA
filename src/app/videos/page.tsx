import type { Metadata } from 'next';
import Link from 'next/link';
import { Film } from 'lucide-react';

import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/ui/JsonLd';
import { EmptyState } from '@/components/ui/EmptyState';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { VideoCard } from '@/components/cards/VideoCard';
import { ConsultationCTA } from '@/components/home/ConsultationCTA';

import { getSettings, getVideos } from '@/lib/queries';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

export const revalidate = 300;

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Videos', path: '/videos' },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: 'Videos — Dr Salongo Hamuza, Traditional Healer in Uganda',
    description:
      'Watch videos from the traditional practice of Dr Salongo Hamuza in Uganda: traditional activities, community gatherings and messages recorded for visitors.',
    path: '/videos',
  });
}

export default async function VideosPage() {
  const [settings, videos] = await Promise.all([getSettings(), getVideos()]);

  const featured = videos.find((v) => v.is_featured) ?? videos[0] ?? null;
  const rest = videos.filter((v) => v.id !== featured?.id);

  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <PageHero
        eyebrow="Videos"
        title="Watch Dr Salongo Hamuza"
        intro="Recordings from the traditional practice — activities, gatherings and messages shared for those who would like to see the work before making contact."
        crumbs={CRUMBS}
      />

      <section className="relative overflow-hidden bg-forest-950 py-20 lg:py-24">
        <div aria-hidden className="pattern-diamond absolute inset-0 opacity-55" />
        <div className="container relative z-10">
          {videos.length ? (
            <>
              {featured ? (
                <Reveal className="mx-auto mb-16 max-w-5xl">
                  <VideoPlayer video={featured} priority />
                  <div className="mt-7 text-center">
                    <h2 className="font-display text-2xl text-cream-100">{featured.title}</h2>
                    {featured.description ? (
                      <p className="mx-auto mt-3.5 max-w-2xl text-[0.95rem] leading-[1.85] text-cream-200/70">
                        {featured.description}
                      </p>
                    ) : null}
                    <Link href={`/videos/${featured.slug}`} className="btn-outline-gold mt-6">
                      Open video page
                    </Link>
                  </div>
                </Reveal>
              ) : null}

              {rest.length ? (
                <>
                  <Reveal className="mb-10 text-center">
                    <p className="eyebrow-light justify-center">More videos</p>
                    <h2 className="heading-md mt-3 text-cream-100">All Recordings</h2>
                  </Reveal>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((video, i) => (
                      <Reveal key={video.id} delay={(i % 3) * 0.07}>
                        <VideoCard video={video} />
                      </Reveal>
                    ))}
                  </div>
                </>
              ) : null}
            </>
          ) : (
            <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-gold-500/35 bg-forest-900/50 px-6 py-14 text-center">
              <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold-400/10 text-gold-300">
                <Film className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="font-display text-xl text-cream-100">Videos are being prepared</h2>
              <p className="mx-auto mt-3 max-w-md text-[0.92rem] leading-relaxed text-cream-200/65">
                Recordings from the traditional practice of Dr Salongo Hamuza will appear here
                shortly. In the meantime you can reach him directly.
              </p>
              <Link href="/contact" className="btn-gold mt-7">
                {settings.consultation_cta}
              </Link>
            </div>
          )}
        </div>
      </section>

      <ConsultationCTA settings={settings} />
    </>
  );
}
