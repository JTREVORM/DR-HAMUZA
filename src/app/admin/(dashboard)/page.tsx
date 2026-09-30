import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  FileEdit,
  Images,
  ImageIcon,
  Mail,
  MessageSquareQuote,
  Plus,
  Send,
  Video,
} from 'lucide-react';
import { AdminPageHeader, AdminCard, StatusPill } from '@/components/admin/ui';
import { createServerSupabase } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type { BlogPost, Inquiry, MediaItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function countOf(
  table: string,
  filters: Array<[string, string | boolean]> = []
): Promise<number> {
  const supabase = await createServerSupabase();
  if (!supabase) return 0;
  let query = supabase.from(table).select('id', { count: 'exact', head: true });
  for (const [column, value] of filters) query = query.eq(column, value);
  const { count } = await query;
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabase();

  const [
    photos,
    videos,
    workTotal,
    workPublished,
    workDrafts,
    testimonials,
    testimonialsPending,
    unread,
    articles,
    articleDrafts,
  ] = await Promise.all([
    countOf('media_library', [['media_type', 'image']]),
    countOf('videos'),
    countOf('work_posts'),
    countOf('work_posts', [['is_published', true]]),
    countOf('work_posts', [['is_published', false]]),
    countOf('testimonials'),
    countOf('testimonials', [['is_approved', false]]),
    countOf('inquiries', [['status', 'new']]),
    countOf('blog_posts'),
    countOf('blog_posts', [['status', 'draft']]),
  ]);

  const [recentMedia, recentInquiries, recentArticles] = supabase
    ? await Promise.all([
        supabase
          .from('media_library')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8)
          .then((r) => (r.data as MediaItem[]) ?? []),
        supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
          .then((r) => (r.data as Inquiry[]) ?? []),
        supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
          .then((r) => (r.data as BlogPost[]) ?? []),
      ])
    : [[], [], []];

  const cards = [
    { label: 'Photographs', value: photos, Icon: ImageIcon, href: '/admin/media' },
    { label: 'Videos', value: videos, Icon: Video, href: '/admin/videos' },
    { label: 'Work posts', value: workTotal, Icon: Images, href: '/admin/work' },
    { label: 'Published work', value: workPublished, Icon: Send, href: '/admin/work' },
    { label: 'Drafts', value: workDrafts + articleDrafts, Icon: FileEdit, href: '/admin/work' },
    {
      label: 'Testimonials',
      value: testimonials,
      Icon: MessageSquareQuote,
      href: '/admin/testimonials',
      badge: testimonialsPending ? `${testimonialsPending} awaiting approval` : undefined,
    },
    { label: 'Unread messages', value: unread, Icon: Mail, href: '/admin/messages', highlight: unread > 0 },
    { label: 'Blog articles', value: articles, Icon: BookOpen, href: '/admin/blog' },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="An overview of everything on the website. Use the menu to add photographs, videos, articles and work posts."
        action={
          <>
            <Link href="/admin/work/new" className="btn-gold !py-2.5 text-[0.8rem]">
              <Plus className="h-4 w-4" aria-hidden />
              New work post
            </Link>
            <Link href="/admin/media" className="btn-outline-forest !py-2.5 text-[0.8rem]">
              Upload media
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, Icon, href, badge, highlight }) => (
          <Link
            key={label}
            href={href}
            className={`group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              highlight ? 'border-gold-400 ring-1 ring-gold-300' : 'border-earth-200'
            }`}
          >
            <span className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-gold-700 transition group-hover:bg-gold-400 group-hover:text-forest-950">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-display text-3xl text-forest-900">{value}</span>
            </span>
            <span className="mt-4 block text-[0.84rem] font-medium text-forest-900">{label}</span>
            {badge ? (
              <span className="mt-1 block text-[0.72rem] text-gold-700">{badge}</span>
            ) : null}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminCard
          title="Latest messages"
          description="Enquiries received through the website contact form."
        >
          {recentInquiries.length ? (
            <ul className="divide-y divide-earth-200">
              {recentInquiries.map((inquiry) => (
                <li key={inquiry.id} className="py-3.5 first:pt-0 last:pb-0">
                  <Link href="/admin/messages" className="group block">
                    <span className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block truncate text-[0.88rem] font-medium text-forest-900 group-hover:text-gold-700">
                          {inquiry.full_name}
                        </span>
                        <span className="mt-0.5 block truncate text-[0.78rem] text-forest-800/60">
                          {inquiry.consultation_type} &middot; {inquiry.phone}
                        </span>
                      </span>
                      <StatusPill
                        published={inquiry.status !== 'new'}
                        labels={['Read', 'New']}
                      />
                    </span>
                    <span className="mt-1.5 block line-clamp-2 text-[0.8rem] leading-relaxed text-forest-800/70">
                      {inquiry.message}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-[0.86rem] text-forest-800/55">
              No messages have been received yet. They will appear here as soon as someone uses
              the contact form.
            </p>
          )}
        </AdminCard>

        <AdminCard title="Latest articles" description="The most recently created blog articles.">
          {recentArticles.length ? (
            <ul className="divide-y divide-earth-200">
              {recentArticles.map((post) => (
                <li key={post.id} className="py-3.5 first:pt-0 last:pb-0">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="flex items-start justify-between gap-3"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[0.88rem] font-medium text-forest-900 hover:text-gold-700">
                        {post.title}
                      </span>
                      <span className="mt-0.5 block text-[0.76rem] text-forest-800/55">
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                    </span>
                    <StatusPill published={post.status === 'published'} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-[0.86rem] text-forest-800/55">
              No articles yet.{' '}
              <Link href="/admin/blog/new" className="font-medium text-gold-700 underline">
                Write the first one
              </Link>
              .
            </p>
          )}
        </AdminCard>
      </div>

      <AdminCard
        title="Recently uploaded media"
        description="The newest files in the shared media library."
        className="mt-6"
      >
        {recentMedia.length ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {recentMedia.map((item) => (
              <Link
                key={item.id}
                href="/admin/media"
                className="relative block aspect-square overflow-hidden rounded-lg border border-earth-200 bg-cream-100"
              >
                {item.media_type === 'image' ? (
                  <Image
                    src={item.url}
                    alt={item.alt_text || item.file_name}
                    fill
                    sizes="120px"
                    className="object-cover transition hover:scale-105"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center bg-forest-900 text-gold-400">
                    <Video className="h-5 w-5" aria-hidden />
                  </span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-[0.86rem] text-forest-800/55">
            No media uploaded yet.{' '}
            <Link href="/admin/media" className="font-medium text-gold-700 underline">
              Upload your first photographs
            </Link>
            .
          </p>
        )}
      </AdminCard>
    </>
  );
}
