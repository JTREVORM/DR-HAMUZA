import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Hero } from '@/components/home/Hero';
import { TrustStrip } from '@/components/home/TrustStrip';
import { AboutPreview } from '@/components/home/AboutPreview';
import { HealerMessage } from '@/components/home/HealerMessage';
import { WhyConsult } from '@/components/home/WhyConsult';
import { ApproachSection } from '@/components/home/ApproachSection';
import { ConsultationCTA } from '@/components/home/ConsultationCTA';
import { ContactInfoSection } from '@/components/home/ContactInfoSection';
import { DisclaimerSection } from '@/components/home/DisclaimerSection';

import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { MasonryGallery } from '@/components/ui/MasonryGallery';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { WorkCard } from '@/components/cards/WorkCard';
import { VideoCard } from '@/components/cards/VideoCard';
import { BlogCard } from '@/components/cards/BlogCard';
import { TestimonialCard } from '@/components/cards/TestimonialCard';

import {
  getBlogPosts,
  getGalleries,
  getServices,
  getSettings,
  getTestimonials,
  getVideos,
  getWorkPosts,
} from '@/lib/queries';
import { buildMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: settings.default_seo_title || `${settings.site_name} | ${settings.tagline}`,
    description: settings.default_seo_description || settings.short_description,
    path: '/',
  });
}

export default async function HomePage() {
  const [settings, services, work, galleries, videos, testimonials, posts] = await Promise.all([
    getSettings(),
    getServices(),
    getWorkPosts(6),
    getGalleries(),
    getVideos(7),
    getTestimonials(6),
    getBlogPosts(3),
  ]);

  const featuredServices = (() => {
    const featured = services.filter((s) => s.is_featured);
    return (featured.length >= 3 ? featured : services).slice(0, 6);
  })();

  const galleryImages = galleries
    .flatMap((gallery) =>
      (gallery.gallery_images ?? []).map((image) => ({
        url: image.url,
        caption: image.caption || gallery.title,
        alt: image.alt_text || `${gallery.title} — ${settings.site_name}`,
      }))
    )
    .slice(0, 8);

  const featuredVideo = videos.find((v) => v.is_featured) ?? videos[0] ?? null;
  const latestVideos = videos.filter((v) => v.id !== featuredVideo?.id).slice(0, 3);

  // Portrait / supporting images for the About block, drawn from whatever the
  // admin has already uploaded so the section is never a blank placeholder.
  const aboutImages = [
    ...galleries.flatMap((g) => (g.gallery_images ?? []).map((i) => i.url)),
    ...work.map((w) => w.cover_image),
  ].filter(Boolean);

  return (
    <>
      <Hero settings={settings} />
      <TrustStrip settings={settings} />
      <AboutPreview settings={settings} images={aboutImages} />
      <HealerMessage settings={settings} />

      {/* ------------------------------------------------ featured services */}
      <section className="relative bg-cream-100 py-20 lg:py-28">
        <div aria-hidden className="pattern-weave absolute inset-0 opacity-60" />
        <div className="container relative z-10">
          <SectionHeading
            eyebrow="Consultation areas"
            title="How Dr Salongo Hamuza Can Help"
            intro="People come with many different concerns. These are the areas most often brought to him — and if yours is not listed, you are still welcome to make contact."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service, i) => (
              <Reveal key={service.slug} delay={(i % 3) * 0.08}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-12 text-center">
            <Link href="/services" className="btn-forest">
              View all consultation areas
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      <WhyConsult />

      {/* -------------------------------------------------------- our work */}
      {work.length ? (
        <section className="bg-cream-50 py-20 lg:py-28">
          <div className="container">
            <SectionHeading
              eyebrow="Our work"
              title="Recent Work & Activities"
              intro="Photographs and records of traditional practice, consultations, gatherings and community activities, published with permission."
            />

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {work.slice(0, 6).map((post, i) => (
                <Reveal key={post.id} delay={(i % 3) * 0.08}>
                  <WorkCard post={post} priority={i === 0} />
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1} className="mt-12 text-center">
              <Link href="/our-work" className="btn-outline-forest">
                See all our work
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* -------------------------------------------------- gallery preview */}
      {galleryImages.length ? (
        <section className="relative overflow-hidden bg-forest-950 py-20 lg:py-28">
          <div aria-hidden className="pattern-diamond absolute inset-0 opacity-50" />
          <div className="container relative z-10">
            <SectionHeading
              eyebrow="Photo gallery"
              title="Moments From the Practice"
              intro="Traditional items, herbs, gatherings and daily practice — a glimpse of the world Dr Salongo Hamuza works within."
              tone="dark"
            />
            <div className="mt-14">
              <MasonryGallery
                items={galleryImages}
                columnsClassName="columns-2 sm:columns-3 lg:columns-4"
              />
            </div>
            <Reveal delay={0.1} className="mt-10 text-center">
              <Link href="/gallery" className="btn-outline-gold">
                Open the full gallery
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* -------------------------------------------------- featured video */}
      {featuredVideo ? (
        <section className="relative overflow-hidden bg-forest-900 py-20 lg:py-28">
          <div aria-hidden className="pattern-diamond absolute inset-0 opacity-60" />
          <div className="container relative z-10">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <p className="eyebrow-light">
                  <span aria-hidden className="h-px w-8 bg-gold-400/70" />
                  Featured video
                </p>
                <h2 className="heading-lg mt-4 text-cream-100">{featuredVideo.title}</h2>
                <span aria-hidden className="mt-6 block h-[3px] w-20 rounded-full bg-gold-sheen" />
                {featuredVideo.description ? (
                  <p className="mt-6 text-[1.0rem] leading-[1.9] text-cream-200/75">
                    {featuredVideo.description}
                  </p>
                ) : null}
                <Link
                  href={`/videos/${featuredVideo.slug}`}
                  className="btn-outline-gold mt-8"
                >
                  Watch on its own page
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Reveal>

              <Reveal delay={0.12} className="lg:col-span-7">
                <VideoPlayer video={featuredVideo} />
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------- latest videos */}
      {latestVideos.length ? (
        <section className="bg-forest-950 py-20 lg:py-24">
          <div className="container">
            <SectionHeading
              eyebrow="Watch"
              title="Latest Videos"
              intro="Recordings shared by Dr Salongo Hamuza from his traditional practice and community activities."
              tone="dark"
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestVideos.map((video, i) => (
                <Reveal key={video.id} delay={(i % 3) * 0.08}>
                  <VideoCard video={video} />
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1} className="mt-12 text-center">
              <Link href="/videos" className="btn-outline-gold">
                All videos
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}

      <ApproachSection />

      {/* ------------------------------------------------------ testimonials */}
      {testimonials.length ? (
        <section className="bg-cream-50 py-20 lg:py-28">
          <div className="container">
            <SectionHeading
              eyebrow="Success stories"
              title="What People Have Shared"
              intro="Experiences shared by people who chose to speak about their consultation, published only with their permission."
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 6).map((testimonial, i) => (
                <Reveal key={testimonial.id} delay={(i % 3) * 0.08}>
                  <TestimonialCard testimonial={testimonial} />
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1} className="mx-auto mt-10 max-w-2xl text-center">
              <p className="text-[0.82rem] leading-relaxed text-forest-800/60">
                Individual experiences differ from person to person. Testimonials describe what
                those individuals felt about their own consultation and are not a promise or
                guarantee of any result.
              </p>
              <Link href="/testimonials" className="btn-outline-forest mt-6">
                Read more experiences
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------- blog */}
      {posts.length ? (
        <section className="bg-cream-100 py-20 lg:py-24">
          <div className="container">
            <SectionHeading
              eyebrow="Insights"
              title="Latest Articles"
              intro="Writing on traditional practice, Ugandan cultural traditions, and the matters people bring to consultation."
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={(i % 3) * 0.08}>
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1} className="mt-12 text-center">
              <Link href="/blog" className="btn-outline-forest">
                Read all insights
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}

      <ConsultationCTA settings={settings} />
      <ContactInfoSection settings={settings} />
      <DisclaimerSection settings={settings} />
    </>
  );
}
