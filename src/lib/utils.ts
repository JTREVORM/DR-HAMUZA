import type { VideoItem, VideoOrientation, VideoSource } from '@/lib/types';

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export function formatDate(value?: string | null, opts?: Intl.DateTimeFormatOptions) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
    ...opts,
  }).format(date);
}

export function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Strips a phone number down to digits so it can be used in tel: / wa.me links. */
export function digitsOnly(phone: string) {
  return (phone || '').replace(/[^\d]/g, '');
}

/**
 * Normalises a Ugandan phone number to international form, e.g. `0777172119`,
 * `256777172119` and `+256 777 172 119` all become `+256777172119`. Numbers that
 * already carry another country code are kept as they are. Returns '' when
 * there is nothing usable, so callers can simply skip empty values.
 */
export function formatPhone(phone: string) {
  let digits = digitsOnly(phone);
  if (!digits) return '';
  if (digits.startsWith('00')) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = `256${digits.slice(1)}`;
  else if (!digits.startsWith('256') && digits.length === 9) digits = `256${digits}`;
  return `+${digits}`;
}

/** The phone numbers to show, primary first, formatted, with blanks and duplicates removed. */
export function contactPhones(settings: { phone: string; phone_secondary?: string }) {
  return [settings.phone, settings.phone_secondary ?? '']
    .map(formatPhone)
    .filter((number, index, all) => number && all.indexOf(number) === index);
}

/**
 * Static copy (the cornerstone FAQ answers) can write `{phone}` instead of a
 * number. It is filled from Site Settings at render time, so editing the number
 * in the dashboard changes the wording too — "+256777172119 or +256744937529".
 */
export function fillPhoneToken(
  text: string,
  settings: { phone: string; phone_secondary?: string }
) {
  return text.replace(/\{phone\}/g, contactPhones(settings).join(' or '));
}

/** Builds a wa.me link. WhatsApp needs the number as digits with the country code. */
export function whatsappHref(whatsapp: string, message: string) {
  const number = formatPhone(whatsapp).slice(1);
  const text = encodeURIComponent(message || '');
  return `https://wa.me/${number}${text ? `?text=${text}` : ''}`;
}

export function telHref(phone: string) {
  return `tel:${formatPhone(phone)}`;
}

export function excerptFrom(text: string, length = 160) {
  const clean = (text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length <= length) return clean;
  return `${clean.slice(0, length).replace(/\s+\S*$/, '')}…`;
}

export function readingMinutes(text: string) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/* -------------------------------------------------------------- video ---- */

export function youtubeId(url: string) {
  const match = (url || '').match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return match?.[1] ?? '';
}

export function vimeoId(url: string) {
  const match = (url || '').match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match?.[1] ?? '';
}

export function detectVideoSource(url: string): VideoSource {
  if (youtubeId(url)) return 'youtube';
  if (vimeoId(url)) return 'vimeo';
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)) return 'upload';
  return 'url';
}

/** Player URL used inside the iframe / <video> element. */
export function videoEmbedUrl(video: Pick<VideoItem, 'source' | 'video_url'>) {
  const { video_url: url } = video;
  const source = video.source === 'url' ? detectVideoSource(url) : video.source;

  if (source === 'youtube') {
    const id = youtubeId(url);
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : url;
  }
  if (source === 'vimeo') {
    const id = vimeoId(url);
    return id ? `https://player.vimeo.com/video/${id}?dnt=1` : url;
  }
  return url;
}

/** Falls back to the provider thumbnail when the admin did not upload one. */
export function videoThumbnail(video: Pick<VideoItem, 'source' | 'video_url' | 'thumbnail_url'>) {
  if (video.thumbnail_url) return video.thumbnail_url;
  const id = youtubeId(video.video_url);
  return id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : '';
}

/**
 * Builds a complete `VideoItem` from whatever a caller happens to have.
 *
 * Pages that show a video attached to something else — a work post, say — do
 * not have a videos row to hand, and the player needs every field present.
 */
export function makeVideoItem(
  partial: Partial<VideoItem> & { video_url: string; title: string }
): VideoItem {
  const orientation: VideoOrientation = partial.orientation ?? 'landscape';
  return {
    id: '',
    slug: '',
    description: '',
    source: detectVideoSource(partial.video_url),
    thumbnail_url: '',
    duration: '',
    category: '',
    tags: [],
    is_hero: false,
    show_on_homepage: false,
    sort_order: 0,
    is_published: true,
    is_featured: false,
    seo_title: '',
    seo_description: '',
    published_at: null,
    created_at: '',
    ...partial,
    orientation,
  };
}

/**
 * Turns the human duration an admin types ("1:24", "2:05:30") into the ISO 8601
 * form `VideoObject.duration` requires. Returns '' for anything unparseable, so
 * a bad value is left out of the markup rather than written in wrong.
 */
export function isoDuration(duration: string): string {
  const parts = (duration || '').trim().split(':');
  if (parts.length < 2 || parts.length > 3) return '';
  if (!parts.every((p) => /^\d{1,3}$/.test(p))) return '';

  const [h, m, sec] =
    parts.length === 3
      ? parts.map(Number)
      : [0, Number(parts[0]), Number(parts[1])];
  if (m > 59 || sec > 59) return '';
  if (!h && !m && !sec) return '';

  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${sec ? `${sec}S` : ''}`;
}

export function isSelfHostedVideo(video: Pick<VideoItem, 'source' | 'video_url'>) {
  const source = video.source === 'url' ? detectVideoSource(video.video_url) : video.source;
  return source === 'upload';
}

/* --------------------------------------------------------------- misc ---- */

export function absoluteUrl(siteUrl: string, path: string) {
  if (!path) return siteUrl;
  if (path.startsWith('http')) return path;
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Escapes user/admin supplied text before it is placed inside HTML. */
export function escapeHtml(value: string) {
  return (value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Very small, deliberately conservative Markdown-ish renderer for admin written
 * article bodies. All input is HTML-escaped first, so no raw HTML (and no
 * script) from the editor can ever reach the page.
 */
export function renderRichText(source: string) {
  const blocks = escapeHtml(source || '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/);

  const inline = (text: string) =>
    text
      .replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,
        '<a href="$2" rel="noopener">$1</a>'
      )
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br />');

  return blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^###\s+/.test(trimmed)) return `<h3>${inline(trimmed.replace(/^###\s+/, ''))}</h3>`;
      if (/^##\s+/.test(trimmed)) return `<h2>${inline(trimmed.replace(/^##\s+/, ''))}</h2>`;
      if (/^#\s+/.test(trimmed)) return `<h2>${inline(trimmed.replace(/^#\s+/, ''))}</h2>`;
      if (/^&gt;\s+/.test(trimmed))
        return `<blockquote>${inline(trimmed.replace(/^&gt;\s+/gm, ''))}</blockquote>`;
      if (/^---+$/.test(trimmed)) return '<hr />';
      if (/^[-*]\s+/m.test(trimmed) && trimmed.split('\n').every((l) => /^[-*]\s+/.test(l.trim()))) {
        const items = trimmed
          .split('\n')
          .map((l) => `<li>${inline(l.trim().replace(/^[-*]\s+/, ''))}</li>`)
          .join('');
        return `<ul>${items}</ul>`;
      }
      if (/^\d+\.\s+/m.test(trimmed) && trimmed.split('\n').every((l) => /^\d+\.\s+/.test(l.trim()))) {
        const items = trimmed
          .split('\n')
          .map((l) => `<li>${inline(l.trim().replace(/^\d+\.\s+/, ''))}</li>`)
          .join('');
        return `<ol>${items}</ol>`;
      }
      return `<p>${inline(trimmed)}</p>`;
    })
    .join('\n');
}
