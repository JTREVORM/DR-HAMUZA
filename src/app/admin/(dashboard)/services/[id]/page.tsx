'use client';

import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  AdminCard,
  AdminLoading,
  AdminPageHeader,
  FeedbackBanner,
  Field,
  SaveButton,
  Toggle,
  type Feedback,
} from '@/components/admin/ui';
import { BodyField, SeoFields, SlugField } from '@/components/admin/form-parts';
import { MediaField } from '@/components/admin/MediaPicker';
import { SERVICE_ICON_NAMES, ServiceIcon } from '@/components/ui/ServiceIcon';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import type { Service } from '@/lib/types';

type Draft = Omit<Service, 'id'>;

const EMPTY: Draft = {
  slug: '',
  title: '',
  short_description: '',
  description: '',
  body: '',
  icon: 'sparkles',
  cover_image: '',
  bullet_points: [],
  notice: '',
  sort_order: 100,
  is_published: true,
  is_featured: false,
  seo_title: '',
  seo_description: '',
};

export default function AdminServiceEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();

  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [bullets, setBullets] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const load = useCallback(async () => {
    if (isNew) return;
    try {
      const { data, error } = await createClient()
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      const { id: _id, ...rest } = data as Service;
      void _id;
      setDraft(rest as Draft);
      setBullets((rest.bullet_points ?? []).join('\n'));
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not load this service.',
      });
    } finally {
      setLoading(false);
    }
  }, [id, isNew]);

  useEffect(() => {
    load();
  }, [load]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      ...draft,
      slug: draft.slug || slugify(draft.title),
      bullet_points: bullets
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    };

    try {
      const supabase = createClient();
      if (isNew) {
        const { data, error } = await supabase
          .from('services')
          .insert(payload)
          .select('id')
          .single();
        if (error) throw error;
        router.replace(`/admin/services/${data.id}`);
        router.refresh();
        return;
      }
      const { error } = await supabase.from('services').update(payload).eq('id', id);
      if (error) throw error;
      setDraft(payload);
      setFeedback({ type: 'success', message: 'Service saved.' });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not save this service.';
      setFeedback({
        type: 'error',
        message: /duplicate key|unique/i.test(message)
          ? 'That URL slug is already used by another service. Please choose a different one.'
          : message,
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminLoading label="Loading service" />;

  return (
    <form onSubmit={onSubmit}>
      <AdminPageHeader
        title={isNew ? 'New service' : 'Edit service'}
        description="Each service has its own page on the website, with its own web address and search-engine listing."
        action={
          <>
            <Link href="/admin/services" className="btn-outline-forest !py-2.5 text-[0.8rem]">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back
            </Link>
            <SaveButton saving={saving} label={isNew ? 'Create service' : 'Save changes'} />
          </>
        }
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AdminCard title="Service details">
            <div className="space-y-5">
              <Field label="Title" required>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => {
                    set('title', e.target.value);
                    if (isNew && !draft.slug) set('slug', slugify(e.target.value));
                  }}
                  required
                  maxLength={160}
                  className="field"
                />
              </Field>

              <SlugField
                value={draft.slug}
                onChange={(v) => set('slug', v)}
                source={draft.title}
                prefix="/services"
              />

              <Field
                label="Short description"
                required
                hint="One or two sentences, shown on the service cards."
              >
                <textarea
                  value={draft.short_description}
                  onChange={(e) => set('short_description', e.target.value)}
                  rows={3}
                  required
                  maxLength={400}
                  className="field resize-y"
                />
              </Field>

              <Field
                label="Introduction"
                hint="A fuller paragraph shown in the banner at the top of the service page."
              >
                <textarea
                  value={draft.description}
                  onChange={(e) => set('description', e.target.value)}
                  rows={4}
                  maxLength={1200}
                  className="field resize-y"
                />
              </Field>

              <BodyField
                label="Page content"
                value={draft.body}
                onChange={(v) => set('body', v)}
                rows={18}
              />

              <Field
                label="This consultation covers"
                hint="One point per line. Shown as a checklist beside the page content."
              >
                <textarea
                  value={bullets}
                  onChange={(e) => setBullets(e.target.value)}
                  rows={6}
                  className="field resize-y"
                  placeholder={'Misunderstandings between partners\nSeparation and reconciliation'}
                />
              </Field>

              <Field
                label="Notice"
                hint="An important note shown in a highlighted box — for example a reminder to also see a doctor, or a statement of what is not offered."
              >
                <textarea
                  value={draft.notice}
                  onChange={(e) => set('notice', e.target.value)}
                  rows={4}
                  maxLength={900}
                  className="field resize-y"
                />
              </Field>
            </div>
          </AdminCard>

          <SeoFields
            seoTitle={draft.seo_title}
            seoDescription={draft.seo_description}
            onTitleChange={(v) => set('seo_title', v)}
            onDescriptionChange={(v) => set('seo_description', v)}
            fallbackTitle={draft.title}
            fallbackDescription={draft.short_description}
          />
        </div>

        <div className="space-y-6">
          <AdminCard title="Visibility">
            <div className="space-y-3">
              <Toggle
                label="Published"
                checked={draft.is_published}
                onChange={(v) => set('is_published', v)}
                description="Hidden services stay reachable only by their direct web address."
              />
              <Toggle
                label="Featured on the homepage"
                checked={draft.is_featured}
                onChange={(v) => set('is_featured', v)}
              />
            </div>
            <div className="mt-5">
              <Field label="Display order" hint="Lower numbers appear first.">
                <input
                  type="number"
                  value={draft.sort_order}
                  onChange={(e) => set('sort_order', Number(e.target.value))}
                  className="field"
                />
              </Field>
            </div>
          </AdminCard>

          <AdminCard title="Icon">
            <div className="grid grid-cols-5 gap-2">
              {SERVICE_ICON_NAMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => set('icon', name)}
                  aria-label={`Use the ${name} icon`}
                  aria-pressed={draft.icon === name}
                  className={`flex h-12 items-center justify-center rounded-lg border transition ${
                    draft.icon === name
                      ? 'border-gold-500 bg-gold-50 text-gold-700'
                      : 'border-earth-200 text-forest-800/60 hover:border-gold-300'
                  }`}
                >
                  <ServiceIcon name={name} className="h-5 w-5" />
                </button>
              ))}
            </div>
          </AdminCard>

          <AdminCard title="Cover image">
            <MediaField
              label="Cover image"
              value={draft.cover_image}
              onChange={(v) => set('cover_image', v)}
              hint="Optional. Used on the service card and as the page banner."
            />
          </AdminCard>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-2.5 border-t border-earth-200 pt-6">
        <Link href="/admin/services" className="btn-outline-forest">
          Cancel
        </Link>
        <SaveButton saving={saving} label={isNew ? 'Create service' : 'Save changes'} />
      </div>
    </form>
  );
}
