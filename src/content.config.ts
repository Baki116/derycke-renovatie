import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Realisaties — beheerd via het CMS op /admin/ of als Markdown-bestand.
 * Elke realisatie staat in een eigen map: src/content/realisaties/<naam>/index.md
 * met de foto's in dezelfde map.
 */
const realisaties = defineCollection({
  loader: glob({ pattern: '[!_]*/index.md', base: './src/content/realisaties' }),
  schema: ({ image }) =>
    z.object({
      titel: z.string(),
      typeWerken: z.enum([
        'Schilderwerken',
        'Badkamerrenovaties',
        'Keukenrenovaties',
        'Vloerwerken',
        'Algemene renovaties',
      ]),
      /** Alleen invullen als de klant toestemming gaf om de gemeente te vermelden. */
      gemeente: z.string().optional().nullable(),
      samenvatting: z.string().max(220),
      hoofdfoto: image(),
      hoofdfotoAlt: z.string(),
      galerij: z
        .array(z.object({ foto: image(), alt: z.string() }))
        .default([]),
      status: z.enum(['concept', 'gepubliceerd']).default('concept'),
      /** true = inspiratiebeeld (geen echte realisatie van Derycke). */
      inspiratie: z.boolean().default(false),
      datum: z.coerce.date(),
    }),
});

/**
 * Blog — artikels voor bezoekers en voor SEO.
 * Elk artikel: src/content/blog/<slug>.md
 */
const blog = defineCollection({
  loader: glob({ pattern: '[!_]*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      titel: z.string(),
      /** Korte omschrijving (meta description en overzicht), max. 160 tekens. */
      samenvatting: z.string().max(160),
      datum: z.coerce.date(),
      beeld: image(),
      beeldAlt: z.string(),
      /** Slug van de bijhorende dienst, bv. 'schilderwerken'. */
      dienst: z.string().optional(),
      status: z.enum(['concept', 'gepubliceerd']).default('gepubliceerd'),
    }),
});

export const collections = { realisaties, blog };
