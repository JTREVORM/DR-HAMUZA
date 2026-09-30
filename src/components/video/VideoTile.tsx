'use client';

import Image from 'next/image';
import { Clock, Play } from 'lucide-react';
import type { VideoItem } from '@/lib/types';
import { cn, formatDate, videoThumbnail } from '@/lib/utils';

/**
 * A poster card. Pressing it opens the lightbox rather than navigating, so the
 * visitor keeps their place in the showcase. Nothing is loaded but the poster.
 */
export function VideoTile({
  video,
  onOpen,
  size = 'md',
  priority,
  sizes = '(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 30vw',
  className,
  showDescription = true,
}: {
  video: VideoItem;
  onOpen: (video: VideoItem) => void;
  size?: 'sm' | 'md' | 'lg';
  priority?: boolean;
  sizes?: string;
  className?: string;
  showDescription?: boolean;
}) {
  const poster = videoThumbnail(video);

  return (
    <button
      type="button"
      onClick={() => onOpen(video)}
      aria-label={`Play video: ${video.title}`}
      className={cn(
        'group relative block h-full w-full overflow-hidden rounded-2xl text-left',
        'border border-gold-500/25 bg-forest-900 shadow-deep',
        'transition duration-500 hover:-translate-y-1 hover:border-gold-400/60',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400',
        className
      )}
    >
      <div className="absolute inset-0">
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover object-center transition-transform duration-[1300ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <span aria-hidden className="pattern-diamond absolute inset-0 bg-forest-800" />
        )}
      </div>

      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/45 to-forest-950/10 transition-opacity duration-500 group-hover:from-forest-950/95"
      />

      <span
        className={cn(
          'absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center',
          'rounded-full border border-gold-300/70 bg-forest-950/45 text-gold-200 backdrop-blur-sm',
          'transition duration-500 group-hover:scale-110 group-hover:bg-gold-400 group-hover:text-forest-950',
          size === 'lg' ? 'h-20 w-20 sm:h-24 sm:w-24' : size === 'sm' ? 'h-12 w-12' : 'h-16 w-16'
        )}
      >
        <Play
          className={cn('ml-0.5 fill-current', size === 'lg' ? 'h-8 w-8' : size === 'sm' ? 'h-4 w-4' : 'h-6 w-6')}
          aria-hidden
        />
      </span>

      {video.duration ? (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-forest-950/80 px-2 py-1 text-[0.68rem] font-medium text-cream-200 backdrop-blur-sm">
          <Clock className="h-3 w-3" aria-hidden />
          {video.duration}
        </span>
      ) : null}

      <span
        className={cn(
          'absolute inset-x-0 bottom-0 block',
          size === 'lg' ? 'p-6 sm:p-8' : size === 'sm' ? 'p-4' : 'p-5'
        )}
      >
        {video.category ? (
          <span className="eyebrow-light text-[0.64rem]">{video.category}</span>
        ) : null}
        <span
          className={cn(
            'mt-1.5 block font-display leading-snug text-cream-100 transition group-hover:text-gold-200',
            size === 'lg' ? 'text-xl sm:text-3xl' : size === 'sm' ? 'text-[0.95rem]' : 'text-lg'
          )}
        >
          {video.title}
        </span>

        {showDescription && video.description && size !== 'sm' ? (
          <span className="mt-2 line-clamp-2 block text-[0.85rem] leading-relaxed text-cream-200/70">
            {video.description}
          </span>
        ) : null}

        {video.published_at && size === 'lg' ? (
          <span className="mt-3 block text-[0.7rem] uppercase tracking-[0.16em] text-gold-400/70">
            {formatDate(video.published_at)}
          </span>
        ) : null}
      </span>
    </button>
  );
}
