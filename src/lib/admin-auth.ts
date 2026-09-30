import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';

export interface AdminProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  is_active: boolean;
}

/**
 * Server-side guard for every admin page.
 *
 * The middleware already redirects anonymous visitors, but this runs again on
 * the server for each render so authorisation is never left to the client.
 * Row Level Security in the database is the final line of defence.
 */
export async function requireAdmin(): Promise<{
  profile: AdminProfile;
  email: string;
}> {
  const supabase = await createServerSupabase();
  if (!supabase) redirect('/admin/login?error=not-configured');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, role, is_active')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || !profile.is_active || profile.role !== 'admin') {
    redirect('/admin/login?error=not-authorised');
  }

  return { profile: profile as AdminProfile, email: user.email ?? '' };
}
