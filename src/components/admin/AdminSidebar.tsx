'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  BookOpen,
  Images,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  Search,
  Settings,
  Sparkles,
  UserCircle,
  Video,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface Item {
  label: string;
  href: string;
  Icon: LucideIcon;
}

const ITEMS: Item[] = [
  { label: 'Dashboard', href: '/admin', Icon: LayoutDashboard },
  { label: 'Our Work', href: '/admin/work', Icon: Images },
  { label: 'Gallery', href: '/admin/gallery', Icon: LibraryBig },
  { label: 'Videos', href: '/admin/videos', Icon: Video },
  { label: 'Services', href: '/admin/services', Icon: Sparkles },
  { label: 'Testimonials', href: '/admin/testimonials', Icon: MessageSquareQuote },
  { label: 'Blog', href: '/admin/blog', Icon: BookOpen },
  { label: 'Messages', href: '/admin/messages', Icon: Mail },
  { label: 'Media Library', href: '/admin/media', Icon: LibraryBig },
  { label: 'SEO', href: '/admin/seo', Icon: Search },
  { label: 'Site Settings', href: '/admin/settings', Icon: Settings },
  { label: 'Profile', href: '/admin/profile', Icon: UserCircle },
];

export function AdminSidebar({
  name,
  email,
  logoUrl,
  unread,
}: {
  name: string;
  email: string;
  logoUrl?: string;
  unread: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  async function signOut() {
    setSigningOut(true);
    try {
      await createClient().auth.signOut();
    } finally {
      router.replace('/admin/login');
      router.refresh();
    }
  }

  const nav = (
    <nav className="flex h-full flex-col">
      <Link
        href="/admin"
        className="flex items-center gap-3 border-b border-gold-500/15 px-5 py-4"
      >
        <Logo src={logoUrl} alt="" size={40} />
        <span className="flex min-w-0 flex-col leading-none">
          <span className="truncate font-display text-[0.95rem] text-cream-100">
            Dr Salongo Hamuza
          </span>
          <span className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-gold-400">
            Admin dashboard
          </span>
        </span>
      </Link>

      <ul className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {ITEMS.map(({ label, href, Icon }) => (
          <li key={href}>
            <Link
              href={href}
              onClick={() => setOpen(false)}
              aria-current={isActive(href) ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[0.86rem] transition',
                isActive(href)
                  ? 'bg-gold-400/15 font-semibold text-gold-200'
                  : 'text-cream-200/70 hover:bg-forest-800/70 hover:text-cream-100'
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
              <span className="flex-1">{label}</span>
              {href === '/admin/messages' && unread > 0 ? (
                <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[0.65rem] font-bold text-forest-950">
                  {unread}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>

      <div className="border-t border-gold-500/15 p-3">
        <div className="mb-2 px-3.5 py-2">
          <p className="truncate text-[0.82rem] font-medium text-cream-100">{name}</p>
          <p className="truncate text-[0.7rem] text-cream-200/50">{email}</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[0.82rem] text-cream-200/70 transition hover:bg-forest-800/70 hover:text-cream-100"
        >
          <Sparkles className="h-[18px] w-[18px]" aria-hidden />
          View website
        </Link>
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-[0.82rem] text-red-300/80 transition hover:bg-red-500/10 hover:text-red-200 disabled:opacity-60"
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden />
          {signingOut ? 'Signing out…' : 'Logout'}
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-earth-200 bg-white px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Logo src={logoUrl} alt="" size={34} />
          <span className="font-display text-[0.95rem] text-forest-900">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open dashboard menu"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-earth-200 text-forest-800"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-forest-950 lg:block">
        {nav}
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-forest-950/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(17rem,85vw)] bg-forest-950">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close dashboard menu"
              className="absolute right-3 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-lg text-gold-300"
            >
              <X className="h-5 w-5" />
            </button>
            {nav}
          </div>
        </div>
      ) : null}
    </>
  );
}
