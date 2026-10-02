import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { VideoItem } from '@/lib/types';
import { InlineVideo } from '@/components/video/InlineVideo';
import { PortraitStage } from '@/components/video/VideoFrame';
import { Reveal } from '@/components/ui/Reveal';
import { cn, videoThumbnail } from '@/lib/utils';

/**
 * Video married to the text it belongs with, so footage sits inside the story
 * the page is telling instead of being quarantined in a gallery. Sections
 * alternate sides down the page to keep the rhythm from flattening out.
 */
export function VideoStory({
  video,
  eyebrow,
  title,
  body,
  points,
  href,
  linkLabel = 'Read more',
  side = 'left',
  tone = 'dark',
}: {
  video: VideoItem;
  eyebrow: string;
  title: string;
  body: string[];
  points?: string[];
  href?: string;
  linkLabel?: string;
  /** Which side the video sits on at desktop width. */
  side?: 'left' | 'right';
  tone?: 'dark' | 'light';
}) {
  const dark = tone === 'dark';
  const poster = videoThumbnail(video);
  const portrait = video.orientation === 'portrait';

  return (
    <section
      className={cn(
        'relative overflow-hidden py-20 lg:py-28',
        dark ? 'bg-forest-950' : 'bg-cream-100'
      )}
    >
      <div
        aria-hidden
        className={cn('absolute inset-0', dark ? 'pattern-diamond opacity-35' : 'pattern-weave opacity-60')}
      />

      <div className="container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal
            className={cn('lg:col-span-6', side === 'right' ? 'lg:order-2' : 'lg:order-1')}
          >
            {portrait ? (
              <PortraitStage poster={poster} height="h-[30rem] sm:h-[34rem]">
                <div className="relative h-full aspect-[9/16] overflow-hidden rounded-[1.25rem] border border-gold-500/35 shadow-deep">
                  <InlineVideo
                    video={video}
                    objectFit="contain"
                    playButtonSize="md"
                    sizes="(max-width: 640px) 70vw, 20rem"
                  />
                </div>
              </PortraitStage>
            ) : (
              <div className="relative aspect-video overflow-hidden rounded-[1.75rem] border border-gold-500/30 bg-forest-950 shadow-deep">
                <InlineVideo
                  video={video}
                  playButtonSize="md"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}
          </Reveal>

          <Reveal
            delay={0.1}
            className={cn('lg:col-span-6', side === 'right' ? 'lg:order-1' : 'lg:order-2')}
          >
            <p className={dark ? 'eyebrow-light' : 'eyebrow'}>
              <span
                aria-hidden
                className={cn('h-px w-8', dark ? 'bg-gold-400/70' : 'bg-gold-600/60')}
              />
              {eyebrow}
            </p>

            <h2 className={cn('heading-lg mt-4', dark ? 'text-cream-100' : 'text-forest-900')}>
              {title}
            </h2>
            <span aria-hidden className="mt-6 block h-[3px] w-20 rounded-full bg-gold-sheen" />

            <div
              className={cn(
                'mt-7 space-y-5 text-[1.0rem] leading-[1.9]',
                dark ? 'text-cream-200/80' : 'text-forest-800/85'
              )}
            >
              {body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {points?.length ? (
              <ul className="mt-8 space-y-3.5">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-3.5">
                    <span
                      aria-hidden
                      className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-500"
                    />
                    <span
                      className={cn(
                        'text-[0.95rem] leading-relaxed',
                        dark ? 'text-cream-200/75' : 'text-forest-800/80'
                      )}
                    >
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            {href ? (
              <Link href={href} className={cn('mt-9', dark ? 'btn-outline-gold' : 'btn-forest')}>
                {linkLabel}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
