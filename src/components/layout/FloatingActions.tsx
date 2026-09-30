'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, CalendarCheck, MessageCircle, Phone } from 'lucide-react';
import { telHref, whatsappHref } from '@/lib/utils';
import type { SiteSettings } from '@/lib/types';

/**
 * Floating WhatsApp button, scroll-to-top control, and — on phones — a sticky
 * contact bar, since most visitors arrive on a mobile device.
 */
export function FloatingActions({ settings }: { settings: SiteSettings }) {
  const [showTop, setShowTop] = useState(false);
  const wa = whatsappHref(settings.whatsapp || settings.phone, settings.whatsapp_message);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed bottom-24 right-4 z-[95] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {showTop ? (
            <motion.button
              key="top"
              type="button"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll back to top"
              className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/50 bg-forest-900/90 text-gold-300 shadow-deep backdrop-blur transition hover:bg-forest-800"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          ) : null}
        </AnimatePresence>

        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Dr Salongo Hamuza on WhatsApp"
          className="pointer-events-auto flex h-14 w-14 animate-pulse-ring items-center justify-center rounded-full bg-[#1FA855] text-white shadow-[0_12px_32px_-10px_rgba(31,168,85,0.9)] transition hover:scale-105 hover:bg-[#199348]"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>

      {/* Sticky mobile contact bar */}
      <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-gold-500/25 bg-forest-950/95 px-3 py-2.5 backdrop-blur-lg sm:hidden">
        <div className="grid grid-cols-3 gap-2">
          <a href={telHref(settings.phone)} className="btn-gold !px-2 text-[0.74rem]">
            <Phone className="h-4 w-4" aria-hidden />
            Call
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp !px-2 text-[0.74rem]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </a>
          <Link
            href="/contact"
            className="btn !px-2 border border-gold-400/50 text-[0.74rem] text-gold-200"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden />
            Consult
          </Link>
        </div>
      </div>
      {/* Spacer so the sticky bar never covers page content on phones */}
      <div aria-hidden className="h-[68px] sm:hidden" />
    </>
  );
}
