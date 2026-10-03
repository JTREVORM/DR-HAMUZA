import type { VideoItem } from '@/lib/types';

/**
 * The footage Dr Salongo Hamuza supplied, shipped with the site.
 *
 * These are the videos the homepage falls back to before anything has been
 * entered in the admin dashboard, so a fresh deployment is never a page of
 * empty video frames. Once real rows exist in the `videos` table they take
 * over completely — see `getVideos` in `src/lib/queries.ts`.
 *
 * Every file lives under `/public/videos`, and every poster is a frame taken
 * from that same video and colour graded to match the rest of the site, so a
 * card never shows a random first frame.
 */

type CatalogueEntry = Omit<VideoItem, 'id' | 'created_at'> & { id: string };

const entry = (
  index: number,
  video: Omit<VideoItem, 'id' | 'created_at' | 'source' | 'is_published' | 'sort_order'>
): CatalogueEntry => ({
  id: `bundled-${video.slug}`,
  source: 'upload',
  is_published: true,
  sort_order: index,
  ...video,
});

export const BUNDLED_VIDEOS: CatalogueEntry[] = [
  entry(1, {
    slug: 'traditional-ceremony-in-the-field',
    title: 'Traditional Ceremony in the Open Field',
    description:
      'Filmed in an open garden outside Kamonkoli. A live swarm settles over the practitioner while an elder carries a basin of freshly cut herbs, and neighbours gather quietly along the path to watch the work being carried out.',
    video_url: '/videos/traditional-ceremony-open-field-uganda.mp4',
    thumbnail_url: '/video-posters/traditional-ceremony-open-field-uganda-poster.webp',
    duration: '1:24',
    category: 'Traditional Practices',
    tags: ['traditional practice', 'ceremony', 'herbs', 'Uganda'],
    orientation: 'portrait',
    is_hero: true,
    show_on_homepage: true,
    is_featured: false,
    seo_title: 'Traditional Ceremony in the Open Field — Dr Salongo Hamuza',
    seo_description:
      'Original footage of a traditional ceremony conducted in the open field by Dr Salongo Hamuza, traditional healer from Uganda.',
    published_at: '2026-08-14',
  }),

  entry(2, {
    slug: 'village-healing-gathering',
    title: 'A Gathering at the Village Compound',
    description:
      'A working afternoon in the village. Dr Salongo Hamuza moves through the compound with his helpers, a basin of prepared herbs is carried between the homesteads, and families step out of their doorways to follow what is happening.',
    video_url: '/videos/traditional-healing-village-gathering-uganda.mp4',
    thumbnail_url: '/video-posters/traditional-healing-village-gathering-uganda-poster.webp',
    duration: '1:19',
    category: 'Community Activities',
    tags: ['community', 'village', 'traditional practice'],
    orientation: 'portrait',
    is_hero: false,
    show_on_homepage: true,
    is_featured: true,
    seo_title: 'A Gathering at the Village Compound — Dr Salongo Hamuza',
    seo_description:
      'Dr Salongo Hamuza at work in a Ugandan village compound, filmed during a community gathering.',
    published_at: '2026-07-02',
  }),

  entry(3, {
    slug: 'herbs-and-preparation',
    title: 'Carrying the Herbs Through the Trading Centre',
    description:
      'Fresh green cuttings are carried in an open basin from one homestead to the next along the trading centre road, past shopfronts and neighbours, on the way to where the preparation is to be done.',
    video_url: '/videos/traditional-herbs-preparation-uganda.mp4',
    thumbnail_url: '/video-posters/traditional-herbs-preparation-uganda-poster.webp',
    duration: '1:06',
    category: 'Herbs & Preparations',
    tags: ['herbs', 'preparation', 'trading centre'],
    orientation: 'portrait',
    is_hero: false,
    show_on_homepage: true,
    is_featured: false,
    seo_title: 'Carrying the Herbs Through the Trading Centre — Dr Salongo Hamuza',
    seo_description:
      'Traditional herbs being carried and prepared, filmed at a Ugandan trading centre with Dr Salongo Hamuza.',
    published_at: '2026-06-18',
  }),

  entry(4, {
    slug: 'community-gathering-open-field',
    title: 'The Whole Village Comes to Watch',
    description:
      'One of the larger gatherings recorded. Families, elders and a long line of children stand along the edge of the field while the work is carried out in front of them in the open, with nothing hidden from view.',
    video_url: '/videos/traditional-healing-community-gathering-uganda.mp4',
    thumbnail_url: '/video-posters/traditional-healing-community-gathering-uganda-poster.webp',
    duration: '2:21',
    category: 'Community Activities',
    tags: ['community', 'gathering', 'open field'],
    orientation: 'portrait',
    is_hero: false,
    show_on_homepage: true,
    is_featured: false,
    seo_title: 'The Whole Village Comes to Watch — Dr Salongo Hamuza',
    seo_description:
      'A large community gathering in an open field, filmed during the traditional work of Dr Salongo Hamuza.',
    published_at: '2026-05-27',
  }),

  entry(5, {
    slug: 'a-message-from-dr-salongo-hamuza',
    title: 'A Message From Dr Salongo Hamuza',
    description:
      'Dr Salongo Hamuza speaks directly to camera in his own words and in his own language, explaining who he is, the work he does and how those who need him can make contact.',
    video_url: '/videos/dr-salongo-hamuza-message.mp4',
    thumbnail_url: '/video-posters/dr-salongo-hamuza-message-poster.webp',
    duration: '2:31',
    category: 'Messages',
    tags: ['message', 'introduction', 'Dr Salongo Hamuza'],
    orientation: 'portrait',
    is_hero: false,
    show_on_homepage: true,
    is_featured: false,
    seo_title: 'A Message From Dr Salongo Hamuza',
    seo_description:
      'Dr Salongo Hamuza, traditional healer from Uganda, speaking directly about his practice and how to reach him.',
    published_at: '2026-09-09',
  }),
];

/** Marks the footage that ships with the site rather than coming from the database. */
export const BUNDLED_ID_PREFIX = 'bundled-';

/** The hero clip is short, silent and encoded small — it autoplays on arrival. */
export const HERO_LOOP_SRC = '/videos/traditional-healing-uganda-hero-loop.mp4';
export const HERO_LOOP_POSTER = '/video-posters/dr-salongo-hamuza-traditional-healer-uganda-poster.webp';

/**
 * Which file the hero should actually autoplay.
 *
 * The bundled ceremony video runs for a minute and a half and carries audio.
 * Pulling all of it down on every visit, over phone data, to play it silently
 * behind a headline would be indefensible — so a short silent cut of that same
 * footage is shipped for the job. A video the client uploads later has no such
 * cut prepared, so it is used as it is.
 */
export function heroClipFor(video: { id: string; video_url: string } | null): string {
  if (!video?.video_url) return HERO_LOOP_SRC;
  return video.id.startsWith(BUNDLED_ID_PREFIX) ? HERO_LOOP_SRC : video.video_url;
}

/**
 * Stills pulled from the same footage and graded to match, used wherever the
 * site needs photography. Nothing here is stock imagery.
 */
export const FOOTAGE_STILLS = [
  {
    url: '/images/dr-salongo-hamuza-traditional-healer-uganda.webp',
    width: 800,
    height: 1000,
    caption: 'Fresh herbs brought to the field',
    alt: 'An elder holds an open basin of freshly cut green herbs during a traditional ceremony in an open field',
  },
  {
    url: '/images/traditional-healing-community-gathering-uganda.webp',
    width: 800,
    height: 1000,
    caption: 'Families gather to watch the work',
    alt: 'Children and families standing along the edge of an open field watching a traditional gathering',
  },
  {
    url: '/images/dr-salongo-hamuza-traditional-practice.webp',
    width: 800,
    height: 1000,
    caption: 'Along the trading centre road',
    alt: 'Herbs carried in a basin along a village trading centre road as neighbours look on',
  },
  {
    url: '/images/traditional-ceremony-open-field-uganda.webp',
    width: 640,
    height: 1387,
    caption: 'In the garden at midday',
    alt: 'A traditional ceremony taking place beside a motorcycle in a green garden',
  },
  {
    url: '/images/traditional-healer-visiting-homestead-uganda.webp',
    width: 800,
    height: 1000,
    caption: 'Walking out to the homestead',
    alt: 'A group walking through green grass towards a village homestead',
  },
  {
    url: '/images/traditional-herbs-uganda.webp',
    width: 800,
    height: 800,
    caption: 'Cuttings prepared in an open basin',
    alt: 'Close view of freshly cut green herbs prepared in a red basin',
  },
  {
    url: '/images/ugandan-village-homestead.webp',
    width: 640,
    height: 1138,
    caption: 'The homestead at Kamonkoli',
    alt: 'Grass-thatched and iron-roofed homes in a Ugandan village compound',
  },
  {
    url: '/images/traditional-ceremony-crowd-uganda.webp',
    width: 640,
    height: 1138,
    caption: 'Neighbours along the path',
    alt: 'A crowd of neighbours and children standing along a path in an open field',
  },
  {
    url: '/images/traditional-herb-preparation-uganda.webp',
    width: 640,
    height: 1138,
    caption: 'Carrying the preparation',
    alt: 'A prepared basin carried by hand through a village compound',
  },
  {
    url: '/images/traditional-practice-close-up-uganda.webp',
    width: 800,
    height: 800,
    caption: 'Close to the work',
    alt: 'A close view of the traditional work being carried out on the ground',
  },
  {
    url: '/images/traditional-consultation-uganda.webp',
    width: 800,
    height: 1000,
    caption: 'Early in the morning',
    alt: 'Two people standing together in a garden early in the morning during traditional work',
  },
] as const;

/** Portrait frames of Dr Salongo Hamuza himself, taken from his own message. */
export const PORTRAIT_STILL = '/images/dr-salongo-hamuza-portrait.webp';
export const PORTRAIT_STILL_WIDE = '/images/dr-salongo-hamuza-speaking.webp';
