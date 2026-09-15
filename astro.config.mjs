// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Used for canonical URLs, Open Graph tags and the sitemap.
  site: 'https://bushtalkinfo.com',

  // Fully static: no server, no adapter. /admin is a plain file in public/.
  output: 'static',

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],

  build: {
    // Cleaner URLs without trailing-slash surprises on Cloudflare/Netlify.
    format: 'directory',
  },
});
