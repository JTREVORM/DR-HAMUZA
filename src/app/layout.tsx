import type { Metadata, Viewport } from 'next';
import { Cinzel, Cormorant_Garamond, Outfit } from 'next/font/google';
import './globals.css';

import { getSettings } from '@/lib/queries';
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
      'traditional healer Kampala',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-UG" className={`${display.variable} ${serif.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
