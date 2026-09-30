'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Check, MessageSquareQuote, Plus, Star, Trash2, X } from 'lucide-react';
import {
  AdminCard,
  AdminEmptyState,
  AdminLoading,
  AdminPageHeader,
  FeedbackBanner,
  Field,
  SaveButton,
  StatusPill,
  Toggle,
  useConfirm,
  type Feedback,
} from '@/components/admin/ui';
import { MediaField } from '@/components/admin/MediaPicker';
import { createClient } from '@/lib/supabase/client';
import { CONSULTATION_TYPES } from '@/content/site-defaults';
import { formatDate } from '@/lib/utils';
import type { Testimonial } from '@/lib/types';

const EMPTY = {
  client_name: '',
  photo_url: '',
  content: '',
  service: '',
  location: '',
  rating: 5 as number | null,
  is_approved: false,
  is_featured: false,
  given_at: '' as string | null,
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [draft, setDraft] = useState({ ...EMPTY });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const { pending, confirm } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await createClient()
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setFeedback({ type: 'error', message: error.message });
    setItems((data as Testimonial[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function add(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const { error } = await createClient()
      .from('testimonials')
      .insert({
        ...draft,
        client_name: draft.client_name.trim() || 'Anonymous',
        given_at: draft.given_at || null,
      });
    setSaving(false);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
      return;
    }
    setDraft({ ...EMPTY });
    setShowForm(false);
    setFeedback({ type: 'success', message: 'Testimonial added.' });
    load();
  }

  async function patch(item: Testimonial, changes: Partial<Testimonial>) {
    const { error } = await createClient().from('testimonials').update(changes).eq('id', item.id);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
      return;
    }
    load();
  }

  async function remove(item: Testimonial) {
    const { error } = await createClient().from('testimonials').delete().eq('id', item.id);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
      return;
    }
    setFeedback({ type: 'success', message: 'Testimonial deleted.' });
    load();
  }

  const awaiting = items.filter((i) => !i.is_approved).length;

  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        description="Only approved testimonials appear on the website. Please publish somebody's words only once they have given permission."
        action={
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="btn-gold !py-2.5 text-[0.8rem]"
          >
            <Plus className="h-4 w-4" aria-hidden />
            {showForm ? 'Close form' : 'Add testimonial'}
          </button>
        }
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      {awaiting ? (
        <p className="mb-6 rounded-xl border border-gold-300 bg-gold-50 p-4 text-[0.86rem] text-forest-900">
          {awaiting} {awaiting === 1 ? 'testimonial is' : 'testimonials are'} awaiting approval.
        </p>
      ) : null}

      {showForm ? (
        <AdminCard title="Add a testimonial" className="mb-6">
          <form onSubmit={add} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Name"
                hint="Leave blank to publish it as Anonymous."
              >
                <input
                  type="text"
                  value={draft.client_name}
                  onChange={(e) => setDraft({ ...draft, client_name: e.target.value })}
                  maxLength={120}
                  className="field"
                  placeholder="Anonymous"
                />
              </Field>
              <Field label="Location" hint="Optional, for example a district.">
                <input
                  type="text"
                  value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                  maxLength={120}
                  className="field"
                />
              </Field>
            </div>

            <Field label="Testimonial" required>
              <textarea
                value={draft.content}
                onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                rows={5}
                required
                maxLength={2000}
                className="field resize-y"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Consultation area">
                <select
                  value={draft.service}
                  onChange={(e) => setDraft({ ...draft, service: e.target.value })}
                  className="field"
                >
                  <option value="">Not specified</option>
                  {CONSULTATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Rating">
                <select
                  value={draft.rating ?? ''}
                  onChange={(e) =>
                    setDraft({ ...draft, rating: e.target.value ? Number(e.target.value) : null })
                  }
                  className="field"
                >
                  <option value="">No rating</option>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} out of 5
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Date given">
                <input
                  type="date"
                  value={draft.given_at ?? ''}
                  onChange={(e) => setDraft({ ...draft, given_at: e.target.value || null })}
                  className="field"
                />
              </Field>
            </div>

            <MediaField
              label="Photograph (optional)"
              value={draft.photo_url}
              onChange={(v) => setDraft({ ...draft, photo_url: v })}
              hint="Only include a photograph if the person has agreed to it being published."
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Toggle
                label="Approved for publication"
                description="Permission has been given for these words to appear on the website."
                checked={draft.is_approved}
                onChange={(v) => setDraft({ ...draft, is_approved: v })}
              />
              <Toggle
                label="Featured"
                checked={draft.is_featured}
                onChange={(v) => setDraft({ ...draft, is_featured: v })}
              />
            </div>

            <SaveButton saving={saving} label="Add testimonial" />
          </form>
        </AdminCard>
      ) : null}

      {loading ? (
        <AdminLoading label="Loading testimonials" />
      ) : items.length ? (
        <div className="space-y-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-earth-200 bg-white p-5 sm:flex-row"
            >
              {item.photo_url ? (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                  <Image src={item.photo_url} alt="" fill sizes="56px" className="object-cover" />
                </div>
              ) : (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cream-200 font-display text-lg text-forest-800">
                  {item.client_name.trim().charAt(0).toUpperCase() || 'A'}
                </span>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-[1rem] text-forest-900">{item.client_name}</h2>
                  <StatusPill
                    published={item.is_approved}
                    labels={['Approved', 'Awaiting approval']}
                  />
                  {item.rating ? (
                    <span className="inline-flex items-center gap-0.5">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" aria-hidden />
                      ))}
                      <span className="sr-only">{item.rating} out of 5</span>
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-[0.88rem] leading-relaxed text-forest-800/80">
                  &ldquo;{item.content}&rdquo;
                </p>

                <p className="mt-2 text-[0.74rem] text-forest-800/45">
                  {[item.service, item.location, formatDate(item.given_at || item.created_at)]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
                <button
                  type="button"
                  onClick={() => patch(item, { is_approved: !item.is_approved })}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[0.76rem] font-medium transition ${
                    item.is_approved
                      ? 'border-earth-200 text-forest-800 hover:bg-cream-100'
                      : 'border-green-500 bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {item.is_approved ? (
                    <>
                      <X className="h-3.5 w-3.5" aria-hidden />
                      Unapprove
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" aria-hidden />
                      Approve
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => patch(item, { is_featured: !item.is_featured })}
                  className="rounded-lg border border-earth-200 px-3 py-2 text-[0.76rem] font-medium text-forest-800 transition hover:border-gold-400 hover:bg-gold-50"
                >
                  {item.is_featured ? 'Unfeature' : 'Feature'}
                </button>
                <button
                  type="button"
                  onClick={() => confirm(item.id, () => remove(item))}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[0.76rem] font-medium transition ${
                    pending === item.id
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-earth-200 text-red-700 hover:border-red-400 hover:bg-red-50'
                  }`}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  {pending === item.id ? 'Confirm' : 'Delete'}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmptyState
          icon={<MessageSquareQuote className="h-6 w-6" />}
          title="No testimonials yet"
          description="When somebody shares their experience and gives permission for it to be published, add it here. Nothing appears on the website until it is approved."
        />
      )}
    </>
  );
}
