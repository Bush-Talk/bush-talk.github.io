import { z } from 'zod';
import siteData from '../data/site.json';
import homeData from '../data/home.json';
import { blankable, text, softEmail, softUrl } from './schema';

/**
 * Singletons — one-off content that isn't a list, so it doesn't warrant a
 * content collection.
 *
 * Everything the editor can clear is modelled as "may be empty" rather than
 * required, and the email/URL fields degrade to '' rather than throwing. See
 * lib/schema.ts: a cleared field must never be able to fail the build.
 */

const linkSchema = z.object({ label: text, href: text });

const siteSchema = z.object({
  name: z.string(),
  tagline: text,
  description: text,
  url: softUrl,
  contactName: text,
  email: softEmail,
  phone: text,
  phoneHref: text,
  hours: text,
  locations: z.array(z.string()).catch([]).default([]),
  acknowledgement: text,
  footerTagline: text,
  photoCredit: text,
  social: z
    .array(z.object({ label: text, url: softUrl }))
    .catch([])
    .default([])
    // A social row with no label or no URL is half-filled, not a link.
    .transform((rows) => rows.filter((r) => r.label && r.url)),
});

const pillarSchema = z.object({
  title: text,
  body: text,
  image: text,
  imageAlt: text,
});

const homeSchema = z.object({
  heroEyebrow: text,
  heroHeading: text,
  heroSubheading: text,
  heroText: text,
  heroImage: text,
  heroImageAlt: text,
  primaryCta: linkSchema,
  secondaryCta: blankable(linkSchema),

  pillarsHeading: text,
  pillarsIntro: text,
  pillars: z.array(pillarSchema).catch([]).default([]),

  programsHeading: text,
  programsIntro: text,

  featureHeading: text,
  featureText: text,
  featureImage: text,
  featureImageAlt: text,
  featureCta: linkSchema,

  closingHeading: text,
  closingText: text,
  closingCta: linkSchema,
});

export const site = siteSchema.parse(siteData);
export const home = homeSchema.parse(homeData);

export type Site = z.infer<typeof siteSchema>;
export type Home = z.infer<typeof homeSchema>;
