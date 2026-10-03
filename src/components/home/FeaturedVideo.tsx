import Link from 'next/link';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import type { VideoItem } from '@/lib/types';
import { InlineVideo } from '@/components/video/InlineVideo';
import { PortraitStage, VideoFrame } from '@/components/video/VideoFrame';
import { Reveal } from '@/components/ui/Reveal';
import { formatDate, videoThumbnail } from '@/lib/utils';

/**
 * The large cinematic slot near the top of the homepage — one video, given the
 * room to be the point of the section rather than a card in a grid.
 */
export function FeaturedVideo({
  video,
  eyebrow = 'Featured',
  title = "See Dr Salongo Hamuza's Traditional Work",
  intro,
}: {
  video: VideoItem;
  eyebrow?: string;
  title?: string;
  intro?: string;
}) {
  const poster = videoThumbnail(video);
  const portrait = video.orientation === 'portrait';

  const stage = (
    <InlineVideo
      video={video}
      showTitle
      playButtonSize="lg"
      objectFit={portrait ? 'contain' : 'cover'}
      sizes={portrait ? '(max-width: 640px) 90vw, 24rem' : '(max-width: 1024px) 100vw, 60vw'}
    />
  );

  return (
    <section className="relative overflow-hidden bg-forest-900 py-20 lg:py-28">
      <div aria-hidden className="pattern-diamond absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent"
      />

      <div className="container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow-light">
              <span aria-hidden className="h-px w-8 bg-gold-400/70" />
              {eyebrow}
            </p>
            <h2 className="heading-lg mt-4 text-cream-100">{title}</h2>
            <span aria-hidden className="mt-6 block h-[3px] w-20 rounded-full bg-gold-sheen" />

            <p className="mt-7 text-[1.02rem] leading-[1.9] text-cream-200/80">
              {intro ??
                'This is original footage, filmed where the work actually takes place — not a studio reconstruction. Watch it in full, then decide for yourself.'}
            </p>

            <div className="mt-8 rounded-2xl border border-gold-500/20 bg-forest-950/50 p-6">
              <h3 className="font-display text-xl text-cream-100">{video.title}</h3>
              {video.description ? (
                <p className="mt-3 text-[0.92rem] leading-relaxed text-cream-200/70">
                  {video.description}
                </p>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.75rem] uppercase tracking-[0.16em] text-gold-400/80">
                {video.category ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {video.category}
                  </span>
                ) : null}
                {video.duration ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {video.duration}
                  </span>
                ) : null}
                {video.published_at ? <span>{formatDate(video.published_at)}</span> : null}
              </div>
            </div>

            <Link href={`/videos/${video.slug}`} className="btn-outline-gold mt-8">
              Watch on its own page
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-7">
            {portrait ? (
              <PortraitStage poster={poster}>
                <div className="relative h-full aspect-[9/16] overflow-hidden rounded-[1.25rem] border border-gold-500/35 shadow-deep">
                  {stage}
                </div>
              </PortraitStage>
            ) : (
              <VideoFrame orientation="landscape">{stage}</VideoFrame>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
