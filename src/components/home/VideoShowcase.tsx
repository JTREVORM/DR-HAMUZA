'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { VideoItem } from '@/lib/types';
import { VideoTile } from '@/components/video/VideoTile';
import { VideoLightbox } from '@/components/video/VideoLightbox';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

/**
 * The main showcase: one tall lead video with a column of smaller ones beside
 * it on desktop, stacking into a single readable column on a phone. Nothing
 * plays until it is asked for, and then it plays in the lightbox.
 */
export function VideoShowcase({ videos }: { videos: VideoItem[] }) {
  const [active, setActive] = useState<VideoItem | null>(null);
  if (!videos.length) return null;

  const [lead, ...rest] = videos.slice(0, 5);
  const side = rest.slice(0, 4);

  return (
    <section id="our-work" className="relative overflow-hidden bg-forest-950 py-20 lg:py-28">
      <div aria-hidden className="pattern-diamond absolute inset-0 opacity-40" />

      <div className="container relative z-10">
        <SectionHeading
          eyebrow="Watch"
          title="Watch Our Latest Work"
          intro="Footage recorded during traditional practice, community gatherings and daily work. Choose any one to watch it in full."
          tone="dark"
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[34rem]">
              <VideoTile
                video={lead}
                onOpen={setActive}
                size="lg"
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
          </Reveal>

          {side.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              {side.map((video, i) => (
                <Reveal key={video.id} delay={0.08 * (i + 1)}>
                  <div className="aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/9]">
                    <VideoTile
                      video={video}
                      onOpen={setActive}
                      size={side.length > 2 ? 'sm' : 'md'}
                      showDescription={side.length <= 2}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 38vw"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>

        <Reveal delay={0.1} className="mt-12 text-center">
          <Link href="/videos" className="btn-outline-gold">
            Browse every video
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>

      <VideoLightbox video={active} onClose={() => setActive(null)} />
    </section>
  );
}
