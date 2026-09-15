import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

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
    order: z.number().default(50),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    // Free text, not a number — "$150 for one hour session", "POA" all happen.
    price: z.string().optional(),
    duration: z.string().optional(),
    audience: z.string().optional(),
    includes: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
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
    date: z.coerce.date().optional(),
    dateLabel: z.string().optional(),
    time: z.string().optional(),
    location: z.string().optional(),
    price: z.string().optional(),
    duration: z.string().optional(),
    summary: z.string(),
    bookingUrl: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    order: z.number().default(50),
    draft: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string().optional(),
    // Mirrors how the reviews are grouped on the current site.
    category: z.enum(['principals', 'teachers', 'kids', 'participants']).default('participants'),
    featured: z.boolean().default(false),
    order: z.number().default(50),
    draft: z.boolean().default(false),
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
    caption: z.string().optional(),
    group: z.enum(['weaving', 'bush']).default('bush'),
    order: z.number().default(50),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { programs, workshops, testimonials, gallery, pages };
