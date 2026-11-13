/**
 * Conversie "offerteaanvraag" voor GA4 en Google Ads.
 *
 * Staat klaar maar doet niets zolang:
 *  - er geen gtag (Google tag) op de site staat, én
 *  - de bezoeker geen toestemming gaf (Consent Mode: analytics_storage / ad_storage = granted).
 * Er is momenteel geen analytics geïnstalleerd en dus ook geen cookiebanner nodig.
 * Om te activeren: Google tag + cookiebanner toevoegen en PUBLIC_GADS_CONVERSIE invullen
 * (formaat "AW-XXXXXXXXX/XXXXXXXXXXXX").
 */
type Gtag = (...args: unknown[]) => void;

export function meldConversie(detail: { bron: 'formulier' | 'assistent'; fotos: number }) {
  const w = window as unknown as { gtag?: Gtag; deryckeToestemming?: boolean };
  if (typeof w.gtag !== 'function' || w.deryckeToestemming !== true) return false;
  w.gtag('event', 'generate_lead', { method: detail.bron, fotos: detail.fotos });
  const ads = import.meta.env.PUBLIC_GADS_CONVERSIE as string | undefined;
  if (ads) w.gtag('event', 'conversion', { send_to: ads });
  return true;
}
