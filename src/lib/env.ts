/**
 * Central place for the environment values the app needs.
 *
 * The site is designed to build and render even when Supabase has not been
 * connected yet (for example the very first Vercel deploy). Everything that
 * touches the database checks `isSupabaseConfigured` first and falls back to
 * the bundled default content instead of throwing.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured =
  SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY.length > 20;

/**
 * The one canonical host. Every canonical tag, Open Graph URL, sitemap entry
 * and piece of structured data is built from it.
 *
 * It is deliberately not derived from Vercel's deployment URL: that would point
 * canonicals at a preview or *.vercel.app host and invite Google to index a
 * duplicate of the site. `NEXT_PUBLIC_SITE_URL` still overrides it — set it to
 * the preview URL if you ever need a preview to be self-consistent — and local
 * development falls back to localhost.
 */
export const PRODUCTION_URL = 'https://dr-salongohamuza.com';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : PRODUCTION_URL)
).replace(/\/$/, '');

/** The bare host, used for the www -> apex redirect and for display. */
export const SITE_HOST = PRODUCTION_URL.replace(/^https?:\/\//, '');

export const STORAGE_BUCKET = 'media';
