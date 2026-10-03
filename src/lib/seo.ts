import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/env';
import type { SiteSettings } from '@/lib/types';
import { absoluteUrl, contactPhones, formatPhone } from '@/lib/utils';

interface BuildMetadataArgs {
  settings: SiteSettings;
  title: string;
  description: string;
  path: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageType?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string | null;
  tags?: string[];
  noIndex?: boolean;
}

export function buildMetadata({
  settings,
  title,
  description,
  path,
  image,
  imageWidth = 1200,
  imageHeight = 630,
  imageType,
  type = 'website',
  publishedTime,
  tags,
  noIndex,
}: BuildMetadataArgs): Metadata {
  const url = absoluteUrl(SITE_URL, path);
  const ogImage = absoluteUrl(SITE_URL, image || settings.default_og_image || '/brand/logo.webp');
  const fullTitle = title.includes(settings.site_name)
    ? title
    : `${title} | ${settings.site_name}`;

  return {
    // `absolute` stops the root layout's "%s | Site Name" template appending
    // the site name a second time.
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    openGraph: {
      type: type === 'profile' ? 'profile' : type,
      url,
      title: fullTitle,
      description,
      siteName: settings.site_name,
      locale: 'en_UG',
      images: [{
        url: ogImage,
        secureUrl: ogImage,
        width: imageWidth,
        height: imageHeight,
        alt: settings.site_name,
        ...(imageType ? { type: imageType } : {}),
      }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(tags?.length ? { tags } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

/* ------------------------------------------------------- structured data -- */

export function localBusinessSchema(settings: SiteSettings) {
  const sameAs = [
    settings.facebook_url,
    settings.instagram_url,
    settings.tiktok_url,
    settings.youtube_url,
    settings.twitter_url,
  ].filter(Boolean);

  // `location` defaults to the country, and "Uganda" is not a locality — writing
  // it into addressLocality would be structured data that says something untrue.
  // No street address or coordinates were supplied, so none are invented here;
  // set `location` to the real town in Site Settings and it appears.
  const locality =
    settings.location && settings.location.trim().toLowerCase() !== 'uganda'
      ? settings.location.trim()
      : '';

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: settings.site_name,
    description: settings.short_description,
    url: SITE_URL,
    // Valid international (E.164-style) numbers, e.g. +256777172119.
    telephone: formatPhone(settings.phone),
    contactPoint: contactPhones(settings).map((telephone) => ({
      '@type': 'ContactPoint',
      telephone,
      contactType: 'customer service',
      areaServed: 'UG',
    })),
    image: [
      absoluteUrl(SITE_URL, '/images/dr-salongo-hamuza-traditional-healer-uganda.webp'),
      absoluteUrl(SITE_URL, '/images/traditional-herbs-uganda.webp'),
      absoluteUrl(SITE_URL, '/images/dr-salongo-hamuza-traditional-practice.webp'),
    ],
    logo: absoluteUrl(SITE_URL, settings.logo_url || '/brand/logo.webp'),
    ...(settings.email ? { email: settings.email } : {}),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UG',
      ...(locality ? { addressLocality: locality } : {}),
    },
    areaServed: { '@type': 'Country', name: 'Uganda' },
    ...(sameAs.length ? { sameAs } : {}),
    ...(settings.business_hours.length
      ? {
          openingHours: settings.business_hours.map((h) => `${h.day} ${h.hours}`),
        }
      : {}),
  };
}

export function personSchema(settings: SiteSettings) {
  const sameAs = [
    settings.facebook_url,
    settings.instagram_url,
    settings.tiktok_url,
    settings.youtube_url,
    settings.twitter_url,
  ].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: settings.site_name,
    jobTitle: settings.tagline,
    description: settings.short_description,
    url: `${SITE_URL}/about`,
    // A photograph of him, not the logo — the Person is the man.
    image: absoluteUrl(SITE_URL, '/images/dr-salongo-hamuza-portrait.webp'),
    telephone: formatPhone(settings.phone),
    nationality: { '@type': 'Country', name: 'Uganda' },
    worksFor: { '@id': `${SITE_URL}/#business` },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(SITE_URL, item.path),
    })),
  };
}

export function articleSchema(args: {
  settings: SiteSettings;
  title: string;
  description: string;
  path: string;
  image?: string;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: args.title,
    description: args.description,
    mainEntityOfPage: absoluteUrl(SITE_URL, args.path),
    url: absoluteUrl(SITE_URL, args.path),
    ...(args.image ? { image: [absoluteUrl(SITE_URL, args.image)] } : {}),
    ...(args.publishedTime ? { datePublished: args.publishedTime } : {}),
    ...(args.modifiedTime ? { dateModified: args.modifiedTime } : {}),
    author: { '@type': 'Person', name: args.author || args.settings.site_name },
    publisher: {
      '@type': 'Organization',
      name: args.settings.site_name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(SITE_URL, args.settings.logo_url || '/brand/logo.webp'),
      },
    },
  };
}

/**
 * `VideoObject` for a single video page.
 *
 * `contentUrl` is the media file itself and `embedUrl` is a player — they are
 * not interchangeable, so a self-hosted MP4 is only ever given as `contentUrl`
 * and an external provider only ever as `embedUrl`. Everything optional is left
 * out entirely when we do not have a real value for it.
 */
export function videoSchema(args: {
  settings: SiteSettings;
  name: string;
  description: string;
  pageUrl: string;
  thumbnailUrl?: string;
  uploadDate?: string | null;
  duration?: string;
  embedUrl?: string;
  contentUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${absoluteUrl(SITE_URL, args.pageUrl)}#video`,
    name: args.name,
    description: args.description,
    url: absoluteUrl(SITE_URL, args.pageUrl),
    ...(args.thumbnailUrl ? { thumbnailUrl: [args.thumbnailUrl] } : {}),
    ...(args.uploadDate ? { uploadDate: args.uploadDate } : {}),
    ...(args.duration ? { duration: args.duration } : {}),
    ...(args.embedUrl ? { embedUrl: args.embedUrl } : {}),
    ...(args.contentUrl ? { contentUrl: args.contentUrl } : {}),
    creator: { '@id': `${SITE_URL}/#person` },
    publisher: { '@id': `${SITE_URL}/#business` },
    inLanguage: 'en',
    isFamilyFriendly: true,
  };
}

/**
 * FAQ markup. Only ever generated from questions and answers that are visibly
 * rendered on the same page — Google requires it, and marking up anything else
 * would be misleading.
 */
export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/** Marks a page as part of the site, tied to the one business entity. */
export function webPageSchema(args: {
  settings: SiteSettings;
  name: string;
  description: string;
  path: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: args.name,
    description: args.description,
    url: absoluteUrl(SITE_URL, args.path),
    inLanguage: 'en',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#person` },
    ...(args.image ? { primaryImageOfPage: absoluteUrl(SITE_URL, args.image) } : {}),
  };
}

/** The website itself, so Google can tie every page back to one entity. */
export function websiteSchema(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: settings.site_name,
    description: settings.short_description,
    url: SITE_URL,
    inLanguage: 'en',
    publisher: { '@id': `${SITE_URL}/#business` },
  };
}

export function serviceSchema(args: {
  settings: SiteSettings;
  name: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: args.name,
    description: args.description,
    url: absoluteUrl(SITE_URL, args.path),
    serviceType: 'Traditional consultation',
    areaServed: { '@type': 'Country', name: 'Uganda' },
    provider: { '@id': `${SITE_URL}/#business` },
  };
}
