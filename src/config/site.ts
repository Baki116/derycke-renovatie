/**
 * ─────────────────────────────────────────────────────────────
 *  BEDRIJFSGEGEVENS — één centrale plek
 * ─────────────────────────────────────────────────────────────
 *  De contactgegevens staan in src/config/bedrijf.json en zijn ook
 *  aanpasbaar via het CMS op /admin/ (Instellingen → Bedrijfsgegevens). Een veld dat `null` is,
 *  wordt op de site getoond als "nog aan te vullen" (alleen in de
 *  demoversie) en wordt NIET opgenomen in de gestructureerde data.
 *
 *  Niets in dit bestand is verzonnen: ontbrekende gegevens blijven
 *  leeg tot Derycke ze bevestigt.
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

  /** Demoversie: toont labels bij inspiratiebeelden en lege gegevens, en blokkeert indexering. */
  demo: true,

  /** Zet op `true` zodra de site live mag en de inspiratiebeelden vervangen zijn. */
  indexeerbaar: false,

  contact: {
    telefoon: waarde('telefoon'), // bv. '+32 470 00 00 00'
    telefoonWeergave: waarde('telefoonWeergave'), // bv. '0470 00 00 00'
    email: waarde('email'), // bv. 'info@derycke.be'
  },

  adres: {
    straat: waarde('straat'),
    postcode: waarde('postcode'),
    gemeente: waarde('gemeente'),
  },

  onderneming: {
    ondernemingsnummer: waarde('ondernemingsnummer'), // bv. 'BE 0123.456.789'
    rechtsvorm: waarde('rechtsvorm'), // bv. 'BV'
  },

  /** Wie de privacyverklaring onderschrijft (verwerkingsverantwoordelijke). */
  privacyContact: waarde('privacyContact'),
} as const;

export const ontbreekt = 'nog aan te vullen';

export function heeftContact() {
  return Boolean(site.contact.telefoon || site.contact.email);
}

export const navigatie = [
  { href: '/diensten/', label: 'Diensten' },
  { href: '/realisaties/', label: 'Realisaties' },
  { href: '/voor-bedrijven/', label: 'Voor bedrijven' },
  { href: '/over-ons/', label: 'Over ons' },
] as const;
