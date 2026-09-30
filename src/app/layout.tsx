import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Cinzel, Cormorant_Garamond, Outfit } from 'next/font/google';
import './globals.css';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { JsonLd } from '@/components/ui/JsonLd';
import { getSettings } from '@/lib/queries';
import { localBusinessSchema, personSchema } from '@/lib/seo';
import { SITE_URL } from '@/lib/env';

const display = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0C3323',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings.default_seo_title || `${settings.site_name} | ${settings.tagline}`,
      template: `%s | ${settings.site_name}`,
    },
    description: settings.default_seo_description || settings.short_description,
    applicationName: settings.site_name,
    authors: [{ name: settings.site_name }],
    creator: settings.site_name,
    keywords: [
      'traditional healer Uganda',
      'traditional healer in Uganda',
      'African traditional healer',
      'spiritual consultation Uganda',
      'traditional consultation Uganda',
      settings.site_name,
    ],
    alternates: { canonical: '/' },
    icons: {
      icon: settings.favicon_url || '/brand/logo.webp',
      apple: settings.favicon_url || '/brand/logo.webp',
    },
    robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    ...(settings.google_site_verification
      ? { verification: { google: settings.google_site_verification } }
      : {}),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="en-UG" className={`${display.variable} ${serif.variable} ${sans.variable}`}>
      <body className="font-sans">
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
      </body>
    </html>
  );
}
