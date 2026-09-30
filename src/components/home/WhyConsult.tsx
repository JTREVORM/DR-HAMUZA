import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TRUST_POINTS } from '@/content/site-defaults';

export function WhyConsult() {
  return (
    <section className="relative overflow-hidden bg-forest-950 py-20 lg:py-28">
      <div aria-hidden className="pattern-diamond absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-forest-600/20 blur-[120px]"
      />

      <div className="container relative z-10">
        <SectionHeading
          eyebrow="Why people come"
          title="Why People Consult Dr Salongo Hamuza"
          intro="People arrive carrying very different situations, but they tend to describe the same reasons for choosing to come here."
          tone="dark"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_POINTS.map((point, i) => (
            <Reveal key={point.title} delay={i * 0.07} as="article" className="group card-dark p-7">
              <span
                aria-hidden
                className="font-display text-4xl leading-none text-gold-400/30 transition-colors duration-500 group-hover:text-gold-400/60"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-[1.22rem] text-cream-100">{point.title}</h3>
              <p className="mt-3 text-[0.92rem] leading-[1.85] text-cream-200/70">{point.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
