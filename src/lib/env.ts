/**
 * Central place for the environment values the app needs.
 *
 * The site is designed to build and render even when Supabase has not been
 * connected yet (for example the very first Vercel deploy). Everything that
 * touches the database checks `isSupabaseConfigured` first and falls back to
 * the bundled default content instead of throwing.
 */

function normaliseHttpUrl(value: string | undefined, fallback = '') {
  const raw = (value ?? '').trim().replace(/^['"]|['"]$/g, '');
  if (!raw) return fallback;

  try {
    const url = new URL(raw);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return fallback;
    return url.toString().replace(/\/$/, '');
  } catch {
    return fallback;
  }
}

export const SUPABASE_URL = normaliseHttpUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

export const isSupabaseConfigured =
  Boolean(SUPABASE_URL) && SUPABASE_ANON_KEY.length > 20;

/**
 * The one canonical host. Every canonical tag, Open Graph URL, sitemap entry
 * and piece of structured data is built from it.
 *
 * It is deliberately not derived from Vercel's deployment URL: that would point
 * canonicals at a preview or *.vercel.app host and invite Google to index a
 * duplicate of the site. An invalid NEXT_PUBLIC_SITE_URL must never break a
 * production build, so it is validated and falls back to the canonical domain.
 */
export const PRODUCTION_URL = 'https://dr-salongohamuza.com';

const fallbackSiteUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : PRODUCTION_URL;

export const SITE_URL = normaliseHttpUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  fallbackSiteUrl
);

/** The bare host, used for the www -> apex redirect and for display. */
export const SITE_HOST = PRODUCTION_URL.replace(/^https?:\/\//, '');

export const STORAGE_BUCKET = 'media';
