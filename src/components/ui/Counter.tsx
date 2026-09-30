'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Counts up to a numeric target once the element scrolls into view. Any
 * non-numeric admin value (for example "20+" or "Over 15") is shown as-is.
 */
export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/(\d[\d,]*)/);
  const target = match ? Number(match[1].replace(/,/g, '')) : null;
  const [display, setDisplay] = useState(
    target === null || !match ? value : value.replace(match[1], '0')
  );

  useEffect(() => {
    if (target === null || !match || !ref.current) return;
    const node = ref.current;
    const token = match[1];
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(value.replace(token, Math.round(target * eased).toLocaleString()));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // `match` is derived from `value`, so `value` alone is the real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, target]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
