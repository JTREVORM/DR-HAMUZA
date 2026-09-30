'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, MessageCircle, Phone, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { NAV_ITEMS } from '@/components/layout/nav-items';
import { cn, telHref, whatsappHref } from '@/lib/utils';
import type { SiteSettings } from '@/lib/types';

export function Header({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const wa = whatsappHref(settings.whatsapp || settings.phone, settings.whatsapp_message);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-gold-400 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-forest-950"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[100] transition-all duration-500',
          scrolled
            ? 'border-b border-gold-500/20 bg-forest-950/92 shadow-deep backdrop-blur-xl'
            : 'bg-gradient-to-b from-forest-950/85 via-forest-950/45 to-transparent'
        )}
      >
        <div className="container flex items-center justify-between gap-4 py-3 lg:py-3.5">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label={`${settings.site_name} — home`}
          >
            <Logo
              src={settings.logo_url}
              alt={`${settings.site_name} logo`}
              size={scrolled ? 46 : 56}
              priority
              className="transition-all duration-500 drop-shadow-[0_4px_16px_rgba(228,179,44,0.28)]"
            />
            <span className="hidden min-w-0 flex-col leading-none sm:flex">
              <span className="truncate font-display text-[1.05rem] tracking-wide text-cream-100 transition group-hover:text-gold-200 lg:text-[1.15rem]">
                {settings.site_name}
              </span>
              <span className="mt-1 truncate text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-gold-400">
                {settings.tagline}
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-0.5 xl:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'relative rounded-full px-3 py-2 text-[0.82rem] font-medium tracking-wide transition-colors',
                  isActive(item.href)
                    ? 'text-gold-300'
                    : 'text-cream-100/80 hover:text-gold-200'
                )}
              >
                {item.label}
                {isActive(item.href) ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-gold-sheen"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={telHref(settings.phone)}
              className="hidden items-center gap-2 rounded-full border border-gold-400/50 px-4 py-2.5 text-[0.8rem] font-semibold text-gold-200 transition hover:bg-gold-400/12 md:inline-flex"
            >
              <Phone className="h-4 w-4" aria-hidden />
              <span>{settings.phone}</span>
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-[#1FA855] px-4 py-2.5 text-[0.8rem] font-semibold text-white transition hover:bg-[#199348] sm:inline-flex"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/45 text-gold-200 transition hover:bg-gold-400/12 xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div aria-hidden className="pattern-frieze h-2 opacity-40" />
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[110] xl:hidden"
          >
            <div
              className="absolute inset-0 bg-forest-950/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              aria-label="Mobile navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 34 }}
              className="pattern-diamond absolute right-0 top-0 flex h-full w-[min(22rem,90vw)] flex-col overflow-y-auto border-l border-gold-500/25 bg-forest-950"
            >
              <div className="flex items-center justify-between border-b border-gold-500/15 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Logo src={settings.logo_url} alt="" size={42} />
                  <span className="font-display text-base text-cream-100">
                    {settings.site_name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 text-gold-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ul className="flex-1 px-4 py-5">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.035 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between border-b border-gold-500/10 px-2 py-3.5 font-display text-lg transition',
                        isActive(item.href)
                          ? 'text-gold-300'
                          : 'text-cream-100/85 hover:text-gold-200'
                      )}
                    >
                      {item.label}
                      <span aria-hidden className="text-gold-500/50">
                        &rsaquo;
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="space-y-2.5 border-t border-gold-500/15 p-5">
                <a href={telHref(settings.phone)} className="btn-gold w-full">
                  <Phone className="h-4 w-4" aria-hidden />
                  Call {settings.phone}
                </a>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WhatsApp Now
                </a>
              </div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
