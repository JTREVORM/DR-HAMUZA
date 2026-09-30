'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_SETTINGS } from '@/content/site-defaults';
import type { SiteSettings } from '@/lib/types';
import type { Feedback } from '@/components/admin/ui';

/**
 * Loads the single site_settings row and saves partial updates back to it.
 * Shared by the Site Settings and SEO screens so both edit the same record.
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await createClient()
        .from('site_settings')
        .select('*')
        .eq('id', true)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        const row = data as Record<string, unknown>;
        const merged = { ...DEFAULT_SETTINGS } as Record<string, unknown>;
        for (const key of Object.keys(DEFAULT_SETTINGS)) {
          if (row[key] !== null && row[key] !== undefined) merged[key] = row[key];
        }
        for (const key of ['hero_media_urls', 'business_hours'] as const) {
          if (!Array.isArray(merged[key])) merged[key] = DEFAULT_SETTINGS[key];
        }
        setSettings(merged as unknown as SiteSettings);
      }
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not load the site settings.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = useCallback(<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  }, []);

  const save = useCallback(
    async (fields: Partial<SiteSettings>, successMessage = 'Settings saved.') => {
      setSaving(true);
      setFeedback(null);
      try {
        const { error } = await createClient()
          .from('site_settings')
          .upsert({ id: true, ...fields })
          .eq('id', true);
        if (error) throw error;
        setFeedback({ type: 'success', message: successMessage });
      } catch (e) {
        setFeedback({
          type: 'error',
          message: e instanceof Error ? e.message : 'The settings could not be saved.',
        });
      } finally {
        setSaving(false);
      }
    },
    []
  );

  return { settings, set, save, loading, saving, feedback, setFeedback };
}
