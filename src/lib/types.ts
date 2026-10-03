export type HeroMediaType = 'image' | 'video' | 'rotating';

export interface BusinessHour {
  day: string;
  hours: string;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  short_description: string;
  phone: string;
  phone_secondary: string;
  whatsapp: string;
  email: string;
  location: string;
  map_embed_url: string;
  logo_url: string;
  favicon_url: string;
  hero_title: string;
  hero_subtitle: string;
  hero_media_type: HeroMediaType;
  hero_media_url: string;
  hero_media_urls: string[];
  hero_poster_url: string;
  consultation_cta: string;
  healer_message: string;
  about_short: string;
  about_long: string;
  years_experience: string;
  clients_served: string;
  languages_spoken: string;
  business_hours: BusinessHour[];
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  youtube_url: string;
  twitter_url: string;
  footer_text: string;
  health_disclaimer: string;
  general_disclaimer: string;
  whatsapp_message: string;
  default_seo_title: string;
  default_seo_description: string;
  default_og_image: string;
  google_site_verification: string;
  google_analytics_id: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  body: string;
  icon: string;
  cover_image: string;
  bullet_points: string[];
  notice: string;
  sort_order: number;
  is_published: boolean;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
}

export interface WorkMedia {
  id: string;
  work_post_id: string;
  url: string;
  media_type: 'image' | 'video';
  caption: string;
  alt_text: string;
  sort_order: number;
}

export interface WorkPost {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  cover_image: string;
  video_url: string;
  category: string;
  tags: string[];
  location: string;
  event_date: string | null;
  is_published: boolean;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
  published_at: string | null;
  created_at: string;
  work_media?: WorkMedia[];
}

export interface GalleryImage {
  id: string;
  gallery_id: string;
  url: string;
  caption: string;
  alt_text: string;
  width: number | null;
  height: number | null;
  sort_order: number;
}

export interface Gallery {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image: string;
  category: string;
  sort_order: number;
  is_published: boolean;
  seo_title: string;
  seo_description: string;
  created_at: string;
  gallery_images?: GalleryImage[];
}

export type VideoSource = 'youtube' | 'vimeo' | 'upload' | 'url';

export interface VideoItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  source: VideoSource;
  video_url: string;
  thumbnail_url: string;
  duration: string;
  category: string;
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
  published_at: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  photo_url: string;
  content: string;
  service: string;
  location: string;
  rating: number | null;
  is_approved: boolean;
  is_featured: boolean;
  given_at: string | null;
  created_at: string;
}

export interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category_id: string | null;
  tags: string[];
  author_name: string;
  reading_minutes: number;
  status: 'draft' | 'published';
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
  published_at: string | null;
  created_at: string;
  blog_categories?: BlogCategory | null;
}

export interface Inquiry {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  consultation_type: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  source_page: string;
  created_at: string;
}

export interface MediaItem {
  id: string;
  file_name: string;
  title: string;
  storage_path: string;
  url: string;
  mime_type: string;
  media_type: 'image' | 'video' | 'other';
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt_text: string;
  caption: string;
  category: string;
  created_at: string;
}
