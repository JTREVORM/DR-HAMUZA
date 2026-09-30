'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Phone, PlayCircle, ShieldCheck } from 'lucide-react';
import type { SiteSettings, VideoItem } from '@/lib/types';
import { HERO_LOOP_POSTER, heroClipFor } from '@/content/videos';
import { prefersStillHero } from '@/lib/video-playback';
import { telHref, videoThumbnail, whatsappHref } from '@/lib/utils';

/**
 * The first screen: the client's own footage running silently behind his name.
 *
 * The footage is filmed on a phone, so it is 9:16. That shape is handled
 * differently at each width rather than being cropped to fit:
 *
 *  - On a phone the video is full bleed, because the viewport is the same shape
 *    as the video and nothing is lost.
 *  - On a desktop, cropping a 9:16 clip to a wide screen would zoom in until
 *    only a torso was left. So the poster becomes a blurred, darkened backdrop
 *    and the video itself plays in a tall framed panel at its true shape.
 *
 * Only ever one <video> element is mounted. It is attached after mount, and
 * only when the visitor has not asked for reduced motion and the browser has
 * not flagged a metered connection — otherwise the graded poster is the hero,
 * and it is meant to look that way.
 */
export function VideoHero({
  settings,
  video,
}: {
  settings: SiteSettings;
  video: VideoItem | null;
}) {
  const [showVideo, setShowVideo] = useState(false);
  const [wide, setWide] = useState<boolean | null>(null);
  const ref = useRef<HTMLVideoElement>(null);

  const wa = whatsappHref(settings.whatsapp || settings.phone, settings.whatsapp_message);

  // An admin-chosen hero video wins; otherwise the short silent loop cut from
  // the ceremony footage, which is a fraction of the size.
  const adminHero = video?.is_hero && video.video_url ? video : null;
  const src = settings.hero_media_url || heroClipFor(adminHero);
  const poster =
    settings.hero_poster_url || (adminHero ? videoThumbnail(adminHero) : '') || HERO_LOOP_POSTER;

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener('change', sync);
    if (!prefersStillHero()) setShowVideo(true);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!showVideo) return;
    const el = ref.current;
    if (!el) return;
    // Autoplay can still be refused (iOS low power mode, strict settings). If it
    // is, fall back to the poster rather than leaving a frozen first frame.
    el.play().catch(() => setShowVideo(false));
  }, [showVideo, wide]);

  const loop = (className: string) => (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      tabIndex={-1}
      aria-hidden
    >
      <source src={src} type="video/mp4" />
    </video>
  );

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-forest-950 pt-28 pb-20 lg:pt-32">
      {/* --------------------------------------------------------- backdrop */}
      <div aria-hidden className="absolute inset-0 -z-20">
        <Image
          src={poster}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover object-center blur-[4px] saturate-[0.95] lg:blur-[9px]"
        />
        {/* Below lg the clip fills the screen; above it, the panel carries it. */}
        {showVideo && wide === false
          ? loop('absolute inset-0 h-full w-full object-cover object-center')
          : null}
      </div>

      {/* Cinematic scrim. Deliberately heavy: the footage is bright daylight and
          the headline has to win.                                            */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-forest-950/55 lg:bg-forest-950/50" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-950/95 via-forest-950/55 to-forest-950/85"
      />
      {/* A softer column of shade under the headline itself, so the type stays
          readable without flattening the whole frame to black. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/90 via-forest-950/45 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_40%_45%,transparent_0%,rgba(4,21,14,0.35)_65%,rgba(4,21,14,0.85)_100%)]"
      />
      <div aria-hidden className="pattern-diamond absolute inset-0 -z-10 opacity-35" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-forest-950 via-forest-950/80 to-transparent"
      />

      {/* ---------------------------------------------------------- content */}
      <div className="container relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-gold-400/35 bg-forest-950/60 px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-gold-300 backdrop-blur sm:text-[0.7rem]"
            >
              <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold-400" />
              {settings.tagline} &middot; {settings.location || 'Uganda'}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08 }}
              className="mt-7 font-display text-[2.5rem] uppercase leading-[0.98] tracking-tight text-cream-50 text-shadow-deep sm:text-6xl lg:text-[4.2rem]"
            >
              {settings.site_name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18 }}
              className="mt-5 font-serif text-lg italic text-gold-200 text-shadow-deep sm:text-xl"
            >
              Professional Traditional Healer from Uganda
            </motion.p>

            <motion.span
              aria-hidden
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.28 }}
              className="mt-7 block h-[3px] w-28 origin-left rounded-full bg-gold-sheen"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-7 text-[1.05rem] uppercase tracking-[0.16em] text-cream-100/90 text-shadow-deep"
            >
              Traditional &amp; Spiritual Consultation
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <Link href="/contact" className="btn-gold">
                Request Consultation
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp Now
              </a>
              <a href="#our-work" className="btn-outline-gold">
                <PlayCircle className="h-4 w-4" aria-hidden />
                Watch Our Work
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.55 }}
              className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-4"
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
                  <span className="text-[0.68rem] uppercase tracking-[0.22em] text-gold-400/80">
                    Phone
                  </span>
                  <span className="font-display text-xl tracking-wide text-cream-100">
                    {settings.phone}
                  </span>
                </span>
              </a>

              <span className="flex items-center gap-2.5 text-[0.8rem] text-cream-200/70">
                <ShieldCheck className="h-4 w-4 text-gold-400" aria-hidden />
                Private &amp; confidential consultation
              </span>
            </motion.div>
          </div>

          {/* ----------------------- the footage itself, at its true shape --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto hidden w-full max-w-[19rem] lg:col-span-5 lg:block"
          >
            <span
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[3rem] bg-gold-400/12 blur-3xl"
            />
            <div className="relative aspect-[9/16] overflow-hidden rounded-[1.75rem] border border-gold-400/40 bg-forest-950 shadow-deep ring-1 ring-inset ring-gold-200/10">
              <Image
                src={poster}
                alt=""
                fill
                priority
                sizes="19rem"
                className="object-cover object-center"
              />
              {showVideo && wide
                ? loop('absolute inset-0 h-full w-full object-cover object-center')
                : null}
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-forest-950/55 via-transparent to-transparent"
              />
            </div>

            <p className="mt-5 text-center text-[0.68rem] uppercase tracking-[0.24em] text-gold-400/70">
              Filmed during traditional work
            </p>
          </motion.div>
        </div>
      </div>

      <div aria-hidden className="pattern-frieze absolute inset-x-0 bottom-0 h-4 opacity-45" />
    </section>
  );
}
