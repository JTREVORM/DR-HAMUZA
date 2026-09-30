import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/layout/LegalPage';
import { getSettings } from '@/lib/queries';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Privacy Policy', path: '/privacy-policy' },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: 'Privacy Policy',
    description: `How ${settings.site_name} collects, uses and protects the information you provide through this website.`,
    path: '/privacy-policy',
  });
}

export default async function PrivacyPolicyPage() {
  const settings = await getSettings();

  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="How information you provide through this website is collected, used and protected."
      crumbs={CRUMBS}
    >
      <h2>What this policy covers</h2>
      <p>
        This policy explains what happens to the information you provide when you use this
        website, whether through the enquiry form, by telephone, or by WhatsApp. It applies to
        this website only.
      </p>

      <h2>Information collected through this website</h2>
      <p>
        When you send an enquiry through the contact form, the following is stored: your name,
        your telephone number, your email address if you choose to give one, the type of
        consultation you selected, and the message you wrote. The page you sent it from and the
        time it was received are also recorded.
      </p>
      <p>
        No account is required to use this website, and no payment details are ever collected
        through it.
      </p>

      <h2>How that information is used</h2>
      <p>
        It is used for one purpose: to respond to your enquiry and to arrange or discuss a
        consultation. It is not used for advertising, it is not sold, and it is not shared with
        any third party for their own purposes.
      </p>

      <h2>Confidentiality</h2>
      <p>
        What you describe in an enquiry, and anything discussed in a consultation, is treated in
        confidence. No name, photograph, story or testimonial appears anywhere on this website
        unless the person concerned has given permission for it first.
      </p>

      <h2>Where the information is stored</h2>
      <p>
        Enquiries are stored in a secured database hosted by Supabase, and the website is served
        by Vercel. Both are established hosting providers. Access to stored enquiries requires an
        authenticated administrator account.
      </p>

      <h2>How long it is kept</h2>
      <p>
        Enquiries are kept for as long as they are needed to respond to you and to keep a record
        of correspondence. You may ask at any time for your enquiry to be deleted, and it will
        be.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        This website does not use advertising cookies or tracking cookies. If website analytics
        are enabled, they are used only to understand which pages visitors find useful, in
        aggregate. A cookie is set only for administrators when they sign in to the private
        dashboard.
      </p>

      <h2>Third-party links</h2>
      <p>
        Links to WhatsApp, and to any social media pages, take you to services run by other
        companies. Once you leave this website, those companies&rsquo; own privacy policies apply
        to what you do there.
      </p>

      <h2>Your rights</h2>
      <ul>
        <li>You may ask what information is held about you.</li>
        <li>You may ask for it to be corrected.</li>
        <li>You may ask for it to be deleted.</li>
        <li>You may withdraw permission for anything you previously agreed to publish.</li>
      </ul>

      <h2>Contact about privacy</h2>
      <p>
        To make any of these requests, telephone{' '}
        <a href={`tel:${settings.phone}`}>{settings.phone}</a>
        {settings.email ? (
          <>
            {' '}or write to <a href={`mailto:${settings.email}`}>{settings.email}</a>
          </>
        ) : null}
        . You can also use the <Link href="/contact">contact page</Link>.
      </p>
    </LegalPage>
  );
}
