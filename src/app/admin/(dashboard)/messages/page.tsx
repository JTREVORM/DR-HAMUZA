'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Mail, MessageCircle, Phone, Trash2 } from 'lucide-react';
import {
  AdminEmptyState,
  AdminLoading,
  AdminPageHeader,
  FeedbackBanner,
  useConfirm,
  type Feedback,
} from '@/components/admin/ui';
import { createClient } from '@/lib/supabase/client';
import { cn, formatDate, telHref, whatsappHref } from '@/lib/utils';
import type { Inquiry } from '@/lib/types';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
] as const;

type Filter = (typeof FILTERS)[number]['value'];

export default function AdminMessagesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const { pending, confirm } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await createClient()
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setFeedback({ type: 'error', message: error.message });
    setItems((data as Inquiry[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(item: Inquiry, status: Inquiry['status']) {
    setItems((current) => current.map((i) => (i.id === item.id ? { ...i, status } : i)));
    const { error } = await createClient().from('inquiries').update({ status }).eq('id', item.id);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
      load();
    }
  }

  async function remove(item: Inquiry) {
    const { error } = await createClient().from('inquiries').delete().eq('id', item.id);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
      return;
    }
    setItems((current) => current.filter((i) => i.id !== item.id));
    setFeedback({ type: 'success', message: 'Message deleted.' });
  }

  const visible = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.status === filter)),
    [items, filter]
  );

  const counts = useMemo(
    () =>
      items.reduce<Record<string, number>>(
        (acc, item) => ({ ...acc, [item.status]: (acc[item.status] ?? 0) + 1 }),
        {}
      ),
    [items]
  );

  return (
    <>
      <AdminPageHeader
        title="Messages"
        description="Enquiries received through the website contact form."
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            aria-pressed={filter === option.value}
            className={cn(
              'rounded-full border px-4 py-2 text-[0.78rem] font-medium transition',
              filter === option.value
                ? 'border-gold-500 bg-gold-400 text-forest-950'
                : 'border-earth-200 bg-white text-forest-800 hover:border-gold-400'
            )}
          >
            {option.label}
            {option.value !== 'all' && counts[option.value]
              ? ` (${counts[option.value]})`
              : option.value === 'all' && items.length
                ? ` (${items.length})`
                : ''}
          </button>
        ))}
      </div>

      {loading ? (
        <AdminLoading label="Loading messages" />
      ) : visible.length ? (
        <div className="space-y-3">
          {visible.map((item) => (
            <article
              key={item.id}
              className={cn(
                'rounded-2xl border bg-white p-5',
                item.status === 'new' ? 'border-gold-400 ring-1 ring-gold-200' : 'border-earth-200'
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-display text-[1.05rem] text-forest-900">{item.full_name}</h2>
                  <p className="mt-1 text-[0.78rem] text-forest-800/55">
                    {item.consultation_type} &middot; {formatDate(item.created_at)}
                    {item.source_page ? ` · from ${item.source_page}` : ''}
                  </p>
                </div>

                <select
                  value={item.status}
                  onChange={(e) => setStatus(item, e.target.value as Inquiry['status'])}
                  aria-label={`Status of the message from ${item.full_name}`}
                  className="field !w-auto !py-2 text-[0.78rem]"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <p className="mt-4 whitespace-pre-line rounded-xl bg-cream-50 p-4 text-[0.88rem] leading-relaxed text-forest-800/85">
                {item.message}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <a href={telHref(item.phone)} className="btn-outline-forest !py-2 text-[0.76rem]">
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  {item.phone}
                </a>
                <a
                  href={whatsappHref(
                    item.phone,
                    `Hello ${item.full_name}, thank you for your message to Dr Salongo Hamuza.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp !py-2 text-[0.76rem]"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                  WhatsApp
                </a>
                {item.email ? (
                  <a
                    href={`mailto:${item.email}`}
                    className="btn-outline-forest !py-2 text-[0.76rem]"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    {item.email}
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => confirm(item.id, () => remove(item))}
                  className={cn(
                    'btn !py-2 text-[0.76rem]',
                    pending === item.id
                      ? 'bg-red-500 text-white'
                      : 'border border-earth-200 text-red-700 hover:bg-red-50'
                  )}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  {pending === item.id ? 'Confirm delete' : 'Delete'}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmptyState
          icon={<Mail className="h-6 w-6" />}
          title={filter === 'all' ? 'No messages yet' : `No ${filter} messages`}
          description={
            filter === 'all'
              ? 'Enquiries sent through the website contact form will appear here.'
              : 'Try a different filter to see other messages.'
          }
        />
      )}
    </>
  );
}
