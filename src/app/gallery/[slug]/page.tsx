import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/ui/JsonLd';
import { MasonryGallery } from '@/components/ui/MasonryGallery';
import { ConsultationCTA } from '@/components/home/ConsultationCTA';

import { getGalleries, getGalleryBySlug, getSettings } from '@/lib/queries';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

export const revalidate = 300;

export async function generateStaticParams() {
  const galleries = await getGalleries();
  return galleries.map((gallery) => ({ slug: gallery.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [settings, gallery] = await Promise.all([getSettings(), getGalleryBySlug(slug)]);
  if (!gallery) return { title: 'Album not found' };

  return buildMetadata({
    settings,
    title: gallery.seo_title || `${gallery.title} — Photo Album`,
    description:
      gallery.seo_description ||
      gallery.description ||
      `Photographs from ${gallery.title} — ${settings.site_name}, ${settings.tagline} in Uganda.`,
    path: `/gallery/${gallery.slug}`,
    image: gallery.cover_image || gallery.gallery_images?.[0]?.url,
  });
}

export default async function GalleryAlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [settings, gallery, galleries] = await Promise.all([
    getSettings(),
    getGalleryBySlug(slug),
    getGalleries(),
  ]);

  if (!gallery) notFound();

  const images = (gallery.gallery_images ?? []).map((image) => ({
    url: image.url,
    caption: image.caption,
    alt: image.alt_text || `${gallery.title} — ${settings.site_name}`,
  }));

  const others = galleries
    .filter((g) => g.slug !== gallery.slug && (g.gallery_images ?? []).length > 0)
    .slice(0, 4);

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: gallery.title, path: `/gallery/${gallery.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow={gallery.category || 'Album'}
        title={gallery.title}
        intro={gallery.description}
        crumbs={crumbs}
        image={gallery.cover_image || images[0]?.url}
      />

      <section className="bg-cream-50 py-20 lg:py-24">
        <div className="container">
          {images.length ? (
            <MasonryGallery items={images} columnsClassName="columns-2 sm:columns-3 lg:columns-4" />
          ) : (
            <p className="text-center text-forest-800/70">
              Photographs for this album are being prepared.
            </p>
          )}

          <Reveal delay={0.1} className="mt-14 text-center">
            <Link href="/gallery" className="btn-outline-forest">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to all albums
            </Link>
          </Reveal>

          {others.length ? (
            <div className="mt-16 border-t border-earth-200 pt-12">
              <h2 className="text-center font-display text-xl text-forest-900">Other Albums</h2>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {others.map((album) => (
                  <Link
                    key={album.id}
                    href={`/gallery/${album.slug}`}
                    className="rounded-full border border-earth-200 bg-cream-100 px-5 py-2.5 text-[0.84rem] text-forest-800 transition hover:border-gold-400 hover:bg-gold-50"
                  >
                    {album.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <ConsultationCTA settings={settings} />
    </>
  );
}
