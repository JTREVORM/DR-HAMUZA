'use client';

import { useState } from 'react';
import { Link2, Wand2 } from 'lucide-react';
import { AdminCard, Field } from '@/components/admin/ui';
import { excerptFrom, slugify } from '@/lib/utils';

/** Slug field with a "generate from title" helper. */
export function SlugField({
  value,
  onChange,
  source,
  prefix,
}: {
  value: string;
  onChange: (value: string) => void;
  source: string;
  prefix: string;
}) {
  return (
    <Field
      label="URL slug"
      required
      hint={`The public address will be ${prefix}/${value || 'your-slug'}`}
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(slugify(e.target.value))}
          className="field"
          placeholder="a-short-web-address"
          required
        />
        <button
          type="button"
          onClick={() => onChange(slugify(source))}
          disabled={!source}
          title="Generate from the title"
          className="btn-outline-forest shrink-0 !px-3.5 !py-2.5"
        >
          <Wand2 className="h-4 w-4" aria-hidden />
          <span className="sr-only">Generate slug from title</span>
        </button>
      </div>
    </Field>
  );
}

/** Shared SEO block used by every content editor. */
export function SeoFields({
  seoTitle,
  seoDescription,
  onTitleChange,
  onDescriptionChange,
  fallbackTitle,
  fallbackDescription,
}: {
  seoTitle: string;
  seoDescription: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  fallbackTitle: string;
  fallbackDescription: string;
}) {
  const effectiveTitle = seoTitle || fallbackTitle;
  const effectiveDescription = seoDescription || excerptFrom(fallbackDescription, 160);

  return (
    <AdminCard
      title="Search engine listing"
      description="How this page appears in Google results. Leave blank to use the title and summary above."
    >
      <div className="space-y-5">
        <Field
          label="SEO title"
          hint={`${effectiveTitle.length} characters — aim for 50 to 60.`}
        >
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            maxLength={120}
            className="field"
            placeholder={fallbackTitle}
          />
        </Field>

        <Field
          label="SEO description"
          hint={`${effectiveDescription.length} characters — aim for 140 to 160.`}
        >
          <textarea
            value={seoDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={3}
            maxLength={320}
            className="field resize-y"
            placeholder={excerptFrom(fallbackDescription, 160)}
          />
        </Field>

        {/* Google-style preview */}
        <div className="rounded-xl border border-earth-200 bg-cream-50 p-4">
          <p className="mb-2 flex items-center gap-1.5 text-[0.70rem] font-semibold uppercase tracking-[0.16em] text-forest-800/45">
            <Link2 className="h-3.5 w-3.5" aria-hidden />
            Preview
          </p>
          <p className="truncate text-[1.05rem] text-[#1a0dab]">{effectiveTitle || 'Page title'}</p>
          <p className="mt-1 line-clamp-2 text-[0.82rem] leading-relaxed text-[#4d5156]">
            {effectiveDescription || 'A short description of this page.'}
          </p>
        </div>
      </div>
    </AdminCard>
  );
}

/** Comma-separated tag editor stored as a string array. */
export function TagsField({
  value,
  onChange,
  label = 'Tags',
  hint = 'Separate tags with commas.',
}: {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  hint?: string;
}) {
  const [text, setText] = useState(value.join(', '));

  return (
    <Field label={label} hint={hint}>
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(
            e.target.value
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          );
        }}
        className="field"
        placeholder="traditional herbs, community, Kampala"
      />
    </Field>
  );
}

/**
 * Plain-text body editor. The site renders a small, safe subset of Markdown
 * (headings, lists, bold, italic, links, quotes) with all HTML escaped first.
 */
export function BodyField({
  label,
  value,
  onChange,
  rows = 16,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
}) {
  return (
    <Field
      label={label}
      required={required}
      hint="Formatting: ## Heading, ### Sub-heading, **bold**, *italic*, - bullet, 1. numbered, > quote, [link](https://…). Leave a blank line between paragraphs."
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        required={required}
        className="field resize-y font-mono text-[0.84rem] leading-relaxed"
      />
    </Field>
  );
}
