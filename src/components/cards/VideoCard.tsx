import Link from 'next/link';
import Image from 'next/image';
import { Clock, Film, Play } from 'lucide-react';
import type { VideoItem } from '@/lib/types';
import { formatDate, videoThumbnail } from '@/lib/utils';

export function VideoCard({ video, priority }: { video: VideoItem; priority?: boolean }) {
  const thumb = videoThumbnail(video);

  return (
    <article className="group card-dark h-full">
      <Link href={`/videos/${video.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          {thumb ? (
            <Image
              src={thumb}
              alt={video.title}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
              className="lift-img object-cover"
              priority={priority}
            />
          ) : (
            <span className="pattern-diamond absolute inset-0 flex items-center justify-center bg-forest-800">
              <Film className="h-10 w-10 text-gold-500/50" aria-hidden />
            </span>
          )}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-forest-950/80 to-transparent transition-opacity duration-500 group-hover:opacity-70"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-300/70 bg-forest-950/55 text-gold-200 backdrop-blur-sm transition duration-500 group-hover:scale-110 group-hover:bg-gold-400 group-hover:text-forest-950">
              <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden />
            </span>
          </span>
          {video.duration ? (
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-forest-950/85 px-2 py-1 text-[0.70rem] font-medium text-cream-200">
              <Clock className="h-3 w-3" aria-hidden />
              {video.duration}
            </span>
          ) : null}
        </div>

        <div className="p-6">
          {video.category ? (
            <span className="eyebrow-light text-[0.70rem]">{video.category}</span>
          ) : null}
          <h3 className="mt-2.5 line-clamp-2 font-display text-lg leading-snug text-cream-100 transition group-hover:text-gold-200">
            {video.title}
          </h3>
          {video.description ? (
            <p className="mt-3 line-clamp-2 text-[0.88rem] leading-relaxed text-cream-200/65">
              {video.description}
            </p>
          ) : null}
          {video.published_at ? (
            <p className="mt-4 text-[0.72rem] uppercase tracking-[0.16em] text-gold-400/70">
              {formatDate(video.published_at)}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
