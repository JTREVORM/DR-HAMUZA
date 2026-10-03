'use client';

import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Loader2, Send, TriangleAlert } from 'lucide-react';
import { CONSULTATION_TYPES } from '@/content/site-defaults';

type Errors = Record<string, string>;

export function ContactForm({ defaultType }: { defaultType?: string }) {
  const pathname = usePathname();
  const mountedAt = useRef(Date.now());
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;

    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus('sending');
    setErrors({});
    setMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: data.get('full_name'),
          phone: data.get('phone'),
          email: data.get('email'),
          consultation_type: data.get('consultation_type'),
          message: data.get('message'),
          website: data.get('website'), // honeypot
          elapsed_ms: Date.now() - mountedAt.current,
          source_page: pathname,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus('error');
        setErrors(result.errors ?? {});
        setMessage(
          result.error ?? 'Your message could not be sent. Please try again in a moment.'
        );
        return;
      }

      form.reset();
      mountedAt.current = Date.now();
      setStatus('sent');
      setMessage(
        'Thank you. Your message has been received and Dr Salongo Hamuza will be in touch. If your matter is urgent, please call the number on this page.'
      );
    } catch {
      setStatus('error');
      setMessage(
        'Your message could not be sent — please check your connection and try again, or call the number on this page.'
      );
    }
  }

  const fieldError = (name: string) =>
    errors[name] ? (
      <p id={`${name}-error`} className="mt-1.5 text-[0.78rem] text-red-700">
        {errors[name]}
      </p>
    ) : null;

  const invalid = (name: string) =>
    errors[name]
      ? { 'aria-invalid': true as const, 'aria-describedby': `${name}-error` }
      : {};

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Honeypot — visually hidden and hidden from assistive technology. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Do not fill this in</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="full_name">
            Full name <span className="text-red-600">*</span>
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            autoComplete="name"
            maxLength={120}
            placeholder="Your full name"
            className="field"
            {...invalid('full_name')}
          />
          {fieldError('full_name')}
        </div>

        <div>
          <label className="label" htmlFor="phone">
            Phone number <span className="text-red-600">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            maxLength={40}
            placeholder="+256 7XX XXX XXX"
            className="field"
            {...invalid('phone')}
          />
          {fieldError('phone')}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="email">
            Email <span className="font-normal normal-case text-forest-800/45">(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={160}
            placeholder="you@example.com"
            className="field"
            {...invalid('email')}
          />
          {fieldError('email')}
        </div>

        <div>
          <label className="label" htmlFor="consultation_type">
            Type of consultation
          </label>
          <select
            id="consultation_type"
            name="consultation_type"
            defaultValue={
              defaultType && CONSULTATION_TYPES.includes(defaultType)
                ? defaultType
                : 'General Traditional Consultation'
            }
            className="field"
          >
            {CONSULTATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="message">
          Your message <span className="text-red-600">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={4000}
          placeholder="Please describe your situation in your own words. Everything you write is treated in confidence."
          className="field resize-y"
          {...invalid('message')}
        />
        {fieldError('message')}
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-gold w-full sm:w-auto"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending&hellip;
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden />
            Send message
          </>
        )}
      </button>

      <p aria-live="polite" role="status">
        {status === 'sent' ? (
          <span className="flex items-start gap-2.5 rounded-xl border border-green-600/30 bg-green-50 p-4 text-[0.88rem] leading-relaxed text-green-900">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {message}
          </span>
        ) : status === 'error' && message ? (
          <span className="flex items-start gap-2.5 rounded-xl border border-red-600/30 bg-red-50 p-4 text-[0.88rem] leading-relaxed text-red-900">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {message}
          </span>
        ) : null}
      </p>

      <p className="text-[0.78rem] leading-relaxed text-forest-800/55">
        Your details are used only to respond to your enquiry. They are never sold, published or
        shared with anyone else.
      </p>
    </form>
  );
}
