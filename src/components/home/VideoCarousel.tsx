'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { VideoItem } from '@/lib/types';
import { VideoTile } from '@/components/video/VideoTile';
import { VideoLightbox } from '@/components/video/VideoLightbox';
import { Reveal } from '@/components/ui/Reveal';

/**
 * A horizontal strip of footage, swipeable on a phone and stepped with arrows
 * on a desktop. It borrows the pacing of a streaming rail without borrowing the
 * look of one — the tiles keep the site's gold edge and forest ground.
 */
export function VideoCarousel({ videos }: { videos: VideoItem[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<VideoItem | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 8,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const step = (direction: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.round(el.clientWidth * 0.8), behavior: 'smooth' });
  };

  if (!videos.length) return null;

  return (
    <section className="relative overflow-hidden bg-forest-900 py-20 lg:py-24">
      <div aria-hidden className="pattern-weave absolute inset-0 opacity-30" />

      <div className="container relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow-light">
              <span aria-hidden className="h-px w-8 bg-gold-400/70" />
              The archive
            </p>
            <h2 className="heading-lg mt-4 text-cream-100">Explore More Videos</h2>
            <span aria-hidden className="mt-5 block h-[3px] w-20 rounded-full bg-gold-sheen" />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={edges.start}
              aria-label="Previous videos"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 text-gold-200 transition hover:bg-gold-400 hover:text-forest-950 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold-200"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={edges.end}
              aria-label="More videos"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 text-gold-200 transition hover:bg-gold-400 hover:text-forest-950 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold-200"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <Reveal className="relative z-10 mt-12">
        <div
          ref={rail}
          onScroll={measure}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 sm:px-6 lg:px-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]"
        >
          {videos.map((video) => (
            <div
              key={video.id}
              className="aspect-[9/14] w-[15rem] shrink-0 snap-start sm:w-[16.5rem]"
            >
              <VideoTile
                video={video}
                onOpen={setActive}
                size="md"
                showDescription={false}
                sizes="17rem"
              />
            </div>
          ))}
        </div>
      </Reveal>

      <div className="container relative z-10 mt-10 text-center">
        <Link href="/videos" className="btn-outline-gold">
          Open the full video library
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <VideoLightbox video={active} onClose={() => setActive(null)} />
    </section>
  );
}
