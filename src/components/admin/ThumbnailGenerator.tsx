'use client';

import { useRef, useState } from 'react';
import { ImageDown, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { uploadMedia } from '@/lib/media';
import { slugify } from '@/lib/utils';

/**
 * Grabs a frame from an uploaded video and stores it as that video's thumbnail,
 * so the client never has to prepare a poster image by hand.
 *
 * The frame is taken a little way in — the very first frame of a phone
 * recording is almost always a blur or a lens cap — and the capture happens in
 * the browser, which means it only works for files served from our own origin.
 */
export function ThumbnailGenerator({
  videoUrl,
  title,
  onGenerated,
}: {
  videoUrl: string;
  title: string;
  onGenerated: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState(25);
  const videoRef = useRef<HTMLVideoElement>(null);

  async function generate() {
    setBusy(true);
    setError(null);
    try {
      const url = await captureFrame(videoUrl, position / 100);
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], `${slugify(title) || 'video'}-poster.jpg`, {
        type: 'image/jpeg',
      });
      const media = await uploadMedia(createClient(), file, {
        category: 'Video thumbnails',
        altText: title,
      });
      onGenerated(media.url);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Could not read a frame from this video. Try uploading a thumbnail instead.'
      );
    } finally {
      setBusy(false);
    }
  }

  if (!videoUrl) return null;

  return (
    <div className="mt-4 rounded-lg border border-earth-200 bg-cream-100/60 p-4">
      <p className="text-[0.78rem] font-semibold uppercase tracking-wider text-forest-800/70">
        Generate from the video
      </p>
      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-forest-800/70">
        Pick a moment and we will take that frame and use it as the thumbnail.
      </p>

      <label className="mt-3 block text-[0.78rem] text-forest-800/80">
        Position: {position}% through the video
        <input
          type="range"
          min={0}
          max={95}
          step={5}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="mt-1.5 w-full accent-gold-600"
        />
      </label>

      <button
        type="button"
        onClick={generate}
        disabled={busy}
        className="btn-outline-forest mt-3 !py-2 text-[0.78rem] disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <ImageDown className="h-4 w-4" aria-hidden />
        )}
        {busy ? 'Capturing…' : 'Capture this frame'}
      </button>

      {error ? <p className="mt-2.5 text-[0.8rem] text-red-700">{error}</p> : null}
      <video ref={videoRef} className="hidden" muted playsInline />
    </div>
  );
}

/** Seeks an off-screen video to a fraction of its length and reads that frame. */
function captureFrame(src: string, fraction: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    const fail = () =>
      reject(new Error('This video could not be read in the browser. Upload a thumbnail instead.'));

    video.onloadedmetadata = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return fail();
      video.currentTime = Math.min(video.duration * fraction, video.duration - 0.1);
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) return fail();
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch {
        // A cross-origin video taints the canvas and cannot be read back.
        fail();
      }
    };

    video.onerror = fail;
    video.src = src;
  });
}
