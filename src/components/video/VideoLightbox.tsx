'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, X } from 'lucide-react';
import type { VideoItem } from '@/lib/types';
import { InlineVideo } from '@/components/video/InlineVideo';
import { aspectFor } from '@/components/video/VideoFrame';

/**
 * Opens a video over the page rather than navigating away from it, so a visitor
 * browsing the showcase keeps their place. Portrait clips are given a tall,
 * narrow stage instead of being stretched into a wide one.
 */
export function VideoLightbox({
  video,
  onClose,
}: {
  video: VideoItem | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = Boolean(video);

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, handleKey]);

  if (!open || typeof document === 'undefined') return null;
  const item = video!;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="Close video"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-forest-950/92 backdrop-blur-md"
      />

      <div className="relative z-10 flex max-h-full w-full max-w-5xl flex-col items-center gap-5 overflow-y-auto">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="self-end inline-flex items-center gap-2 rounded-full border border-gold-400/50 px-4 py-2 text-[0.75rem] uppercase tracking-[0.18em] text-gold-200 transition hover:bg-gold-400 hover:text-forest-950"
        >
          Close
          <X className="h-4 w-4" aria-hidden />
        </button>

        <div
          className={`relative w-full overflow-hidden rounded-2xl border border-gold-500/30 bg-black shadow-deep ${aspectFor(
            item.orientation
          )} ${item.orientation === 'portrait' ? 'mx-auto max-w-[min(94vw,26rem)]' : ''}`}
        >
          <InlineVideo
            video={item}
            autoStart
            objectFit="contain"
            sizes="(max-width: 640px) 94vw, 40rem"
          />
        </div>

        <div className="w-full max-w-2xl pb-4 text-center">
          {item.category ? (
            <p className="eyebrow-light justify-center text-[0.68rem]">{item.category}</p>
          ) : null}
          <h3 className="mt-2 font-display text-xl text-cream-100 sm:text-2xl">{item.title}</h3>
          {item.description ? (
            <p className="mt-3 text-[0.9rem] leading-relaxed text-cream-200/70">
              {item.description}
            </p>
          ) : null}
          <Link
            href={`/videos/${item.slug}`}
            className="btn-outline-gold mt-6 !py-2.5 text-[0.8rem]"
          >
            Open the full page
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
