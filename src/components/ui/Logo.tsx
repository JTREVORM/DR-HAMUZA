import Image from 'next/image';
import { cn } from '@/lib/utils';

/** The crest from the brand mark. Falls back to the bundled logo file. */
export function Logo({
  src,
  alt,
  size = 56,
  className,
  priority,
}: {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn('relative block shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={src || '/brand/logo.webp'}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-contain"
        priority={priority}
      />
    </span>
  );
}
