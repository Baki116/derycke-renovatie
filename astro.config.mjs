// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Zet SITE_URL in Vercel (Settings → Environment Variables) zodra het domein gekend is,
// bv. https://www.derycke.be. Zonder domein valt de site terug op de Vercel-URL.
const SITE_URL =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:4321');

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/bedankt'),
    }),
  ],
  image: {
    responsiveStyles: false,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
