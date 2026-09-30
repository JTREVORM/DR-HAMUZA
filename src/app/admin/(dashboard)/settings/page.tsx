'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  AdminCard,
  AdminLoading,
  AdminPageHeader,
  FeedbackBanner,
  Field,
  SaveButton,
} from '@/components/admin/ui';
import { MediaField, MediaPickerDialog } from '@/components/admin/MediaPicker';
import { useSiteSettings } from '@/components/admin/useSiteSettings';
import type { BusinessHour, HeroMediaType } from '@/lib/types';

export default function AdminSettingsPage() {
  const { settings, set, save, loading, saving, feedback, setFeedback } = useSiteSettings();
  const [heroPickerOpen, setHeroPickerOpen] = useState(false);

  if (loading) return <AdminLoading label="Loading site settings" />;

  const addHour = () =>
    set('business_hours', [...settings.business_hours, { day: '', hours: '' }]);

  const updateHour = (index: number, patch: Partial<BusinessHour>) =>
    set(
      'business_hours',
      settings.business_hours.map((hour, i) => (i === index ? { ...hour, ...patch } : hour))
    );

  const removeHour = (index: number) =>
    set(
      'business_hours',
      settings.business_hours.filter((_, i) => i !== index)
    );

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const { default_seo_title, default_seo_description, default_og_image,
      google_site_verification, google_analytics_id, ...rest } = settings;
    void default_seo_title;
    void default_seo_description;
    void default_og_image;
    void google_site_verification;
    void google_analytics_id;
    await save(rest, 'Site settings saved. The website will show the changes within a few minutes.');
  }

  return (
    <form onSubmit={onSubmit}>
      <AdminPageHeader
        title="Site Settings"
        description="Business details, branding, homepage text and the disclaimers. Nothing here is fixed in the code — everything can be changed from this page."
        action={<SaveButton saving={saving} />}
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <div className="space-y-6">
        <AdminCard title="Business details" description="Shown in the header, the footer and on the contact page.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Site name" required>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => set('site_name', e.target.value)}
                required
                maxLength={120}
                className="field"
              />
            </Field>
            <Field label="Tagline" hint="For example: Professional Traditional Healer">
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => set('tagline', e.target.value)}
                maxLength={120}
                className="field"
              />
            </Field>
            <Field label="Phone number" required hint="Shown everywhere on the website.">
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => set('phone', e.target.value)}
                required
                maxLength={40}
                className="field"
              />
            </Field>
            <Field
              label="WhatsApp number"
              hint="Local numbers starting 07… are converted to the international 256… form automatically."
            >
              <input
                type="tel"
                value={settings.whatsapp}
                onChange={(e) => set('whatsapp', e.target.value)}
                maxLength={40}
                className="field"
              />
            </Field>
            <Field label="Email address">
              <input
                type="email"
                value={settings.email}
                onChange={(e) => set('email', e.target.value)}
                maxLength={160}
                className="field"
              />
            </Field>
            <Field label="Location / service area">
              <input
                type="text"
                value={settings.location}
                onChange={(e) => set('location', e.target.value)}
                maxLength={160}
                className="field"
                placeholder="Uganda"
              />
            </Field>
          </div>

          <div className="mt-5 space-y-5">
            <Field
              label="Short description"
              hint="One paragraph about the practice, used in the introduction and in search results."
            >
              <textarea
                value={settings.short_description}
                onChange={(e) => set('short_description', e.target.value)}
                rows={3}
                maxLength={600}
                className="field resize-y"
              />
            </Field>

            <Field
              label="Google Maps embed link"
              hint="Optional. In Google Maps choose Share → Embed a map, and paste the src address here."
            >
              <input
                type="url"
                value={settings.map_embed_url}
                onChange={(e) => set('map_embed_url', e.target.value)}
                className="field"
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard title="Branding">
          <div className="grid gap-6 sm:grid-cols-2">
            <MediaField
              label="Logo"
              value={settings.logo_url}
              onChange={(v) => set('logo_url', v)}
              hint="Leave blank to use the logo supplied with the website."
            />
            <MediaField
              label="Favicon"
              value={settings.favicon_url}
              onChange={(v) => set('favicon_url', v)}
              hint="The small icon shown in the browser tab."
            />
          </div>
        </AdminCard>

        <AdminCard title="Homepage hero" description="The large banner at the top of the homepage.">
          <div className="space-y-5">
            <Field label="Headline" required>
              <input
                type="text"
                value={settings.hero_title}
                onChange={(e) => set('hero_title', e.target.value)}
                required
                maxLength={200}
                className="field"
              />
            </Field>

            <Field label="Supporting paragraph">
              <textarea
                value={settings.hero_subtitle}
                onChange={(e) => set('hero_subtitle', e.target.value)}
                rows={4}
                maxLength={800}
                className="field resize-y"
              />
            </Field>

            <Field label="Consultation button text">
              <input
                type="text"
                value={settings.consultation_cta}
                onChange={(e) => set('consultation_cta', e.target.value)}
                maxLength={60}
                className="field"
              />
            </Field>

            <Field label="Background">
              <select
                value={settings.hero_media_type}
                onChange={(e) => set('hero_media_type', e.target.value as HeroMediaType)}
                className="field"
              >
                <option value="image">A single photograph</option>
                <option value="video">A background video</option>
                <option value="rotating">Several photographs, rotating</option>
              </select>
            </Field>

            {settings.hero_media_type === 'rotating' ? (
              <div>
                <span className="label">Rotating photographs</span>
                <button
                  type="button"
                  onClick={() => setHeroPickerOpen(true)}
                  className="btn-outline-forest !py-2.5 text-[0.8rem]"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  Add photographs
                </button>
                {settings.hero_media_urls.length ? (
                  <ul className="mt-4 space-y-2">
                    {settings.hero_media_urls.map((url, index) => (
                      <li
                        key={`${url}-${index}`}
                        className="flex items-center gap-3 rounded-lg border border-earth-200 bg-cream-50 p-2.5"
                      >
                        <span className="flex-1 truncate text-[0.78rem] text-forest-800/70">
                          {url}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            set(
                              'hero_media_urls',
                              settings.hero_media_urls.filter((_, i) => i !== index)
                            )
                          }
                          aria-label="Remove this photograph"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-[0.8rem] text-forest-800/60">
                    No photographs chosen. The hero will show the brand background instead.
                  </p>
                )}
              </div>
            ) : (
              <MediaField
                label={
                  settings.hero_media_type === 'video' ? 'Background video' : 'Background photograph'
                }
                value={settings.hero_media_url}
                onChange={(v) => set('hero_media_url', v)}
                filter={settings.hero_media_type === 'video' ? 'video' : 'image'}
                hint="A dark overlay is applied automatically so the headline stays readable."
              />
            )}

            {settings.hero_media_type === 'video' ? (
              <MediaField
                label="Video still image"
                value={settings.hero_poster_url}
                onChange={(v) => set('hero_poster_url', v)}
                hint="Shown while the video loads, and on connections where it cannot play."
              />
            ) : null}
          </div>
        </AdminCard>

        <AdminCard
          title="Dr Salongo Hamuza's message"
          description="His own statement, published on the homepage exactly as he gave it."
        >
          <Field
            label="Message"
            hint="This is published word for word. Please change it only if Dr Salongo Hamuza asks for it to be changed."
          >
            <textarea
              value={settings.healer_message}
              onChange={(e) => set('healer_message', e.target.value)}
              rows={8}
              className="field resize-y"
            />
          </Field>
        </AdminCard>

        <AdminCard title="About section">
          <div className="space-y-5">
            <Field
              label="Short introduction"
              hint="Shown on the homepage and at the top of the About page."
            >
              <textarea
                value={settings.about_short}
                onChange={(e) => set('about_short', e.target.value)}
                rows={4}
                maxLength={900}
                className="field resize-y"
              />
            </Field>

            <Field
              label="Full about text"
              hint="Optional. Leave blank to use the written About page that ships with the website. Formatting: ## Heading, **bold**, - bullet."
            >
              <textarea
                value={settings.about_long}
                onChange={(e) => set('about_long', e.target.value)}
                rows={12}
                className="field resize-y font-mono text-[0.84rem]"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field
                label="Years of experience"
                hint="Leave blank if you prefer not to state it — the section is then hidden."
              >
                <input
                  type="text"
                  value={settings.years_experience}
                  onChange={(e) => set('years_experience', e.target.value)}
                  maxLength={40}
                  className="field"
                />
              </Field>
              <Field label="People received" hint="Optional.">
                <input
                  type="text"
                  value={settings.clients_served}
                  onChange={(e) => set('clients_served', e.target.value)}
                  maxLength={40}
                  className="field"
                />
              </Field>
              <Field label="Languages spoken" hint="Optional.">
                <input
                  type="text"
                  value={settings.languages_spoken}
                  onChange={(e) => set('languages_spoken', e.target.value)}
                  maxLength={80}
                  className="field"
                />
              </Field>
            </div>
          </div>
        </AdminCard>

        <AdminCard
          title="Consultation hours"
          description="Optional. Leave empty and the hours are hidden everywhere on the website."
        >
          {settings.business_hours.length ? (
            <ul className="mb-4 space-y-3">
              {settings.business_hours.map((hour, index) => (
                <li key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={hour.day}
                    onChange={(e) => updateHour(index, { day: e.target.value })}
                    placeholder="Monday to Friday"
                    aria-label="Days"
                    className="field"
                  />
                  <input
                    type="text"
                    value={hour.hours}
                    onChange={(e) => updateHour(index, { hours: e.target.value })}
                    placeholder="8:00am – 6:00pm"
                    aria-label="Hours"
                    className="field"
                  />
                  <button
                    type="button"
                    onClick={() => removeHour(index)}
                    aria-label="Remove this line"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-earth-200 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <button type="button" onClick={addHour} className="btn-outline-forest !py-2.5 text-[0.8rem]">
            <Plus className="h-4 w-4" aria-hidden />
            Add a line
          </button>
        </AdminCard>

        <AdminCard title="Social media">
          <div className="grid gap-5 sm:grid-cols-2">
            {(
              [
                ['facebook_url', 'Facebook'],
                ['instagram_url', 'Instagram'],
                ['tiktok_url', 'TikTok'],
                ['youtube_url', 'YouTube'],
                ['twitter_url', 'X (Twitter)'],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label}>
                <input
                  type="url"
                  value={settings[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className="field"
                  placeholder="https://"
                />
              </Field>
            ))}
          </div>
          <p className="mt-4 text-[0.78rem] text-forest-800/55">
            Icons appear in the footer only for the links you fill in.
          </p>
        </AdminCard>

        <AdminCard title="WhatsApp">
          <Field
            label="Opening message"
            hint="Pre-written into WhatsApp when somebody taps the WhatsApp button."
          >
            <textarea
              value={settings.whatsapp_message}
              onChange={(e) => set('whatsapp_message', e.target.value)}
              rows={3}
              maxLength={400}
              className="field resize-y"
            />
          </Field>
        </AdminCard>

        <AdminCard
          title="Footer and disclaimers"
          description="The health disclaimer appears on the homepage, in the footer and on several service pages. Please keep it accurate."
        >
          <div className="space-y-5">
            <Field label="Footer text">
              <textarea
                value={settings.footer_text}
                onChange={(e) => set('footer_text', e.target.value)}
                rows={3}
                maxLength={500}
                className="field resize-y"
              />
            </Field>

            <Field label="Health disclaimer" required>
              <textarea
                value={settings.health_disclaimer}
                onChange={(e) => set('health_disclaimer', e.target.value)}
                rows={5}
                required
                className="field resize-y"
              />
            </Field>

            <Field label="General disclaimer">
              <textarea
                value={settings.general_disclaimer}
                onChange={(e) => set('general_disclaimer', e.target.value)}
                rows={5}
                className="field resize-y"
              />
            </Field>
          </div>
        </AdminCard>
      </div>

      <div className="mt-8 flex justify-end border-t border-earth-200 pt-6">
        <SaveButton saving={saving} label="Save all settings" />
      </div>

      <MediaPickerDialog
        open={heroPickerOpen}
        onClose={() => setHeroPickerOpen(false)}
        multiple
        filter="image"
        onSelect={(urls) => set('hero_media_urls', [...settings.hero_media_urls, ...urls])}
      />
    </form>
  );
}
