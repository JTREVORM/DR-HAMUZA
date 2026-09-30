'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Images, Pencil, Plus, Trash2 } from 'lucide-react';
import {
  AdminEmptyState,
  AdminLoading,
  AdminPageHeader,
  FeedbackBanner,
  StatusPill,
  useConfirm,
  type Feedback,
} from '@/components/admin/ui';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import type { WorkPost } from '@/lib/types';

export default function AdminWorkListPage() {
  const [posts, setPosts] = useState<WorkPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const { pending, confirm } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await createClient()
        .from('work_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPosts((data as WorkPost[]) ?? []);
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not load work posts.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function togglePublished(post: WorkPost) {
    const next = !post.is_published;
    try {
      const { error } = await createClient()
        .from('work_posts')
        .update({
          is_published: next,
          published_at: next ? post.published_at ?? new Date().toISOString() : post.published_at,
        })
        .eq('id', post.id);
      if (error) throw error;
      setFeedback({
        type: 'success',
        message: next ? 'Work post published.' : 'Work post unpublished.',
      });
      load();
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not update the work post.',
      });
    }
  }

  async function remove(post: WorkPost) {
    try {
      const { error } = await createClient().from('work_posts').delete().eq('id', post.id);
      if (error) throw error;
      setFeedback({ type: 'success', message: `"${post.title}" was deleted.` });
      load();
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not delete the work post.',
      });
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Our Work"
        description="Photographs and records of traditional practice, consultations, events and community activities."
        action={
          <Link href="/admin/work/new" className="btn-gold !py-2.5 text-[0.8rem]">
            <Plus className="h-4 w-4" aria-hidden />
            New work post
          </Link>
        }
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      {loading ? (
        <AdminLoading label="Loading work posts" />
      ) : posts.length ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col gap-4 rounded-2xl border border-earth-200 bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-cream-100 sm:h-20 sm:w-32">
                {post.cover_image ? (
                  <Image
                    src={post.cover_image}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-earth-300">
                    <Images className="h-6 w-6" aria-hidden />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-[1.05rem] text-forest-900">{post.title}</h2>
                  <StatusPill published={post.is_published} />
                  {post.is_featured ? (
                    <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[0.68rem] font-semibold text-gold-800">
                      Featured
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-1 text-[0.82rem] text-forest-800/65">
                  {post.short_description}
                </p>
                <p className="mt-1 text-[0.74rem] text-forest-800/45">
                  {post.category} &middot;{' '}
                  {formatDate(post.event_date || post.published_at || post.created_at)}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => togglePublished(post)}
                  className="rounded-lg border border-earth-200 px-3 py-2 text-[0.76rem] font-medium text-forest-800 transition hover:border-gold-400 hover:bg-gold-50"
                >
                  {post.is_published ? 'Unpublish' : 'Publish'}
                </button>
                {post.is_published ? (
                  <Link
                    href={`/our-work/${post.slug}`}
                    target="_blank"
                    aria-label={`View ${post.title} on the website`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-earth-200 text-forest-800 transition hover:border-gold-400 hover:bg-gold-50"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />
                  </Link>
                ) : null}
                <Link
                  href={`/admin/work/${post.id}`}
                  aria-label={`Edit ${post.title}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-earth-200 text-forest-800 transition hover:border-gold-400 hover:bg-gold-50"
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                </Link>
                <button
                  type="button"
                  onClick={() => confirm(post.id, () => remove(post))}
                  className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-[0.76rem] font-medium transition ${
                    pending === post.id
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'w-9 border-earth-200 px-0 text-red-700 hover:border-red-400 hover:bg-red-50'
                  }`}
                  aria-label={
                    pending === post.id ? `Confirm deleting ${post.title}` : `Delete ${post.title}`
                  }
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  {pending === post.id ? 'Confirm' : null}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmptyState
          icon={<Images className="h-6 w-6" />}
          title="No work posts yet"
          description="Create your first work post to show photographs and videos of traditional practice, consultations, events and community activities on the website."
          actionLabel="Create the first work post"
          actionHref="/admin/work/new"
        />
      )}
    </>
  );
}
