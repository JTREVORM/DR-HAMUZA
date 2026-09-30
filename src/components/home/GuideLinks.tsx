import Link from 'next/link';
import { ArrowRight, BookOpen, Leaf, MessageSquareQuote } from 'lucide-react';

import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const GUIDES = [
  {
    href: '/traditional-healer-uganda',
    icon: Leaf,
    title: 'Traditional Healer in Uganda',
    body: 'What a traditional healer actually does, who comes for consultation, how a consultation works, and where the line to medical care is drawn.',
  },
  {
    href: '/traditional-doctor-uganda',
    icon: BookOpen,
    title: 'Traditional Doctor & Herbs',
    body: 'What people mean by a traditional doctor, how herbs and traditional preparations are used, and how this differs from a medical doctor.',
  },
  {
    href: '/witch-doctor-uganda',
    icon: MessageSquareQuote,
    title: 'A Note on Terminology',
    body: 'Why some people search for "witch doctor", where the phrase came from, and the words Ugandan practitioners use for themselves.',
  },
];

/**
 * Routes visitors from the homepage into the cornerstone guides. People arrive
 * with very different questions — some want to book, some want to understand
 * what this even is before they call — and this is the path for the second kind.
 */
export function GuideLinks() {
  return (
    <section className="bg-cream-100 py-20 lg:py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Start here"
          title="Understanding Traditional Healing in Uganda"
          intro="If you have not consulted a traditional healer before, these pages explain the practice plainly — including what it does not claim to do."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {GUIDES.map((guide, i) => (
            <Reveal key={guide.href} delay={(i % 3) * 0.08}>
              <Link href={guide.href} className="card-premium group block h-full p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-300 bg-gold-50 text-gold-700">
                  <guide.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-xl leading-snug text-forest-900 transition group-hover:text-gold-700">
                  {guide.title}
                </h3>
                <p className="mt-3 text-[0.94rem] leading-[1.85] text-forest-800/80">
                  {guide.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-[0.85rem] font-semibold text-forest-700 transition group-hover:gap-3">
                  Read more
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
