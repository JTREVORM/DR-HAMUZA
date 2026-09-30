'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70svh] items-center bg-forest-950 py-32">
      <div className="container text-center">
        <p className="eyebrow-light justify-center">Something went wrong</p>
        <h1 className="heading-lg mt-4 text-cream-100">This page could not be loaded</h1>
        <p className="mx-auto mt-5 max-w-lg text-[0.98rem] leading-[1.9] text-cream-200/70">
          Please try again in a moment. If the problem continues you can still reach
          Dr Salongo Hamuza directly by telephone or WhatsApp.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn-gold">
            Try again
          </button>
          <Link href="/contact" className="btn-outline-gold">
            Contact page
          </Link>
        </div>
      </div>
    </section>
  );
}
