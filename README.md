# Dr Salongo Hamuza — Professional Traditional Healer

The official website for **Dr Salongo Hamuza**, a professional traditional healer
from Uganda, with a private dashboard so the whole site can be managed without
touching any code.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS and Supabase, and
ready to deploy to Vercel.

---

## What is in the box

**Public website**

| Route | Purpose |
| --- | --- |
| `/` | Homepage — hero, introduction, about, Dr Salongo Hamuza's own message, services, work, gallery, videos, testimonials, articles, contact and disclaimers |
| `/about` | Full About page |
| `/services` · `/services/[slug]` | Thirteen consultation areas, each with its own indexable page |
| `/our-work` · `/our-work/[slug]` | Photographs, videos and records of traditional practice |
| `/gallery` · `/gallery/[slug]` | Photo albums with a lightbox |
| `/videos` · `/videos/[slug]` | YouTube, Vimeo, or uploaded video |
| `/testimonials` | Approved experiences only |
| `/blog` · `/blog/[slug]` | Articles, with related reading |
| `/contact` | Enquiry form, call and WhatsApp buttons |
| `/privacy-policy` · `/terms` · `/disclaimer` | Legal pages |
| `/sitemap.xml` · `/robots.txt` | Generated automatically from published content |

**Dashboard** at `/admin` — work posts, gallery albums, videos, services,
testimonials, blog articles and categories, messages, media library, SEO, site
settings and profile.

---

## Setting it up

### 1. Install

```bash
npm install
cp .env.example .env.local
```

### 2. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the whole of
   [`supabase/schema.sql`](supabase/schema.sql) and run it. This creates every
   table, the `media` storage bucket, and all Row Level Security policies. It is
   safe to run again later.
   **Upgrading an existing database?** Re-run the same file. It adds the new
   `phone_secondary` column and converts a phone or WhatsApp number still stored
   in the old local form (`0777172119`) to international format
   (`+256777172119`). Numbers you have already edited are left alone. Until it
   has been run, saving Site Settings will fail because the column is missing.
3. Optionally run [`supabase/seed.sql`](supabase/seed.sql) to load the thirteen
   consultation areas and some starter blog categories into the database so they
   become editable. (The same thing can be done from the dashboard: **Services →
   Load default services**.)

### 3. Add the environment variables

From **Project Settings → API** in Supabase, copy the values into `.env.local`:

```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_SITE_URL=https://www.your-domain.com
```

`NEXT_PUBLIC_SITE_URL` is used for canonical addresses, the sitemap and link
previews, so set it to the real domain before going live.

> The site is built to run **without** Supabase as well: it falls back to the
> content bundled in `src/content/`, and the dashboard stays closed. That means
> a first deploy never fails for want of a database.

### 4. Create the administrator account

In Supabase, go to **Authentication → Users → Add user**, enter an email address
and a strong password, and tick *Auto Confirm User*. Every user created in this
project becomes an administrator, so keep that list short.

Then sign in at `/admin/login`.

### 5. Run it

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — the framework is
   detected automatically, and no build settings need changing.
3. Add the three environment variables above under **Settings → Environment
   Variables** (and `SUPABASE_SERVICE_ROLE_KEY` only if you later add features
   that need it — it must never be exposed to the browser).
4. Deploy, then point the domain at it and update `NEXT_PUBLIC_SITE_URL`.

---

## After going live

- **Google Search Console** — add the property, take the HTML-tag verification
  code, and paste it into **Admin → SEO → Google site verification code**. Then
  submit `https://your-domain.com/sitemap.xml`.
- **Google Analytics** — paste the `G-XXXXXXXXXX` measurement ID into
  **Admin → SEO**. Nothing is loaded until an ID is present.
- **Google Business Profile** — link it to the website address.

---

## How the project is organised

```
src/
  app/
    (site)/          Public pages — header, footer and floating contact actions
    admin/
      login/         Sign-in page, outside the admin guard
      (dashboard)/   Everything behind Supabase Auth
    api/contact/     Rate-limited enquiry endpoint
    sitemap.ts       Generated from published content
    robots.ts
  components/
    layout/  home/  cards/  ui/  admin/
  content/           Default copy: services, site defaults, the healer's message
  lib/
    queries.ts       All public data access, with fallbacks
    seo.ts           Metadata and structured data
    supabase/        Browser, server, middleware and session-less clients
    media.ts         Upload validation and de-duplication
    rate-limit.ts
supabase/
  schema.sql         Tables, triggers, RLS policies, storage bucket
  seed.sql           Thirteen services and starter blog categories
```

### Design

The palette, typography and decoration all come from the logo: deep forest and
emerald greens, metallic gold, warm earth browns and cream, with chevron,
diamond and woven patterns used as separators and surface texture. Headings are
set in Cinzel, quotations in Cormorant Garamond, and body text in Outfit.

### Security

- **Row Level Security on every table.** Anonymous visitors can read only
  published rows; every write requires an authenticated administrator. Enquiries
  can be inserted by anyone but read by nobody except an administrator.
- **Three-layer admin guard** — edge middleware, a server-side check on every
  dashboard render, and RLS in the database. Client-side checks are never the
  security boundary.
- **Storage** is a public-read bucket with writes restricted to administrators,
  plus file type and size limits enforced both in the browser and in the bucket.
- **The contact form** is rate limited, uses a honeypot field and a time trap,
  validates and truncates every field, and stores nothing else.
- Admin-written article text is HTML-escaped before a small Markdown subset is
  rendered, so no script from the editor can ever reach a page.

### Performance

Public pages read Supabase through a session-less client, so they stay
statically rendered and revalidate on a timer (five minutes for content pages,
ten for the slower-moving ones) rather than rendering on every request. Images
go through Next.js image optimisation in AVIF/WebP with lazy loading, and videos
never autoplay with sound.

---

## Editing content

Everything the client can change lives in the dashboard. Nothing about the
business — the two phone numbers, the WhatsApp number, the disclaimers, the hero
text, the social links — is written into the code; it all comes from
**Admin → Site Settings**.

Two pieces of content deserve a note:

- **Dr Salongo Hamuza's message** on the homepage is published exactly as he
  supplied it, including its original spelling. It lives in
  `src/content/healer-message.ts` and in **Admin → Site Settings**, and should
  only be changed if he asks for it to be changed.
- **The health disclaimer** appears on the homepage, in the footer and on
  several service pages. Please keep it accurate — the site deliberately makes
  no claim to diagnose, treat or cure any condition, and points people to
  qualified medical care.
