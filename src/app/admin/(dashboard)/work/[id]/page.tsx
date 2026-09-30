'use client';

import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, GripVertical, Plus, Trash2 } from 'lucide-react';
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
import { BodyField, SeoFields, SlugField, TagsField } from '@/components/admin/form-parts';
import { MediaField, MediaPickerDialog } from '@/components/admin/MediaPicker';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import type { WorkMedia, WorkPost } from '@/lib/types';

const CATEGORIES = [
  'Traditional Practices',
  'Consultations',
  'Events',
  'Community Activities',
  'Herbs & Traditional Items',
  'Recent Work',
  'General',
];

type Draft = Omit<WorkPost, 'id' | 'created_at' | 'work_media'>;

const EMPTY: Draft = {
  slug: '',
  title: '',
  short_description: '',
  description: '',
  cover_image: '',
  video_url: '',
  category: 'General',
  tags: [],
  location: '',
  event_date: null,
  is_published: false,
  is_featured: false,
  seo_title: '',
  seo_description: '',
  published_at: null,
};

export default function AdminWorkEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();

  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [media, setMedia] = useState<WorkMedia[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const load = useCallback(async () => {
    if (isNew) return;
    try {
      const { data, error } = await createClient()
        .from('work_posts')
        .select('*, work_media(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      const post = data as WorkPost;
      const { id: _id, created_at: _created, work_media, ...rest } = post;
      void _id;
      void _created;
      setDraft(rest as Draft);
      setMedia((work_media ?? []).sort((a, b) => a.sort_order - b.sort_order));
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not load this work post.',
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
      event_date: draft.event_date || null,
      published_at:
        draft.is_published && !draft.published_at
          ? new Date().toISOString()
          : draft.published_at,
    };

    try {
      const supabase = createClient();

      if (isNew) {
        const { data, error } = await supabase
          .from('work_posts')
          .insert(payload)
          .select('id')
          .single();
        if (error) throw error;
        setFeedback({ type: 'success', message: 'Work post created.' });
        router.replace(`/admin/work/${data.id}`);
        router.refresh();
        return;
      }

      const { error } = await supabase.from('work_posts').update(payload).eq('id', id);
      if (error) throw error;
      setDraft(payload);
      setFeedback({ type: 'success', message: 'Changes saved.' });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not save this work post.';
      setFeedback({
        type: 'error',
        message: /duplicate key|unique/i.test(message)
          ? 'That URL slug is already used by another work post. Please choose a different one.'
          : message,
      });
    } finally {
      setSaving(false);
    }
  }

  async function addMedia(urls: string[]) {
    if (isNew) {
      setFeedback({
        type: 'error',
        message: 'Please save this work post first, then add photographs to it.',
      });
      return;
    }
    try {
      const supabase = createClient();
      const rows = urls.map((url, index) => ({
        work_post_id: id,
        url,
        media_type: /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) ? 'video' : 'image',
        sort_order: media.length + index,
      }));
      const { error } = await supabase.from('work_media').insert(rows);
      if (error) throw error;
      load();
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not add the media.',
      });
    }
  }

  async function updateMedia(item: WorkMedia, patch: Partial<WorkMedia>) {
    setMedia((current) => current.map((m) => (m.id === item.id ? { ...m, ...patch } : m)));
    await createClient().from('work_media').update(patch).eq('id', item.id);
  }

  async function removeMedia(item: WorkMedia) {
    try {
      const { error } = await createClient().from('work_media').delete().eq('id', item.id);
      if (error) throw error;
      setMedia((current) => current.filter((m) => m.id !== item.id));
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not remove the media.',
      });
    }
  }

  async function move(item: WorkMedia, direction: -1 | 1) {
    const index = media.findIndex((m) => m.id === item.id);
    const target = index + direction;
    if (target < 0 || target >= media.length) return;

    const reordered = [...media];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setMedia(reordered);

    const supabase = createClient();
    await Promise.all(
      reordered.map((m, i) => supabase.from('work_media').update({ sort_order: i }).eq('id', m.id))
    );
  }

  if (loading) return <AdminLoading label="Loading work post" />;

  return (
    <form onSubmit={onSubmit}>
      <AdminPageHeader
        title={isNew ? 'New work post' : 'Edit work post'}
        description="Show photographs, videos and a description of traditional practice, a consultation, an event or a community activity."
        action={
          <>
            <Link href="/admin/work" className="btn-outline-forest !py-2.5 text-[0.8rem]">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back
            </Link>
            <SaveButton saving={saving} label={isNew ? 'Create work post' : 'Save changes'} />
          </>
        }
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AdminCard title="Details">
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
                  maxLength={200}
                  className="field"
                  placeholder="A short, descriptive title"
                />
              </Field>

              <SlugField
                value={draft.slug}
                onChange={(v) => set('slug', v)}
                source={draft.title}
                prefix="/our-work"
              />

              <Field
                label="Short description"
                required
                hint="One or two sentences, shown on the cards and in search results."
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

              <BodyField
                label="Full description"
                value={draft.description}
                onChange={(v) => set('description', v)}
              />
            </div>
          </AdminCard>

          <AdminCard
            title="Photographs & videos"
            description="Files added here appear in the gallery on the work post page."
            className={isNew ? 'opacity-60' : ''}
          >
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="btn-outline-forest !py-2.5 text-[0.8rem]"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add from media library
            </button>

            {isNew ? (
              <p className="mt-4 text-[0.82rem] text-forest-800/60">
                Save the work post first, then photographs can be attached to it.
              </p>
            ) : media.length ? (
              <ul className="mt-5 space-y-3">
                {media.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border border-earth-200 bg-cream-50 p-3 sm:flex-row"
                  >
                    <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-cream-200 sm:w-32">
                      {item.media_type === 'image' ? (
                        <Image
                          src={item.url}
                          alt={item.alt_text}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      ) : (
                        <video src={item.url} className="h-full w-full object-cover" muted />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-2.5">
                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) => updateMedia(item, { caption: e.target.value })}
                        placeholder="Caption (optional)"
                        aria-label="Caption"
                        className="field !py-2"
                      />
                      <input
                        type="text"
                        value={item.alt_text}
                        onChange={(e) => updateMedia(item, { alt_text: e.target.value })}
                        placeholder="Alternative text — describes the image for screen readers"
                        aria-label="Alternative text"
                        className="field !py-2"
                      />
                    </div>

                    <div className="flex shrink-0 gap-2 sm:flex-col">
                      <button
                        type="button"
                        onClick={() => move(item, -1)}
                        disabled={index === 0}
                        aria-label="Move up"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-earth-200 text-forest-800 disabled:opacity-35"
                      >
                        <GripVertical className="h-4 w-4 rotate-90" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMedia(item)}
                        aria-label="Remove this media"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-earth-200 text-red-700 hover:border-red-400 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-[0.82rem] text-forest-800/60">
                No photographs attached yet.
              </p>
            )}
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
          <AdminCard title="Publishing">
            <div className="space-y-3">
              <Toggle
                label="Published"
                description="Only published work posts appear on the website."
                checked={draft.is_published}
                onChange={(v) => set('is_published', v)}
              />
              <Toggle
                label="Featured"
                description="Featured posts are shown first on the homepage."
                checked={draft.is_featured}
                onChange={(v) => set('is_featured', v)}
              />
            </div>
          </AdminCard>

          <AdminCard title="Cover image">
            <MediaField
              label="Cover image"
              value={draft.cover_image}
              onChange={(v) => set('cover_image', v)}
              hint="Used on the cards, the page banner and when the link is shared."
            />
          </AdminCard>

          <AdminCard title="Organisation">
            <div className="space-y-5">
              <Field label="Category">
                <select
                  value={draft.category}
                  onChange={(e) => set('category', e.target.value)}
                  className="field"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>

              <TagsField value={draft.tags} onChange={(v) => set('tags', v)} />

              <Field label="Location" hint="Optional — for example a district or a town.">
                <input
                  type="text"
                  value={draft.location}
                  onChange={(e) => set('location', e.target.value)}
                  maxLength={120}
                  className="field"
                />
              </Field>

              <Field label="Date of the occasion">
                <input
                  type="date"
                  value={draft.event_date ?? ''}
                  onChange={(e) => set('event_date', e.target.value || null)}
                  className="field"
                />
              </Field>

              <Field
                label="Video link"
                hint="Optional YouTube, Vimeo or direct video URL shown on the page."
              >
                <input
                  type="url"
                  value={draft.video_url}
                  onChange={(e) => set('video_url', e.target.value)}
                  className="field"
                  placeholder="https://www.youtube.com/watch?v=…"
                />
              </Field>
            </div>
          </AdminCard>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-2.5 border-t border-earth-200 pt-6">
        <Link href="/admin/work" className="btn-outline-forest">
          Cancel
        </Link>
        <SaveButton saving={saving} label={isNew ? 'Create work post' : 'Save changes'} />
      </div>

      <MediaPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        multiple
        onSelect={(urls) => addMedia(urls)}
      />
    </form>
  );
}
