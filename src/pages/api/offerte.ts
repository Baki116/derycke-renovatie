import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { REGELS, TIMING, KLANTTYPE, DIENSTKEUZES, isGeldigEmail, isGeldigTelefoon, isGeldigePostcode } from '../../lib/offerte-regels';

export const prerender = false;

/**
 * Offerteaanvraag — serverzijde
 *
 * Vereiste omgevingsvariabelen (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY   API-sleutel van Resend
 *   OFFERTE_TO       adres(sen) waar de aanvragen binnenkomen, komma-gescheiden
 *                    (tijdelijk info@flandershostassist.be, later contact@deryckerenovatie.be)
 *   OFFERTE_FROM     geverifieerd afzenderadres bij Resend (bv. "Website Derycke <offerte@viewlaya.site>")
 *
 * Zolang één ervan ontbreekt, wordt NIETS verzonden en krijgt de bezoeker een duidelijke melding.
 */

type Resultaat = { ok: true } | { ok: false; fout: string; velden?: Record<string, string> };

// Eenvoudige snelheidsbeperking per IP (per serverinstantie)
const pogingen = new Map<string, number[]>();
function teVeelPogingen(ip: string) {
  const nu = Date.now();
  const venster = 10 * 60 * 1000;
  const lijst = (pogingen.get(ip) ?? []).filter((t) => nu - t < venster);
  lijst.push(nu);
  pogingen.set(ip, lijst);
  return lijst.length > 5;
}

function antwoord(request: Request, status: number, body: Resultaat) {
  const wilJson = (request.headers.get('accept') ?? '').includes('application/json');
  if (wilJson) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }
  // Zonder JavaScript: terug naar de pagina
  const doel = body.ok ? '/contact/bedankt/' : `/contact/?fout=${encodeURIComponent(body.fout)}#offerte`;
  return new Response(null, { status: 303, headers: { Location: doel } });
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** Controleert het echte bestandsformaat aan de hand van de eerste bytes. */
function beeldType(buf: Uint8Array): string | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  const ascii = (a: number, b: number) => String.fromCharCode(...buf.slice(a, b));
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  if (ascii(4, 8) === 'ftyp' && /^(heic|heix|hevc|mif1|msf1|heif)$/.test(ascii(8, 12))) return 'image/heic';
  return null;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // 1. Configuratie
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const OFFERTE_TO = process.env.OFFERTE_TO || process.env.OFFERTE_ONTVANGER;
  const OFFERTE_FROM = process.env.OFFERTE_FROM || process.env.OFFERTE_AFZENDER;
  if (!RESEND_API_KEY || !OFFERTE_TO || !OFFERTE_FROM) {
    console.error('[offerte] Formulier niet geconfigureerd: ontbrekende omgevingsvariabelen.');
    return antwoord(request, 503, {
      ok: false,
      fout: 'Het formulier is nog niet gekoppeld aan een e-mailadres. Neem tijdelijk rechtstreeks contact met ons op.',
    });
  }

  // 2. Snelheidsbeperking
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress || 'onbekend';
  if (teVeelPogingen(ip)) {
    return antwoord(request, 429, { ok: false, fout: 'U heeft te veel aanvragen na elkaar verstuurd. Probeer het binnen enkele minuten opnieuw.' });
  }

  // 3. Grootte vooraf controleren
  const lengte = Number(request.headers.get('content-length') ?? 0);
  if (lengte > REGELS.maxBytesTotaal + 200_000) {
    return antwoord(request, 413, { ok: false, fout: "De foto's zijn samen te groot. Verwijder er één of meer en probeer opnieuw." });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return antwoord(request, 400, { ok: false, fout: 'De aanvraag kon niet gelezen worden. Probeer het opnieuw.' });
  }

  const tekst = (k: string, max = 500) => String(form.get(k) ?? '').trim().slice(0, max);

  // 4. Antispam: honeypot en minimale invultijd. Bots krijgen een neutraal "ok".
  const gestart = Number(tekst('gestart', 20));
  if (tekst('website')) return antwoord(request, 200, { ok: true });
  if (gestart && Date.now() - gestart < REGELS.minInvultijd) return antwoord(request, 200, { ok: true });

  // 5. Velden valideren
  const v = {
    naam: tekst('naam', 120),
    email: tekst('email', 160),
    telefoon: tekst('telefoon', 30),
    gemeente: tekst('gemeente', 80),
    postcode: tekst('postcode', 4),
    klanttype: tekst('klanttype', 60),
    timing: tekst('timing', 60),
    beschrijving: tekst('beschrijving', REGELS.maxBeschrijving),
    akkoord: tekst('akkoord', 5),
    bron: tekst('bron', 20) === 'assistent' ? 'Derycke-assistent (chat)' : 'Offerteformulier',
  };
  const diensten = [...new Set(form.getAll('diensten').map((d) => String(d).trim()))].filter((d) =>
    (DIENSTKEUZES as readonly string[]).includes(d),
  );

  const velden: Record<string, string> = {};
  if (v.naam.length < 2) velden.naam = 'Vul uw naam in.';
  if (!isGeldigEmail(v.email)) velden.email = 'Vul een geldig e-mailadres in.';
  if (!isGeldigTelefoon(v.telefoon)) velden.telefoon = 'Vul een geldig telefoonnummer in.';
  if (v.gemeente.length < 2) velden.gemeente = 'Vul de gemeente van het project in.';
  if (v.postcode && !isGeldigePostcode(v.postcode)) velden.postcode = 'Vul een geldige postcode in.';
  if (!diensten.length) velden.diensten = 'Kies minstens één soort werken.';
  if (v.akkoord !== 'ja') velden.akkoord = 'Uw akkoord met de privacyverklaring is nodig.';
  if (v.timing && !(TIMING as readonly string[]).includes(v.timing)) velden.timing = 'Ongeldige timing.';
  if (v.klanttype && !(KLANTTYPE as readonly string[]).includes(v.klanttype)) velden.klanttype = 'Ongeldige keuze.';
  if (v.beschrijving.length < REGELS.minBeschrijving) velden.beschrijving = 'Beschrijf uw project iets uitgebreider.';

  if (Object.keys(velden).length) {
    return antwoord(request, 422, { ok: false, fout: Object.values(velden).join(' '), velden });
  }

  // 6. Foto's controleren
  const bestanden = form.getAll('fotos').filter((f): f is File => f instanceof File && f.size > 0);
  if (bestanden.length > REGELS.maxFotos) {
    return antwoord(request, 422, { ok: false, fout: `U kunt maximaal ${REGELS.maxFotos} foto's meesturen.` });
  }
  let totaal = 0;
  const bijlagen: { filename: string; content: Buffer; contentType: string }[] = [];
  for (const [i, f] of bestanden.entries()) {
    if (f.size > REGELS.maxBytesPerFoto) {
      return antwoord(request, 422, { ok: false, fout: `De foto "${f.name}" is te groot (max. 3 MB per foto na verkleinen).` });
    }
    totaal += f.size;
    if (totaal > REGELS.maxBytesTotaal) {
      return antwoord(request, 422, { ok: false, fout: "De foto's zijn samen te groot (max. 4 MB). Verwijder er één of meer." });
    }
    const buf = Buffer.from(await f.arrayBuffer());
    const type = beeldType(buf);
    if (!type) {
      return antwoord(request, 422, { ok: false, fout: `"${f.name}" is geen geldige foto. Gebruik JPG, PNG, WebP of HEIC.` });
    }
    const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/heic': 'heic' }[type];
    bijlagen.push({ filename: `foto-${i + 1}.${ext}`, content: buf, contentType: type });
  }

  // 7. Verzenden
  const rijen: [string, string][] = [
    ['Naam', v.naam],
    ['E-mail', v.email],
    ['Telefoon', v.telefoon || '—'],
    ['Gemeente', [v.postcode, v.gemeente].filter(Boolean).join(' ')],
    ['Klant', v.klanttype || '—'],
    ['Werken', diensten.join(', ')],
    ['Gewenste timing', v.timing || '—'],
    ["Foto's", bijlagen.length ? `${bijlagen.length} als bijlage` : 'geen'],
    ['Via', v.bron],
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;color:#24272b;max-width:640px">
      <h2 style="font-weight:600">Nieuwe offerteaanvraag via de website</h2>
      <table cellpadding="6" style="border-collapse:collapse;width:100%">
        ${rijen.map(([k, w]) => `<tr><td style="color:#625e57;width:170px;border-top:1px solid #ddd">${esc(k)}</td><td style="border-top:1px solid #ddd">${esc(w)}</td></tr>`).join('')}
      </table>
      <h3 style="margin-top:24px">Beschrijving</h3>
      <p style="white-space:pre-wrap;line-height:1.5">${esc(v.beschrijving)}</p>
    </div>`;
  const platteTekst = `${rijen.map(([k, w]) => `${k}: ${w}`).join('\n')}\n\nBeschrijving:\n${v.beschrijving}`;

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: OFFERTE_FROM,
      to: OFFERTE_TO.split(',').map((s) => s.trim()),
      replyTo: v.email,
      subject: `Offerteaanvraag: ${diensten.join(', ')} in ${v.gemeente}`,
      html,
      text: platteTekst,
      attachments: bijlagen.map((b) => ({ filename: b.filename, content: b.content, contentType: b.contentType })),
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error('[offerte] Verzenden mislukt:', e);
    return antwoord(request, 502, {
      ok: false,
      fout: 'Uw aanvraag kon door een technische fout niet verzonden worden. Probeer het later opnieuw of neem rechtstreeks contact met ons op.',
    });
  }

  return antwoord(request, 200, { ok: true });
};

export const ALL: APIRoute = () => new Response('Methode niet toegestaan', { status: 405, headers: { Allow: 'POST' } });
