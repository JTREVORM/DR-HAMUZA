import Image from 'next/image';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { PatternDivider } from '@/components/ui/PatternDivider';

/** Shared banner used at the top of every inner page. */
export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  image,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs: Crumb[];
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-950 pb-16 pt-32 lg:pb-20 lg:pt-40">
      {image ? (
        <>
          <Image src={image} alt="" fill sizes="100vw" priority className="-z-20 object-cover" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-forest-950/85" />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,#1A5A40_0%,#0C3323_50%,#04150E_100%)]"
        />
      )}
      <div aria-hidden className="pattern-diamond absolute inset-0 -z-10 opacity-55" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold-400/8 blur-[110px]"
      />

      <div className="container relative z-10">
        <Breadcrumbs items={crumbs} />

        {eyebrow ? (
          <p className="eyebrow-light">
            <span aria-hidden className="h-px w-8 bg-gold-400/70" />
            {eyebrow}
          </p>
        ) : null}

        <h1 className="heading-xl mt-4 max-w-4xl text-cream-50">{title}</h1>

        {intro ? (
          <p className="mt-6 max-w-3xl text-[1.02rem] leading-[1.9] text-cream-200/80">{intro}</p>
        ) : null}

        {children}

        <PatternDivider tone="dark" className="mt-10 max-w-md" />
      </div>

      <div aria-hidden className="pattern-frieze absolute inset-x-0 bottom-0 h-3 opacity-40" />
    </section>
  );
}
