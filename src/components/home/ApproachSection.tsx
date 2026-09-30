import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { APPROACH_STEPS } from '@/content/site-defaults';

export function ApproachSection() {
  return (
    <section className="relative overflow-hidden bg-cream-100 py-20 lg:py-28">
      <div aria-hidden className="pattern-weave absolute inset-0 opacity-70" />

      <div className="container relative z-10">
        <SectionHeading
          eyebrow="The practice"
          title="How a Consultation Unfolds"
          intro="Traditional consultation is a patient practice. Nothing is hurried, and nothing is decided on your behalf."
        />

        <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {APPROACH_STEPS.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.08} as="li" className="relative">
              <div className="card-premium group h-full p-7">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold-400/50 bg-cream-50 font-display text-lg text-gold-700 transition-colors duration-500 group-hover:border-gold-500 group-hover:bg-gold-400 group-hover:text-forest-950">
                  {step.step}
                </span>
                <h3 className="mt-5 font-display text-[1.18rem] text-forest-900">{step.title}</h3>
                <p className="mt-3 text-[0.92rem] leading-[1.85] text-forest-800/75">
                  {step.body}
                </p>
              </div>
              {i < APPROACH_STEPS.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute -right-3 top-16 hidden h-px w-6 bg-gold-400/50 lg:block"
                />
              ) : null}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
