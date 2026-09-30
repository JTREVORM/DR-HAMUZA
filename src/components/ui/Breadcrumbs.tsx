import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items, tone = 'dark' }: { items: Crumb[]; tone?: 'dark' | 'light' }) {
  const onDark = tone === 'dark';
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.8rem]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {i > 0 ? (
                <ChevronRight
                  aria-hidden
                  className={cn('h-3.5 w-3.5', onDark ? 'text-gold-400/60' : 'text-forest-700/40')}
                />
              ) : null}
              {last ? (
                <span
                  aria-current="page"
                  className={cn(onDark ? 'text-cream-200/70' : 'text-forest-800/70')}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className={cn(
                    'underline-offset-4 transition hover:underline',
                    onDark
                      ? 'text-gold-300 hover:text-gold-200'
                      : 'text-forest-700 hover:text-gold-700'
                  )}
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
