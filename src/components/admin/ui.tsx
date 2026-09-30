'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { CheckCircle2, Loader2, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------ page shell -- */

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-earth-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl text-forest-900 sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-forest-800/65">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap gap-2.5">{action}</div> : null}
    </header>
  );
}

export function AdminCard({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn('rounded-2xl border border-earth-200 bg-white p-6 shadow-sm sm:p-7', className)}
    >
      {title ? (
        <div className="mb-6">
          <h2 className="font-display text-lg text-forest-900">{title}</h2>
          {description ? (
            <p className="mt-1.5 text-[0.84rem] leading-relaxed text-forest-800/60">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/* ---------------------------------------------------------------- fields -- */

export function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      <span className="label">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1.5 block text-[0.74rem] text-forest-800/50">{hint}</span> : null}
    </label>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3.5 rounded-xl border border-earth-200 bg-cream-50 p-4">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-gold-500' : 'bg-earth-200'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
            checked ? 'left-[1.4rem]' : 'left-0.5'
          )}
        />
      </button>
      <span>
        <span className="block text-[0.88rem] font-medium text-forest-900">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-[0.78rem] leading-relaxed text-forest-800/60">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

/* ------------------------------------------------------------- feedback --- */

export type Feedback = { type: 'success' | 'error'; message: string } | null;

export function FeedbackBanner({
  feedback,
  onDismiss,
}: {
  feedback: Feedback;
  onDismiss?: () => void;
}) {
  useEffect(() => {
    if (feedback?.type === 'success' && onDismiss) {
      const timer = setTimeout(onDismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback, onDismiss]);

  if (!feedback) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'mb-6 flex items-start gap-2.5 rounded-xl border p-4 text-[0.86rem] leading-relaxed',
        feedback.type === 'success'
          ? 'border-green-600/30 bg-green-50 text-green-900'
          : 'border-red-600/30 bg-red-50 text-red-900'
      )}
    >
      {feedback.type === 'success' ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      ) : (
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      )}
      <span>{feedback.message}</span>
    </div>
  );
}

export function SaveButton({
  saving,
  label = 'Save changes',
  className,
}: {
  saving: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <button type="submit" disabled={saving} className={cn('btn-gold', className)}>
      {saving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Saving&hellip;
        </>
      ) : (
        label
      )}
    </button>
  );
}

/* ---------------------------------------------------------- empty states -- */

export function AdminEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-earth-300 bg-cream-50 px-6 py-14 text-center">
      {icon ? (
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-700">
          {icon}
        </div>
      ) : null}
      <h3 className="font-display text-lg text-forest-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-[0.86rem] leading-relaxed text-forest-800/65">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="btn-gold mt-6">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function AdminLoading({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-forest-800/60" role="status">
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
      <span className="text-[0.86rem]">{label}&hellip;</span>
    </div>
  );
}

export function StatusPill({ published, labels }: { published: boolean; labels?: [string, string] }) {
  const [on, off] = labels ?? ['Published', 'Draft'];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold',
        published ? 'bg-green-100 text-green-800' : 'bg-earth-100 text-earth-700'
      )}
    >
      <span
        aria-hidden
        className={cn('h-1.5 w-1.5 rounded-full', published ? 'bg-green-600' : 'bg-earth-500')}
      />
      {published ? on : off}
    </span>
  );
}

/* ---------------------------------------------- confirm-before-destroy ---- */

export function useConfirm() {
  const [pending, setPending] = useState<string | null>(null);

  /**
   * Two-step delete: the first click arms the button, the second within five
   * seconds performs the action. Prevents accidental data loss on touch
   * screens without resorting to a blocking window.confirm dialog.
   */
  function confirm(id: string, action: () => void) {
    if (pending === id) {
      setPending(null);
      action();
      return;
    }
    setPending(id);
    setTimeout(() => setPending((current) => (current === id ? null : current)), 5000);
  }

  return { pending, confirm };
}
