import Link from 'next/link';
import { HeartHandshake, Lock, Phone, Users } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Counter } from '@/components/ui/Counter';
import type { SiteSettings } from '@/lib/types';
import { contactPhones, telHref } from '@/lib/utils';

/**
 * Introduction strip beneath the hero. Statistics only appear when the admin
 * has actually entered them — nothing is invented here.
 */
export function TrustStrip({ settings }: { settings: SiteSettings }) {
  const stats = [
    settings.years_experience && {
      icon: HeartHandshake,
      value: settings.years_experience,
      label: 'Years in traditional practice',
    },
    settings.clients_served && {
      icon: Users,
      value: settings.clients_served,
      label: 'People received in consultation',
    },
    settings.languages_spoken && {
      icon: Users,
      value: settings.languages_spoken,
      label: 'Languages spoken',
    },
  ].filter(Boolean) as { icon: typeof Users; value: string; label: string }[];

  return (
    <section className="relative border-b border-earth-200/70 bg-cream-100 py-14 lg:py-16">
      <div aria-hidden className="pattern-weave absolute inset-0 opacity-70" />

      <div className="container relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">
              <span aria-hidden className="h-px w-8 bg-gold-500/70" />
              Welcome
            </p>
            <h2 className="heading-md mt-4 text-forest-900">
              A traditional healer from Uganda, receiving people with the
              difficulties of ordinary life
            </h2>
            <p className="mt-5 max-w-2xl text-[1.0rem] leading-[1.9] text-forest-800/80">
              {settings.short_description}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="rounded-2xl border border-gold-300/50 bg-gradient-to-br from-forest-900 to-forest-950 p-7 shadow-deep">
              <p className="text-[0.70rem] font-semibold uppercase tracking-[0.24em] text-gold-400">
                Speak to Dr Salongo Hamuza
              </p>
              <div className="mt-4 flex flex-col">
                {contactPhones(settings).map((number) => (
                  <a
                    key={number}
                    href={telHref(number)}
                    aria-label={`Call ${number}`}
                    className="py-0.5 font-display text-2xl tracking-wide text-cream-100 transition hover:text-gold-300 sm:text-3xl"
                  >
                    {number}
                  </a>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-2 text-[0.84rem] text-cream-200/70">
                <Lock className="h-4 w-4 text-gold-400" aria-hidden />
                Every enquiry is treated in confidence
              </p>
              <Link href="/contact" className="btn-gold mt-6 w-full">
                <Phone className="h-4 w-4" aria-hidden />
                {settings.consultation_cta}
              </Link>
            </div>
          </Reveal>
        </div>

        {stats.length ? (
          <div className="mt-12 grid gap-4 border-t border-earth-200 pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 0.08}
                className="flex items-center gap-4 rounded-xl border border-earth-200/80 bg-cream-50 px-5 py-5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700">
                  <stat.icon className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <Counter
                    value={stat.value}
                    className="block font-display text-2xl text-forest-900"
                  />
                  <span className="mt-0.5 block text-[0.78rem] text-forest-800/65">
                    {stat.label}
                  </span>
                </span>
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
