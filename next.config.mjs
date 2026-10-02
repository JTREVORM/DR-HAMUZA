const PRODUCTION_URL = 'https://dr-salongohamuza.com';
const SITE_HOST = PRODUCTION_URL.replace(/^https?:\/\//, '');

/**
 * Alternative service URLs kept working with permanent redirects. The left side
 * is the wording used in the SEO brief; the right side is the slug the page is
 * actually published at.
 */
const SERVICE_SLUG_ALIASES = [
  ['relationship-and-family', 'relationship-and-love-matters'],
  ['spiritual-consultation', 'church-and-spiritual-matters'],
  ['traditional-consultation', 'general-traditional-consultation'],
  ['fertility-and-family', 'fertility-and-family-consultation'],
  ['fishermen', 'fishermen-consultation'],
  ['lost-property-and-theft', 'lost-property-and-theft-concerns'],
  ['business-and-career-matters', 'business-and-career'],
];

/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.vimeocdn.com' },
      ...(supabaseHost ? [{ protocol: 'https', hostname: supabaseHost }] : []),
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Tells browsers to use HTTPS for a year, so http:// requests stop
          // leaving the device at all after the first visit.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        // The media is content-addressed by filename and replaced rather than
        // edited, so it can be cached hard.
        source: '/:dir(videos|video-posters|images|brand)/:file*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Belt and braces alongside the noindex metadata on the dashboard.
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },

  async redirects() {
    return [
      // One host only. Without this both www and the apex resolve, Google
      // indexes each, and the site competes against itself.
      {
        source: '/:path*',
        has: [{ type: 'host', value: `www.${SITE_HOST}` }],
        destination: `${PRODUCTION_URL}/:path*`,
        permanent: true,
      },
      // Slugs the SEO brief suggested, pointed at the pages that actually
      // exist, so a link written against either spelling still lands.
      ...SERVICE_SLUG_ALIASES.map(([from, to]) => ({
        source: `/services/${from}`,
        destination: `/services/${to}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
