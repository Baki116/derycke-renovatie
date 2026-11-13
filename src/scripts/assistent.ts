import { onderwerpen, acties } from '../data/assistent';
import { REGELS, DIENSTKEUZES, TIMING, KLANTTYPE, isGeldigEmail, isGeldigTelefoon } from '../lib/offerte-regels';
import { voegFotosToe, voorbeeldUrl } from '../lib/fotos';
import { meldConversie } from './conversie';

type Stap =
  | { id: string; soort: 'keuze'; vraag: string; opties: readonly string[]; meer?: boolean }
  | { id: string; soort: 'tekst'; vraag: string; label: string; type?: string; check: (v: string) => string }
  | { id: string; soort: 'fotos'; vraag: string }
  | { id: string; soort: 'bevestig'; vraag: string };

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9² ]/g, ' ');

export function initAssistent() {
  const paneel = document.querySelector<HTMLElement>('[data-assistent]');
  const achter = document.querySelector<HTMLElement>('[data-assistent-achter]');
  if (!paneel || !achter) return;
  const log = paneel.querySelector<HTMLElement>('[data-log]')!;
  const invoer = paneel.querySelector<HTMLFormElement>('[data-invoer]')!;
  const tekst = paneel.querySelector<HTMLInputElement>('[data-tekst]')!;
  const tekstLabel = paneel.querySelector<HTMLElement>('[data-invoer-label]')!;
  const fotoInput = paneel.querySelector<HTMLInputElement>('[data-as-fotos]')!;
  const wa = paneel.dataset.wa;
  const tel = paneel.dataset.tel;
  const telWeergave = paneel.dataset.telWeergave;
  const termijn = paneel.dataset.termijn || 'zo snel mogelijk';
  const startDienst = document.body.dataset.dienst;
  const html = document.documentElement;

  let gestart = 0;
  let laatsteOpener: HTMLElement | null = null;
  let begonnen = false;

  // ── Openen en sluiten ───────────────────────────────
  function open(opener?: HTMLElement | null) {
    laatsteOpener = opener ?? (document.activeElement as HTMLElement);
    paneel!.hidden = false;
    achter!.hidden = false;
    html.setAttribute('data-assistent-open', '');
    html.setAttribute('data-scroll-stop', '');
    if (!begonnen) {
      begonnen = true;
      welkom();
    }
    setTimeout(() => tekst.focus({ preventScroll: true }), 60);
  }
  function sluit() {
    paneel!.hidden = true;
    achter!.hidden = true;
    html.removeAttribute('data-assistent-open');
    html.removeAttribute('data-scroll-stop');
    laatsteOpener?.focus({ preventScroll: true });
  }
  document.querySelectorAll<HTMLElement>('[data-assistent-open]').forEach((k) =>
    k.addEventListener('click', () => open(k)),
  );
  paneel.querySelector('[data-assistent-sluit]')?.addEventListener('click', sluit);
  achter.addEventListener('click', sluit);
  paneel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      sluit();
    }
    if (e.key === 'Tab') {
      // focus binnen het venster houden
      const f = [...paneel!.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([type=file]):not([disabled]), [tabindex="0"]')].filter(
        (el) => el.offsetParent !== null,
      );
      if (!f.length) return;
      const eerste = f[0];
      const laatste = f[f.length - 1];
      if (e.shiftKey && document.activeElement === eerste) {
        e.preventDefault();
        laatste.focus();
      } else if (!e.shiftKey && document.activeElement === laatste) {
        e.preventDefault();
        eerste.focus();
      }
    }
  });

  // ── Berichten ───────────────────────────────────────
  const rustig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function naarOnder() {
    log.scrollTop = log.scrollHeight;
  }
  function bericht(inhoud: string | Node, van: 'bot' | 'ik' = 'bot') {
    const div = document.createElement('div');
    div.className = `bericht bericht--${van}`;
    if (typeof inhoud === 'string') {
      if (van === 'bot') div.innerHTML = inhoud;
      else div.textContent = inhoud;
    } else div.append(inhoud);
    log.append(div);
    naarOnder();
    return div;
  }
  async function bot(inhoud: string | Node) {
    if (!rustig) {
      const t = document.createElement('div');
      t.className = 'bericht bericht--bot typen';
      t.setAttribute('aria-hidden', 'true');
      t.innerHTML = '<i></i><i></i><i></i>';
      log.append(t);
      naarOnder();
      await new Promise((r) => setTimeout(r, 420));
      t.remove();
    }
    return bericht(inhoud, 'bot');
  }
  function knoppen(lijst: { tekst: string; actie: () => void; hoofd?: boolean; href?: string }[]) {
    const rij = document.createElement('div');
    rij.className = 'keuzerij';
    lijst.forEach((k) => {
      if (k.href) {
        const a = document.createElement('a');
        a.href = k.href;
        a.textContent = k.tekst;
        if (k.href.startsWith('http')) {
          a.target = '_blank';
          a.rel = 'noopener';
        }
        rij.append(a);
        return;
      }
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = k.tekst;
      if (k.hoofd) b.className = 'hoofd';
      b.addEventListener('click', () => {
        rij.querySelectorAll('button').forEach((x) => ((x as HTMLButtonElement).disabled = true));
        k.actie();
      });
      rij.append(b);
    });
    log.append(rij);
    naarOnder();
    return rij;
  }

  // ── Onderwerpen ─────────────────────────────────────
  function knopVoor(id: string) {
    if (id === 'offerte') return { tekst: acties.offerte, actie: () => startOfferte(), hoofd: true };
    if (id === 'contact') return { tekst: acties.contact, actie: () => direct() };
    if (id === 'bedrijven-pagina') return { tekst: acties['bedrijven-pagina'], actie: () => {}, href: '/voor-bedrijven/' };
    const o = onderwerpen.find((x) => x.id === id)!;
    return { tekst: o.knop, actie: () => beantwoord(o.id, true) };
  }

  async function welkom() {
    await bot(
      `<p>Hallo! Ik ben de assistent van Derycke Renovatie &amp; Schilderwerken.</p><p>Ik beantwoord uw vragen of help u meteen een <strong>gratis offerte</strong> aan te vragen.</p>`,
    );
    menu();
  }
  function menu() {
    knoppen([knopVoor('offerte'), ...onderwerpen.slice(0, 7).map((o) => knopVoor(o.id)), knopVoor('contact')]);
  }
  async function beantwoord(id: string, alsKnop = false) {
    const o = onderwerpen.find((x) => x.id === id)!;
    if (alsKnop) bericht(o.knop, 'ik');
    await bot(o.antwoord);
    knoppen([...o.verder.map(knopVoor), { tekst: 'Andere vraag', actie: () => menu() }]);
  }
  async function direct() {
    bericht(acties.contact, 'ik');
    await bot(
      `<p>Natuurlijk. U bereikt Derycke ook rechtstreeks${telWeergave ? ` op <strong>${telWeergave}</strong>` : ''}.</p>`,
    );
    const lijst: { tekst: string; actie: () => void; href?: string; hoofd?: boolean }[] = [];
    if (wa) lijst.push({ tekst: 'WhatsApp', href: wa, actie: () => {} });
    if (tel) lijst.push({ tekst: 'Bellen', href: tel, actie: () => {} });
    lijst.push({ tekst: 'Toch via de assistent', actie: () => menu() });
    knoppen(lijst);
  }

  // Vrije vraag → beste overeenkomst op trefwoorden
  function zoek(v: string) {
    const n = ` ${norm(v)} `;
    let beste: { id: string; score: number } | null = null;
    for (const o of onderwerpen) {
      const score = o.woorden.reduce((s, w) => s + (n.includes(norm(w)) ? w.length : 0), 0);
      if (score && (!beste || score > beste.score)) beste = { id: o.id, score };
    }
    return beste?.id ?? null;
  }

  // ── Offerte aanvragen ───────────────────────────────
  const stappen: Stap[] = [
    { id: 'diensten', soort: 'keuze', meer: true, vraag: 'Over welke werken gaat het? U kunt meerdere keuzes aanduiden.', opties: DIENSTKEUZES },
    { id: 'klanttype', soort: 'keuze', vraag: 'Voor wie worden de werken uitgevoerd?', opties: KLANTTYPE },
    {
      id: 'plaats',
      soort: 'tekst',
      vraag: 'In welke gemeente ligt het project? Vermeld ook de postcode, bijvoorbeeld <strong>9000 Gent</strong>.',
      label: 'Postcode en gemeente',
      check: (v) => {
        const pc = v.match(/\b[1-9]\d{3}\b/);
        const gem = v.replace(/\b[1-9]\d{3}\b/, '').replace(/[,;]/g, ' ').trim();
        if (!pc) return 'Vermeld ook de postcode (4 cijfers), bijvoorbeeld 9000 Gent.';
        if (gem.length < 2) return 'Vermeld ook de naam van de gemeente, bijvoorbeeld 9000 Gent.';
        return '';
      },
    },
    {
      id: 'beschrijving',
      soort: 'tekst',
      vraag: 'Beschrijf kort wat u wilt laten doen. Vermeld gerust de oppervlakte (m²) en de huidige toestand.',
      label: 'Beschrijving van het project',
      check: (v) => (v.trim().length < REGELS.minBeschrijving ? 'Vertel iets meer, minstens enkele woorden over de werken.' : ''),
    },
    { id: 'timing', soort: 'keuze', vraag: 'Wanneer wilt u de werken laten uitvoeren?', opties: TIMING },
    {
      id: 'naam',
      soort: 'tekst',
      vraag: 'Bijna klaar. Wat is uw naam?',
      label: 'Uw naam',
      check: (v) => (v.trim().length < 2 ? 'Vul uw naam in.' : ''),
    },
    {
      id: 'telefoon',
      soort: 'tekst',
      type: 'tel',
      vraag: 'Op welk telefoonnummer kunnen we u bereiken?',
      label: 'Uw telefoonnummer',
      check: (v) => (!isGeldigTelefoon(v) ? 'Dit lijkt geen geldig telefoonnummer. Bijvoorbeeld 0470 12 34 56.' : ''),
    },
    {
      id: 'email',
      soort: 'tekst',
      type: 'email',
      vraag: 'En uw e-mailadres?',
      label: 'Uw e-mailadres',
      check: (v) => (!isGeldigEmail(v) ? 'Dit lijkt geen geldig e-mailadres. Bijvoorbeeld naam@voorbeeld.be.' : ''),
    },
    { id: 'fotos', soort: 'fotos', vraag: "Wilt u foto's toevoegen? Dat helpt om uw aanvraag snel in te schatten." },
    { id: 'bevestig', soort: 'bevestig', vraag: 'Dit is uw aanvraag:' },
  ];
  let antwoorden: Record<string, string | string[]> = {};
  let fotos: File[] = [];
  let stapIndex = -1;

  function invoerModus(stap?: Stap) {
    if (stap?.soort === 'tekst') {
      tekstLabel.textContent = stap.label;
      tekst.type = stap.type ?? 'text';
      tekst.placeholder = stap.label + '…';
      tekst.autocomplete = { naam: 'name', telefoon: 'tel', email: 'email' }[stap.id] ?? 'off';
      tekst.inputMode = stap.type === 'tel' ? 'tel' : stap.type === 'email' ? 'email' : 'text';
    } else {
      tekstLabel.textContent = 'Uw bericht';
      tekst.type = 'text';
      tekst.placeholder = 'Typ uw vraag…';
      tekst.autocomplete = 'off';
      tekst.inputMode = 'text';
    }
  }

  async function startOfferte() {
    bericht(acties.offerte, 'ik');
    antwoorden = {};
    fotos = [];
    gestart = Date.now();
    stapIndex = -1;
    await bot('<p>Graag! Ik stel u enkele korte vragen. Dat duurt ongeveer een minuut.</p>');
    volgende();
  }

  async function volgende() {
    stapIndex++;
    const stap = stappen[stapIndex];
    invoerModus(stap);
    if (!stap) return;
    if (stap.soort === 'keuze') {
      await bot(`<p>${stap.vraag}</p>`);
      if (stap.meer) {
        const gekozen = new Set<string>(startDienst && stap.id === 'diensten' && stap.opties.includes(startDienst) ? [startDienst] : []);
        const rij = knoppen(
          stap.opties.map((o) => ({
            tekst: o,
            actie: () => {},
          })),
        );
        rij.querySelectorAll('button').forEach((b) => {
          const knop = b as HTMLButtonElement;
          knop.setAttribute('aria-pressed', String(gekozen.has(knop.textContent!)));
          // keuzes blijven aanklikbaar (meervoudige keuze)
          const kloon = knop.cloneNode(true) as HTMLButtonElement;
          knop.replaceWith(kloon);
          kloon.addEventListener('click', () => {
            const t = kloon.textContent!;
            if (gekozen.has(t)) gekozen.delete(t);
            else gekozen.add(t);
            kloon.setAttribute('aria-pressed', String(gekozen.has(t)));
          });
        });
        knoppen([
          {
            tekst: 'Verder',
            hoofd: true,
            actie: async () => {
              if (!gekozen.size) {
                await bot('<p class="fout">Kies minstens één soort werken.</p>');
                stapIndex--;
                rij.remove();
                volgende();
                return;
              }
              rij.querySelectorAll('button').forEach((x) => ((x as HTMLButtonElement).disabled = true));
              antwoorden[stap.id] = [...gekozen];
              bericht([...gekozen].join(', '), 'ik');
              volgende();
            },
          },
        ]);
      } else {
        knoppen(
          stap.opties.map((o) => ({
            tekst: o,
            actie: () => {
              antwoorden[stap.id] = o;
              bericht(o, 'ik');
              volgende();
            },
          })),
        );
      }
    } else if (stap.soort === 'tekst') {
      await bot(`<p>${stap.vraag}</p>`);
      tekst.focus({ preventScroll: true });
    } else if (stap.soort === 'fotos') {
      await bot(`<p>${stap.vraag}</p>`);
      fotoKnoppen();
    } else if (stap.soort === 'bevestig') {
      await samenvatting();
    }
  }

  function fotoKnoppen() {
    knoppen([
      { tekst: fotos.length ? "Nog foto's toevoegen" : "Foto's kiezen", actie: () => fotoInput.click() },
      { tekst: fotos.length ? 'Verder' : 'Overslaan', hoofd: fotos.length > 0, actie: () => volgende() },
    ]);
  }
  fotoInput.addEventListener('change', async () => {
    const nieuw = [...(fotoInput.files ?? [])];
    fotoInput.value = '';
    if (!nieuw.length) {
      fotoKnoppen();
      return;
    }
    const r = await voegFotosToe(fotos, nieuw);
    fotos = r.fotos;
    const div = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = `${fotos.length} foto${fotos.length === 1 ? '' : "'s"} toegevoegd`;
    const rij = document.createElement('div');
    rij.className = 'fotorij';
    fotos.forEach((f) => {
      const u = voorbeeldUrl(f);
      if (u) {
        const img = document.createElement('img');
        img.src = u;
        img.alt = '';
        rij.append(img);
      } else {
        const s = document.createElement('span');
        s.textContent = 'HEIC';
        rij.append(s);
      }
    });
    div.append(p, rij);
    bericht(div, 'ik');
    if (r.fout) await bot(`<p class="fout"></p>`).then((d) => (d.querySelector('.fout')!.textContent = r.fout));
    fotoKnoppen();
  });
  // Foto-keuze geannuleerd: knoppen opnieuw tonen
  fotoInput.addEventListener('cancel', () => fotoKnoppen());

  async function samenvatting() {
    const dl = document.createElement('dl');
    dl.className = 'samenvatting';
    const rijen: [string, string][] = [
      ['Werken', (antwoorden.diensten as string[]).join(', ')],
      ['Klant', antwoorden.klanttype as string],
      ['Plaats', antwoorden.plaats as string],
      ['Project', antwoorden.beschrijving as string],
      ['Timing', antwoorden.timing as string],
      ['Naam', antwoorden.naam as string],
      ['Telefoon', antwoorden.telefoon as string],
      ['E-mail', antwoorden.email as string],
      ["Foto's", fotos.length ? String(fotos.length) : 'geen'],
    ];
    rijen.forEach(([k, v]) => {
      const dt = document.createElement('dt');
      dt.textContent = k;
      const dd = document.createElement('dd');
      dd.textContent = v;
      dl.append(dt, dd);
    });
    const wrap = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = 'Dit is uw aanvraag:';
    const label = document.createElement('label');
    label.className = 'akkoord';
    const vak = document.createElement('input');
    vak.type = 'checkbox';
    const uitleg = document.createElement('span');
    uitleg.innerHTML =
      'Ik ga akkoord dat Derycke mijn gegevens en foto\'s gebruikt om mijn aanvraag te beantwoorden (<a href="/privacyverklaring/" target="_blank">privacyverklaring</a>).';
    label.append(vak, uitleg);
    wrap.append(p, dl, label);
    await bot(wrap);
    knoppen([
      {
        tekst: 'Aanvraag versturen',
        hoofd: true,
        actie: () => verstuur(vak),
      },
      { tekst: 'Opnieuw beginnen', actie: () => startOfferte() },
    ]);
  }

  async function verstuur(vak: HTMLInputElement) {
    if (!vak.checked) {
      const d = await bot('<p class="fout">Vink eerst het akkoord aan, dan kan ik uw aanvraag versturen.</p>');
      vak.focus();
      void d;
      knoppen([{ tekst: 'Aanvraag versturen', hoofd: true, actie: () => verstuur(vak) }]);
      return;
    }
    vak.disabled = true;
    const plaats = String(antwoorden.plaats);
    const postcode = plaats.match(/\b[1-9]\d{3}\b/)?.[0] ?? '';
    const gemeente = plaats.replace(postcode, '').replace(/[,;]/g, ' ').replace(/\s+/g, ' ').trim();
    const data = new FormData();
    (antwoorden.diensten as string[]).forEach((d) => data.append('diensten', d));
    data.append('klanttype', String(antwoorden.klanttype));
    data.append('gemeente', gemeente);
    data.append('postcode', postcode);
    data.append('beschrijving', String(antwoorden.beschrijving));
    data.append('timing', String(antwoorden.timing));
    data.append('naam', String(antwoorden.naam));
    data.append('telefoon', String(antwoorden.telefoon));
    data.append('email', String(antwoorden.email));
    data.append('akkoord', 'ja');
    data.append('bron', 'assistent');
    data.append('website', '');
    data.append('gestart', String(gestart));
    fotos.forEach((f) => data.append('fotos', f, f.name));

    const bezig = await bot('<p>Even geduld, ik verstuur uw aanvraag…</p>');
    try {
      const res = await fetch('/api/offerte/', { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.fout || 'Er ging iets mis bij het verzenden.');
      bezig.remove();
      await bot(
        `<p><strong>Bedankt, uw aanvraag is verzonden.</strong></p><p>We nemen ${termijn} contact met u op.</p>`,
      );
      meldConversie({ bron: 'assistent', fotos: fotos.length });
      stapIndex = stappen.length;
      invoerModus();
      knoppen([{ tekst: 'Nog een vraag', actie: () => menu() }]);
    } catch (e) {
      bezig.remove();
      const melding = e instanceof TypeError ? 'De verbinding is weggevallen.' : (e as Error).message;
      const d = await bot('<p class="fout"></p><p>Probeer opnieuw, of neem rechtstreeks contact op.</p>');
      d.querySelector('.fout')!.textContent = `Uw aanvraag is niet verzonden. ${melding}`;
      vak.disabled = false;
      const lijst: { tekst: string; actie: () => void; href?: string; hoofd?: boolean }[] = [
        { tekst: 'Opnieuw proberen', hoofd: true, actie: () => verstuur(vak) },
      ];
      if (wa) lijst.push({ tekst: 'WhatsApp', href: wa, actie: () => {} });
      knoppen(lijst);
    }
  }

  // ── Vrije invoer ────────────────────────────────────
  invoer.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = tekst.value.trim();
    if (!v) return;
    const stap = stappen[stapIndex];
    if (stap && stap.soort === 'tekst') {
      const fout = stap.check(v);
      bericht(v, 'ik');
      tekst.value = '';
      if (fout) {
        const d = await bot('<p class="fout"></p>');
        d.querySelector('.fout')!.textContent = fout;
        tekst.focus();
        return;
      }
      antwoorden[stap.id] = v;
      volgende();
      return;
    }
    bericht(v, 'ik');
    tekst.value = '';
    if (stap && stap.soort !== 'tekst') {
      await bot('<p>Kies hierboven een antwoord, of beantwoord eerst de vraag.</p>');
      return;
    }
    const n = norm(v);
    if (/\b(offerte aanvragen|aanvragen|offerte|bestek)\b/.test(n) && !/hoe|wat|verloopt|gratis/.test(n)) {
      startOfferte();
      return;
    }
    if (/\b(bellen|telefoon|nummer|whatsapp|contact|mail)\b/.test(n)) {
      direct();
      return;
    }
    const id = zoek(v);
    if (id) beantwoord(id);
    else {
      await bot(
        '<p>Daar heb ik geen pasklaar antwoord op. Derycke helpt u graag persoonlijk verder.</p>',
      );
      knoppen([knopVoor('offerte'), knopVoor('contact'), { tekst: 'Toon de vragen', actie: () => menu() }]);
    }
  });

  // Open de assistent rechtstreeks via #assistent in de URL
  if (location.hash === '#assistent') open(null);
}
