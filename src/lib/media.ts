import type { SupabaseClient } from '@supabase/supabase-js';
import { STORAGE_BUCKET } from '@/lib/env';
import { slugify } from '@/lib/utils';

export const IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
];
export const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg'];
export const ACCEPTED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

export const MAX_IMAGE_BYTES = 12 * 1024 * 1024; // 12 MB
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 MB

export function mediaKindFor(mime: string): 'image' | 'video' | 'other' {
  if (IMAGE_TYPES.includes(mime)) return 'image';
  if (VIDEO_TYPES.includes(mime)) return 'video';
  return 'other';
}

/** Client-side validation. The storage bucket enforces the same rules server-side. */
export function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `"${file.name}" is not an accepted file type. Please upload a JPG, PNG, WebP, AVIF, GIF or SVG image, or an MP4, WebM, MOV or OGG video.`;
  }
  const kind = mediaKindFor(file.type);
  const limit = kind === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit) {
    return `"${file.name}" is too large. The limit is ${Math.round(limit / 1024 / 1024)} MB for ${kind === 'video' ? 'videos' : 'images'}.`;
  }
  if (file.size === 0) return `"${file.name}" appears to be empty.`;
  return null;
}

/** Stable fingerprint used to avoid storing the same file twice. */
async function checksumOf(file: File): Promise<string | null> {
  try {
    if (!globalThis.crypto?.subtle) return null;
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return null;
  }
}

/** Reads the natural dimensions of an image so the gallery can reserve space. */
function imageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    if (!IMAGE_TYPES.includes(file.type) || file.type === 'image/svg+xml') return resolve(null);
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export interface UploadedMedia {
  id: string;
  url: string;
  storage_path: string;
  file_name: string;
  media_type: 'image' | 'video' | 'other';
  reused: boolean;
}

/**
 * Uploads a file to Supabase Storage and records it in `media_library`.
 * If a byte-identical file was uploaded before, the existing record is reused
 * rather than storing a duplicate.
 */
export async function uploadMedia(
  supabase: SupabaseClient,
  file: File,
  options: { category?: string; altText?: string; caption?: string } = {}
): Promise<UploadedMedia> {
  const problem = validateFile(file);
  if (problem) throw new Error(problem);

  const checksum = await checksumOf(file);

  if (checksum) {
    const { data: existing } = await supabase
      .from('media_library')
      .select('id, url, storage_path, file_name, media_type')
      .eq('checksum', checksum)
      .maybeSingle();

    if (existing) {
      return { ...(existing as Omit<UploadedMedia, 'reused'>), reused: true };
    }
  }

  const kind = mediaKindFor(file.type);
  const extension = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : 'bin';
  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'file';
  const path = `${kind}s/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: '31536000', contentType: file.type, upsert: false });

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);

  const dimensions = await imageDimensions(file);

  const { data: record, error: recordError } = await supabase
    .from('media_library')
    .insert({
      file_name: file.name,
      title: file.name.replace(/\.[^.]+$/, ''),
      storage_path: path,
      url: publicUrl,
      mime_type: file.type,
      media_type: kind,
      size_bytes: file.size,
      width: dimensions?.width ?? null,
      height: dimensions?.height ?? null,
      alt_text: options.altText ?? '',
      caption: options.caption ?? '',
      category: options.category ?? 'General',
      checksum,
    })
    .select('id, url, storage_path, file_name, media_type')
    .single();

  if (recordError) {
    // Do not leave an orphaned object behind if the catalogue insert failed.
    await supabase.storage.from(STORAGE_BUCKET).remove([path]);
    throw new Error(`Could not save the media record: ${recordError.message}`);
  }

  return { ...(record as Omit<UploadedMedia, 'reused'>), reused: false };
}

/** Removes both the stored object and its catalogue row. */
export async function deleteMedia(
  supabase: SupabaseClient,
  item: { id: string; storage_path: string }
) {
  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([item.storage_path]);
  if (storageError && !/not found/i.test(storageError.message)) {
    throw new Error(`Could not delete the file: ${storageError.message}`);
  }
  const { error } = await supabase.from('media_library').delete().eq('id', item.id);
  if (error) throw new Error(`Could not delete the media record: ${error.message}`);
}
