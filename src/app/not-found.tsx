import Link from 'next/link';
import { Home, Phone } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Logo } from '@/components/ui/Logo';
import { getSettings } from '@/lib/queries';
import { contactPhones, telHref } from '@/lib/utils';

export default async function NotFound() {
  const settings = await getSettings();

  return (
    <>
      <Header settings={settings} />
      <main id="main">
        <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-forest-950 py-32">
          <div aria-hidden className="pattern-diamond absolute inset-0 opacity-55" />
          <div className="container relative z-10 text-center">
            <Logo src={settings.logo_url} alt="" size={110} className="mx-auto" />
            <p className="eyebrow-light mt-8 justify-center">Page not found</p>
            <h1 className="heading-lg mt-4 text-cream-100">This page could not be found</h1>
            <p className="mx-auto mt-5 max-w-lg text-[0.98rem] leading-[1.9] text-cream-200/70">
              The page you were looking for may have been moved, or may no longer exist. You can
              return to the homepage, or contact Dr Salongo Hamuza directly.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/" className="btn-gold">
                <Home className="h-4 w-4" aria-hidden />
                Back to homepage
              </Link>
              {contactPhones(settings).map((number) => (
                <a key={number} href={telHref(number)} className="btn-outline-gold">
                  <Phone className="h-4 w-4" aria-hidden />
                  Call {number}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
