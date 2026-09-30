import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/env';
import {
  getBlogPosts,
  getGalleries,
  getServices,
  getVideos,
  getWorkPosts,
} from '@/lib/queries';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, work, galleries, videos, posts] = await Promise.all([
    getServices(),
    getWorkPosts(),
    getGalleries(),
    getVideos(),
    getBlogPosts(),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
      { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.9 },
      { url: `${SITE_URL}/services`, changeFrequency: 'monthly', priority: 0.9 },
      { url: `${SITE_URL}/our-work`, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${SITE_URL}/gallery`, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${SITE_URL}/videos`, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${SITE_URL}/testimonials`, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.9 },
      { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
      { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
      { url: `${SITE_URL}/disclaimer`, changeFrequency: 'yearly', priority: 0.4 },
    ] as const
  ).map((entry) => ({ ...entry, lastModified: now }));

  return [
    ...staticRoutes,
    ...services.map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    ...work.map((w) => ({
      url: `${SITE_URL}/our-work/${w.slug}`,
      lastModified: new Date(w.published_at || w.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...galleries.map((g) => ({
      url: `${SITE_URL}/gallery/${g.slug}`,
      lastModified: new Date(g.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...videos.map((v) => ({
      url: `${SITE_URL}/videos/${v.slug}`,
      lastModified: new Date(v.published_at || v.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.published_at || p.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ];
}
