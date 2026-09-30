import { cn } from '@/lib/utils';

/** Gold chevron frieze inspired by the banded borders in the logo. */
export function PatternDivider({
  className,
  tone = 'light',
}: {
  className?: string;
  tone?: 'light' | 'dark';
}) {
  return (
    <div className={cn('relative flex items-center justify-center gap-4 py-2', className)}>
      <span
        aria-hidden
        className={cn(
          'h-px flex-1 bg-gradient-to-r from-transparent',
          tone === 'dark' ? 'to-gold-400/40' : 'to-gold-500/35'
        )}
      />
      <svg
        aria-hidden
        viewBox="0 0 64 20"
        className="h-4 w-16 shrink-0 text-gold-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M2 18 12 4l10 14M22 18 32 4l10 14M42 18 52 4l10 14" />
      </svg>
      <span
        aria-hidden
        className={cn(
          'h-px flex-1 bg-gradient-to-l from-transparent',
          tone === 'dark' ? 'to-gold-400/40' : 'to-gold-500/35'
        )}
      />
    </div>
  );
}
