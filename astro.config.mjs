// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  // Used for canonical URLs, Open Graph tags and the sitemap.
  // Change to 'https://bushtalkinfo.com' once the custom domain is pointed here.
  //
  // No `base` is needed: the repo is named <org>.github.io, so the site is
  // served from the root. A normal project repo would sit at /<repo-name> and
  // need `base`, which breaks every absolute path in the site.
  site: 'https://bush-talk.github.io',

  // Fully static: no server, no adapter. /admin is a plain file in public/.
  output: 'static',

  integrations: [
    // Shared components are .tsx so the CMS preview can render the same code.
    // Nothing is hydrated, so these still compile to static HTML with no JS.
    react(),
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],

  build: {
    // Cleaner URLs without trailing-slash surprises on Cloudflare/Netlify.
    format: 'directory',
  },
});
