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
      images: [{ url: ogImage, width: 1200, height: 1200, alt: settings.site_name }],
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
    image: absoluteUrl(SITE_URL, settings.logo_url || '/brand/logo.webp'),
    logo: absoluteUrl(SITE_URL, settings.logo_url || '/brand/logo.webp'),
    ...(settings.email ? { email: settings.email } : {}),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UG',
      ...(settings.location ? { addressLocality: settings.location } : {}),
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
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: settings.site_name,
    jobTitle: settings.tagline,
    description: settings.short_description,
    url: `${SITE_URL}/about`,
    image: absoluteUrl(SITE_URL, settings.logo_url || '/brand/logo.webp'),
    telephone: formatPhone(settings.phone),
    worksFor: { '@id': `${SITE_URL}/#business` },
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

export function videoSchema(args: {
  name: string;
  description: string;
  thumbnailUrl?: string;
  uploadDate?: string | null;
  embedUrl?: string;
  contentUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: args.name,
    description: args.description,
    ...(args.thumbnailUrl ? { thumbnailUrl: [args.thumbnailUrl] } : {}),
    ...(args.uploadDate ? { uploadDate: args.uploadDate } : {}),
    ...(args.embedUrl ? { embedUrl: args.embedUrl } : {}),
    ...(args.contentUrl ? { contentUrl: args.contentUrl } : {}),
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
