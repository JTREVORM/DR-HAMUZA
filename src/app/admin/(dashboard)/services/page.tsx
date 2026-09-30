'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, ExternalLink, Loader2, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react';
import {
  AdminEmptyState,
  AdminLoading,
  AdminPageHeader,
  FeedbackBanner,
  StatusPill,
  useConfirm,
  type Feedback,
} from '@/components/admin/ui';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_SERVICES } from '@/content/services';
import type { Service } from '@/lib/types';

export default function AdminServicesListPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const { pending, confirm } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await createClient()
        .from('services')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      setServices((data as Service[]) ?? []);
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not load the services.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Copies the thirteen consultation areas that ship with the site into the
   * database so they become editable. Existing rows are left untouched.
   */
  async function seedDefaults() {
    setSeeding(true);
    setFeedback(null);
    try {
      const supabase = createClient();
      const existing = new Set(services.map((s) => s.slug));
      const rows = DEFAULT_SERVICES.filter((s) => !existing.has(s.slug)).map((s) => ({
        ...s,
        cover_image: s.cover_image ?? '',
      }));
      if (!rows.length) {
        setFeedback({ type: 'success', message: 'All default services are already in place.' });
        return;
      }
      const { error } = await supabase.from('services').insert(rows);
      if (error) throw error;
      setFeedback({ type: 'success', message: `${rows.length} services were added.` });
      load();
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not add the default services.',
      });
    } finally {
      setSeeding(false);
    }
  }

  async function togglePublished(service: Service) {
    const { error } = await createClient()
      .from('services')
      .update({ is_published: !service.is_published })
      .eq('id', service.id);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
      return;
    }
    load();
  }

  async function remove(service: Service) {
    const { error } = await createClient().from('services').delete().eq('id', service.id);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
      return;
    }
    setFeedback({ type: 'success', message: `"${service.title}" was deleted.` });
    load();
  }

  return (
    <>
      <AdminPageHeader
        title="Services"
        description="The consultation areas shown on the website. Each one has its own page and its own search-engine listing."
        action={
          <>
            <button
              type="button"
              onClick={seedDefaults}
              disabled={seeding}
              className="btn-outline-forest !py-2.5 text-[0.8rem]"
            >
              {seeding ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Download className="h-4 w-4" aria-hidden />
              )}
              Load default services
            </button>
            <Link href="/admin/services/new" className="btn-gold !py-2.5 text-[0.8rem]">
              <Plus className="h-4 w-4" aria-hidden />
              New service
            </Link>
          </>
        }
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      {loading ? (
        <AdminLoading label="Loading services" />
      ) : services.length ? (
        <div className="space-y-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="flex flex-col gap-4 rounded-2xl border border-earth-200 bg-white p-4 sm:flex-row sm:items-center"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-700">
                <ServiceIcon name={service.icon} className="h-5 w-5" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-[1.05rem] text-forest-900">{service.title}</h2>
                  <StatusPill published={service.is_published} labels={['Published', 'Hidden']} />
                  {service.is_featured ? (
                    <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[0.68rem] font-semibold text-gold-800">
                      Featured
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-1 text-[0.82rem] text-forest-800/65">
                  {service.short_description}
                </p>
                <p className="mt-1 text-[0.72rem] text-forest-800/40">/services/{service.slug}</p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => togglePublished(service)}
                  className="rounded-lg border border-earth-200 px-3 py-2 text-[0.76rem] font-medium text-forest-800 transition hover:border-gold-400 hover:bg-gold-50"
                >
                  {service.is_published ? 'Hide' : 'Publish'}
                </button>
                <Link
                  href={`/services/${service.slug}`}
                  target="_blank"
                  aria-label={`View ${service.title} on the website`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-earth-200 text-forest-800 hover:border-gold-400 hover:bg-gold-50"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href={`/admin/services/${service.id}`}
                  aria-label={`Edit ${service.title}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-earth-200 text-forest-800 hover:border-gold-400 hover:bg-gold-50"
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                </Link>
                <button
                  type="button"
                  onClick={() => confirm(service.id, () => remove(service))}
                  className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-[0.76rem] font-medium transition ${
                    pending === service.id
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'w-9 border-earth-200 px-0 text-red-700 hover:border-red-400 hover:bg-red-50'
                  }`}
                  aria-label={
                    pending === service.id
                      ? `Confirm deleting ${service.title}`
                      : `Delete ${service.title}`
                  }
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  {pending === service.id ? 'Confirm' : null}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmptyState
          icon={<Sparkles className="h-6 w-6" />}
          title="Services are not yet stored in the database"
          description="The website is currently showing the thirteen consultation areas that ship with it. Choose “Load default services” above to copy them into the database, after which every word can be edited here."
        />
      )}
    </>
  );
}
