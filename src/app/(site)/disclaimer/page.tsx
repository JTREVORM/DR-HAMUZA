import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/layout/LegalPage';
import { getSettings } from '@/lib/queries';
import { buildMetadata } from '@/lib/seo';
import { contactPhones, telHref } from '@/lib/utils';

export const revalidate = 3600;

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Disclaimer', path: '/disclaimer' },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: 'Disclaimer',
    description:
      'Important notice about traditional and spiritual consultation, health-related concerns, and the limits of the services described on this website.',
    path: '/disclaimer',
  });
}

export default async function DisclaimerPage() {
  const settings = await getSettings();

  return (
    <LegalPage
      eyebrow="Important"
      title="Disclaimer"
      intro="Please read this notice carefully. It explains the limits of what is offered on this website, particularly where health, money and the law are concerned."
      crumbs={CRUMBS}
    >
      <h2>Health and medical care</h2>
      <blockquote>{settings.health_disclaimer}</blockquote>
      <p>
        To state this as plainly as possible: no condition is diagnosed on this website or in a
        consultation, no medical treatment is given, and no cure is claimed for any condition
        whatsoever — including diabetes, mental-health conditions, or any other illness.
      </p>
      <p>
        If you or somebody close to you is unwell, please see a doctor. If treatment has been
        prescribed to you by a qualified healthcare professional, do not stop it, reduce it or
        delay it. If somebody is in danger of harming themselves or others, seek emergency medical
        help immediately.
      </p>

      <h2>No guaranteed outcomes</h2>
      <blockquote>{settings.general_disclaimer}</blockquote>
      <p>
        Traditional consultation is guidance rooted in traditional belief and practice. It is not a
        mechanism that produces results on demand, and anyone who tells you otherwise is not being
        honest with you.
      </p>

      <h2>Money and financial matters</h2>
      <p>
        Nothing offered here creates money, wealth, luck with money, employment or business
        results. No financial gain is promised or guaranteed. Please be careful of anyone —
        anywhere — who claims to be able to make money appear for you. Financial decisions deserve
        a bank, a savings group, an accountant or a qualified adviser.
      </p>

      <h2>Employment, ranks and official processes</h2>
      <p>
        Promotions, ranks, appointments and postings in the police, the armed forces and any other
        employer are decided by lawful official processes. Nothing offered here influences those
        processes in any way, and no bribery, manipulation or interference is provided or
        entertained.
      </p>

      <h2>Travel and immigration</h2>
      <p>
        Visas, passports and immigration decisions belong entirely to governments. No traditional
        healer can influence them. Use only official channels and licensed agents, and be careful
        of anyone who promises you travel documents or work abroad in exchange for money.
      </p>

      <h2>Theft, loss and accusations</h2>
      <p>
        Theft should be reported to the police. Traditional consultation is not a criminal
        investigation and is never a replacement for one. No consultation should ever be used to
        name, accuse, confront, punish or harm a person suspected of theft. Accusations made
        without evidence destroy innocent lives, and any request pointing in that direction is
        refused.
      </p>

      <h2>Children and education</h2>
      <p>
        Where a child is struggling at school, please speak to the child&rsquo;s teachers and to a
        doctor. Vision, hearing, health and specific learning difficulties are common and
        treatable causes, and they are identified by proper assessment.
      </p>

      <h2>Fertility and reproductive health</h2>
      <p>
        Difficulty in conceiving has medical causes, many of which can be identified and treated.
        Please see a doctor or a fertility clinic alongside any traditional consultation. Nothing
        here diagnoses or treats a medical condition.
      </p>

      <h2>Safety on the water</h2>
      <p>
        Nothing makes open water safe. Wear a life jacket, check the weather, do not overload a
        boat, and respect fishing regulations and closed seasons.
      </p>

      <h2>Testimonials</h2>
      <p>
        Any testimonials published on this website describe the personal experience of the
        individuals who gave them, and are published with their permission. Individual experiences
        differ. They are not a promise or a guarantee of any result for anybody else.
      </p>

      <h2>Questions</h2>
      <p>
        If anything in this notice is unclear, telephone{' '}
        {contactPhones(settings).map((number, index) => (
          <span key={number}>
            {index > 0 ? ' or ' : null}
            <a href={telHref(number)}>{number}</a>
          </span>
        ))} or use the{' '}
        <Link href="/contact">contact page</Link>, and it will be explained.
      </p>
    </LegalPage>
  );
}
