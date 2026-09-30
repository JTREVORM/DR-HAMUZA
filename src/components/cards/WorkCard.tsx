import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, MapPin, Play } from 'lucide-react';
import type { WorkPost } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export function WorkCard({ post, priority }: { post: WorkPost; priority?: boolean }) {
  const date = formatDate(post.event_date || post.published_at || post.created_at);

  return (
    <article className="card-premium group flex h-full flex-col">
      <Link href={`/our-work/${post.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className="lift-img object-cover"
            priority={priority}
          />
        ) : (
          <span className="pattern-diamond absolute inset-0 bg-forest-800" />
        )}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/15 to-transparent"
        />

        {post.category ? (
          <span className="absolute left-4 top-4 rounded-full border border-gold-400/50 bg-forest-950/70 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-200 backdrop-blur">
            {post.category}
          </span>
        ) : null}

        {post.video_url ? (
          <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gold-400/90 text-forest-950">
            <Play className="h-4 w-4 fill-current" aria-hidden />
            <span className="sr-only">Includes video</span>
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-lg leading-snug text-cream-100 transition group-hover:text-gold-200">
            {post.title}
          </h3>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6 pt-5">
        <p className="flex-1 text-[0.9rem] leading-[1.8] text-forest-800/75 line-clamp-3">
          {post.short_description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-earth-200/70 pt-4 text-[0.74rem] text-forest-800/60">
          {date ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-gold-600" aria-hidden />
              {date}
            </span>
          ) : null}
          {post.location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gold-600" aria-hidden />
              {post.location}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
