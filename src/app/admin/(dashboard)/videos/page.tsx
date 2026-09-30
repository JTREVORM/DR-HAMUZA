'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Pencil, Plus, Trash2, Video } from 'lucide-react';
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
import { formatDate, videoThumbnail } from '@/lib/utils';
import type { VideoItem } from '@/lib/types';

export default function AdminVideosListPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const { pending, confirm } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await createClient()
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setVideos((data as VideoItem[]) ?? []);
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not load the videos.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function togglePublished(video: VideoItem) {
    const next = !video.is_published;
    const { error } = await createClient()
      .from('videos')
      .update({
        is_published: next,
        published_at: next ? video.published_at ?? new Date().toISOString() : video.published_at,
      })
      .eq('id', video.id);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
      return;
    }
    setFeedback({ type: 'success', message: next ? 'Video published.' : 'Video unpublished.' });
    load();
  }

  async function remove(video: VideoItem) {
    const { error } = await createClient().from('videos').delete().eq('id', video.id);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
      return;
    }
    setFeedback({ type: 'success', message: `"${video.title}" was deleted.` });
    load();
  }

  return (
    <>
      <AdminPageHeader
        title="Videos"
        description="Add videos from YouTube or Vimeo, paste a direct video link, or upload a video file to the media library."
        action={
          <Link href="/admin/videos/new" className="btn-gold !py-2.5 text-[0.8rem]">
            <Plus className="h-4 w-4" aria-hidden />
            New video
          </Link>
        }
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      {loading ? (
        <AdminLoading label="Loading videos" />
      ) : videos.length ? (
        <div className="space-y-3">
          {videos.map((video) => {
            const thumb = videoThumbnail(video);
            return (
              <article
                key={video.id}
                className="flex flex-col gap-4 rounded-2xl border border-earth-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-forest-900 sm:w-40">
                  {thumb ? (
                    <Image src={thumb} alt="" fill sizes="160px" className="object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-gold-400">
                      <Video className="h-6 w-6" aria-hidden />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="font-display text-[1.05rem] text-forest-900">{video.title}</h2>
                    <StatusPill published={video.is_published} />
                    {video.is_featured ? (
                      <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[0.70rem] font-semibold text-gold-800">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 line-clamp-1 text-[0.82rem] text-forest-800/65">
                    {video.description}
                  </p>
                  <p className="mt-1 text-[0.74rem] capitalize text-forest-800/45">
                    {video.source} &middot; {video.category} &middot;{' '}
                    {formatDate(video.published_at || video.created_at)}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => togglePublished(video)}
                    className="rounded-lg border border-earth-200 px-3 py-2 text-[0.76rem] font-medium text-forest-800 transition hover:border-gold-400 hover:bg-gold-50"
                  >
                    {video.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  {video.is_published ? (
                    <Link
                      href={`/videos/${video.slug}`}
                      target="_blank"
                      aria-label={`View ${video.title} on the website`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-earth-200 text-forest-800 hover:border-gold-400 hover:bg-gold-50"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden />
                    </Link>
                  ) : null}
                  <Link
                    href={`/admin/videos/${video.id}`}
                    aria-label={`Edit ${video.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-earth-200 text-forest-800 hover:border-gold-400 hover:bg-gold-50"
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                  </Link>
                  <button
                    type="button"
                    onClick={() => confirm(video.id, () => remove(video))}
                    className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-[0.76rem] font-medium transition ${
                      pending === video.id
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'w-9 border-earth-200 px-0 text-red-700 hover:border-red-400 hover:bg-red-50'
                    }`}
                    aria-label={
                      pending === video.id
                        ? `Confirm deleting ${video.title}`
                        : `Delete ${video.title}`
                    }
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    {pending === video.id ? 'Confirm' : null}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <AdminEmptyState
          icon={<Video className="h-6 w-6" />}
          title="No videos yet"
          description="Add your first video by pasting a YouTube or Vimeo link, or by uploading a video file."
          actionLabel="Add the first video"
          actionHref="/admin/videos/new"
        />
      )}
    </>
  );
}
