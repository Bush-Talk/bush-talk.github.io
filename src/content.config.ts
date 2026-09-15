import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
import { blankable, numberWithDefault, boolWithDefault } from './lib/schema';

/**
 * Every field defined here shows up as a form field in the CMS at /admin.
 * If you change a schema, change public/admin/config.yml to match — they are
 * two descriptions of the same thing, and Sveltia has no way to read this one.
 */

const programs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/programs' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    // Controls ordering on the programs index. Lower numbers come first.
    order: numberWithDefault(50),
    image: blankable(z.string()),
    imageAlt: z.string().default(''),
    // Free text, not a number — "$150 for one hour session", "POA" all happen.
    price: blankable(z.string()),
    duration: blankable(z.string()),
    audience: blankable(z.string()),
    includes: z.array(z.string()).default([]),
    draft: boolWithDefault(false),
  }),
});

/**
 * Dated weaving workshops. Separate from programs because these expire —
 * the site hides them once the date has passed, so old ones can be left alone
 * rather than needing to be deleted.
 */
const workshops = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/workshops' }),
  schema: z.object({
    title: z.string(),
    date: blankable(z.coerce.date()),
    dateLabel: blankable(z.string()),
    time: blankable(z.string()),
    location: blankable(z.string()),
    price: blankable(z.string()),
    duration: blankable(z.string()),
    summary: z.string(),
    bookingUrl: blankable(z.string()),
    image: blankable(z.string()),
    imageAlt: z.string().default(''),
    order: numberWithDefault(50),
    draft: boolWithDefault(false),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    role: blankable(z.string()),
    // Mirrors how the reviews are grouped on the current site.
    category: z
      .enum(['principals', 'teachers', 'kids', 'participants'])
      .catch('participants')
      .default('participants'),
    featured: boolWithDefault(false),
    order: numberWithDefault(50),
    draft: boolWithDefault(false),
  }),
});

/**
 * Loose photos that aren't tied to one program or workshop. Grouped so a photo
 * can be pointed at the page it belongs on without needing a new collection
 * every time.
 */
const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    image: z.string(),
    imageAlt: z.string().default(''),
    caption: blankable(z.string()),
    group: z.enum(['weaving', 'bush']).catch('bush').default('bush'),
    order: numberWithDefault(50),
    draft: boolWithDefault(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: blankable(z.string()),
    image: blankable(z.string()),
    imageAlt: z.string().default(''),
    draft: boolWithDefault(false),
  }),
});

export const collections = { programs, workshops, testimonials, gallery, pages };
