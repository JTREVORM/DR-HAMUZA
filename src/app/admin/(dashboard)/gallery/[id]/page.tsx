'use client';

import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
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
import { SeoFields, SlugField } from '@/components/admin/form-parts';
import { MediaField, MediaPickerDialog } from '@/components/admin/MediaPicker';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import type { Gallery, GalleryImage } from '@/lib/types';

const CATEGORIES = [
  'Traditional Practices',
  'Herbs & Traditional Items',
  'Events',
  'Consultations',
  'Community Activities',
  'Recent Work',
  'Client-approved Stories',
  'General',
];

type Draft = Omit<Gallery, 'id' | 'created_at' | 'gallery_images'>;

const EMPTY: Draft = {
  slug: '',
  title: '',
  description: '',
  cover_image: '',
  category: 'General',
  sort_order: 0,
  is_published: true,
  seo_title: '',
  seo_description: '',
};

export default function AdminGalleryEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();

  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [images, setImages] = useState<GalleryImage[]>([]);
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
        .from('galleries')
        .select('*, gallery_images(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      const album = data as Gallery;
      const { id: _id, created_at: _created, gallery_images, ...rest } = album;
      void _id;
      void _created;
      setDraft(rest as Draft);
      setImages((gallery_images ?? []).sort((a, b) => a.sort_order - b.sort_order));
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not load this album.',
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

    const payload = { ...draft, slug: draft.slug || slugify(draft.title) };

    try {
      const supabase = createClient();
      if (isNew) {
        const { data, error } = await supabase
          .from('galleries')
          .insert(payload)
          .select('id')
          .single();
        if (error) throw error;
        router.replace(`/admin/gallery/${data.id}`);
        router.refresh();
        return;
      }
      const { error } = await supabase.from('galleries').update(payload).eq('id', id);
      if (error) throw error;
      setDraft(payload);
      setFeedback({ type: 'success', message: 'Album saved.' });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not save this album.';
      setFeedback({
        type: 'error',
        message: /duplicate key|unique/i.test(message)
          ? 'That URL slug is already used by another album. Please choose a different one.'
          : message,
      });
    } finally {
      setSaving(false);
    }
  }

  async function addImages(urls: string[]) {
    if (isNew) {
      setFeedback({
        type: 'error',
        message: 'Please save the album first, then add photographs to it.',
      });
      return;
    }
    try {
      const rows = urls.map((url, index) => ({
        gallery_id: id,
        url,
        sort_order: images.length + index,
      }));
      const { error } = await createClient().from('gallery_images').insert(rows);
      if (error) throw error;
      if (!draft.cover_image && urls[0]) {
        set('cover_image', urls[0]);
        await createClient().from('galleries').update({ cover_image: urls[0] }).eq('id', id);
      }
      load();
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not add the photographs.',
      });
    }
  }

  async function updateImage(item: GalleryImage, patch: Partial<GalleryImage>) {
    setImages((current) => current.map((i) => (i.id === item.id ? { ...i, ...patch } : i)));
    await createClient().from('gallery_images').update(patch).eq('id', item.id);
  }

  async function removeImage(item: GalleryImage) {
    const { error } = await createClient().from('gallery_images').delete().eq('id', item.id);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
      return;
    }
    setImages((current) => current.filter((i) => i.id !== item.id));
  }

  async function move(item: GalleryImage, direction: -1 | 1) {
    const index = images.findIndex((i) => i.id === item.id);
    const target = index + direction;
    if (target < 0 || target >= images.length) return;

    const reordered = [...images];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setImages(reordered);

    const supabase = createClient();
    await Promise.all(
      reordered.map((i, order) =>
        supabase.from('gallery_images').update({ sort_order: order }).eq('id', i.id)
      )
    );
  }

  if (loading) return <AdminLoading label="Loading album" />;

  return (
    <form onSubmit={onSubmit}>
      <AdminPageHeader
        title={isNew ? 'New album' : 'Edit album'}
        description="An album groups related photographs together on the gallery page."
        action={
          <>
            <Link href="/admin/gallery" className="btn-outline-forest !py-2.5 text-[0.8rem]">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back
            </Link>
            <SaveButton saving={saving} label={isNew ? 'Create album' : 'Save changes'} />
          </>
        }
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AdminCard title="Album details">
            <div className="space-y-5">
              <Field label="Album title" required>
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
                  placeholder="For example: Herbs & Traditional Items"
                />
              </Field>

              <SlugField
                value={draft.slug}
                onChange={(v) => set('slug', v)}
                source={draft.title}
                prefix="/gallery"
              />

              <Field label="Description">
                <textarea
                  value={draft.description}
                  onChange={(e) => set('description', e.target.value)}
                  rows={4}
                  maxLength={600}
                  className="field resize-y"
                />
              </Field>

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
            </div>
          </AdminCard>

          <AdminCard
            title="Photographs"
            description="Add photographs from the media library. Drag order is set with the arrows."
          >
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="btn-outline-forest !py-2.5 text-[0.8rem]"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add photographs
            </button>

            {isNew ? (
              <p className="mt-4 text-[0.82rem] text-forest-800/60">
                Save the album first, then photographs can be added to it.
              </p>
            ) : images.length ? (
              <ul className="mt-5 space-y-3">
                {images.map((image, index) => (
                  <li
                    key={image.id}
                    className="flex flex-col gap-3 rounded-xl border border-earth-200 bg-cream-50 p-3 sm:flex-row"
                  >
                    <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-cream-200 sm:w-32">
                      <Image
                        src={image.url}
                        alt={image.alt_text}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-2.5">
                      <input
                        type="text"
                        value={image.caption}
                        onChange={(e) => updateImage(image, { caption: e.target.value })}
                        placeholder="Caption (optional)"
                        aria-label="Caption"
                        className="field !py-2"
                      />
                      <input
                        type="text"
                        value={image.alt_text}
                        onChange={(e) => updateImage(image, { alt_text: e.target.value })}
                        placeholder="Alternative text — describes the photograph for screen readers"
                        aria-label="Alternative text"
                        className="field !py-2"
                      />
                    </div>

                    <div className="flex shrink-0 gap-2 sm:flex-col">
                      <button
                        type="button"
                        onClick={() => move(image, -1)}
                        disabled={index === 0}
                        aria-label="Move earlier"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-earth-200 text-forest-800 disabled:opacity-35"
                      >
                        <ChevronLeft className="h-4 w-4 rotate-90" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(image, 1)}
                        disabled={index === images.length - 1}
                        aria-label="Move later"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-earth-200 text-forest-800 disabled:opacity-35"
                      >
                        <ChevronRight className="h-4 w-4 rotate-90" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(image)}
                        aria-label="Remove this photograph"
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
                This album has no photographs yet. Albums without photographs are hidden from the
                website.
              </p>
            )}
          </AdminCard>

          <SeoFields
            seoTitle={draft.seo_title}
            seoDescription={draft.seo_description}
            onTitleChange={(v) => set('seo_title', v)}
            onDescriptionChange={(v) => set('seo_description', v)}
            fallbackTitle={draft.title}
            fallbackDescription={draft.description}
          />
        </div>

        <div className="space-y-6">
          <AdminCard title="Visibility">
            <Toggle
              label="Visible on the website"
              description="Albums without photographs stay hidden regardless of this setting."
              checked={draft.is_published}
              onChange={(v) => set('is_published', v)}
            />
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

          <AdminCard title="Cover image">
            <MediaField
              label="Album cover"
              value={draft.cover_image}
              onChange={(v) => set('cover_image', v)}
            />
          </AdminCard>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-2.5 border-t border-earth-200 pt-6">
        <Link href="/admin/gallery" className="btn-outline-forest">
          Cancel
        </Link>
        <SaveButton saving={saving} label={isNew ? 'Create album' : 'Save changes'} />
      </div>

      <MediaPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        multiple
        filter="image"
        onSelect={(urls) => addImages(urls)}
      />
    </form>
  );
}
