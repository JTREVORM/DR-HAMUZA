'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import {
  AdminCard,
  AdminLoading,
  AdminPageHeader,
  FeedbackBanner,
  Field,
  useConfirm,
  type Feedback,
} from '@/components/admin/ui';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import type { BlogCategory } from '@/lib/types';

export default function AdminBlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const { pending, confirm } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await createClient().from('blog_categories').select('*').order('name');
    if (error) setFeedback({ type: 'error', message: error.message });
    setCategories((data as BlogCategory[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function add(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    const { error } = await createClient()
      .from('blog_categories')
      .insert({ name: name.trim(), slug: slugify(name), description });
    if (error) {
      setFeedback({
        type: 'error',
        message: /duplicate|unique/i.test(error.message)
          ? 'A category with that name already exists.'
          : error.message,
      });
      return;
    }
    setName('');
    setDescription('');
    setFeedback({ type: 'success', message: 'Category added.' });
    load();
  }

  async function remove(category: BlogCategory) {
    const { error } = await createClient()
      .from('blog_categories')
      .delete()
      .eq('id', category.id);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
      return;
    }
    setFeedback({ type: 'success', message: `"${category.name}" was deleted.` });
    load();
  }

  return (
    <>
      <AdminPageHeader
        title="Blog categories"
        description="Group articles by topic. Removing a category leaves its articles in place, simply uncategorised."
        action={
          <Link href="/admin/blog" className="btn-outline-forest !py-2.5 text-[0.8rem]">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to articles
          </Link>
        }
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard title="Add a category">
          <form onSubmit={add} className="space-y-5">
            <Field label="Name" required>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={80}
                className="field"
                placeholder="Traditional Practices"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={300}
                className="field resize-y"
              />
            </Field>
            <button type="submit" className="btn-gold">
              <Plus className="h-4 w-4" aria-hidden />
              Add category
            </button>
          </form>
        </AdminCard>

        <AdminCard title="Existing categories">
          {loading ? (
            <AdminLoading label="Loading categories" />
          ) : categories.length ? (
            <ul className="divide-y divide-earth-200">
              {categories.map((category) => (
                <li key={category.id} className="flex items-center justify-between gap-3 py-3.5">
                  <span className="min-w-0">
                    <span className="block text-[0.9rem] font-medium text-forest-900">
                      {category.name}
                    </span>
                    <span className="block text-[0.74rem] text-forest-800/50">
                      /{category.slug}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => confirm(category.id, () => remove(category))}
                    className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-[0.76rem] font-medium transition ${
                      pending === category.id
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'w-9 border-earth-200 px-0 text-red-700 hover:border-red-400 hover:bg-red-50'
                    }`}
                    aria-label={
                      pending === category.id
                        ? `Confirm deleting ${category.name}`
                        : `Delete ${category.name}`
                    }
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    {pending === category.id ? 'Confirm' : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-[0.86rem] text-forest-800/55">
              No categories yet.
            </p>
          )}
        </AdminCard>
      </div>
    </>
  );
}
