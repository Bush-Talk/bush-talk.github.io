import { z } from 'zod';
import siteData from '../data/site.json';
import homeData from '../data/home.json';

/**
 * Singletons — one-off content that isn't a list, so it doesn't warrant a
 * content collection. Parsed through Zod so a bad CMS edit fails the build
 * loudly instead of rendering an empty page.
 *
 * Optional text fields are modelled as "string that may be empty" rather than
 * `.optional()`, because the CMS writes "" for a cleared field, not null.
 */

const optionalText = z.string().default('');
const linkSchema = z.object({ label: z.string(), href: z.string() });

const siteSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  url: z.url(),
  contactName: z.string(),
  email: z.email(),
  phone: z.string(),
  phoneHref: z.string(),
  hours: z.string(),
  locations: z.array(z.string()).default([]),
  acknowledgement: z.string(),
  footerTagline: z.string(),
  photoCredit: optionalText,
  social: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
});

const homeSchema = z.object({
  heroEyebrow: optionalText,
  heroHeading: z.string(),
  heroSubheading: optionalText,
  heroText: z.string(),
  heroImage: optionalText,
  heroImageAlt: optionalText,
  primaryCta: linkSchema,
  secondaryCta: linkSchema.optional(),

  pillarsHeading: z.string(),
  pillarsIntro: optionalText,
  pillars: z.array(
    z.object({
      title: z.string(),
      body: z.string(),
      image: optionalText,
      imageAlt: optionalText,
    }),
  ),

  programsHeading: z.string(),
  programsIntro: optionalText,

  featureHeading: z.string(),
  featureText: z.string(),
  featureImage: optionalText,
  featureImageAlt: optionalText,
  featureCta: linkSchema,

  closingHeading: z.string(),
  closingText: z.string(),
  closingCta: linkSchema,
});

export const site = siteSchema.parse(siteData);
export const home = homeSchema.parse(homeData);

export type Site = z.infer<typeof siteSchema>;
export type Home = z.infer<typeof homeSchema>;
