import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Logo } from '@/components/ui/Logo';
import { contactPhones, telHref, whatsappHref } from '@/lib/utils';
import type { SiteSettings } from '@/lib/types';

/**
 * The closing call to action. A still from Dr Salongo Hamuza's own footage sits
 * behind it, heavily darkened — it should read as atmosphere, not as a picture
 * competing with the phone number.
 */
export function ConsultationCTA({
  settings,
  backgroundImage,
}: {
  settings: SiteSettings;
  backgroundImage?: string;
}) {
  const wa = whatsappHref(settings.whatsapp || settings.phone, settings.whatsapp_message);

  return (
    <section className="relative isolate overflow-hidden bg-forest-900 py-20 lg:py-28">
      {backgroundImage ? (
        <div aria-hidden className="absolute inset-0 -z-10">
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <span className="absolute inset-0 bg-forest-950/88" />
          <span className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-950/70 to-forest-950" />
        </div>
      ) : null}

      <div aria-hidden className="pattern-diamond absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-[120px]"
      />

      <div className="container relative z-10">
        <Reveal className="mx-auto max-w-4xl rounded-3xl border border-gold-500/30 bg-forest-950/60 p-8 text-center shadow-deep backdrop-blur-sm sm:p-14">
          <Logo
            src={settings.logo_url}
            alt=""
            size={80}
            className="mx-auto drop-shadow-[0_8px_28px_rgba(228,179,44,0.28)]"
          />
          <h2 className="heading-lg mt-7 text-cream-100">
            Speak With Dr Salongo Hamuza
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[1.0rem] leading-[1.9] text-cream-200/75">
            You do not need to prepare anything or fill in any form. A telephone call or a
            WhatsApp message describing your situation in your own words is enough to begin,
            and you can decide afterwards whether you wish to come.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {contactPhones(settings).map((number) => (
              <a key={number} href={telHref(number)} className="btn-gold">
                <Phone className="h-4 w-4" aria-hidden />
                Call {number}
              </a>
            ))}
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp Now
            </a>
            <Link href="/contact" className="btn-outline-gold">
              {settings.consultation_cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <p className="mt-7 text-[0.8rem] text-cream-200/50">
            Consultations are private. Nothing you share is published without your permission.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
