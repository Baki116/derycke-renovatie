/**
 * Merken waarmee Derycke werkt.
 *
 * Formulering op de site: "Wij werken met professionele topmerken zoals …".
 * Nooit "officiële partner", "erkend dealer" of "gecertificeerd" zonder schriftelijke bevestiging.
 *
 * Logo's: enkel officiële bestanden uit de perskits van de merken. Zolang er geen officieel
 * logo in /public/merken/ staat, wordt de merknaam typografisch getoond.
 * Zet `actief: false` om een merk te verbergen.
 */
export type Merk = {
  naam: string;
  /** Eén zin voor de pagina Schilderwerken. */
  tekst: string;
  groep: 'verf' | 'afwerking';
  actief: boolean;
  /** Pad naar het officiële logo in /public/merken/, bv. '/merken/sikkens.svg'. */
  logo?: string;
};

export const merken: Merk[] = [
  { naam: 'Sikkens', groep: 'verf', actief: true, tekst: 'Hoogwaardige lakken en muurverven voor professionals.' },
  { naam: 'Boss Paints', groep: 'verf', actief: true, tekst: 'Belgische verffabrikant, veel gebruikt door Vlaamse schilders.' },
  { naam: 'Sigma', groep: 'verf', actief: true, tekst: 'Professionele verven voor binnen en buiten.' },
  { naam: 'Trimetal', groep: 'verf', actief: true, tekst: 'Professioneel verfmerk met een lange geschiedenis in België.' },
  { naam: 'Levis', groep: 'verf', actief: true, tekst: 'Bekend Belgisch verfmerk voor binnen- en buitenwerk.' },
  { naam: 'Mathys', groep: 'verf', actief: true, tekst: 'Gevel- en beschermingscoatings, gemaakt in België.' },
  { naam: 'Caparol', groep: 'verf', actief: true, tekst: 'Gevelverven, pleisters en isolatiesystemen.' },
  { naam: 'Farrow & Ball', groep: 'verf', actief: true, tekst: 'Decoratieve kleuren met een diepe, stijlvolle uitstraling.' },
  { naam: 'Little Greene', groep: 'verf', actief: true, tekst: 'Karaktervolle kleuren voor een verfijnd interieur.' },

  // Te bevestigen door Mike vóór publicatie: standaard uitgeschakeld.
  { naam: 'Quick-Step', groep: 'afwerking', actief: false, tekst: 'Laminaat en parket.' },
  { naam: 'Mosa', groep: 'afwerking', actief: false, tekst: 'Keramische tegels.' },
  { naam: 'Villeroy & Boch', groep: 'afwerking', actief: false, tekst: 'Sanitair en tegels.' },
  { naam: 'Grohe', groep: 'afwerking', actief: false, tekst: 'Kranen en douchesystemen.' },
  { naam: 'Hansgrohe', groep: 'afwerking', actief: false, tekst: 'Kranen en douchesystemen.' },
  { naam: 'Geberit', groep: 'afwerking', actief: false, tekst: 'Inbouwsystemen en sanitair.' },
  { naam: 'Gyproc', groep: 'afwerking', actief: false, tekst: 'Gipsplaten en afwerkingssystemen.' },
];

export const actieveMerken = merken.filter((m) => m.actief);
export const verfMerken = actieveMerken.filter((m) => m.groep === 'verf');
