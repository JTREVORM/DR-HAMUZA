import type { ReactNode } from 'react';
import type { VideoOrientation } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * The frame every video on the site sits inside: deep forest surround, a thin
 * gold edge and a soft glow beneath it. The point is that a portrait phone clip
 * and a landscape one look like they belong to the same brand.
 */

export const aspectFor = (orientation: VideoOrientation) =>
  orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video';

export function VideoFrame({
  orientation = 'portrait',
  children,
  className,
  glow = true,
  rounded = 'rounded-[1.75rem]',
}: {
  orientation?: VideoOrientation;
  children: ReactNode;
  className?: string;
  glow?: boolean;
  rounded?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      {glow ? (
        <span
          aria-hidden
          className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gold-400/10 blur-2xl"
        />
      ) : null}

      <div
        className={cn(
          'relative overflow-hidden border border-gold-500/30 bg-forest-950 shadow-deep',
          'ring-1 ring-inset ring-gold-300/10',
          rounded,
          aspectFor(orientation)
        )}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Portrait footage in a wide slot. Rather than stretching a 9:16 clip or
 * dropping it into a letterboxed black bar, the poster is blurred out behind it
 * to fill the width — the video itself keeps its true shape.
 */
export function PortraitStage({
  poster,
  children,
  className,
  height = 'h-[68vh] min-h-[420px] max-h-[760px]',
}: {
  poster?: string;
  children: ReactNode;
  className?: string;
  height?: string;
}) {
  return (
    <div
      className={cn(
        'relative isolate flex items-center justify-center overflow-hidden rounded-[1.75rem]',
        'border border-gold-500/25 bg-forest-950 shadow-deep',
        height,
        className
      )}
    >
      {poster ? (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 scale-125 bg-cover bg-center opacity-35 blur-2xl saturate-[0.85]"
          style={{ backgroundImage: `url(${poster})` }}
        />
      ) : null}
      <span aria-hidden className="absolute inset-0 -z-10 bg-forest-950/55" />
      <span aria-hidden className="pattern-diamond absolute inset-0 -z-10 opacity-40" />

      <div className="relative h-full">{children}</div>
    </div>
  );
}
