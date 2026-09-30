'use client';

import { ExternalLink, Search } from 'lucide-react';
import {
  AdminCard,
  AdminLoading,
  AdminPageHeader,
  FeedbackBanner,
  Field,
  SaveButton,
} from '@/components/admin/ui';
import { MediaField } from '@/components/admin/MediaPicker';
import { useSiteSettings } from '@/components/admin/useSiteSettings';

export default function AdminSeoPage() {
  const { settings, set, save, loading, saving, feedback, setFeedback } = useSiteSettings();

  if (loading) return <AdminLoading label="Loading SEO settings" />;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    await save(
      {
        default_seo_title: settings.default_seo_title,
        default_seo_description: settings.default_seo_description,
        default_og_image: settings.default_og_image,
        google_site_verification: settings.google_site_verification,
        google_analytics_id: settings.google_analytics_id,
      },
      'SEO settings saved.'
    );
  }

  const title = settings.default_seo_title || `${settings.site_name} | ${settings.tagline}`;
  const description = settings.default_seo_description || settings.short_description;

  return (
    <form onSubmit={onSubmit}>
      <AdminPageHeader
        title="SEO"
        description="How the website appears in Google, plus verification and analytics. Each page, service, article and video also has its own SEO fields in its own editor."
        action={<SaveButton saving={saving} />}
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <div className="space-y-6">
        <AdminCard
          title="Default search listing"
          description="Used for the homepage, and as the fallback wherever a page has no SEO text of its own."
        >
          <div className="space-y-5">
            <Field label="Default title" hint={`${title.length} characters — aim for 50 to 60.`}>
              <input
                type="text"
                value={settings.default_seo_title}
                onChange={(e) => set('default_seo_title', e.target.value)}
                maxLength={120}
                className="field"
                placeholder={`${settings.site_name} | ${settings.tagline}`}
              />
            </Field>

            <Field
              label="Default description"
              hint={`${description.length} characters — aim for 140 to 160.`}
            >
              <textarea
                value={settings.default_seo_description}
                onChange={(e) => set('default_seo_description', e.target.value)}
                rows={3}
                maxLength={320}
                className="field resize-y"
                placeholder={settings.short_description}
              />
            </Field>

            <div className="rounded-xl border border-earth-200 bg-cream-50 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-[0.70rem] font-semibold uppercase tracking-[0.16em] text-forest-800/45">
                <Search className="h-3.5 w-3.5" aria-hidden />
                Google preview
              </p>
              <p className="truncate text-[1.05rem] text-[#1a0dab]">{title}</p>
              <p className="mt-1 line-clamp-2 text-[0.82rem] leading-relaxed text-[#4d5156]">
                {description}
              </p>
            </div>
          </div>
        </AdminCard>

        <AdminCard
          title="Sharing image"
          description="The picture shown when a link to the website is shared on WhatsApp, Facebook or X."
        >
          <MediaField
            label="Default sharing image"
            value={settings.default_og_image}
            onChange={(v) => set('default_og_image', v)}
            hint="A wide image of about 1200 × 630 pixels works best. Leave blank to use the logo."
          />
        </AdminCard>

        <AdminCard
          title="Google Search Console and Analytics"
          description="Optional. Add these once the website is live on its own web address."
        >
          <div className="space-y-5">
            <Field
              label="Google site verification code"
              hint="From Search Console, choose the HTML tag method and paste only the content value."
            >
              <input
                type="text"
                value={settings.google_site_verification}
                onChange={(e) => set('google_site_verification', e.target.value)}
                maxLength={200}
                className="field font-mono text-[0.84rem]"
                placeholder="abc123…"
              />
            </Field>

            <Field label="Google Analytics measurement ID" hint="Looks like G-XXXXXXXXXX.">
              <input
                type="text"
                value={settings.google_analytics_id}
                onChange={(e) => set('google_analytics_id', e.target.value)}
                maxLength={40}
                className="field font-mono text-[0.84rem]"
                placeholder="G-XXXXXXXXXX"
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard
          title="Technical SEO"
          description="These are handled automatically by the website — nothing to configure."
        >
          <ul className="space-y-2.5 text-[0.86rem] text-forest-800/75">
            {[
              'Unique page titles, descriptions and canonical addresses on every page',
              'Open Graph and X (Twitter) cards for link sharing',
              'Structured data for the business, the practitioner, services, articles and videos',
              'Breadcrumb navigation and breadcrumb structured data',
              'Automatic sitemap covering every published page',
              'robots.txt allowing search engines and keeping the dashboard private',
              'Image optimisation in modern formats, with lazy loading',
            ].map((line) => (
              <li key={line} className="flex gap-2.5">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-500" />
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-forest !py-2.5 text-[0.8rem]"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              View sitemap.xml
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-forest !py-2.5 text-[0.8rem]"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              View robots.txt
            </a>
          </div>
        </AdminCard>
      </div>

      <div className="mt-8 flex justify-end border-t border-earth-200 pt-6">
        <SaveButton saving={saving} label="Save SEO settings" />
      </div>
    </form>
  );
}
