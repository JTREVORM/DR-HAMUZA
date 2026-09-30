'use client';

import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye } from 'lucide-react';
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
import { MediaField } from '@/components/admin/MediaPicker';
import { createClient } from '@/lib/supabase/client';
import { excerptFrom, readingMinutes, renderRichText, slugify } from '@/lib/utils';
import type { BlogCategory, BlogPost } from '@/lib/types';

type Draft = Omit<BlogPost, 'id' | 'created_at' | 'blog_categories'>;

const EMPTY: Draft = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  cover_image: '',
  category_id: null,
  tags: [],
  author_name: 'Dr Salongo Hamuza',
  reading_minutes: 4,
  status: 'draft',
  is_featured: false,
  seo_title: '',
  seo_description: '',
  published_at: null,
};

/** Converts between an ISO timestamp and the value a datetime-local input wants. */
const toLocalInput = (iso: string | null) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export default function AdminBlogEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();

  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: cats } = await supabase.from('blog_categories').select('*').order('name');
    setCategories((cats as BlogCategory[]) ?? []);

    if (isNew) return;
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      const { id: _id, created_at: _created, ...rest } = data as BlogPost;
      void _id;
      void _created;
      setDraft(rest as Draft);
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not load this article.',
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
      excerpt: draft.excerpt || excerptFrom(draft.content, 200),
      reading_minutes: readingMinutes(draft.content),
      published_at:
        draft.status === 'published' && !draft.published_at
          ? new Date().toISOString()
          : draft.published_at,
    };

    try {
      const supabase = createClient();
      if (isNew) {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert(payload)
          .select('id')
          .single();
        if (error) throw error;
        router.replace(`/admin/blog/${data.id}`);
        router.refresh();
        return;
      }
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', id);
      if (error) throw error;
      setDraft(payload);
      setFeedback({ type: 'success', message: 'Article saved.' });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not save this article.';
      setFeedback({
        type: 'error',
        message: /duplicate key|unique/i.test(message)
          ? 'That URL slug is already used by another article. Please choose a different one.'
          : message,
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminLoading label="Loading article" />;

  const scheduledAhead =
    draft.status === 'published' &&
    draft.published_at &&
    new Date(draft.published_at) > new Date();

  return (
    <form onSubmit={onSubmit}>
      <AdminPageHeader
        title={isNew ? 'New article' : 'Edit article'}
        description="Write about traditional practice, cultural traditions, guidance or recent work. Save as a draft until it is ready."
        action={
          <>
            <Link href="/admin/blog" className="btn-outline-forest !py-2.5 text-[0.8rem]">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back
            </Link>
            <SaveButton saving={saving} label={isNew ? 'Create article' : 'Save changes'} />
          </>
        }
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AdminCard title="Article">
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
                prefix="/blog"
              />

              <Field
                label="Summary"
                hint="Shown on the article cards and in search results. Left blank, the opening of the article is used."
              >
                <textarea
                  value={draft.excerpt}
                  onChange={(e) => set('excerpt', e.target.value)}
                  rows={3}
                  maxLength={400}
                  className="field resize-y"
                  placeholder={excerptFrom(draft.content, 180)}
                />
              </Field>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="label !mb-0">Article content</span>
                  <button
                    type="button"
                    onClick={() => setPreview((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-[0.76rem] font-medium text-gold-700 hover:text-forest-900"
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden />
                    {preview ? 'Back to writing' : 'Preview'}
                  </button>
                </div>

                {preview ? (
                  <div
                    className="prose-brand rounded-xl border border-earth-200 bg-cream-50 p-6"
                    dangerouslySetInnerHTML={{ __html: renderRichText(draft.content) }}
                  />
                ) : (
                  <BodyField
                    label=""
                    value={draft.content}
                    onChange={(v) => set('content', v)}
                    rows={22}
                  />
                )}
                <p className="mt-2 text-[0.74rem] text-forest-800/50">
                  About {readingMinutes(draft.content)} minutes to read.
                </p>
              </div>
            </div>
          </AdminCard>

          <SeoFields
            seoTitle={draft.seo_title}
            seoDescription={draft.seo_description}
            onTitleChange={(v) => set('seo_title', v)}
            onDescriptionChange={(v) => set('seo_description', v)}
            fallbackTitle={draft.title}
            fallbackDescription={draft.excerpt || draft.content}
          />
        </div>

        <div className="space-y-6">
          <AdminCard title="Publishing">
            <div className="space-y-5">
              <Field label="Status">
                <select
                  value={draft.status}
                  onChange={(e) => set('status', e.target.value as Draft['status'])}
                  className="field"
                >
                  <option value="draft">Draft — not visible on the website</option>
                  <option value="published">Published</option>
                </select>
              </Field>

              <Field
                label="Publication date and time"
                hint="Set a future time to schedule the article. It stays hidden until then."
              >
                <input
                  type="datetime-local"
                  value={toLocalInput(draft.published_at)}
                  onChange={(e) =>
                    set(
                      'published_at',
                      e.target.value ? new Date(e.target.value).toISOString() : null
                    )
                  }
                  className="field"
                />
              </Field>

              {scheduledAhead ? (
                <p className="rounded-lg border border-blue-300 bg-blue-50 p-3 text-[0.78rem] text-blue-900">
                  This article is scheduled and will appear on the website at the time set above.
                </p>
              ) : null}

              <Toggle
                label="Featured"
                checked={draft.is_featured}
                onChange={(v) => set('is_featured', v)}
              />
            </div>
          </AdminCard>

          <AdminCard title="Featured image">
            <MediaField
              label="Cover image"
              value={draft.cover_image}
              onChange={(v) => set('cover_image', v)}
            />
          </AdminCard>

          <AdminCard title="Organisation">
            <div className="space-y-5">
              <Field label="Category">
                <select
                  value={draft.category_id ?? ''}
                  onChange={(e) => set('category_id', e.target.value || null)}
                  className="field"
                >
                  <option value="">Uncategorised</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Field>

              <TagsField value={draft.tags} onChange={(v) => set('tags', v)} />

              <Field label="Author">
                <input
                  type="text"
                  value={draft.author_name}
                  onChange={(e) => set('author_name', e.target.value)}
                  maxLength={120}
                  className="field"
                />
              </Field>
            </div>
          </AdminCard>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-2.5 border-t border-earth-200 pt-6">
        <Link href="/admin/blog" className="btn-outline-forest">
          Cancel
        </Link>
        <SaveButton saving={saving} label={isNew ? 'Create article' : 'Save changes'} />
      </div>
    </form>
  );
}
