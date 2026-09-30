'use client';

import { useCallback, useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import {
  AdminCard,
  AdminLoading,
  AdminPageHeader,
  FeedbackBanner,
  Field,
  SaveButton,
  type Feedback,
} from '@/components/admin/ui';
import { MediaField } from '@/components/admin/MediaPicker';
import { createClient } from '@/lib/supabase/client';

export default function AdminProfilePage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const load = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? '');

      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      setFullName(data?.full_name ?? '');
      setAvatarUrl(data?.avatar_url ?? '');
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not load your profile.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setSavingProfile(true);
    setFeedback(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('You are no longer signed in.');

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, avatar_url: avatarUrl })
        .eq('id', user.id);
      if (error) throw error;
      setFeedback({ type: 'success', message: 'Profile saved.' });
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not save your profile.',
      });
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 10) {
      setFeedback({
        type: 'error',
        message: 'Please choose a password of at least 10 characters.',
      });
      return;
    }
    if (password !== confirmPassword) {
      setFeedback({ type: 'error', message: 'The two passwords do not match.' });
      return;
    }

    setSavingPassword(true);
    setFeedback(null);
    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) throw error;
      setPassword('');
      setConfirmPassword('');
      setFeedback({ type: 'success', message: 'Your password has been changed.' });
    } catch (e) {
      setFeedback({
        type: 'error',
        message: e instanceof Error ? e.message : 'Could not change your password.',
      });
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) return <AdminLoading label="Loading your profile" />;

  return (
    <>
      <AdminPageHeader
        title="Profile"
        description="Your own dashboard account."
      />

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard title="Your details">
          <form onSubmit={saveProfile} className="space-y-5">
            <Field label="Email address" hint="Changed in Supabase Authentication, not here.">
              <input type="email" value={email} readOnly disabled className="field bg-cream-100" />
            </Field>

            <Field label="Name">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={120}
                className="field"
              />
            </Field>

            <MediaField
              label="Profile photograph"
              value={avatarUrl}
              onChange={setAvatarUrl}
            />

            <SaveButton saving={savingProfile} label="Save profile" />
          </form>
        </AdminCard>

        <div className="space-y-6">
          <AdminCard title="Change password">
            <form onSubmit={changePassword} className="space-y-5">
              <Field label="New password" required hint="At least 10 characters.">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={10}
                  autoComplete="new-password"
                  className="field"
                />
              </Field>

              <Field label="Repeat the new password" required>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={10}
                  autoComplete="new-password"
                  className="field"
                />
              </Field>

              <SaveButton saving={savingPassword} label="Change password" />
            </form>
          </AdminCard>

          <AdminCard title="Keeping the dashboard safe">
            <div className="flex gap-3.5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" aria-hidden />
              <div className="space-y-3 text-[0.86rem] leading-relaxed text-forest-800/75">
                <p>
                  Only people with an account in this website&rsquo;s Supabase project can reach
                  the dashboard. New administrators are invited from the Supabase dashboard, under
                  Authentication → Users.
                </p>
                <p>
                  Use a long password that is not used anywhere else, and never share it. If you
                  think somebody else has learned it, change it here immediately.
                </p>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </>
  );
}
