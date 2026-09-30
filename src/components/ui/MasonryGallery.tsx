'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Expand } from 'lucide-react';
import { Lightbox, type LightboxItem } from '@/components/ui/Lightbox';

/**
 * Responsive CSS-column masonry with a lightbox. Images are lazy-loaded and
 * sized so a phone never downloads a desktop-sized original.
 */
export function MasonryGallery({
  items,
  columnsClassName = 'columns-2 sm:columns-2 lg:columns-3',
}: {
  items: LightboxItem[];
  columnsClassName?: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  if (!items.length) return null;

  return (
    <>
      <div className={`${columnsClassName} gap-4 [column-fill:_balance]`}>
        {items.map((item, i) => (
          <button
            key={`${item.url}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative mb-4 block w-full overflow-hidden rounded-xl border border-earth-200/70 bg-cream-200 text-left shadow-card transition duration-500 hover:-translate-y-1 hover:border-gold-400 hover:shadow-gold"
            aria-label={`Open image${item.caption ? `: ${item.caption}` : ''}`}
          >
            <Image
              src={item.url}
              alt={item.alt || item.caption || ''}
              width={800}
              height={1000}
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              className="h-auto w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]"
              loading="lazy"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span
              aria-hidden
              className="absolute right-3 top-3 flex h-9 w-9 scale-75 items-center justify-center rounded-full bg-gold-400/95 text-forest-950 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
            >
              <Expand className="h-4 w-4" />
            </span>
            {item.caption ? (
              <span className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-[0.8rem] leading-snug text-cream-100 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {item.caption}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <Lightbox items={items} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />
    </>
  );
}
