import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Images } from 'lucide-react';

import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/ui/JsonLd';
import { EmptyState } from '@/components/ui/EmptyState';
import { MasonryGallery } from '@/components/ui/MasonryGallery';
import { ConsultationCTA } from '@/components/home/ConsultationCTA';

import { getGalleries, getSettings } from '@/lib/queries';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

export const revalidate = 300;

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Gallery', path: '/gallery' },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: 'Photo Gallery — Traditional Practice in Uganda',
    description:
      'Photographs from the practice of Dr Salongo Hamuza: traditional practices, herbs and traditional items, events, consultations and community activities in Uganda.',
    path: '/gallery',
  });
}

export default async function GalleryPage() {
  const [settings, galleries] = await Promise.all([getSettings(), getGalleries()]);
  const albums = galleries.filter((g) => (g.gallery_images ?? []).length > 0);

  const allImages = albums
    .flatMap((g) =>
      (g.gallery_images ?? []).map((i) => ({
        url: i.url,
        caption: i.caption || g.title,
        alt: i.alt_text || `${g.title} — ${settings.site_name}`,
      }))
    )
    .slice(0, 12);

  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <PageHero
        eyebrow="Photo gallery"
        title="Photographs From the Practice"
        intro="Traditional practices, herbs and traditional items, gatherings, consultations and community activities — organised into albums. Everything shown here is published with the permission of the people involved."
        crumbs={CRUMBS}
        image={albums[0]?.cover_image || albums[0]?.gallery_images?.[0]?.url}
      />

      <section className="bg-cream-50 py-20 lg:py-24">
        <div className="container">
          {albums.length ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {albums.map((album, i) => {
                  const cover = album.cover_image || album.gallery_images?.[0]?.url;
                  const count = album.gallery_images?.length ?? 0;
                  return (
                    <Reveal key={album.id} delay={(i % 3) * 0.07}>
                      <Link
                        href={`/gallery/${album.slug}`}
                        className="card-premium group block h-full"
                      >
                        <span className="relative block aspect-[4/3] overflow-hidden">
                          {cover ? (
                            <Image
                              src={cover}
                              alt={album.title}
                              fill
                              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                              className="lift-img object-cover"
                              priority={i < 3}
                            />
                          ) : (
                            <span className="pattern-diamond absolute inset-0 bg-forest-800" />
                          )}
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent"
                          />
                          <span className="absolute inset-x-0 bottom-0 p-5">
                            {album.category ? (
                              <span className="text-[0.70rem] font-semibold uppercase tracking-[0.2em] text-gold-300">
                                {album.category}
                              </span>
                            ) : null}
                            <span className="mt-1.5 block font-display text-lg text-cream-100 transition group-hover:text-gold-200">
                              {album.title}
                            </span>
                            <span className="mt-1 block text-[0.76rem] text-cream-200/65">
                              {count} {count === 1 ? 'photograph' : 'photographs'}
                            </span>
                          </span>
                        </span>
                        {album.description ? (
                          <span className="block p-6 text-[0.9rem] leading-[1.8] text-forest-800/75 line-clamp-3">
                            {album.description}
                          </span>
                        ) : null}
                      </Link>
                    </Reveal>
                  );
                })}
              </div>

              {allImages.length ? (
                <div className="mt-20">
                  <Reveal className="mb-10 text-center">
                    <p className="eyebrow justify-center">Recent photographs</p>
                    <h2 className="heading-md mt-3 text-forest-900">A Selection From Every Album</h2>
                  </Reveal>
                  <MasonryGallery
                    items={allImages}
                    columnsClassName="columns-2 sm:columns-3 lg:columns-4"
                  />
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              icon={<Images className="h-6 w-6" />}
              title="Photo albums are being prepared"
              description="Albums of traditional practices, herbs and traditional items, events and community activities will appear here shortly."
              action={
                <Link href="/contact" className="btn-gold">
                  {settings.consultation_cta}
                </Link>
              }
            />
          )}
        </div>
      </section>

      <ConsultationCTA settings={settings} />
    </>
  );
}
