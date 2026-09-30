'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Play } from 'lucide-react';
import type { VideoItem } from '@/lib/types';
import { isSelfHostedVideo, videoEmbedUrl, videoThumbnail } from '@/lib/utils';

/**
 * Cinematic video frame. Nothing plays until the visitor asks for it — no
 * autoplay, and therefore never any unexpected sound.
 */
export function VideoPlayer({
  video,
  className,
  priority,
}: {
  video: VideoItem;
  className?: string;
  priority?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const thumb = videoThumbnail(video);
  const selfHosted = isSelfHostedVideo(video);
  const embed = videoEmbedUrl(video);

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-gold-500/30 bg-forest-950 shadow-deep ${className ?? ''}`}
    >
      {!playing ? (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={`Play video: ${video.title}`}
        >
          {thumb ? (
            <Image
              src={thumb}
              alt=""
              fill
              sizes="(max-width:1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <span className="pattern-diamond absolute inset-0 bg-forest-800" />
          )}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/25 to-forest-950/35"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold-300/70 bg-forest-950/55 text-gold-200 backdrop-blur transition duration-500 group-hover:scale-110 group-hover:bg-gold-400 group-hover:text-forest-950">
              <Play className="ml-1 h-8 w-8 fill-current" aria-hidden />
            </span>
          </span>
          <span className="absolute inset-x-0 bottom-0 p-6 text-left sm:p-8">
            <span className="block font-display text-lg text-cream-100 sm:text-2xl">
              {video.title}
            </span>
          </span>
        </button>
      ) : selfHosted ? (
        <video
          className="h-full w-full bg-black"
          controls
          autoPlay
          playsInline
          poster={thumb || undefined}
        >
          <source src={video.video_url} />
          Your browser does not support embedded video.
        </video>
      ) : (
        <iframe
          src={`${embed}${embed.includes('?') ? '&' : '?'}autoplay=1`}
          title={video.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  );
}
