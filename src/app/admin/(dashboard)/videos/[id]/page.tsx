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
import { SeoFields, SlugField, TagsField } from '@/components/admin/form-parts';
import { MediaField } from '@/components/admin/MediaPicker';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { createClient } from '@/lib/supabase/client';
import { detectVideoSource, slugify } from '@/lib/utils';
import type { VideoItem, VideoSource } from '@/lib/types';

const CATEGORIES = [
  'Traditional Practices',
  'Consultations',
  'Events',
  'Community Activities',
  'Messages',
  'General',
];

const SOURCES: { value: VideoSource; label: string }[] = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'vimeo', label: 'Vimeo' },
  { value: 'upload', label: 'Uploaded video file' },
  { value: 'url', label: 'Other link (detected automatically)' },
];

type Draft = Omit<VideoItem, 'id' | 'created_at'>;

const EMPTY: Draft = {
  slug: '',
  title: '',
  description: '',
  source: 'youtube',
  video_url: '',
  thumbnail_url: '',
  duration: '',
  category: 'General',
  tags: [],
  is_published: false,
  is_featured: false,
  seo_title: '',
  seo_description: '',
  published_at: null,
};

export default function AdminVideoEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();

  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const load = useCallback(async () => {
    if (isNew) return;
    try {
      const { data, error } = await createClient()
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      const { id: _id, created_at: _created, ...rest } = data as VideoItem;
      void _id;
      void _created;
      setDraft(rest as Draft);
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not load this video.',
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
      published_at:
        draft.is_published && !draft.published_at ? new Date().toISOString() : draft.published_at,
    };

    try {
      const supabase = createClient();
      if (isNew) {
        const { data, error } = await supabase
          .from('videos')
          .insert(payload)
          .select('id')
          .single();
        if (error) throw error;
        router.replace(`/admin/videos/${data.id}`);
        router.refresh();
        return;
      }
      const { error } = await supabase.from('videos').update(payload).eq('id', id);
      if (error) throw error;
      setDraft(payload);
      setFeedback({ type: 'success', message: 'Video saved.' });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not save this video.';
      setFeedback({
        type: 'error',
        message: /duplicate key|unique/i.test(message)
          ? 'That URL slug is already used by another video. Please choose a different one.'
          : message,
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminLoading label="Loading video" />;

  return (
    <form onSubmit={onSubmit}>
      <AdminPageHeader
        title={isNew ? 'New video' : 'Edit video'}
        description="Paste a YouTube or Vimeo link, or choose an uploaded video file from the media library."
        action={
          <>
            <Link href="/admin/videos" className="btn-outline-forest !py-2.5 text-[0.8rem]">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back
            </Link>
            <SaveButton saving={saving} label={isNew ? 'Create video' : 'Save changes'} />
          </>
        }
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AdminCard title="Video details">
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
                />
              </Field>

              <SlugField
                value={draft.slug}
                onChange={(v) => set('slug', v)}
                source={draft.title}
                prefix="/videos"
              />

              <Field label="Description">
                <textarea
                  value={draft.description}
                  onChange={(e) => set('description', e.target.value)}
                  rows={5}
                  maxLength={2000}
                  className="field resize-y"
                />
              </Field>

              <Field label="Where the video comes from">
                <select
                  value={draft.source}
                  onChange={(e) => set('source', e.target.value as VideoSource)}
                  className="field"
                >
                  {SOURCES.map((source) => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
              </Field>

              {draft.source === 'upload' ? (
                <MediaField
                  label="Video file"
                  value={draft.video_url}
                  onChange={(v) => set('video_url', v)}
                  filter="video"
                  hint="Upload the file in the media library first, then choose it here."
                />
              ) : (
                <Field
                  label="Video link"
                  required
                  hint="For example https://www.youtube.com/watch?v=… or https://vimeo.com/…"
                >
                  <input
                    type="url"
                    value={draft.video_url}
                    onChange={(e) => {
                      set('video_url', e.target.value);
                      if (draft.source === 'url' && e.target.value) {
                        set('source', detectVideoSource(e.target.value));
                      }
                    }}
                    required
                    className="field"
                  />
                </Field>
              )}

              {draft.video_url ? (
                <div>
                  <span className="label">Preview</span>
                  <VideoPlayer
                    video={{ ...draft, id: id, created_at: new Date().toISOString() }}
                  />
                </div>
              ) : null}
            </div>
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
          <AdminCard title="Publishing">
            <div className="space-y-3">
              <Toggle
                label="Published"
                description="Only published videos appear on the website."
                checked={draft.is_published}
                onChange={(v) => set('is_published', v)}
              />
              <Toggle
                label="Featured"
                description="The featured video is shown large on the homepage and the videos page."
                checked={draft.is_featured}
                onChange={(v) => set('is_featured', v)}
              />
            </div>
          </AdminCard>

          <AdminCard title="Thumbnail">
            <MediaField
              label="Custom thumbnail"
              value={draft.thumbnail_url}
              onChange={(v) => set('thumbnail_url', v)}
              hint="Optional. YouTube videos use their own thumbnail automatically."
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

              <Field label="Duration" hint="Optional, for example 4:32.">
                <input
                  type="text"
                  value={draft.duration}
                  onChange={(e) => set('duration', e.target.value)}
                  maxLength={20}
                  className="field"
                />
              </Field>

              <TagsField value={draft.tags} onChange={(v) => set('tags', v)} />
            </div>
          </AdminCard>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-2.5 border-t border-earth-200 pt-6">
        <Link href="/admin/videos" className="btn-outline-forest">
          Cancel
        </Link>
        <SaveButton saving={saving} label={isNew ? 'Create video' : 'Save changes'} />
      </div>
    </form>
  );
}
