'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
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
import type { BlogPost } from '@/lib/types';

export default function AdminBlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const { pending, confirm } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await createClient()
        .from('blog_posts')
        .select('*, blog_categories(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPosts((data as BlogPost[]) ?? []);
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not load the articles.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleStatus(post: BlogPost) {
    const status = post.status === 'published' ? 'draft' : 'published';
    const { error } = await createClient()
      .from('blog_posts')
      .update({
        status,
        published_at:
          status === 'published' ? post.published_at ?? new Date().toISOString() : post.published_at,
      })
      .eq('id', post.id);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
      return;
    }
    setFeedback({
      type: 'success',
      message: status === 'published' ? 'Article published.' : 'Article moved back to draft.',
    });
    load();
  }

  async function remove(post: BlogPost) {
    const { error } = await createClient().from('blog_posts').delete().eq('id', post.id);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
      return;
    }
    setFeedback({ type: 'success', message: `"${post.title}" was deleted.` });
    load();
  }

  const scheduled = (post: BlogPost) =>
    post.status === 'published' && post.published_at && new Date(post.published_at) > new Date();

  return (
    <>
      <AdminPageHeader
        title="Blog & Insights"
        description="Write articles about traditional practice, Ugandan cultural traditions, guidance and announcements."
        action={
          <>
            <Link href="/admin/blog/categories" className="btn-outline-forest !py-2.5 text-[0.8rem]">
              Categories
            </Link>
            <Link href="/admin/blog/new" className="btn-gold !py-2.5 text-[0.8rem]">
              <Plus className="h-4 w-4" aria-hidden />
              New article
            </Link>
          </>
        }
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      {loading ? (
        <AdminLoading label="Loading articles" />
      ) : posts.length ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col gap-4 rounded-2xl border border-earth-200 bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-cream-100 sm:h-20 sm:w-32">
                {post.cover_image ? (
                  <Image src={post.cover_image} alt="" fill sizes="128px" className="object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-earth-300">
                    <BookOpen className="h-6 w-6" aria-hidden />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-[1.05rem] text-forest-900">{post.title}</h2>
                  <StatusPill published={post.status === 'published'} />
                  {scheduled(post) ? (
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[0.70rem] font-semibold text-blue-800">
                      Scheduled
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-1 text-[0.82rem] text-forest-800/65">
                  {post.excerpt}
                </p>
                <p className="mt-1 text-[0.74rem] text-forest-800/45">
                  {post.blog_categories?.name ?? 'Uncategorised'} &middot;{' '}
                  {formatDate(post.published_at || post.created_at)} &middot;{' '}
                  {post.reading_minutes} min read
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleStatus(post)}
                  className="rounded-lg border border-earth-200 px-3 py-2 text-[0.76rem] font-medium text-forest-800 transition hover:border-gold-400 hover:bg-gold-50"
                >
                  {post.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                {post.status === 'published' ? (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    aria-label={`View ${post.title} on the website`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-earth-200 text-forest-800 hover:border-gold-400 hover:bg-gold-50"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />
                  </Link>
                ) : null}
                <Link
                  href={`/admin/blog/${post.id}`}
                  aria-label={`Edit ${post.title}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-earth-200 text-forest-800 hover:border-gold-400 hover:bg-gold-50"
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
          icon={<BookOpen className="h-6 w-6" />}
          title="No articles yet"
          description="Write your first article about traditional practice, Ugandan cultural traditions, or an announcement about recent work."
          actionLabel="Write the first article"
          actionHref="/admin/blog/new"
        />
      )}
    </>
  );
}
