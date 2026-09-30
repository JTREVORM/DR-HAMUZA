import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { VideoHero } from '@/components/home/VideoHero';
import { TrustStrip } from '@/components/home/TrustStrip';
import { FeaturedVideo } from '@/components/home/FeaturedVideo';
import { VideoShowcase } from '@/components/home/VideoShowcase';
import { VideoCarousel } from '@/components/home/VideoCarousel';
import { VideoStory } from '@/components/home/VideoStory';
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
import { ServiceCard } from '@/components/cards/ServiceCard';
import { WorkCard } from '@/components/cards/WorkCard';
import { BlogCard } from '@/components/cards/BlogCard';
import { TestimonialCard } from '@/components/cards/TestimonialCard';

import { FOOTAGE_STILLS } from '@/content/videos';
import {
  getBlogPosts,
  getGalleries,
  getHomepageVideos,
  getServices,
  getSettings,
  getTestimonials,
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
    getHomepageVideos(),
    getTestimonials(6),
    getBlogPosts(3),
  ]);

  const featuredServices = (() => {
    const featured = services.filter((s) => s.is_featured);
    return (featured.length >= 3 ? featured : services).slice(0, 6);
  })();

  /* ------------------------------------------------------------- videos --
   * The hero clip plays behind the headline, one video carries the featured
   * section, and everything else fills the showcase and the carousel. Each
   * video therefore has a reason to be on the page rather than padding it.  */
  const { hero, featured, rest, pool } = videos;
  const showcaseVideos = featured ? [featured, ...rest] : rest;

  // Videos used to illustrate a story section further down, picked by what they
  // actually show rather than by position in the list.
  const practiceVideo =
    pool.find((v) => v.category === 'Herbs & Preparations') ??
    rest.find((v) => v.id !== featured?.id) ??
    null;
  const messageVideo =
    pool.find((v) => v.category === 'Messages') ??
    pool.find((v) => v.id !== hero?.id && v.id !== featured?.id && v.id !== practiceVideo?.id) ??
    null;

  /* -------------------------------------------------------------- images --
   * All photography on this page is taken from Dr Salongo Hamuza's own
   * footage, so admin-uploaded gallery images come first and the graded stills
   * fill out whatever is left.                                              */
  const uploadedImages = galleries.flatMap((gallery) =>
    (gallery.gallery_images ?? []).map((image) => ({
      url: image.url,
      caption: image.caption || gallery.title,
      alt: image.alt_text || `${gallery.title} — ${settings.site_name}`,
      width: image.width ?? undefined,
      height: image.height ?? undefined,
    }))
  );

  const stills = FOOTAGE_STILLS.map((s) => ({ ...s }));

  // The starter album is built from these same stills, so a picture can arrive
  // down both paths. Keep the first of each.
  const galleryImages = [...uploadedImages, ...stills]
    .filter((image, i, all) => all.findIndex((other) => other.url === image.url) === i)
    .slice(0, 10);
  const aboutImages = [
    ...work.map((w) => w.cover_image).filter(Boolean),
    ...stills.map((s) => s.url),
  ];

  return (
    <>
      {/* 1 ------------------------------------------------ cinematic hero */}
      <VideoHero settings={settings} video={hero} />

      {/* 2 ------------------------------------------ trust / introduction */}
      <TrustStrip settings={settings} />

      {/* 3 ---------------------------------------------- large featured video */}
      {featured ? <FeaturedVideo video={featured} /> : null}

      {/* 4 ----------------------------------------------- featured services */}
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

      {/* 5 ------------------------------------------- latest work video grid */}
      <VideoShowcase videos={showcaseVideos} />

      {/* 6 -------------------------------------- about, with authentic stills */}
      <AboutPreview settings={settings} images={aboutImages} />

      {/* 7 ------------------------------- the client's message, word for word */}
      <HealerMessage settings={settings} />

      {/* 8 ------------------------------------ traditional practice, on video */}
      {practiceVideo ? (
        <VideoStory
          video={practiceVideo}
          eyebrow="Traditional practice"
          title="Herbs, Preparation & Traditional Practice"
          body={[
            'Much of the work rests on plants — leaves, roots and bark gathered fresh and prepared the way they have been prepared in this part of Uganda for generations.',
            'Nothing about it is hidden. The preparation happens in the open, in front of whoever has come, and the footage on this page was filmed exactly where the work takes place.',
          ]}
          points={[
            'Fresh cuttings gathered and prepared on the day they are used',
            'Carried out in the open, in front of the family who asked for it',
            'Traditional practice — offered alongside, never in place of, medical care',
          ]}
          href="/services"
          linkLabel="See the consultation areas"
          side="left"
          tone="dark"
        />
      ) : null}

      {/* 9 -------------------------------------------------- video carousel */}
      <VideoCarousel videos={pool} />

      {/* 10 --------------------------- photo gallery, drawn from the footage */}
      {galleryImages.length ? (
        <section className="relative overflow-hidden bg-forest-950 py-20 lg:py-28">
          <div aria-hidden className="pattern-diamond absolute inset-0 opacity-50" />
          <div className="container relative z-10">
            <SectionHeading
              eyebrow="Photo gallery"
              title="Moments From the Practice"
              intro="Still photographs taken from Dr Salongo Hamuza's own recordings — the gatherings, the herbs, the homesteads and the people who came to watch."
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

      {/* 11 --------------------------------- his own message, on video + why */}
      {messageVideo ? (
        <VideoStory
          video={messageVideo}
          eyebrow="Hear from him directly"
          title="Dr Salongo Hamuza, In His Own Voice"
          body={[
            'Before deciding anything, it is worth simply hearing him speak. In this recording he explains who he is, the work he does and how anyone who needs him can make contact.',
            'He speaks in his own language and in his own words, without a script — which is, in the end, the most honest introduction there is.',
          ]}
          href="/about"
          linkLabel="Read his full story"
          side="right"
          tone="light"
        />
      ) : null}

      <WhyConsult />

      {/* ----------------------------------------- recorded work & activities */}
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

      <ApproachSection />

      {/* 12 ------------------------------------------------------ testimonials */}
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

      {/* 13 ------------------------------------------------------------- blog */}
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

      {/* 14 / 15 / 16 ------------------------- consultation, contact, notice */}
      <ConsultationCTA
        settings={settings}
        backgroundImage={stills.find((s) => s.url.includes('community-gathering'))?.url}
      />
      <ContactInfoSection settings={settings} />
      <DisclaimerSection settings={settings} />
    </>
  );
}
