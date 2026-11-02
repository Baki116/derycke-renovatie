import type { APIRoute } from 'astro';
import { site } from '../config/site';

export const GET: APIRoute = ({ site: siteUrl }) => {
  const sitemap = new URL('/sitemap-index.xml', siteUrl).href;
  const body = site.indexeerbaar
    ? `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${sitemap}\n`
    : `# Demoversie: niet indexeren tot de site live gaat (zie src/config/site.ts → indexeerbaar)\nUser-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
