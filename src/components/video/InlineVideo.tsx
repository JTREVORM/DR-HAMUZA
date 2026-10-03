'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import type { VideoItem } from '@/lib/types';
import { claimPlayback, registerPlayer } from '@/lib/video-playback';
import { cn, isSelfHostedVideo, videoEmbedUrl, videoThumbnail } from '@/lib/utils';

/**
 * The player used everywhere on the site.
 *
 * Nothing is fetched until the visitor presses play: before that there is only
 * the poster image, so a page with six videos on it costs six pictures rather
 * than six video streams. Once playing, the clip pauses itself when it is
 * scrolled out of view and steps aside if another video starts.
 */
export function InlineVideo({
  video,
  priority,
  sizes = '(max-width: 768px) 100vw, 50vw',
  className,
  playButtonSize = 'lg',
  showTitle = false,
  objectFit = 'cover',
  autoStart = false,
}: {
  video: VideoItem;
  priority?: boolean;
  sizes?: string;
  className?: string;
  playButtonSize?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  objectFit?: 'cover' | 'contain';
  /** Begins playback as soon as the player mounts — used by the lightbox. */
  autoStart?: boolean;
}) {
  const [started, setStarted] = useState(autoStart);
  const ref = useRef<HTMLVideoElement>(null);

  const poster = videoThumbnail(video);
  const selfHosted = isSelfHostedVideo(video);
  const embed = videoEmbedUrl(video);

  // Pause when the player leaves the screen, and hand playback over cleanly
  // when another video on the page starts.
  useEffect(() => {
    const el = ref.current;
    if (!el || !started) return;

    const unregister = registerPlayer(el);
    const onPlay = () => claimPlayback(el);
    el.addEventListener('play', onPlay);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !el.paused) el.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(el);

    return () => {
      el.removeEventListener('play', onPlay);
      observer.disconnect();
      unregister();
    };
  }, [started]);

  const start = useCallback(() => setStarted(true), []);

  const buttonSize = {
    sm: 'h-14 w-14',
    md: 'h-16 w-16 sm:h-20 sm:w-20',
    lg: 'h-20 w-20 sm:h-24 sm:w-24',
  }[playButtonSize];

  const iconSize = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6 sm:h-8 sm:w-8',
    lg: 'h-8 w-8 sm:h-9 sm:w-9',
  }[playButtonSize];

  if (!started) {
    return (
      <button
        type="button"
        onClick={start}
        aria-label={`Play video: ${video.title}`}
        className={cn('group absolute inset-0 h-full w-full text-left', className)}
      >
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes={sizes}
            priority={priority}
            className={cn(
              'transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]',
              objectFit === 'contain' ? 'object-contain' : 'object-cover'
            )}
          />
        ) : (
          <span aria-hidden className="pattern-diamond absolute inset-0 bg-forest-800" />
        )}

        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/10 to-forest-950/30"
        />

        <span className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              'flex items-center justify-center rounded-full border border-gold-300/70',
              'bg-forest-950/50 text-gold-200 backdrop-blur-sm',
              'transition duration-500 group-hover:scale-110 group-hover:border-gold-300',
              'group-hover:bg-gold-400 group-hover:text-forest-950',
              buttonSize
            )}
          >
            <Play className={cn('ml-1 fill-current', iconSize)} aria-hidden />
          </span>
        </span>

        {showTitle ? (
          <span className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            {video.category ? (
              <span className="eyebrow-light text-[0.66rem]">{video.category}</span>
            ) : null}
            <span className="mt-1.5 block font-display text-lg leading-snug text-cream-100 sm:text-2xl">
              {video.title}
            </span>
          </span>
        ) : null}
      </button>
    );
  }

  if (!selfHosted) {
    return (
      <iframe
        src={`${embed}${embed.includes('?') ? '&' : '?'}autoplay=1`}
        title={video.title}
        className={cn('absolute inset-0 h-full w-full', className)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    );
  }

  return (
    <video
      ref={ref}
      className={cn(
        'absolute inset-0 h-full w-full bg-black',
        objectFit === 'contain' ? 'object-contain' : 'object-cover',
        className
      )}
      controls
      autoPlay
      playsInline
      preload="auto"
      poster={poster || undefined}
    >
      <source src={video.video_url} type="video/mp4" />
      Your browser cannot play this video.{' '}
      <a href={video.video_url}>Download it instead.</a>
    </video>
  );
}
