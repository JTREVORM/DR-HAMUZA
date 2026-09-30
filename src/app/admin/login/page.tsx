'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, TriangleAlert } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/env';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(() => {
    switch (params.get('error')) {
      case 'not-configured':
        return 'This site is not connected to Supabase yet. Add the Supabase environment variables, then sign in.';
      case 'not-authorised':
        return 'That account does not have dashboard access.';
      default:
        return '';
    }
  });

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured for this deployment.');
      return;
    }

    setBusy(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        // Deliberately vague: never reveal whether an email address exists.
        setError('Those sign-in details were not recognised. Please try again.');
        setBusy(false);
        return;
      }

      const next = params.get('next');
      router.replace(next && next.startsWith('/admin') ? next : '/admin');
      router.refresh();
    } catch {
      setError('Sign in could not be completed. Please try again.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="label" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field pr-12"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-forest-800/50 hover:text-forest-900"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-600/30 bg-red-50 p-3.5 text-[0.84rem] leading-relaxed text-red-900"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={busy} className="btn-gold w-full">
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Signing in&hellip;
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" aria-hidden />
            Sign in
          </>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-forest-950 px-4 py-16">
      <div aria-hidden className="pattern-diamond absolute inset-0 opacity-55" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-gold-400/10 blur-[120px]"
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center">
          <Logo alt="Dr Salongo Hamuza" size={92} className="mx-auto" priority />
          <h1 className="mt-6 font-display text-2xl text-cream-100">Dashboard Sign In</h1>
          <p className="mt-2 text-[0.86rem] text-cream-200/60">
            Private area for managing the website content
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-gold-500/25 bg-cream-50 p-7 shadow-deep sm:p-8">
          <Suspense
            fallback={
              <div className="flex justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-forest-800/50" aria-hidden />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.82rem] text-cream-200/60 transition hover:text-gold-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to the website
          </Link>
        </p>
      </div>
    </main>
  );
}
