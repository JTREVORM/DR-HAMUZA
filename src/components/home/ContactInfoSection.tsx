import Link from 'next/link';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { contactPhones, formatPhone, telHref, whatsappHref } from '@/lib/utils';
import type { SiteSettings } from '@/lib/types';

export function ContactInfoSection({ settings }: { settings: SiteSettings }) {
  const wa = whatsappHref(settings.whatsapp || settings.phone, settings.whatsapp_message);

  const cards = [
    ...contactPhones(settings).map((number, index) => ({
      icon: Phone,
      label: index === 0 ? 'Telephone' : 'Second line',
      value: number,
      href: telHref(number),
      note: index === 0 ? 'Call to describe your situation' : 'An alternative number to call',
      external: false,
    })),
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: formatPhone(settings.whatsapp || settings.phone),
      href: wa,
      note: 'Send a private message any time',
      external: true,
    },
    settings.email
      ? {
          icon: Mail,
          label: 'Email',
          value: settings.email,
          href: `mailto:${settings.email}`,
          note: 'Written enquiries welcome',
          external: false,
        }
      : null,
    settings.location
      ? {
          icon: MapPin,
          label: 'Service area',
          value: settings.location,
          href: '',
          note: 'Visitors received by arrangement',
          external: false,
        }
      : null,
  ].filter(Boolean) as {
    icon: typeof Phone;
    label: string;
    value: string;
    href: string;
    note: string;
    external: boolean;
  }[];

  return (
    <section className="relative bg-cream-50 py-20 lg:py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Contact"
          title="Contact Information"
          intro="Dr Salongo Hamuza can be reached directly by telephone or WhatsApp. Every enquiry is treated privately."
        />

        <div className="mx-auto mt-14 flex max-w-5xl flex-wrap justify-center gap-5">
          {cards.map((card, i) => {
            const inner = (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-300 bg-gold-50 text-gold-700 transition-colors duration-500 group-hover:bg-gold-400 group-hover:text-forest-950">
                  <card.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="mt-5 block text-[0.70rem] font-semibold uppercase tracking-[0.22em] text-forest-800/50">
                  {card.label}
                </span>
                <span className="mt-2 block break-words font-display text-[1.15rem] text-forest-900">
                  {card.value}
                </span>
                <span className="mt-2 block text-[0.82rem] text-forest-800/65">{card.note}</span>
              </>
            );

            return (
              <Reveal
                key={card.label}
                delay={i * 0.07}
                className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)]"
              >
                {card.href ? (
                  <a
                    href={card.href}
                    {...(card.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="card-premium group block h-full p-7"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="card-premium group h-full p-7">{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>

        {settings.business_hours.length ? (
          <Reveal delay={0.1} className="mx-auto mt-8 max-w-2xl">
            <div className="rounded-2xl border border-earth-200 bg-cream-100 p-7">
              <p className="flex items-center gap-2 font-display text-base text-forest-900">
                <Clock className="h-4 w-4 text-gold-600" aria-hidden />
                Consultation Hours
              </p>
              <ul className="mt-4 divide-y divide-earth-200/80 text-[0.88rem]">
                {settings.business_hours.map((hour) => (
                  <li key={hour.day} className="flex justify-between gap-6 py-2.5">
                    <span className="text-forest-900">{hour.day}</span>
                    <span className="text-forest-800/65">{hour.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ) : null}

        <Reveal delay={0.15} className="mt-10 text-center">
          <Link href="/contact" className="btn-gold">
            {settings.consultation_cta}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
