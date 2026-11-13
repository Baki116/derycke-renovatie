// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Canonieke URL's, sitemap en Open Graph verwijzen altijd naar het definitieve domein.
// Keuze: zonder www (https://deryckerenovatie.be); www wordt met een 301 doorgestuurd (vercel.json).
const SITE_URL = 'https://deryckerenovatie.be';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/bedankt'),
    }),
  ],
  image: {
    responsiveStyles: false,
  },
  build: {
    inlineStylesheets: 'always',
  },
});
