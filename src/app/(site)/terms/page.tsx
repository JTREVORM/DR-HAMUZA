import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/layout/LegalPage';
import { getSettings } from '@/lib/queries';
import { buildMetadata } from '@/lib/seo';
import { contactPhones, telHref } from '@/lib/utils';

export const revalidate = 3600;

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Terms of Use', path: '/terms' },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: 'Terms of Use',
    description: `The terms on which this website and the consultation services of ${settings.site_name} are offered.`,
    path: '/terms',
  });
}

export default async function TermsPage() {
  const settings = await getSettings();

  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Use"
      intro="The terms on which this website and the consultation services described on it are offered."
      crumbs={CRUMBS}
    >
      <h2>Acceptance</h2>
      <p>
        By using this website you accept these terms. If you do not accept them, please do not use
        the website.
      </p>

      <h2>What is offered</h2>
      <p>
        {settings.site_name} offers traditional and spiritual consultation, rooted in traditional
        Ugandan belief and practice. Consultation is a private conversation in which guidance is
        given according to that tradition.
      </p>

      <h2>No guarantee of outcome</h2>
      <p>
        No specific result, outcome or financial gain is promised or guaranteed. Individual
        experiences differ from one person to another. Nothing on this website should be read as a
        promise that any particular thing will happen.
      </p>

      <h2>Not professional advice</h2>
      <p>
        Nothing on this website, and nothing said in a consultation, is medical, legal, financial,
        psychological or educational advice. Traditional consultation does not replace a doctor, a
        hospital, a lawyer, an accountant, the police or a school. Where a matter needs any of
        those, please go to them.
      </p>

      <h2>Health matters</h2>
      <p>
        Health-related concerns are received as traditional consultation only. No condition is
        diagnosed, no medical treatment is given, and no cure is claimed for any condition. Please
        read the <Link href="/disclaimer">full disclaimer</Link>. Never stop, reduce or delay
        treatment prescribed by a qualified healthcare professional.
      </p>

      <h2>Lawful use only</h2>
      <p>
        Nothing unlawful is offered here. Requests to cause harm to another person, to interfere
        with an official process, to influence a promotion board or investigation, to obtain
        travel documents, or to accuse or punish a person suspected of theft, are refused without
        exception.
      </p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>Describe your situation truthfully, so that any guidance given is useful.</li>
        <li>Make your own decisions — you are free to accept or leave any guidance offered.</li>
        <li>Seek professional help where a situation calls for it.</li>
        <li>Do not use this website to harass, threaten or defame anybody.</li>
      </ul>

      <h2>Website content</h2>
      <p>
        The text, photographs, videos and design of this website belong to {settings.site_name}
        unless stated otherwise, and may not be copied or republished without permission. Content
        may be updated or corrected at any time.
      </p>

      <h2>Testimonials</h2>
      <p>
        Testimonials published on this website describe the personal experience of the individuals
        who gave them, with their permission. They are not a promise of any result for anyone
        else.
      </p>

      <h2>Limitation</h2>
      <p>
        This website is provided as it is. While care is taken to keep it accurate, no liability is
        accepted for decisions taken solely on the basis of information published here.
      </p>

      <h2>Questions</h2>
      <p>
        For any question about these terms, telephone{' '}
        {contactPhones(settings).map((number, index) => (
          <span key={number}>
            {index > 0 ? ' or ' : null}
            <a href={telHref(number)}>{number}</a>
          </span>
        ))} or use the{' '}
        <Link href="/contact">contact page</Link>.
      </p>
    </LegalPage>
  );
}
