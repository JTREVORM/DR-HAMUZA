import Script from 'next/script';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { JsonLd } from '@/components/ui/JsonLd';
import { getSettings } from '@/lib/queries';
import { localBusinessSchema, personSchema } from '@/lib/seo';

/** Public website shell: sticky header, footer and floating contact actions. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      <JsonLd data={[localBusinessSchema(settings), personSchema(settings)]} />

      <Header settings={settings} />
      <main id="main" className="min-h-screen">
        {children}
      </main>
      <Footer />
      <FloatingActions settings={settings} />

      {settings.google_analytics_id ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${settings.google_analytics_id}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
