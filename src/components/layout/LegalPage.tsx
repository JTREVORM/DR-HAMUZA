import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/ui/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';
import type { Crumb } from '@/components/ui/Breadcrumbs';

/** Shared shell for the privacy, terms and disclaimer pages. */
export function LegalPage({
  eyebrow,
  title,
  intro,
  crumbs,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  crumbs: Crumb[];
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero eyebrow={eyebrow} title={title} intro={intro} crumbs={crumbs} />

      <section className="bg-cream-50 py-20 lg:py-24">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl">
            {updated ? (
              <p className="mb-8 text-[0.78rem] uppercase tracking-[0.18em] text-forest-800/45">
                Last updated: {updated}
              </p>
            ) : null}
            <div className="prose-brand">{children}</div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
