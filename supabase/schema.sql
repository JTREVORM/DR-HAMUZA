-- ============================================================================
--  DR SALONGO HAMUZA — Database schema
--  Run this once in the Supabase SQL editor (Dashboard -> SQL -> New query).
--  It is idempotent: safe to re-run.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- helpers --

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Admin check. Kept SECURITY DEFINER so RLS policies on `profiles` cannot
-- recurse into themselves.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active
  );
$$;

-- ---------------------------------------------------------------- profiles --

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  avatar_url  text,
  role        text not null default 'admin' check (role in ('admin', 'editor', 'viewer')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Every user created through Supabase Auth for this project is an admin of the
-- dashboard. Access to the dashboard is controlled by who you invite in
-- Supabase Auth, so keep that user list short.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'admin'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------- site_settings --

create table if not exists public.site_settings (
  id                    boolean primary key default true check (id),
  site_name             text    not null default 'Dr Salongo Hamuza',
  tagline               text    not null default 'Professional Traditional Healer',
  short_description     text    not null default '',
  phone                 text    not null default '+256777172119',
  phone_secondary       text    not null default '+256744937529',
  whatsapp              text    not null default '+256777172119',
  email                 text    default '',
  location              text    default 'Uganda',
  map_embed_url         text    default '',
  logo_url              text    default '',
  favicon_url           text    default '',
  hero_title            text    not null default 'Traditional Guidance, Healing & Spiritual Consultation',
  hero_subtitle         text    not null default '',
  hero_media_type       text    not null default 'image' check (hero_media_type in ('image','video','rotating')),
  hero_media_url        text    default '',
  hero_media_urls       jsonb   not null default '[]'::jsonb,
  hero_poster_url       text    default '',
  consultation_cta      text    not null default 'Request a Consultation',
  healer_message        text    not null default '',
  about_short           text    not null default '',
  about_long            text    not null default '',
  years_experience      text    default '',
  clients_served        text    default '',
  languages_spoken      text    default '',
  business_hours        jsonb   not null default '[]'::jsonb,
  facebook_url          text    default '',
  instagram_url         text    default '',
  tiktok_url            text    default '',
  youtube_url           text    default '',
  twitter_url           text    default '',
  footer_text           text    not null default '',
  health_disclaimer     text    not null default 'Traditional and spiritual services are based on traditional beliefs and practices and should not replace diagnosis, treatment or advice from qualified healthcare professionals. Anyone experiencing a serious medical or mental-health condition should seek appropriate professional medical care.',
  general_disclaimer    text    not null default '',
  whatsapp_message      text    not null default 'Hello Dr Salongo Hamuza, I visited your website and would like to inquire about a consultation.',
  default_seo_title     text    default '',
  default_seo_description text  default '',
  default_og_image      text    default '',
  google_site_verification text default '',
  google_analytics_id   text    default '',
  updated_at            timestamptz not null default now()
);

insert into public.site_settings (id) values (true) on conflict (id) do nothing;

-- Upgrade path for databases created before the second phone number existed.
-- Safe to re-run: the column is only added once, and only numbers still in the
-- old local or bare-digits form are converted to international format, so
-- anything the admin has since edited is left alone.
alter table public.site_settings
  add column if not exists phone_secondary text not null default '+256744937529';

update public.site_settings set phone = '+256777172119' where phone in ('0777172119', '256777172119');
update public.site_settings set whatsapp = '+256777172119' where whatsapp in ('0777172119', '256777172119');

-- ---------------------------------------------------------------- services --

create table if not exists public.services (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  title             text not null,
  short_description text not null default '',
  description       text not null default '',
  body              text not null default '',
  icon              text default 'sparkles',
  cover_image       text default '',
  bullet_points     jsonb not null default '[]'::jsonb,
  notice            text default '',
  sort_order        int not null default 0,
  is_published      boolean not null default true,
  is_featured       boolean not null default false,
  seo_title         text default '',
  seo_description   text default '',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- -------------------------------------------------------------- work_posts --

create table if not exists public.work_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  short_description text not null default '',
  description     text not null default '',
  cover_image     text default '',
  video_url       text default '',
  category        text default 'General',
  tags            text[] not null default '{}',
  location        text default '',
  event_date      date,
  is_published    boolean not null default false,
  is_featured     boolean not null default false,
  seo_title       text default '',
  seo_description text default '',
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.work_media (
  id           uuid primary key default gen_random_uuid(),
  work_post_id uuid not null references public.work_posts(id) on delete cascade,
  url          text not null,
  media_type   text not null default 'image' check (media_type in ('image','video')),
  caption      text default '',
  alt_text     text default '',
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists work_media_post_idx on public.work_media(work_post_id);

-- --------------------------------------------------------------- galleries --

create table if not exists public.galleries (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  description     text not null default '',
  cover_image     text default '',
  category        text default 'General',
  sort_order      int not null default 0,
  is_published    boolean not null default true,
  seo_title       text default '',
  seo_description text default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id         uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries(id) on delete cascade,
  url        text not null,
  caption    text default '',
  alt_text   text default '',
  width      int,
  height     int,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gallery_images_gallery_idx on public.gallery_images(gallery_id);

-- ------------------------------------------------------------------ videos --

create table if not exists public.videos (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  description     text not null default '',
  source          text not null default 'youtube' check (source in ('youtube','vimeo','upload','url')),
  video_url       text not null default '',
  thumbnail_url   text default '',
  duration        text default '',
  category        text default 'General',
  tags            text[] not null default '{}',
  is_published    boolean not null default false,
  is_featured     boolean not null default false,
  seo_title       text default '',
  seo_description text default '',
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ------------------------------------------------------------ testimonials --

create table if not exists public.testimonials (
  id           uuid primary key default gen_random_uuid(),
  client_name  text not null default 'Anonymous',
  photo_url    text default '',
  content      text not null,
  service      text default '',
  location     text default '',
  rating       int check (rating between 1 and 5),
  is_approved  boolean not null default false,
  is_featured  boolean not null default false,
  given_at     date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- --------------------------------------------------------------- blog / cms --

create table if not exists public.blog_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.blog_tags (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text not null default '',
  content         text not null default '',
  cover_image     text default '',
  category_id     uuid references public.blog_categories(id) on delete set null,
  tags            text[] not null default '{}',
  author_name     text not null default 'Dr Salongo Hamuza',
  reading_minutes int not null default 4,
  status          text not null default 'draft' check (status in ('draft','published')),
  is_featured     boolean not null default false,
  seo_title       text default '',
  seo_description text default '',
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists blog_posts_status_idx on public.blog_posts(status, published_at desc);

-- -------------------------------------------------------------- inquiries --

create table if not exists public.inquiries (
  id                uuid primary key default gen_random_uuid(),
  full_name         text not null,
  phone             text not null,
  email             text default '',
  consultation_type text default 'General Consultation',
  message           text not null,
  status            text not null default 'new' check (status in ('new','read','replied','archived')),
  source_page       text default '',
  created_at        timestamptz not null default now()
);

create index if not exists inquiries_status_idx on public.inquiries(status, created_at desc);

-- ---------------------------------------------------------- media_library --

create table if not exists public.media_library (
  id          uuid primary key default gen_random_uuid(),
  file_name   text not null,
  title       text default '',
  storage_path text not null unique,
  url         text not null,
  mime_type   text not null default '',
  media_type  text not null default 'image' check (media_type in ('image','video','other')),
  size_bytes  bigint not null default 0,
  width       int,
  height      int,
  alt_text    text default '',
  caption     text default '',
  category    text default 'General',
  checksum    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists media_library_type_idx on public.media_library(media_type, created_at desc);

-- -------------------------------------------------------- updated_at hooks --

do $$
declare t text;
begin
  foreach t in array array[
    'profiles','site_settings','services','work_posts','galleries','videos',
    'testimonials','blog_posts','media_library'
  ]
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ================================ ROW LEVEL SECURITY ========================
-- Public (anon) visitors may read ONLY published content. Every write, and
-- every read of private data (inquiries, media library, profiles), requires an
-- authenticated admin.

alter table public.profiles       enable row level security;
alter table public.site_settings  enable row level security;
alter table public.services       enable row level security;
alter table public.work_posts     enable row level security;
alter table public.work_media     enable row level security;
alter table public.galleries      enable row level security;
alter table public.gallery_images enable row level security;
alter table public.videos         enable row level security;
alter table public.testimonials   enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_tags      enable row level security;
alter table public.blog_posts     enable row level security;
alter table public.inquiries      enable row level security;
alter table public.media_library  enable row level security;

-- profiles ------------------------------------------------------------------
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- site_settings -------------------------------------------------------------
drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists site_settings_admin_write on public.site_settings;
create policy site_settings_admin_write on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- services ------------------------------------------------------------------
drop policy if exists services_public_read on public.services;
create policy services_public_read on public.services
  for select to anon, authenticated using (is_published or public.is_admin());

drop policy if exists services_admin_write on public.services;
create policy services_admin_write on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- work_posts ----------------------------------------------------------------
drop policy if exists work_posts_public_read on public.work_posts;
create policy work_posts_public_read on public.work_posts
  for select to anon, authenticated using (is_published or public.is_admin());

drop policy if exists work_posts_admin_write on public.work_posts;
create policy work_posts_admin_write on public.work_posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- work_media ----------------------------------------------------------------
drop policy if exists work_media_public_read on public.work_media;
create policy work_media_public_read on public.work_media
  for select to anon, authenticated using (
    public.is_admin() or exists (
      select 1 from public.work_posts p
      where p.id = work_post_id and p.is_published
    )
  );

drop policy if exists work_media_admin_write on public.work_media;
create policy work_media_admin_write on public.work_media
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- galleries -----------------------------------------------------------------
drop policy if exists galleries_public_read on public.galleries;
create policy galleries_public_read on public.galleries
  for select to anon, authenticated using (is_published or public.is_admin());

drop policy if exists galleries_admin_write on public.galleries;
create policy galleries_admin_write on public.galleries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- gallery_images ------------------------------------------------------------
drop policy if exists gallery_images_public_read on public.gallery_images;
create policy gallery_images_public_read on public.gallery_images
  for select to anon, authenticated using (
    public.is_admin() or exists (
      select 1 from public.galleries g
      where g.id = gallery_id and g.is_published
    )
  );

drop policy if exists gallery_images_admin_write on public.gallery_images;
create policy gallery_images_admin_write on public.gallery_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- videos --------------------------------------------------------------------
drop policy if exists videos_public_read on public.videos;
create policy videos_public_read on public.videos
  for select to anon, authenticated using (is_published or public.is_admin());

drop policy if exists videos_admin_write on public.videos;
create policy videos_admin_write on public.videos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- testimonials --------------------------------------------------------------
drop policy if exists testimonials_public_read on public.testimonials;
create policy testimonials_public_read on public.testimonials
  for select to anon, authenticated using (is_approved or public.is_admin());

drop policy if exists testimonials_admin_write on public.testimonials;
create policy testimonials_admin_write on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- blog ----------------------------------------------------------------------
drop policy if exists blog_categories_public_read on public.blog_categories;
create policy blog_categories_public_read on public.blog_categories
  for select to anon, authenticated using (true);

drop policy if exists blog_categories_admin_write on public.blog_categories;
create policy blog_categories_admin_write on public.blog_categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists blog_tags_public_read on public.blog_tags;
create policy blog_tags_public_read on public.blog_tags
  for select to anon, authenticated using (true);

drop policy if exists blog_tags_admin_write on public.blog_tags;
create policy blog_tags_admin_write on public.blog_tags
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists blog_posts_public_read on public.blog_posts;
create policy blog_posts_public_read on public.blog_posts
  for select to anon, authenticated using (
    public.is_admin()
    or (status = 'published' and (published_at is null or published_at <= now()))
  );

drop policy if exists blog_posts_admin_write on public.blog_posts;
create policy blog_posts_admin_write on public.blog_posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- inquiries -----------------------------------------------------------------
-- Anonymous visitors may INSERT (the contact form) but never read.
drop policy if exists inquiries_public_insert on public.inquiries;
create policy inquiries_public_insert on public.inquiries
  for insert to anon, authenticated with check (true);

drop policy if exists inquiries_admin_read on public.inquiries;
create policy inquiries_admin_read on public.inquiries
  for select to authenticated using (public.is_admin());

drop policy if exists inquiries_admin_write on public.inquiries;
create policy inquiries_admin_write on public.inquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists inquiries_admin_delete on public.inquiries;
create policy inquiries_admin_delete on public.inquiries
  for delete to authenticated using (public.is_admin());

-- media_library -------------------------------------------------------------
drop policy if exists media_library_admin_all on public.media_library;
create policy media_library_admin_all on public.media_library
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ================================ STORAGE ===================================
-- One public bucket for website media. Reads are public (the site shows the
-- files); writes are restricted to authenticated admins.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 209715200,
  array[
    'image/jpeg','image/png','image/webp','image/avif','image/gif','image/svg+xml',
    'video/mp4','video/webm','video/quicktime','video/ogg'
  ]
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists media_admin_insert on storage.objects;
create policy media_admin_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists media_admin_update on storage.objects;
create policy media_admin_update on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists media_admin_delete on storage.objects;
create policy media_admin_delete on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
