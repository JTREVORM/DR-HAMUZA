'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { telHref, whatsappHref } from '@/lib/utils';
import type { SiteSettings } from '@/lib/types';

/** Deterministic positions so the server and client render the same particles. */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37 + 11) % 96}%`,
  top: `${(i * 53 + 7) % 88}%`,
  size: 3 + ((i * 7) % 5),
  delay: (i % 7) * 1.1,
  duration: 8 + (i % 5) * 1.6,
}));

export function Hero({ settings }: { settings: SiteSettings }) {
  const wa = whatsappHref(settings.whatsapp || settings.phone, settings.whatsapp_message);

  const rotating = useMemo(
    () =>
      settings.hero_media_type === 'rotating'
        ? settings.hero_media_urls.filter(Boolean)
        : [],
    [settings.hero_media_type, settings.hero_media_urls]
  );
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (rotating.length < 2) return;
    const timer = setInterval(() => setSlide((s) => (s + 1) % rotating.length), 7000);
    return () => clearInterval(timer);
  }, [rotating.length]);

  const isVideo = settings.hero_media_type === 'video' && Boolean(settings.hero_media_url);
  const singleImage = settings.hero_media_type === 'image' ? settings.hero_media_url : '';

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-forest-950 pt-28 pb-16 lg:pt-32">
      {/* ---------------------------------------------------- background --- */}
      <div aria-hidden className="absolute inset-0 -z-20">
        {isVideo ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={settings.hero_poster_url || undefined}
          >
            <source src={settings.hero_media_url} />
          </video>
        ) : rotating.length ? (
          rotating.map((url, i) => (
            <Image
              key={url}
              src={url}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover transition-opacity duration-[1600ms] ${
                i === slide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))
        ) : singleImage ? (
          <Image src={singleImage} alt="" fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_30%_20%,#1A5A40_0%,#0C3323_45%,#04150E_100%)]" />
        )}
      </div>

      {/* Dark overlay keeps the headline readable over any uploaded media */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-forest-950/80 bg-gradient-to-br from-forest-950/95 via-forest-950/78 to-forest-950/92"
      />
      <div aria-hidden className="pattern-diamond absolute inset-0 -z-10 opacity-50" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-forest-950 to-transparent"
      />

      {/* Floating gold particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-gold-300/40 blur-[1px] animate-float"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* --------------------------------------------------------- content -- */}
      <div className="container relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-gold-400/35 bg-forest-900/50 px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-gold-300 backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {settings.tagline} &middot; {settings.location || 'Uganda'}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="heading-xl mt-7 text-cream-50 text-shadow-deep"
            >
              {settings.hero_title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2 }}
              className="mt-7 max-w-2xl text-[1.02rem] leading-[1.9] text-cream-200/85 sm:text-[1.08rem]"
            >
              {settings.hero_subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <Link href="/contact" className="btn-gold">
                {settings.consultation_cta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp Now
              </a>
              <Link href="/services" className="btn-outline-gold">
                View Services
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <a
                href={telHref(settings.phone)}
                className="group flex items-center gap-3.5"
                aria-label={`Call Dr Salongo Hamuza on ${settings.phone}`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/50 bg-gold-400/10 text-gold-300 transition group-hover:bg-gold-400 group-hover:text-forest-950">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[0.62rem] uppercase tracking-[0.22em] text-gold-400/80">
                    Call directly
                  </span>
                  <span className="font-display text-xl tracking-wide text-cream-100">
                    {settings.phone}
                  </span>
                </span>
              </a>

              <span className="flex items-center gap-2.5 text-[0.8rem] text-cream-200/65">
                <ShieldCheck className="h-4 w-4 text-gold-400" aria-hidden />
                Private &amp; confidential consultation
              </span>
            </motion.div>
          </div>

          {/* Crest */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto hidden w-full max-w-md lg:col-span-5 lg:block"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full bg-gold-400/12 blur-3xl"
            />
            <div className="relative aspect-square">
              <span
                aria-hidden
                className="absolute inset-3 rounded-full border border-gold-400/25"
              />
              <span
                aria-hidden
                className="absolute inset-9 rounded-full border border-gold-400/15"
              />
              <Logo
                src={settings.logo_url}
                alt={`${settings.site_name}, ${settings.tagline}`}
                size={420}
                priority
                className="!h-full !w-full drop-shadow-[0_24px_60px_rgba(4,21,14,0.85)]"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div aria-hidden className="pattern-frieze absolute inset-x-0 bottom-0 h-4 opacity-45" />
    </section>
  );
}
