import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '@/lib/env';

let cached: ReturnType<typeof createClient> | null = null;

/**
 * Session-less client for public page data.
 *
 * Deliberately does NOT read cookies: a page that reads cookies is forced to
 * render per request, which would rule out static generation and ISR for the
 * whole public website. With no session attached, this client sees exactly
 * what an anonymous visitor may see under Row Level Security — published rows
 * and nothing else.
 */
export function publicSupabase() {
  if (!isSupabaseConfigured) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { headers: { 'x-application-name': 'dr-salongo-hamuza-site' } },
    });
  }
  return cached;
}
