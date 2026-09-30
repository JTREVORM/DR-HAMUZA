import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { LEGAL_ITEMS, NAV_ITEMS } from '@/components/layout/nav-items';
import { getBlogPosts, getServices, getSettings } from '@/lib/queries';
import { telHref, whatsappHref } from '@/lib/utils';

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.5 3a5.6 5.6 0 0 0 4.3 4.2v2.8a8.3 8.3 0 0 1-4.3-1.4v6.6a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v2.9a3 3 0 1 0 2.1 2.9V3h2.9Z" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.1-5.7 6.1H1.6l7.5-8.6L1.2 3h6.6l4.5 5.6L17.5 3Zm-1.1 16.1h1.8L7.7 4.8H5.8l10.6 14.3Z" />
    </svg>
  );
}

export async function Footer() {
  const [settings, services, posts] = await Promise.all([
    getSettings(),
    getServices(),
    getBlogPosts(3),
  ]);

  const year = new Date().getFullYear();
  const wa = whatsappHref(settings.whatsapp || settings.phone, settings.whatsapp_message);

  const socials = [
    { href: settings.facebook_url, label: 'Facebook', Icon: Facebook },
    { href: settings.instagram_url, label: 'Instagram', Icon: Instagram },
    { href: settings.youtube_url, label: 'YouTube', Icon: Youtube },
    { href: settings.tiktok_url, label: 'TikTok', Icon: TikTokIcon },
    { href: settings.twitter_url, label: 'X', Icon: XIcon },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="relative overflow-hidden bg-forest-950 text-cream-200/80">
      <div aria-hidden className="pattern-frieze h-3 w-full rotate-180 opacity-50" />
      <div aria-hidden className="pattern-diamond pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold-500/5 blur-3xl"
      />

      <div className="container relative z-10 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3.5">
              <Logo src={settings.logo_url} alt={`${settings.site_name} logo`} size={72} />
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl text-cream-100">{settings.site_name}</span>
                <span className="mt-1.5 text-[0.70rem] font-semibold uppercase tracking-[0.24em] text-gold-400">
                  {settings.tagline}
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-[1.85]">{settings.footer_text}</p>

            {socials.length ? (
              <div className="mt-7 flex flex-wrap gap-2.5">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${settings.site_name} on ${label}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/25 text-gold-300 transition hover:-translate-y-0.5 hover:border-gold-400 hover:bg-gold-400/12"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation" className="lg:col-span-2">
            <h2 className="mb-5 font-display text-base text-gold-300">Explore</h2>
            <ul className="space-y-1 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1.5 transition hover:text-gold-200 hover:underline hover:underline-offset-4"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Consultation areas" className="lg:col-span-3">
            <h2 className="mb-5 font-display text-base text-gold-300">Consultation Areas</h2>
            <ul className="space-y-1 text-sm">
              {services.slice(0, 8).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-block py-1.5 transition hover:text-gold-200 hover:underline hover:underline-offset-4"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="inline-block py-1.5 font-medium text-gold-300 hover:text-gold-200">
                  View all services &rarr;
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="mb-5 font-display text-base text-gold-300">Get in Touch</h2>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a
                  href={telHref(settings.phone)}
                  className="flex items-start gap-3 py-1.5 transition hover:text-gold-200"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                  <span className="font-semibold tracking-wide">{settings.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 py-1.5 transition hover:text-gold-200"
                >
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                  <span>WhatsApp Dr Salongo Hamuza</span>
                </a>
              </li>
              {settings.email ? (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-start gap-3 break-all py-1.5 transition hover:text-gold-200"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                    <span>{settings.email}</span>
                  </a>
                </li>
              ) : null}
              {settings.location ? (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                  <span>{settings.location}</span>
                </li>
              ) : null}
            </ul>

            {settings.business_hours.length ? (
              <div className="mt-7">
                <h3 className="mb-3 text-[0.70rem] font-semibold uppercase tracking-[0.22em] text-gold-400">
                  Consultation Hours
                </h3>
                <ul className="space-y-1.5 text-[0.82rem]">
                  {settings.business_hours.map((hour) => (
                    <li key={hour.day} className="flex justify-between gap-4">
                      <span>{hour.day}</span>
                      <span className="text-cream-200/60">{hour.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {posts.length ? (
              <div className="mt-7">
                <h3 className="mb-3 text-[0.70rem] font-semibold uppercase tracking-[0.22em] text-gold-400">
                  Latest Insights
                </h3>
                <ul className="space-y-2.5 text-[0.82rem]">
                  {posts.map((post) => (
                    <li key={post.id}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-block py-1 transition hover:text-gold-200"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-14 rounded-2xl border border-gold-500/20 bg-forest-900/50 p-6 sm:p-7">
          <h2 className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-gold-400">
            Important Notice
          </h2>
          <p className="text-[0.84rem] leading-[1.9] text-cream-200/70">
            {settings.health_disclaimer}
          </p>
          {settings.general_disclaimer ? (
            <p className="mt-3.5 text-[0.84rem] leading-[1.9] text-cream-200/70">
              {settings.general_disclaimer}
            </p>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-gold-500/15 pt-7 text-[0.8rem] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-cream-200/55">
            &copy; {year} {settings.site_name}. All Rights Reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-block py-1.5 transition hover:text-gold-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
