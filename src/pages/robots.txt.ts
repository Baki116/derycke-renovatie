import type { APIRoute } from 'astro';
import { site, isProductie } from '../config/site';

export const GET: APIRoute = () => {
  const body = isProductie
    ? `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /contact/bedankt/\n\nSitemap: ${site.domein}/sitemap-index.xml\n`
    : `# Previewversie: niet indexeren\nUser-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
