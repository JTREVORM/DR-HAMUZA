import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';

import { Reveal } from '@/components/ui/Reveal';
import { Logo } from '@/components/ui/Logo';
import { PatternDivider } from '@/components/ui/PatternDivider';
import { PORTRAIT_STILL } from '@/content/videos';
import type { SiteSettings } from '@/lib/types';
import { contactPhones, digitsOnly, telHref, whatsappHref } from '@/lib/utils';

/**
 * Dr Salongo Hamuza's own statement.
 *
 * The client asked for this text to be published exactly as he supplied it, so
 * every word and every original spelling is preserved and nothing is corrected,
 * reordered or trimmed. What is done here is purely typographic: the greeting
 * is set as a display line, the body is given line length and spacing that make
 * a long run of capitals readable, and the telephone number he ends on becomes
 * tappable. Concatenate what is rendered and you get his text back, unchanged.
 */

/** Splits the statement at its first colon so the greeting can lead. */
function splitGreeting(message: string) {
  const at = message.indexOf(':');
  // Only treat it as a greeting if the colon comes early — otherwise the whole
  // statement is rendered as one block rather than being cut in a silly place.
  if (at < 0 || at > 80) return { lead: '', body: message };
  // The remainder is deliberately not trimmed. Browsers collapse leading
  // whitespace in a block, so it changes nothing on screen — but it keeps the
  // space between the two paragraphs in the text content, so anything reading
  // the page (a crawler, a screen reader, someone copying it) gets his
  // statement back whole rather than "GRANDCHILDREN:IT'S".
  return { lead: message.slice(0, at + 1), body: message.slice(at + 1) };
}

/**
 * Makes the telephone number he quotes dialable, without altering a character.
 *
 * His statement quotes the number the way he wrote it (`0777172119`), while the
 * site now stores numbers in international form (`+256777172119`). So each
 * configured number is searched for in both its local and international digit
 * forms; whatever is found is shown exactly as written, and the link always
 * dials the international number.
 */
function PhoneAware({ text, phones }: { text: string; phones: string[] }) {
  let hit: { index: number; length: number; phone: string } | null = null;

  for (const phone of phones) {
    const international = digitsOnly(phone); // e.g. 256777172119
    const forms = international.startsWith('256')
      ? [international, `0${international.slice(3)}`] // …and 0777172119
      : [international];
    for (const form of forms) {
      const index = form ? text.indexOf(form) : -1;
      if (index >= 0 && (!hit || index < hit.index)) hit = { index, length: form.length, phone };
    }
  }
  if (!hit) return <>{text}</>;

  return (
    <>
      {text.slice(0, hit.index)}
      <a
        href={telHref(hit.phone)}
        className="whitespace-nowrap font-semibold text-gold-200 underline decoration-gold-400/50 underline-offset-4 transition hover:text-gold-100 hover:decoration-gold-300"
      >
        {text.slice(hit.index, hit.index + hit.length)}
      </a>
      {text.slice(hit.index + hit.length)}
    </>
  );
}

export function HealerMessage({
  settings,
  portrait = PORTRAIT_STILL,
  videoSlug = 'a-message-from-dr-salongo-hamuza',
}: {
  settings: SiteSettings;
  portrait?: string;
  videoSlug?: string;
}) {
  const { lead, body } = splitGreeting(settings.healer_message ?? '');
  const wa = whatsappHref(settings.whatsapp || settings.phone, settings.whatsapp_message);

  return (
    <section
      aria-labelledby="healer-message-heading"
      className="relative overflow-hidden bg-forest-900 py-20 lg:py-28"
    >
      <div aria-hidden className="pattern-diamond absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-gold-400/10 blur-[110px]"
      />

      <div className="container relative z-10">
        <Reveal className="mx-auto max-w-4xl text-center">
          <Logo
            src={settings.logo_url}
            alt=""
            size={88}
            className="mx-auto drop-shadow-[0_10px_34px_rgba(228,179,44,0.3)]"
          />
          <p className="eyebrow-light mt-6 justify-center">In his own words</p>
          <h2 id="healer-message-heading" className="heading-lg mt-4 text-cream-100">
            A Message From Dr Salongo Hamuza
          </h2>
          <PatternDivider tone="dark" className="mx-auto mt-6 max-w-xs" />
        </Reveal>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="mx-auto w-full max-w-sm lg:col-span-4 lg:mx-0 lg:sticky lg:top-28">
            <div className="relative">
              <span
                aria-hidden
                className="absolute -left-3 -top-3 h-24 w-24 rounded-tl-3xl border-l-2 border-t-2 border-gold-400/50"
              />
              <span
                aria-hidden
                className="absolute -bottom-3 -right-3 h-24 w-24 rounded-br-3xl border-b-2 border-r-2 border-gold-400/50"
              />
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-gold-500/25 shadow-deep">
                <Image
                  src={portrait}
                  alt={`${settings.site_name}, ${settings.tagline} from Uganda`}
                  fill
                  sizes="(max-width: 1024px) 80vw, 24rem"
                  className="object-cover object-top"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-transparent to-transparent"
                />
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block font-display text-lg text-cream-100">
                    {settings.site_name}
                  </span>
                  <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.22em] text-gold-300/85">
                    {settings.tagline}
                  </span>
                </span>
              </div>
            </div>

            {videoSlug ? (
              <Link
                href={`/videos/${videoSlug}`}
                className="btn-outline-gold mt-5 w-full !py-2.5 text-[0.8rem]"
              >
                Watch him say it himself
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-8">
            <blockquote className="relative rounded-3xl border border-gold-500/30 bg-forest-950/60 p-7 shadow-deep backdrop-blur-sm sm:p-11">
              <span
                aria-hidden
                className="absolute -top-5 left-8 font-display text-7xl leading-none text-gold-400/45"
              >
                &ldquo;
              </span>

              <div className="relative">
                {lead ? (
                  <p className="font-display text-[1.25rem] leading-[1.45] tracking-[0.02em] text-gold-200 sm:text-[1.6rem]">
                    {lead}
                  </p>
                ) : null}

                {/* A long run of capitals needs air: generous line height, a
                    little letter spacing and a capped measure keep it readable. */}
                <p
                  className={`max-w-[46ch] font-sans text-[0.92rem] font-light leading-[2.15] tracking-[0.055em] text-cream-100/90 sm:text-[1rem] sm:leading-[2.2] ${
                    lead ? 'mt-6' : ''
                  }`}
                >
                  <PhoneAware text={body} phones={contactPhones(settings)} />
                </p>
              </div>

              <footer className="mt-9 border-t border-gold-500/25 pt-6">
                <cite className="not-italic">
                  <span className="block font-display text-lg text-gold-300">
                    Dr Salongo Hamuza
                  </span>
                  <span className="mt-1 block text-[0.7rem] uppercase tracking-[0.24em] text-cream-200/55">
                    {settings.tagline} &middot; {settings.location || 'Uganda'}
                  </span>
                </cite>

                <div className="mt-7 flex flex-wrap gap-3">
                  {contactPhones(settings).map((number) => (
                    <a
                      key={number}
                      href={telHref(number)}
                      className="btn-gold !py-2.5 text-[0.82rem]"
                    >
                      <Phone className="h-4 w-4" aria-hidden />
                      Call {number}
                    </a>
                  ))}
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp !py-2.5 text-[0.82rem]"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    WhatsApp Now
                  </a>
                </div>
              </footer>
            </blockquote>

            {/* His statement mentions health matters, so the boundary is stated
                here rather than left to the footer. */}
            <p className="mt-5 max-w-[60ch] text-[0.8rem] leading-[1.8] text-cream-200/50">
              Dr Salongo Hamuza&rsquo;s message above is published in his own words. Traditional
              and spiritual consultation is based on traditional beliefs and practices and is not
              medical diagnosis or treatment. It does not replace advice, diagnosis or treatment
              from qualified healthcare professionals, and no specific outcome is promised or
              guaranteed.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
