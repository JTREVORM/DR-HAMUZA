import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-earth-300 bg-cream-50/80 px-6 py-14 text-center">
      {icon ? (
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-forest-900/5 text-forest-700">
          {icon}
        </div>
      ) : null}
      <h2 className="font-display text-xl text-forest-900">{title}</h2>
      <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-forest-800/70">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
