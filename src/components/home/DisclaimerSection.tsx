import { AlertTriangle, Stethoscope } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import type { SiteSettings } from '@/lib/types';

export function DisclaimerSection({ settings }: { settings: SiteSettings }) {
  return (
    <section
      aria-labelledby="disclaimer-heading"
      className="border-y border-earth-200 bg-cream-200/70 py-16"
    >
      <div className="container">
        <Reveal className="mx-auto max-w-4xl">
          <div className="flex items-center justify-center gap-3">
            <AlertTriangle className="h-5 w-5 text-gold-700" aria-hidden />
            <h2
              id="disclaimer-heading"
              className="text-center font-display text-xl text-forest-900 sm:text-2xl"
            >
              Important Disclaimer
            </h2>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-earth-200 bg-cream-50 p-6">
              <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-700">
                <Stethoscope className="h-4 w-4" aria-hidden />
                Health &amp; medical care
              </p>
              <p className="mt-3.5 text-[0.9rem] leading-[1.9] text-forest-800/80">
                {settings.health_disclaimer}
              </p>
            </div>

            <div className="rounded-2xl border border-earth-200 bg-cream-50 p-6">
              <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-700">
                <AlertTriangle className="h-4 w-4" aria-hidden />
                General notice
              </p>
              <p className="mt-3.5 text-[0.9rem] leading-[1.9] text-forest-800/80">
                {settings.general_disclaimer}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
