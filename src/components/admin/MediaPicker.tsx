'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Check, ImageIcon, Loader2, Search, Upload, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { uploadMedia, ACCEPTED_TYPES } from '@/lib/media';
import type { MediaItem } from '@/lib/types';
import { cn, formatBytes } from '@/lib/utils';

/**
 * Modal for choosing media. Uploads go straight into the shared library, so a
 * file uploaded once is available everywhere in the dashboard.
 */
export function MediaPickerDialog({
  open,
  onClose,
  onSelect,
  filter = 'all',
  multiple = false,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (urls: string[], items: MediaItem[]) => void;
  filter?: 'all' | 'image' | 'video';
  multiple?: boolean;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      let request = supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300);
      if (filter !== 'all') request = request.eq('media_type', filter);
      const { data, error: loadError } = await request;
      if (loadError) throw loadError;
      setItems((data as MediaItem[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load the media library.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (open) {
      setSelected([]);
      load();
    }
  }, [open, load]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError('');
    try {
      const supabase = createClient();
      for (const file of Array.from(files)) {
        await uploadMedia(supabase, file);
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  function toggle(item: MediaItem) {
    if (!multiple) {
      onSelect([item.url], [item]);
      onClose();
      return;
    }
    setSelected((current) =>
      current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id]
    );
  }

  function confirmSelection() {
    const chosen = items.filter((item) => selected.includes(item.id));
    onSelect(chosen.map((i) => i.url), chosen);
    onClose();
  }

  if (!open) return null;

  const visible = query
    ? items.filter((item) =>
        `${item.file_name} ${item.title} ${item.alt_text} ${item.caption} ${item.category}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : items;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Media library"
      className="fixed inset-0 z-[130] flex items-end justify-center bg-forest-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <div className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white sm:h-[85vh] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-earth-200 px-5 py-4">
          <h2 className="font-display text-lg text-forest-900">Media library</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close media library"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-forest-800 hover:bg-cream-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-earth-200 px-5 py-3.5">
          <label className="btn-gold cursor-pointer !py-2.5 text-[0.8rem]">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="h-4 w-4" aria-hidden />
            )}
            {uploading ? 'Uploading…' : 'Upload files'}
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

          <div className="relative min-w-[12rem] flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-800/35"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search media…"
              aria-label="Search media"
              className="field !py-2.5 pl-9"
            />
          </div>
        </div>

        {error ? (
          <p className="mx-5 mt-4 rounded-lg border border-red-600/30 bg-red-50 p-3 text-[0.82rem] text-red-900">
            {error}
          </p>
        ) : null}

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center gap-2.5 py-20 text-forest-800/60">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Loading media…
            </div>
          ) : visible.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {visible.map((item) => {
                const isSelected = selected.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item)}
                    className={cn(
                      'group relative overflow-hidden rounded-xl border-2 bg-cream-100 text-left transition',
                      isSelected
                        ? 'border-gold-500 ring-2 ring-gold-300'
                        : 'border-earth-200 hover:border-gold-400'
                    )}
                  >
                    <span className="relative block aspect-square">
                      {item.media_type === 'image' ? (
                        <Image
                          src={item.url}
                          alt={item.alt_text || item.file_name}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center bg-forest-900 text-gold-400">
                          <ImageIcon className="h-7 w-7" aria-hidden />
                        </span>
                      )}
                      {isSelected ? (
                        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-forest-950">
                          <Check className="h-4 w-4" aria-hidden />
                        </span>
                      ) : null}
                    </span>
                    <span className="block px-2.5 py-2">
                      <span className="block truncate text-[0.72rem] font-medium text-forest-900">
                        {item.title || item.file_name}
                      </span>
                      <span className="block text-[0.66rem] text-forest-800/50">
                        {formatBytes(item.size_bytes)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center">
              <ImageIcon className="mx-auto h-10 w-10 text-earth-300" aria-hidden />
              <p className="mt-4 font-display text-base text-forest-900">
                {query ? 'Nothing matched that search' : 'No media uploaded yet'}
              </p>
              <p className="mt-1.5 text-[0.84rem] text-forest-800/60">
                {query
                  ? 'Try a different word, or upload a new file.'
                  : 'Use the upload button above to add your first photographs or videos.'}
              </p>
            </div>
          )}
        </div>

        {multiple ? (
          <div className="flex items-center justify-between gap-4 border-t border-earth-200 px-5 py-4">
            <span className="text-[0.82rem] text-forest-800/60">
              {selected.length} selected
            </span>
            <div className="flex gap-2.5">
              <button type="button" onClick={onClose} className="btn-outline-forest !py-2.5">
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSelection}
                disabled={!selected.length}
                className="btn-gold !py-2.5"
              >
                Add {selected.length || ''} {selected.length === 1 ? 'item' : 'items'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Single-image field with preview, "choose" and "remove". */
export function MediaField({
  label,
  value,
  onChange,
  hint,
  filter = 'image',
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  filter?: 'all' | 'image' | 'video';
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl border border-earth-200 bg-cream-100">
          {value ? (
            filter === 'video' ? (
              <video src={value} className="h-full w-full object-cover" muted playsInline />
            ) : (
              <Image src={value} alt="" fill sizes="160px" className="object-cover" />
            )
          ) : (
            <span className="flex h-full items-center justify-center text-earth-300">
              <ImageIcon className="h-7 w-7" aria-hidden />
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2.5">
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn-outline-forest !py-2.5 text-[0.8rem]"
            >
              {value ? 'Change' : 'Choose from library'}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange('')}
                className="btn !py-2.5 text-[0.8rem] text-red-700 hover:bg-red-50"
              >
                Remove
              </button>
            ) : null}
          </div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            aria-label={`${label} URL`}
            className="field"
          />
          {hint ? <span className="text-[0.74rem] text-forest-800/50">{hint}</span> : null}
        </div>
      </div>

      <MediaPickerDialog
        open={open}
        onClose={() => setOpen(false)}
        filter={filter}
        onSelect={(urls) => urls[0] && onChange(urls[0])}
      />
    </div>
  );
}
