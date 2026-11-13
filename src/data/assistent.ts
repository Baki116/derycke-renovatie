/**
 * Derycke-assistent — vragen en antwoorden (zonder AI, zonder kosten).
 * Antwoorden bevatten nooit prijzen of beloftes die Derycke niet bevestigde.
 * Pas de teksten hier aan; de assistent leest ze rechtstreeks.
 */
import { verfMerken } from '../config/merken';

export type Onderwerp = {
  id: string;
  /** Knoptekst */
  knop: string;
  /** Trefwoorden voor vrije vragen (zonder accenten, kleine letters) */
  woorden: string[];
  /** Antwoord in eenvoudige HTML (p, ul, li, strong) */
  antwoord: string;
  /** Vervolgknoppen: id's van onderwerpen of acties ('offerte', 'contact') */
  verder: string[];
};

const merkenTekst = verfMerken.map((m) => m.naam).join(', ');

export const onderwerpen: Onderwerp[] = [
  {
    id: 'diensten',
    knop: 'Welke werken doen jullie?',
    woorden: ['dienst', 'werken', 'doen jullie', 'aanbod', 'wat doen', 'renovatie', 'renoveren'],
    antwoord:
      '<p>Derycke voert vijf soorten werken uit, apart of gecombineerd:</p><ul><li><strong>Schilderwerken</strong>: binnen, buiten en lakwerk</li><li><strong>Badkamerrenovaties</strong>: sanitair, douches en tegelwerk</li><li><strong>Keukenrenovaties</strong>: vernieuwen en moderniseren</li><li><strong>Vloerwerken</strong>: tegels, parket, laminaat, vinyl en PVC</li><li><strong>Algemene renovaties</strong>: gyproc, pleisterwerk en interieurafwerking</li></ul>',
    verder: ['offerte', 'werkgebied'],
  },
  {
    id: 'werkgebied',
    knop: 'In welke regio werken jullie?',
    woorden: ['regio', 'werkgebied', 'gemeente', 'waar', 'provincie', 'gent', 'antwerpen', 'brugge', 'kortrijk', 'leuven', 'hasselt', 'mechelen', 'aalst', 'vlaanderen', 'verplaats', 'ver'],
    antwoord:
      '<p>We zijn actief in <strong>heel Vlaanderen</strong>: West-Vlaanderen, Oost-Vlaanderen, Antwerpen, Vlaams-Brabant en Limburg.</p><p>Vermeld de gemeente in uw aanvraag, dan bekijken we de planning.</p>',
    verder: ['offerte', 'offerte-uitleg'],
  },
  {
    id: 'offerte-uitleg',
    knop: 'Hoe verloopt een offerte?',
    woorden: ['offerte', 'hoe verloopt', 'werkwijze', 'bestek', 'plaatsbezoek', 'bezoek', 'gratis', 'vrijblijvend', 'kosteloos'],
    antwoord:
      '<p>Een offerte is <strong>gratis en vrijblijvend</strong>.</p><ul><li>U beschrijft uw project, liefst met enkele foto\'s.</li><li>We nemen contact op om het te bespreken, indien nodig met een bezoek ter plaatse.</li><li>U ontvangt een duidelijke offerte met een omschrijving van de werken.</li></ul>',
    verder: ['offerte', 'prijs'],
  },
  {
    id: 'prijs',
    knop: 'Wat kost het?',
    woorden: ['prijs', 'kost', 'kosten', 'tarief', 'budget', 'duur', 'goedkoop', 'euro', 'per m2', 'm2', 'vierkante'],
    antwoord:
      '<p>Elke renovatie is anders, daarom geven we prijzen <strong>op offerte</strong>: na een bezoek ter plaatse of op basis van uw foto\'s en beschrijving.</p><p>Zo krijgt u een prijs die klopt voor uw project, zonder verrassingen achteraf.</p>',
    verder: ['offerte', 'fotos'],
  },
  {
    id: 'termijn',
    knop: 'Wanneer kunnen jullie starten?',
    woorden: ['wanneer', 'termijn', 'starten', 'snel', 'planning', 'hoelang', 'hoe lang', 'duurt', 'wachttijd', 'datum'],
    antwoord:
      '<p>Dat hangt af van de omvang van de werken en de planning op dat moment. Bij de offerte spreken we samen een duidelijke timing af.</p><p>Geef in uw aanvraag aan wanneer u de werken wilt laten uitvoeren.</p>',
    verder: ['offerte', 'contact'],
  },
  {
    id: 'klanten',
    knop: 'Werken jullie ook voor bedrijven?',
    woorden: ['bedrijf', 'bedrijven', 'particulier', 'vastgoed', 'kantoor', 'immo', 'makelaar', 'promotor', 'projectontwikkelaar', 'verhuur', 'huurder', 'syndicus', 'professioneel'],
    antwoord:
      '<p>Ja. We werken voor <strong>particulieren</strong>, <strong>bedrijven</strong> en <strong>vastgoedprofessionals</strong>: vastgoedkantoren en projectontwikkelaars.</p><p>Voor professionals is er één aanspreekpunt, een duidelijke planning en heldere facturatie. Ook een woning verhuurklaar maken tussen twee huurders is mogelijk.</p>',
    verder: ['offerte', 'bedrijven-pagina'],
  },
  {
    id: 'merken',
    knop: 'Welke verfmerken gebruiken jullie?',
    woorden: ['merk', 'merken', 'verf', 'sikkens', 'boss', 'sigma', 'trimetal', 'levis', 'mathys', 'caparol', 'farrow', 'little greene', 'kwaliteit'],
    antwoord: `<p>Wij werken met professionele topmerken zoals ${merkenTekst}.</p><p>De keuze hangt af van de ondergrond, de ruimte en de gewenste afwerking. We adviseren u graag.</p>`,
    verder: ['offerte', 'diensten'],
  },
  {
    id: 'fotos',
    knop: "Hoe stuur ik foto's door?",
    woorden: ['foto', 'fotos', 'beeld', 'beelden', 'afbeelding', 'doorsturen', 'opsturen', 'uploaden'],
    antwoord:
      "<p>Dat kan op drie manieren:</p><ul><li>Hier in de assistent, bij het aanvragen van een offerte.</li><li>Via het offerteformulier op de contactpagina (tot 8 foto's).</li><li>Via WhatsApp.</li></ul><p>Foto's bij daglicht, van de hele ruimte en van de details, helpen het meest.</p>",
    verder: ['offerte', 'contact'],
  },
];

/** Vaste acties (geen kennisvraag). */
export const acties = {
  offerte: 'Offerte aanvragen',
  contact: 'Liever rechtstreeks praten?',
  'bedrijven-pagina': 'Bekijk de aanpak voor bedrijven',
} as const;
