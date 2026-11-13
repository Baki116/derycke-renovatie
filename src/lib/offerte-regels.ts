/**
 * Gedeelde regels voor het offerteformulier en de assistent — gebruikt door de browser én de server,
 * zodat de grenzen overal identiek zijn.
 */
export const REGELS = {
  maxFotos: 8,
  /** grootte van het originele bestand dat een bezoeker mag kiezen */
  maxBytesOrigineel: 10 * 1024 * 1024,
  /** per bestand na verkleinen in de browser */
  maxBytesPerFoto: 3 * 1024 * 1024,
  /** totaal: blijft onder de 4,5 MB-limiet van een serverless functie */
  maxBytesTotaal: 4 * 1024 * 1024,
  /** foto's worden in de browser verkleind tot deze langste zijde */
  maxPixels: 1800,
  minBeschrijving: 15,
  maxBeschrijving: 4000,
  /** minimale invultijd in ms (antispam) */
  minInvultijd: 3000,
  toegelatenTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
} as const;

export const DIENSTKEUZES = [
  'Schilderwerken',
  'Badkamerrenovaties',
  'Keukenrenovaties',
  'Vloerwerken',
  'Algemene renovaties',
  'Andere',
] as const;

export const TIMING = ['Zo snel mogelijk', 'Binnen de 3 maanden', 'Binnen de 6 maanden', 'Later of nog te bepalen'] as const;
export const KLANTTYPE = ['Particulier', 'Bedrijf', 'Vastgoedkantoor of projectontwikkelaar'] as const;

export function isGeldigEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

export function isGeldigTelefoon(v: string) {
  const cijfers = v.replace(/[^\d]/g, '');
  return /^[+\d][\d\s./()-]*$/.test(v.trim()) && cijfers.length >= 8 && cijfers.length <= 15;
}

export function isGeldigePostcode(v: string) {
  return /^[1-9]\d{3}$/.test(v.trim());
}
