import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'center',
  tone = 'light',
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: 'center' | 'left';
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <Reveal
      className={cn(
        'max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow ? (
        <p className={dark ? 'eyebrow-light' : 'eyebrow'}>
          <span
            aria-hidden
            className={cn('h-px w-8', dark ? 'bg-gold-400/70' : 'bg-gold-500/70')}
          />
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          'heading-lg mt-4',
          dark ? 'text-cream-100' : 'text-forest-900'
        )}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={cn(
            'mt-5 text-base leading-[1.8] sm:text-[1.0625rem]',
            dark ? 'text-cream-200/75' : 'text-forest-800/75'
          )}
        >
          {intro}
        </p>
      ) : null}
      <span
        aria-hidden
        className={cn(
          'mt-7 block h-[3px] w-20 rounded-full bg-gold-sheen',
          align === 'center' && 'mx-auto'
        )}
      />
    </Reveal>
  );
}
