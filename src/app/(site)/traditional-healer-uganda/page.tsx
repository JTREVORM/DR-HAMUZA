import type { Metadata } from 'next';

import { PageHero } from '@/components/layout/PageHero';
import { JsonLd } from '@/components/ui/JsonLd';
import { CornerstoneArticle } from '@/components/seo/CornerstoneArticle';
import { DisclaimerSection } from '@/components/home/DisclaimerSection';
import { ContactInfoSection } from '@/components/home/ContactInfoSection';

import { TRADITIONAL_HEALER_UGANDA as PAGE } from '@/content/cornerstone';
import { getServices, getSettings, getVideoBySlug } from '@/lib/queries';
import { breadcrumbSchema, buildMetadata, faqSchema, webPageSchema } from '@/lib/seo';
import { fillPhoneToken } from '@/lib/utils';

export const revalidate = 3600;

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: PAGE.h1, path: `/${PAGE.slug}` },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: PAGE.seoTitle,
    description: PAGE.seoDescription,
    path: `/${PAGE.slug}`,
    image: PAGE.image,
  });
}

export default async function Page() {
  const [settings, services, video] = await Promise.all([
    getSettings(),
    getServices(),
    PAGE.video ? getVideoBySlug(PAGE.video) : Promise.resolve(null),
  ]);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(CRUMBS),
          webPageSchema({
            settings,
            name: PAGE.h1,
            description: PAGE.seoDescription,
            path: `/${PAGE.slug}`,
            image: PAGE.image,
          }),
          faqSchema(PAGE.faqs.map((faq) => ({ ...faq, answer: fillPhoneToken(faq.answer, settings) }))),
        ]}
      />

      <PageHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.h1}
        intro={PAGE.intro}
        crumbs={CRUMBS}
        image={PAGE.image}
      />

      <CornerstoneArticle page={PAGE} settings={settings} services={services} video={video} />

      <ContactInfoSection settings={settings} />
      <DisclaimerSection settings={settings} />
    </>
  );
}
