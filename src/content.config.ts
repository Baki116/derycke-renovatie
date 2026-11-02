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

export const collections = { realisaties };
