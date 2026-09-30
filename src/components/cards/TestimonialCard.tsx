import Image from 'next/image';
import { MapPin, Quote, Star } from 'lucide-react';
import type { Testimonial } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';

export function TestimonialCard({
  testimonial,
  tone = 'light',
}: {
  testimonial: Testimonial;
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';

  return (
    <figure className={cn('flex h-full flex-col p-7', dark ? 'card-dark' : 'card-premium')}>
      <Quote
        aria-hidden
        className={cn('h-8 w-8 shrink-0', dark ? 'text-gold-400/45' : 'text-gold-400/70')}
      />

      {testimonial.rating ? (
        <div
          className="mt-4 flex gap-0.5"
          aria-label={`Rated ${testimonial.rating} out of 5`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              aria-hidden
              className={cn(
                'h-4 w-4',
                i < testimonial.rating!
                  ? 'fill-gold-400 text-gold-400'
                  : dark
                    ? 'text-cream-200/20'
                    : 'text-earth-200'
              )}
            />
          ))}
        </div>
      ) : null}

      <blockquote
        className={cn(
          'mt-5 flex-1 font-serif text-[1.08rem] leading-[1.85]',
          dark ? 'text-cream-100/90' : 'text-forest-800'
        )}
      >
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>

      <figcaption
        className={cn(
          'mt-6 flex items-center gap-3.5 border-t pt-5',
          dark ? 'border-gold-500/20' : 'border-earth-200/70'
        )}
      >
        {testimonial.photo_url ? (
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-gold-400/50">
            <Image
              src={testimonial.photo_url}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          </span>
        ) : (
          <span
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-base ring-2 ring-gold-400/40',
              dark ? 'bg-forest-900 text-gold-300' : 'bg-cream-200 text-forest-800'
            )}
            aria-hidden
          >
            {testimonial.client_name.trim().charAt(0).toUpperCase() || 'A'}
          </span>
        )}

        <span className="min-w-0">
          <span
            className={cn(
              'block truncate font-display text-[0.98rem]',
              dark ? 'text-cream-100' : 'text-forest-900'
            )}
          >
            {testimonial.client_name}
          </span>
          <span
            className={cn(
              'mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[0.72rem]',
              dark ? 'text-cream-200/55' : 'text-forest-800/55'
            )}
          >
            {testimonial.service ? <span>{testimonial.service}</span> : null}
            {testimonial.location ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" aria-hidden />
                {testimonial.location}
              </span>
            ) : null}
            {testimonial.given_at ? <span>{formatDate(testimonial.given_at)}</span> : null}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
