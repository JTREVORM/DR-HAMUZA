import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import type { BlogPost } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export function BlogCard({ post, priority }: { post: BlogPost; priority?: boolean }) {
  return (
    <article className="card-premium group flex h-full flex-col">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden">
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
          <span className="pattern-weave absolute inset-0 flex items-center justify-center bg-cream-200">
            <BookOpen className="h-9 w-9 text-earth-400" aria-hidden />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.7rem] uppercase tracking-[0.16em] text-gold-700">
          {post.blog_categories?.name ? <span>{post.blog_categories.name}</span> : null}
          {post.published_at ? (
            <time dateTime={post.published_at} className="text-forest-800/50">
              {formatDate(post.published_at)}
            </time>
          ) : null}
        </div>

        <h3 className="mt-3 font-display text-xl leading-snug text-forest-900 transition group-hover:text-gold-700">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="mt-3 flex-1 text-[0.9rem] leading-[1.8] text-forest-800/75 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-earth-200/70 pt-4">
          <span className="inline-flex items-center gap-1.5 text-[0.74rem] text-forest-800/55">
            <Clock className="h-3.5 w-3.5 text-gold-600" aria-hidden />
            {post.reading_minutes} min read
          </span>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-gold-700 transition hover:text-forest-900"
          >
            Read
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            <span className="sr-only">{post.title}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
