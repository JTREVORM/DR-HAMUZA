import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { requireAdmin } from '@/lib/admin-auth';
import { createServerSupabase } from '@/lib/supabase/server';
import { getSettings } from '@/lib/queries';

// The dashboard is always rendered per-request against the signed-in session.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, email } = await requireAdmin();
  const settings = await getSettings();

  const supabase = await createServerSupabase();
  const { count } = supabase
    ? await supabase
        .from('inquiries')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'new')
    : { count: 0 };

  return (
    <div className="min-h-screen bg-cream-100">
      <AdminSidebar
        name={profile.full_name || 'Administrator'}
        email={profile.email || email}
        logoUrl={settings.logo_url}
        unread={count ?? 0}
      />
      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
