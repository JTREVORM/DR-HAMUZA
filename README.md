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

### Video

The homepage is built around Dr Salongo Hamuza's own footage, so video is
treated as a first-class part of the design rather than an afterthought.

**How it is arranged.** The hero plays a short silent loop behind his name; one
video carries the large featured section; the rest fill the showcase grid, the
horizontal carousel and the story sections that sit beside the text they belong
with. Each video appears once, for a reason.

**Portrait footage.** Almost all of the source material is filmed on a phone and
is therefore 9:16. It is never stretched into a widescreen frame. Every video
carries an `orientation` value, and the players use it:

- On a phone the hero is full bleed, because the screen is the same shape.
- On a desktop, cropping a 9:16 clip to a wide screen would zoom in until only a
  torso was left — so the poster becomes a blurred, darkened backdrop and the
  video plays in a tall framed panel at its true shape.
- Elsewhere, portrait video sits on a `PortraitStage`: its own poster blurred out
  behind it to fill the width, with the video itself unstretched in front.

**What loads, and when.** Only the hero autoplays, and only muted. It is a short
silent cut (`/videos/hero-loop.mp4`, under 3 MB) rather than the full ninety
second file, and it is skipped entirely when the visitor has asked for reduced
motion or the browser reports a metered connection — the graded poster is then
the hero. Every other video loads nothing but its poster image until someone
presses play. Once playing, a video pauses when it scrolls out of view, and
starting one stops any other (`src/lib/video-playback.ts`), so two clips never
talk over each other.

**Posters.** Every poster is a frame taken from that same video — no browser is
left to pick a random first frame. They were chosen by scoring each second of
footage for sharpness, contrast and exposure, then graded to a shared look:
white balance and levels corrected, shadows lifted so dark skin keeps detail, a
forest-green and gold split tone, a vignette, and a gradient at the foot of the
frame so titles stay readable. The processing corrects the photography; it never
changes what happened in the shot.

**Where the media lives.**

```
public/videos/          the videos themselves, plus the silent hero loop
public/video-posters/   one graded poster per video
public/images/          stills pulled from the same footage, used site-wide
```

Nothing is base64-encoded into the source. The five videos that ship with the
site are described in `src/content/videos.ts` and are used as the fallback until
rows exist in the `videos` table; once the client adds videos in the dashboard,
those take over entirely.

The same applies to the photo gallery. `src/content/gallery.ts` holds a starter
album, **From the Practice**, built from those stills, so `/gallery` shows real
photographs from the first deploy instead of an empty state — the homepage links
straight there, and that link should never land on nothing. As soon as the
client publishes an album with pictures in it, the starter album disappears and
only theirs is shown.

**Replacing the footage.** The files in `public/` are ordinary assets — swap them
and update `src/content/videos.ts`. Anything the client uploads through the
dashboard goes to Supabase Storage instead and needs no code change.

### Search engine optimisation

The canonical production host is **https://dr-salongohamuza.com**, set in
`src/lib/env.ts`. Every canonical tag, Open Graph URL, sitemap entry and piece
of structured data is built from it. It is deliberately *not* derived from
Vercel's deployment URL, which would point canonicals at a preview host and
invite Google to index a second copy of the site. `NEXT_PUBLIC_SITE_URL`
overrides it if a preview ever needs to be self-consistent.

One host wins: `www` is redirected permanently to the apex in
`next.config.mjs`, and `Strict-Transport-Security` keeps browsers on HTTPS.

**Pages.** The site does not try to rank on the homepage alone. Alongside the
service pages there are three cornerstone guides, written to answer a real
question rather than to carry a keyword:

| Page | Covers |
| --- | --- |
| `/traditional-healer-uganda` | What a traditional healer does, who consults one, how a consultation works, and where the line to medical care sits |
| `/traditional-doctor-uganda` | The term "traditional doctor", herbs and preparations, and how this differs from a medical doctor |
| `/witch-doctor-uganda` | Where the phrase came from, why practitioners avoid it, and the terminology used instead |

Their content lives in `src/content/cornerstone.ts`, separate from the layout
in `src/components/seo/CornerstoneArticle.tsx`, so it can be edited as prose.

Two rules were held while writing all of it, and should be held to in future:
**nothing is invented** — there are no statistics, legal claims,
qualifications, years of experience or success rates, because none were
supplied — and **nothing is promised**. Every page that touches health draws
the line to medical care explicitly.

**Structured data.** One entity graph, cross-referenced by `@id`, so Google
reads the site as a single real practitioner rather than a set of unrelated
pages: `WebSite`, `LocalBusiness` and `Person` site-wide, plus `BreadcrumbList`,
`WebPage`, `FAQPage`, `Service`, `VideoObject` and `BlogPosting` where each
genuinely applies.

No address or coordinates are invented. `addressLocality` is only emitted once
**Site Settings → Location** holds a real town — "Uganda" is a country, not a
locality, and writing it into that field would be structured data that says
something untrue. The phone number is emitted in international form
(`+256777172119`).

**Video.** Every video has its own indexable page at `/videos/[slug]` carrying
`VideoObject` with `name`, `description`, `thumbnailUrl`, `uploadDate`,
`duration` (ISO 8601) and `contentUrl`. A file we host is given as `contentUrl`
and an external provider as `embedUrl` — they are not interchangeable. Each
video has its own poster; none is shared.

**Images.** Filenames are descriptive
(`dr-salongo-hamuza-traditional-healer-uganda.webp`, `traditional-herbs-uganda.webp`)
and every image carries alt text describing what is actually in the frame.

### Google Search Console

After the domain points at the deployment:

1. Add **https://dr-salongohamuza.com** as a property in Search Console.
2. Choose HTML-tag verification, copy the code, and paste it into
   **Admin → SEO → Google site verification**. Nothing in the source needs
   editing — the tag is rendered from that one field.
3. Submit `https://dr-salongohamuza.com/sitemap.xml`.
4. Use URL Inspection on the homepage and the three cornerstone guides, and
   request indexing for each.

The sitemap regenerates hourly and covers every published page — services,
cornerstone guides, videos, work posts, albums and articles — while drafts,
`/admin` and `/api` are excluded. The dashboard is blocked in `robots.txt`,
carries `noindex, nofollow` metadata and an `X-Robots-Tag` header.

Add the same website URL, phone number and business name to the Google
Business Profile so the two reinforce each other, and keep them consistent.

### Performance

Public pages read Supabase through a session-less client, so they stay
statically rendered and revalidate on a timer (five minutes for content pages,
ten for the slower-moving ones) rather than rendering on every request. Images
go through Next.js image optimisation in AVIF/WebP with lazy loading, and videos
never autoplay with sound.

The bundled footage is re-encoded for the web rather than shipped as supplied:
H.264 at 540px wide with a light temporal denoise, which took the five clips from
86 MB to roughly 51 MB with no visible difference at the size they are played.
`faststart` is set so playback can begin before the file has finished
downloading.

---

## Editing content

Everything the client can change lives in the dashboard. Nothing about the
business — the two phone numbers, the WhatsApp number, the disclaimers, the hero
text, the social links — is written into the code; it all comes from
**Admin → Site Settings**.

**Admin → Videos** manages the footage. As well as the title, description,
category, tags, date, SEO fields and draft/published state, each video has:

- **Show on homepage** — whether it joins the showcase and the carousel.
- **Feature on homepage** — gives it the large cinematic section near the top.
- **Set as hero video** — plays silently behind the headline. Only one video can
  hold this at a time; setting it on one clears the others, and the database
  enforces the same rule.
- **Orientation** — portrait or landscape, so the player frames it correctly.
- **Display order** — lower numbers first; leave it at 0 to order by date.

Thumbnails can be uploaded, or captured straight from an uploaded video with
**Generate from the video**, which takes the frame at whatever point on the
slider you choose and saves it to the media library.

Two pieces of content deserve a note:

- **Dr Salongo Hamuza's message** on the homepage is published exactly as he
  supplied it, including its original spelling. It lives in
  `src/content/healer-message.ts` and in **Admin → Site Settings**, and should
  only be changed if he asks for it to be changed.
- **The health disclaimer** appears on the homepage, in the footer and on
  several service pages. Please keep it accurate — the site deliberately makes
  no claim to diagnose, treat or cure any condition, and points people to
  qualified medical care.
