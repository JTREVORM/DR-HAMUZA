import type { Gallery } from '@/lib/types';
import { FOOTAGE_STILLS } from '@/content/videos';

/**
 * A starter album built from the stills taken out of Dr Salongo Hamuza's own
 * footage.
 *
 * Without it the gallery is an empty state until the client has sat down and
 * created albums in the dashboard — and the homepage links straight to it, so a
 * visitor following "Open the full gallery" would land on nothing. As soon as
 * any album exists in the database this is dropped entirely; see `getGalleries`
 * in `src/lib/queries.ts`.
 */
export const BUNDLED_GALLERY_SLUG = 'from-the-practice';

export const BUNDLED_GALLERIES: Gallery[] = [
  {
    id: 'bundled-gallery-from-the-practice',
    slug: BUNDLED_GALLERY_SLUG,
    title: 'From the Practice',
    description:
      'Photographs taken from Dr Salongo Hamuza’s own recordings — the gatherings, the herbs, the homesteads and the people who came to watch. Every picture here is a moment from footage filmed where the work actually takes place.',
    cover_image: FOOTAGE_STILLS[0].url,
    category: 'Traditional Practice',
    sort_order: 1,
    is_published: true,
    seo_title: 'From the Practice — Photographs of Dr Salongo Hamuza at Work',
    seo_description:
      'Photographs from the traditional practice of Dr Salongo Hamuza in Uganda: ceremonies, herbs, village gatherings and community activities.',
    created_at: '2026-08-14',
    gallery_images: FOOTAGE_STILLS.map((still, index) => ({
      id: `bundled-image-${index}`,
      gallery_id: 'bundled-gallery-from-the-practice',
      url: still.url,
      caption: still.caption,
      alt_text: still.alt,
      width: still.width,
      height: still.height,
      sort_order: index + 1,
    })),
  },
];
