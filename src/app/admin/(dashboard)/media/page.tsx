'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Copy, ImageIcon, Loader2, Search, Trash2, Upload, Video, X } from 'lucide-react';
import {
  AdminEmptyState,
  AdminLoading,
  AdminPageHeader,
  FeedbackBanner,
  Field,
  useConfirm,
  type Feedback,
} from '@/components/admin/ui';
import { createClient } from '@/lib/supabase/client';
import { ACCEPTED_TYPES, deleteMedia, uploadMedia } from '@/lib/media';
import { cn, formatBytes, formatDate } from '@/lib/utils';
import type { MediaItem } from '@/lib/types';

const CATEGORIES = [
  'General',
  'Traditional Practices',
  'Herbs & Traditional Items',
  'Events',
  'Consultations',
  'Community Activities',
  'Portraits',
];

const TYPE_FILTERS = [
  { value: 'all', label: 'All files' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
] as const;

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [active, setActive] = useState<MediaItem | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const { pending, confirm } = useConfirm();
  const dropRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await createClient()
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setFeedback({ type: 'error', message: error.message });
    setItems((data as MediaItem[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleFiles = useCallback(
    async (files: FileList | File[] | null) => {
      const list = files ? Array.from(files) : [];
      if (!list.length) return;

      setUploading(true);
      setFeedback(null);
      let added = 0;
      let reused = 0;

      try {
        const supabase = createClient();
        for (const [index, file] of list.entries()) {
          setProgress(`Uploading ${index + 1} of ${list.length}: ${file.name}`);
          const result = await uploadMedia(supabase, file);
          if (result.reused) reused += 1;
          else added += 1;
        }
        setFeedback({
          type: 'success',
          message:
            `${added} ${added === 1 ? 'file was' : 'files were'} uploaded.` +
            (reused
              ? ` ${reused} ${reused === 1 ? 'file was' : 'files were'} already in the library and were not stored again.`
              : ''),
        });
        load();
      } catch (e) {
        setFeedback({
          type: 'error',
          message: e instanceof Error ? e.message : 'The upload could not be completed.',
        });
      } finally {
        setUploading(false);
        setProgress('');
      }
    },
    [load]
  );

  // Drag and drop onto the upload panel.
  useEffect(() => {
    const node = dropRef.current;
    if (!node) return;

    const stop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onDrop = (e: DragEvent) => {
      stop(e);
      node.classList.remove('border-gold-500', 'bg-gold-50');
      handleFiles(e.dataTransfer?.files ?? null);
    };
    const onOver = (e: DragEvent) => {
      stop(e);
      node.classList.add('border-gold-500', 'bg-gold-50');
    };
    const onLeave = (e: DragEvent) => {
      stop(e);
      node.classList.remove('border-gold-500', 'bg-gold-50');
    };

    node.addEventListener('dragover', onOver);
    node.addEventListener('dragleave', onLeave);
    node.addEventListener('drop', onDrop);
    return () => {
      node.removeEventListener('dragover', onOver);
      node.removeEventListener('dragleave', onLeave);
      node.removeEventListener('drop', onDrop);
    };
  }, [handleFiles]);

  async function patch(item: MediaItem, changes: Partial<MediaItem>) {
    setItems((current) => current.map((i) => (i.id === item.id ? { ...i, ...changes } : i)));
    setActive((current) => (current && current.id === item.id ? { ...current, ...changes } : current));
    const { error } = await createClient().from('media_library').update(changes).eq('id', item.id);
    if (error) setFeedback({ type: 'error', message: error.message });
  }

  async function remove(item: MediaItem) {
    try {
      await deleteMedia(createClient(), item);
      setItems((current) => current.filter((i) => i.id !== item.id));
      setActive(null);
      setFeedback({
        type: 'success',
        message: `"${item.file_name}" was deleted. Any page still using it will now show a missing image.`,
      });
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not delete the file.',
      });
    }
  }

  const visible = useMemo(
    () =>
      items.filter((item) => {
        if (typeFilter !== 'all' && item.media_type !== typeFilter) return false;
        if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
        if (!query) return true;
        return `${item.file_name} ${item.title} ${item.alt_text} ${item.caption} ${item.category}`
          .toLowerCase()
          .includes(query.toLowerCase());
      }),
    [items, typeFilter, categoryFilter, query]
  );

  const totalBytes = items.reduce((sum, item) => sum + item.size_bytes, 0);

  return (
    <>
      <AdminPageHeader
        title="Media Library"
        description="Every photograph and video used anywhere on the website. Upload once here, then use the file in any page."
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <div
        ref={dropRef}
        className="mb-6 rounded-2xl border-2 border-dashed border-earth-300 bg-white p-8 text-center transition-colors"
      >
        <Upload className="mx-auto h-8 w-8 text-gold-600" aria-hidden />
        <p className="mt-4 font-display text-lg text-forest-900">
          Drag files here, or choose them
        </p>
        <p className="mx-auto mt-2 max-w-md text-[0.82rem] leading-relaxed text-forest-800/60">
          JPG, PNG, WebP, AVIF, GIF or SVG images up to 12 MB, and MP4, WebM, MOV or OGG videos
          up to 200 MB.
        </p>
        <label className="btn-gold mt-6 cursor-pointer">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Upload className="h-4 w-4" aria-hidden />
          )}
          {uploading ? 'Uploading…' : 'Choose files'}
          <input
            type="file"
            multiple
            accept={ACCEPTED_TYPES.join(',')}
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </label>
        {progress ? (
          <p className="mt-4 text-[0.8rem] text-forest-800/65" aria-live="polite">
            {progress}
          </p>
        ) : null}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[13rem] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-800/35"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, caption or description…"
            aria-label="Search media"
            className="field pl-9"
          />
        </div>

        <div className="flex gap-2">
          {TYPE_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTypeFilter(option.value)}
              aria-pressed={typeFilter === option.value}
              className={cn(
                'rounded-full border px-4 py-2 text-[0.78rem] font-medium transition',
                typeFilter === option.value
                  ? 'border-gold-500 bg-gold-400 text-forest-950'
                  : 'border-earth-200 bg-white text-forest-800 hover:border-gold-400'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
          className="field !w-auto"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {items.length ? (
        <p className="mb-4 text-[0.78rem] text-forest-800/50">
          {items.length} {items.length === 1 ? 'file' : 'files'} &middot; {formatBytes(totalBytes)}{' '}
          stored &middot; showing {visible.length}
        </p>
      ) : null}

      {loading ? (
        <AdminLoading label="Loading media" />
      ) : visible.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {visible.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item)}
              className="group overflow-hidden rounded-xl border border-earth-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-md"
            >
              <span className="relative block aspect-square bg-cream-100">
                {item.media_type === 'image' ? (
                  <Image
                    src={item.url}
                    alt={item.alt_text || item.file_name}
                    fill
                    sizes="(max-width:640px) 50vw, 220px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center bg-forest-900 text-gold-400">
                    <Video className="h-8 w-8" aria-hidden />
                  </span>
                )}
              </span>
              <span className="block p-3">
                <span className="block truncate text-[0.78rem] font-medium text-forest-900">
                  {item.title || item.file_name}
                </span>
                <span className="mt-0.5 block text-[0.68rem] text-forest-800/50">
                  {formatBytes(item.size_bytes)}
                  {item.width ? ` · ${item.width}×${item.height}` : ''}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <AdminEmptyState
          icon={<ImageIcon className="h-6 w-6" />}
          title={items.length ? 'Nothing matched those filters' : 'No media uploaded yet'}
          description={
            items.length
              ? 'Try a different search word, type or category.'
              : 'Upload your first photographs and videos above. They can then be used in work posts, albums, articles and services.'
          }
        />
      )}

      {/* Detail drawer */}
      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Details of ${active.file_name}`}
          className="fixed inset-0 z-[120] flex justify-end bg-forest-950/60 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="h-full w-full max-w-md overflow-y-auto bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-earth-200 px-5 py-4">
              <h2 className="font-display text-lg text-forest-900">File details</h2>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close file details"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-forest-800 hover:bg-cream-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-cream-100">
              {active.media_type === 'image' ? (
                <Image
                  src={active.url}
                  alt={active.alt_text || active.file_name}
                  fill
                  sizes="400px"
                  className="object-contain"
                />
              ) : (
                <video src={active.url} controls className="h-full w-full bg-black" />
              )}
            </div>

            <div className="space-y-5 p-5">
              <Field label="Title">
                <input
                  type="text"
                  value={active.title}
                  onChange={(e) => patch(active, { title: e.target.value })}
                  className="field"
                />
              </Field>

              <Field
                label="Alternative text"
                hint="Describes the image for people using a screen reader, and helps search engines."
              >
                <input
                  type="text"
                  value={active.alt_text}
                  onChange={(e) => patch(active, { alt_text: e.target.value })}
                  className="field"
                />
              </Field>

              <Field label="Caption">
                <input
                  type="text"
                  value={active.caption}
                  onChange={(e) => patch(active, { caption: e.target.value })}
                  className="field"
                />
              </Field>

              <Field label="Category">
                <select
                  value={active.category}
                  onChange={(e) => patch(active, { category: e.target.value })}
                  className="field"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>

              <dl className="space-y-1.5 rounded-xl bg-cream-50 p-4 text-[0.78rem]">
                <div className="flex justify-between gap-4">
                  <dt className="text-forest-800/55">File name</dt>
                  <dd className="truncate text-forest-900">{active.file_name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-forest-800/55">Size</dt>
                  <dd className="text-forest-900">{formatBytes(active.size_bytes)}</dd>
                </div>
                {active.width ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-forest-800/55">Dimensions</dt>
                    <dd className="text-forest-900">
                      {active.width} &times; {active.height}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4">
                  <dt className="text-forest-800/55">Uploaded</dt>
                  <dd className="text-forest-900">{formatDate(active.created_at)}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(active.url);
                  setFeedback({ type: 'success', message: 'Link copied to the clipboard.' });
                }}
                className="btn-outline-forest w-full"
              >
                <Copy className="h-4 w-4" aria-hidden />
                Copy file link
              </button>

              <button
                type="button"
                onClick={() => confirm(active.id, () => remove(active))}
                className={cn(
                  'btn w-full',
                  pending === active.id
                    ? 'bg-red-500 text-white'
                    : 'border border-red-300 text-red-700 hover:bg-red-50'
                )}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                {pending === active.id
                  ? 'Tap again to delete permanently'
                  : 'Delete this file'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
