import { z } from 'zod';

/**
 * Schema helpers for content the CMS writes.
 *
 * The recurring problem: Sveltia writes '' for a cleared field — never null,
 * never absent. Bare .optional() rejects '', z.coerce.date() turns it into an
 * Invalid Date, and z.email()/z.url() reject it outright. Any of those is a
 * hard build failure, which for a non-technical editor means clearing a box
 * takes the site down with an error they can't read.
 *
 * So: empty means absent, and genuinely malformed values degrade to a fallback
 * instead of throwing. A missing phone number renders as no phone number; it
 * does not stop the site building.
 */

/** Optional field: '' and null both mean "not set". */
export const blankable = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' || v === null ? undefined : v), schema.optional());

/** Number field that survives being cleared in the editor. */
export const numberWithDefault = (fallback: number) =>
  z.preprocess((v) => (v === '' || v === null || v === undefined ? fallback : v), z.number());

/** Boolean field that survives being cleared in the editor. */
export const boolWithDefault = (fallback: boolean) =>
  z.preprocess((v) => (v === '' || v === null || v === undefined ? fallback : v), z.boolean());

/** Text that may legitimately be empty. */
export const text = z.string().catch('').default('');

/**
 * Validated-but-forgiving string. A well-formed value passes, anything else
 * (including '') falls back to '' so the template can omit it.
 */
export const softEmail = z.string().email().catch('').default('');
export const softUrl = z.string().url().catch('').default('');
