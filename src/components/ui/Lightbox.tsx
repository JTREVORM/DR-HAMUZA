'use client';

import Image from 'next/image';
import { useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface LightboxItem {
  url: string;
  caption?: string;
  alt?: string;
}

/** Accessible, keyboard-navigable image viewer used by the galleries. */
export function Lightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}) {
  const open = index !== null && index >= 0 && index < items.length;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndexChange((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndexChange]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose, go]);

  if (!open || index === null) return null;
  const item = items[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.caption || 'Image viewer'}
      className="fixed inset-0 z-[120] flex flex-col bg-forest-950/95 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 py-4 text-cream-200 sm:px-8">
        <span className="text-xs uppercase tracking-[0.22em] text-gold-300">
          {index + 1} / {items.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 text-gold-200 transition hover:bg-gold-400/15"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-3 pb-4 sm:px-16"
        onClick={(event) => event.stopPropagation()}
      >
        {items.length > 1 ? (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/35 bg-forest-900/70 text-gold-200 transition hover:bg-gold-400/20 sm:left-5"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        ) : null}

        <div className="relative h-full w-full max-w-5xl">
          <Image
            src={item.url}
            alt={item.alt || item.caption || 'Gallery image'}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        {items.length > 1 ? (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/35 bg-forest-900/70 text-gold-200 transition hover:bg-gold-400/20 sm:right-5"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        ) : null}
      </div>

      {item.caption ? (
        <p className="px-6 pb-8 text-center text-sm text-cream-200/80">{item.caption}</p>
      ) : null}
    </div>
  );
}
