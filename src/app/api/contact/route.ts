import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { CONSULTATION_TYPES } from '@/content/site-defaults';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LIMITS = {
  full_name: 120,
  phone: 40,
  email: 160,
  consultation_type: 120,
  message: 4000,
} as const;

const clean = (value: unknown, max: number) =>
  typeof value === 'string' ? value.replace(/\u0000/g, '').trim().slice(0, max) : '';

export async function POST(request: Request) {
  // ---------------------------------------------------------- rate limit --
  const ip = clientIp(request.headers);
  const limited = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many messages sent from this device. Please try again a little later.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfter) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // ------------------------------------------------------- anti-spam ------
  // 1. Honeypot: a field hidden from people but filled in by most bots.
  if (clean(body.website, 200)) {
    // Answer as though it succeeded so the bot does not learn the trap exists.
    return NextResponse.json({ ok: true });
  }
  // 2. Time trap: a human cannot read and complete this form in under three seconds.
  const elapsed = Number(body.elapsed_ms);
  if (Number.isFinite(elapsed) && elapsed > 0 && elapsed < 3000) {
    return NextResponse.json({ ok: true });
  }

  // --------------------------------------------------------- validation --
  const full_name = clean(body.full_name, LIMITS.full_name);
  const phone = clean(body.phone, LIMITS.phone);
  const email = clean(body.email, LIMITS.email);
  const message = clean(body.message, LIMITS.message);
  const requested_type = clean(body.consultation_type, LIMITS.consultation_type);
  const source_page = clean(body.source_page, 200);

  const errors: Record<string, string> = {};
  if (full_name.length < 2) errors.full_name = 'Please enter your name.';
  if (phone.replace(/\D/g, '').length < 7) errors.phone = 'Please enter a valid phone number.';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'Please enter a valid email address, or leave it blank.';
  }
  if (message.length < 10) {
    errors.message = 'Please describe your situation in at least a few words.';
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ error: 'Please check the form.', errors }, { status: 400 });
  }

  // Only accept a consultation type the site actually offers.
  const consultation_type = CONSULTATION_TYPES.includes(requested_type)
    ? requested_type
    : 'General Traditional Consultation';

  // ------------------------------------------------------------- store ---
  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          'The message could not be saved because the site is not fully configured yet. Please call or send a WhatsApp message instead.',
      },
      { status: 503 }
    );
  }

  const { error } = await supabase
    .from('inquiries')
    .insert({ full_name, phone, email, consultation_type, message, source_page });

  if (error) {
    console.error('Failed to store inquiry:', error.message);
    return NextResponse.json(
      {
        error:
          'Your message could not be sent just now. Please try again, or call the number on this page.',
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
