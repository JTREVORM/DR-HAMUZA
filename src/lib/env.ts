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

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : '') ||
  'http://localhost:3000'
).replace(/\/$/, '');

export const STORAGE_BUCKET = 'media';
