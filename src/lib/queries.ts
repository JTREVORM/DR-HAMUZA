import { cache } from 'react';
import { publicSupabase } from '@/lib/supabase/public';
import { DEFAULT_SETTINGS } from '@/content/site-defaults';
import { DEFAULT_SERVICES } from '@/content/services';
import type {
  BlogCategory,
  BlogPost,
  Gallery,
  Service,
  SiteSettings,
  Testimonial,
  VideoItem,
  WorkPost,
} from '@/lib/types';

/**
 * All public data access lives here.
 *
 * Three rules hold throughout:
 *  1. Reads go through a session-less client, so public pages stay statically
 *     renderable and are revalidated on a timer rather than rebuilt on every
 *     request.
 *  2. A missing or unreachable database never breaks a page — the site falls
 *     back to the bundled default content and to empty lists.
 *  3. Only published / approved rows are requested. Row Level Security
 *     enforces the same thing in the database, so an anonymous visitor cannot
 *     read a draft even if a query were wrong.
 */

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

/** Merges a settings row over the defaults, treating '' and null as "unset". */
function mergeSettings(row: unknown): SiteSettings {
  if (!isRecord(row)) return DEFAULT_SETTINGS;
  const merged = { ...DEFAULT_SETTINGS } as Record<string, unknown>;

  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    const value = row[key];
    if (value === null || value === undefined) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    merged[key] = value;
  }

  // Normalise the JSON columns which may arrive as strings.
  for (const key of ['hero_media_urls', 'business_hours'] as const) {
    const value = merged[key];
    if (typeof value === 'string') {
      try {
        merged[key] = JSON.parse(value);
      } catch {
        merged[key] = DEFAULT_SETTINGS[key];
      }
    }
    if (!Array.isArray(merged[key])) merged[key] = DEFAULT_SETTINGS[key];
  }

  return merged as unknown as SiteSettings;
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = publicSupabase();
  if (!supabase) return DEFAULT_SETTINGS;
  try {
    const { data } = await supabase.from('site_settings').select('*').eq('id', true).maybeSingle();
    return mergeSettings(data);
  } catch {
    return DEFAULT_SETTINGS;
  }
});

/* ------------------------------------------------------------- services -- */

const fallbackServices: Service[] = DEFAULT_SERVICES.map((s, i) => ({
  id: `default-${i}`,
  cover_image: '',
  ...s,
}));

export const getServices = cache(async (): Promise<Service[]> => {
  const supabase = publicSupabase();
  if (!supabase) return fallbackServices;
  try {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    return data && data.length ? (data as unknown as Service[]) : fallbackServices;
  } catch {
    return fallbackServices;
  }
});

export const getServiceBySlug = cache(async (slug: string): Promise<Service | null> => {
  const services = await getServices();
  return services.find((s) => s.slug === slug) ?? null;
});

/* ------------------------------------------------------------ work posts -- */

export const getWorkPosts = cache(async (limit?: number): Promise<WorkPost[]> => {
  const supabase = publicSupabase();
  if (!supabase) return [];
  try {
    let query = supabase
      .from('work_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return (data as unknown as WorkPost[]) ?? [];
  } catch {
    return [];
  }
});

export const getWorkPostBySlug = cache(async (slug: string): Promise<WorkPost | null> => {
  const supabase = publicSupabase();
  if (!supabase) return null;
  try {
    const { data } = await supabase
      .from('work_posts')
      .select('*, work_media(*)')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();
    if (!data) return null;
    const post = data as unknown as WorkPost;
    post.work_media = (post.work_media ?? []).sort((a, b) => a.sort_order - b.sort_order);
    return post;
  } catch {
    return null;
  }
});

/* ------------------------------------------------------------- galleries -- */

export const getGalleries = cache(async (): Promise<Gallery[]> => {
  const supabase = publicSupabase();
  if (!supabase) return [];
  try {
    const { data } = await supabase
      .from('galleries')
      .select('*, gallery_images(*)')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    return ((data as unknown as Gallery[]) ?? []).map((g) => ({
      ...g,
      gallery_images: (g.gallery_images ?? []).sort((a, b) => a.sort_order - b.sort_order),
    }));
  } catch {
    return [];
  }
});

export const getGalleryBySlug = cache(async (slug: string): Promise<Gallery | null> => {
  const galleries = await getGalleries();
  return galleries.find((g) => g.slug === slug) ?? null;
});

/* ---------------------------------------------------------------- videos -- */

export const getVideos = cache(async (limit?: number): Promise<VideoItem[]> => {
  const supabase = publicSupabase();
  if (!supabase) return [];
  try {
    let query = supabase
      .from('videos')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return (data as unknown as VideoItem[]) ?? [];
  } catch {
    return [];
  }
});

export const getVideoBySlug = cache(async (slug: string): Promise<VideoItem | null> => {
  const supabase = publicSupabase();
  if (!supabase) return null;
  try {
    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();
    return (data as unknown as VideoItem) ?? null;
  } catch {
    return null;
  }
});

export const getFeaturedVideo = cache(async (): Promise<VideoItem | null> => {
  const videos = await getVideos();
  return videos.find((v) => v.is_featured) ?? videos[0] ?? null;
});

/* ---------------------------------------------------------- testimonials -- */

export const getTestimonials = cache(async (limit?: number): Promise<Testimonial[]> => {
  const supabase = publicSupabase();
  if (!supabase) return [];
  try {
    let query = supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return (data as unknown as Testimonial[]) ?? [];
  } catch {
    return [];
  }
});

/* ------------------------------------------------------------------ blog -- */

export const getBlogPosts = cache(async (limit?: number): Promise<BlogPost[]> => {
  const supabase = publicSupabase();
  if (!supabase) return [];
  try {
    let query = supabase
      .from('blog_posts')
      .select('*, blog_categories(*)')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return (data as unknown as BlogPost[]) ?? [];
  } catch {
    return [];
  }
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const supabase = publicSupabase();
  if (!supabase) return null;
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('*, blog_categories(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (!data) return null;
    const post = data as unknown as BlogPost;
    if (post.published_at && new Date(post.published_at) > new Date()) return null;
    return post;
  } catch {
    return null;
  }
});

export const getRelatedBlogPosts = cache(
  async (post: BlogPost, limit = 3): Promise<BlogPost[]> => {
    const posts = await getBlogPosts();
    const others = posts.filter((p) => p.id !== post.id);
    const sameCategory = others.filter(
      (p) => post.category_id && p.category_id === post.category_id
    );
    const sharedTag = others.filter(
      (p) => !sameCategory.includes(p) && p.tags?.some((t) => post.tags?.includes(t))
    );
    return [...sameCategory, ...sharedTag, ...others]
      .filter((p, i, arr) => arr.indexOf(p) === i)
      .slice(0, limit);
  }
);

export const getBlogCategories = cache(async (): Promise<BlogCategory[]> => {
  const supabase = publicSupabase();
  if (!supabase) return [];
  try {
    const { data } = await supabase.from('blog_categories').select('*').order('name');
    return (data as unknown as BlogCategory[]) ?? [];
  } catch {
    return [];
  }
});
