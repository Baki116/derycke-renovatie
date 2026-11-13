/**
 * ─────────────────────────────────────────────────────────────
 *  BEDRIJFSGEGEVENS EN INSTELLINGEN — één centrale plek
 * ─────────────────────────────────────────────────────────────
 *  Contactgegevens: src/config/bedrijf.json
 *  Merken:          src/config/merken.ts
 *  Beelden:         src/data/beelden.ts
 */

import bedrijf from './bedrijf.json';

type B = Record<string, string | null | undefined>;
const b = bedrijf as B;
const waarde = (k: string) => (b[k] && String(b[k]).trim() ? String(b[k]).trim() : null);

export const site = {
  naam: 'Derycke Renovatie & Schilderwerken',
  kortenaam: 'Derycke',
  slogan: 'Vakmanschap in elke afwerking.',
  regio: 'heel Vlaanderen',
  domein: 'https://deryckerenovatie.be',

  contact: {
    telefoon: waarde('telefoon'),
    telefoonWeergave: waarde('telefoonWeergave'),
    whatsapp: waarde('whatsapp'),
    email: waarde('email'),
  },

  /** Wettelijk adres: enkel in de wettelijke vermeldingen, niet als open werkplaats. */
  adres: {
    straat: waarde('straat'),
    postcode: waarde('postcode'),
    gemeente: waarde('gemeente'),
  },

  onderneming: {
    ondernemingsnummer: waarde('ondernemingsnummer'),
    rechtsvorm: waarde('rechtsvorm'),
  },

  /**
   * Google-reviews: blijft verborgen tot er echte reviews zijn.
   * Vul dan de link naar het Google-bedrijfsprofiel in en zet `tonen` op true.
   */
  reviews: {
    tonen: false,
    googleLink: null as string | null,
  },

  /** Antwoordtermijn op de bedankpagina (te bevestigen door Derycke). */
  antwoordtermijn: 'binnen 1 werkdag',
} as const;

/** Productie = gekoppeld domein. Previews (vercel.app) worden nooit geïndexeerd. */
export const isProductie = process.env.VERCEL_ENV === 'production' || process.env.INDEXEERBAAR === '1';

export const telLink = site.contact.telefoon ? `tel:${site.contact.telefoon}` : null;

/** WhatsApp-link met een vooraf ingevuld bericht, optioneel per dienst. */
export function whatsappLink(onderwerp?: string) {
  if (!site.contact.whatsapp) return null;
  const tekst = onderwerp
    ? `Hallo Derycke, ik heb een vraag over ${onderwerp}: `
    : 'Hallo Derycke, ik heb een vraag over een renovatieproject: ';
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(tekst)}`;
}

export const navigatie = [
  { href: '/diensten/', label: 'Diensten' },
  { href: '/realisaties/', label: 'Realisaties' },
  { href: '/voor-bedrijven/', label: 'Voor bedrijven' },
  { href: '/over-ons/', label: 'Over ons' },
] as const;
