import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import type { Service } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ServiceCard({
  service,
  tone = 'light',
}: {
  service: Service;
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';

  return (
    <article
      className={cn(
        'group flex h-full flex-col',
        dark ? 'card-dark' : 'card-premium'
      )}
    >
      {service.cover_image ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={service.cover_image}
            alt={service.title}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className="lift-img object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-7">
        <span
          className={cn(
            'flex h-13 w-13 items-center justify-center rounded-xl border transition-colors duration-500',
            'h-[3.25rem] w-[3.25rem]',
            dark
              ? 'border-gold-400/30 bg-gold-400/10 text-gold-300 group-hover:bg-gold-400/20'
              : 'border-gold-300/60 bg-gold-50 text-gold-700 group-hover:border-gold-400 group-hover:bg-gold-100'
          )}
        >
          <ServiceIcon name={service.icon} className="h-6 w-6" />
        </span>

        <h3
          className={cn(
            'mt-6 font-display text-[1.32rem] leading-snug transition-colors',
            dark
              ? 'text-cream-100 group-hover:text-gold-200'
              : 'text-forest-900 group-hover:text-gold-700'
          )}
        >
          {service.title}
        </h3>

        <p
          className={cn(
            'mt-3.5 flex-1 text-[0.92rem] leading-[1.8]',
            dark ? 'text-cream-200/70' : 'text-forest-800/75'
          )}
        >
          {service.short_description}
        </p>

        <Link
          href={`/services/${service.slug}`}
          className={cn(
            'mt-6 inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.14em] transition',
            dark ? 'text-gold-300 hover:text-gold-200' : 'text-gold-700 hover:text-forest-900'
          )}
        >
          Read more
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          <span className="sr-only">about {service.title}</span>
        </Link>
      </div>

      <span
        aria-hidden
        className="h-[3px] w-0 bg-gold-sheen transition-all duration-500 group-hover:w-full"
      />
    </article>
  );
}
