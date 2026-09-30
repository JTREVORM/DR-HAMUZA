'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, LibraryBig, Pencil, Plus, Trash2 } from 'lucide-react';
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
import type { Gallery } from '@/lib/types';

export default function AdminGalleryListPage() {
  const [albums, setAlbums] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const { pending, confirm } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await createClient()
        .from('galleries')
        .select('*, gallery_images(id)')
        .order('sort_order')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAlbums((data as Gallery[]) ?? []);
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not load the albums.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(album: Gallery) {
    try {
      const { error } = await createClient().from('galleries').delete().eq('id', album.id);
      if (error) throw error;
      setFeedback({ type: 'success', message: `"${album.title}" was deleted.` });
      load();
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not delete the album.',
      });
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Photo Gallery"
        description="Group photographs into albums such as Traditional Practices, Herbs & Traditional Items, Events, Consultations and Community Activities."
        action={
          <Link href="/admin/gallery/new" className="btn-gold !py-2.5 text-[0.8rem]">
            <Plus className="h-4 w-4" aria-hidden />
            New album
          </Link>
        }
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      {loading ? (
        <AdminLoading label="Loading albums" />
      ) : albums.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => {
            const count = album.gallery_images?.length ?? 0;
            const cover = album.cover_image;
            return (
              <article
                key={album.id}
                className="overflow-hidden rounded-2xl border border-earth-200 bg-white"
              >
                <div className="relative aspect-[4/3] bg-cream-100">
                  {cover ? (
                    <Image src={cover} alt="" fill sizes="400px" className="object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-earth-300">
                      <LibraryBig className="h-8 w-8" aria-hidden />
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2.5">
                    <h2 className="font-display text-[1.05rem] text-forest-900">{album.title}</h2>
                    <StatusPill published={album.is_published} labels={['Visible', 'Hidden']} />
                  </div>
                  <p className="mt-1.5 text-[0.78rem] text-forest-800/55">
                    {album.category} &middot; {count} {count === 1 ? 'photograph' : 'photographs'}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={`/admin/gallery/${album.id}`}
                      className="btn-outline-forest !py-2 text-[0.76rem]"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden />
                      Edit
                    </Link>
                    {album.is_published ? (
                      <Link
                        href={`/gallery/${album.slug}`}
                        target="_blank"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-earth-200 text-forest-800 hover:border-gold-400 hover:bg-gold-50"
                        aria-label={`View ${album.title} on the website`}
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden />
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => confirm(album.id, () => remove(album))}
                      className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-[0.76rem] font-medium transition ${
                        pending === album.id
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'w-9 border-earth-200 px-0 text-red-700 hover:border-red-400 hover:bg-red-50'
                      }`}
                      aria-label={
                        pending === album.id
                          ? `Confirm deleting ${album.title}`
                          : `Delete ${album.title}`
                      }
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      {pending === album.id ? 'Confirm' : null}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <AdminEmptyState
          icon={<LibraryBig className="h-6 w-6" />}
          title="No albums yet"
          description="Create your first album to organise photographs of traditional practices, herbs, events, consultations and community activities."
          actionLabel="Create the first album"
          actionHref="/admin/gallery/new"
        />
      )}
    </>
  );
}
