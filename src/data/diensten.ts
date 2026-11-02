import schilderwerkLijn from '../assets/beelden/schilderwerk-lijn.jpg';
import lakwerkDeur from '../assets/beelden/lakwerk-deur.jpg';
import gevel from '../assets/beelden/gevel.jpg';
import badkamer from '../assets/beelden/badkamer.jpg';
import tegelwerk from '../assets/beelden/tegelwerk-detail.jpg';
import keuken from '../assets/beelden/keuken.jpg';
import leefkeuken from '../assets/beelden/leefkeuken.jpg';
import parket from '../assets/beelden/parket.jpg';
import appartement from '../assets/beelden/appartement.jpg';
import pleisterwerk from '../assets/beelden/pleisterwerk.jpg';
import inkomhal from '../assets/beelden/inkomhal.jpg';
import type { ImageMetadata } from 'astro';

export type Beeld = { src: ImageMetadata; alt: string };

export type Dienst = {
  slug: string;
  titel: string;
  /** Korte omschrijving voor overzichten (max. ± 90 tekens). */
  kort: string;
  seoTitel: string;
  seoOmschrijving: string;
  intro: string;
  beeld: Beeld;
  detailbeeld: Beeld;
  /** Situaties waarin klanten ons voor deze dienst contacteren. */
  wanneer: string[];
  /** Concrete werken binnen deze dienst. */
  werken: { titel: string; tekst: string }[];
  /** Wat helpt om snel een correcte offerte op te maken. */
  offerte: string[];
  faq: { vraag: string; antwoord: string }[];
};

export const diensten: Dienst[] = [
  {
    slug: 'schilderwerken',
    titel: 'Schilderwerken',
    kort: 'Binnen- en buitenschilderwerken, lakwerken en een strakke afwerking.',
    seoTitel: 'Schilderwerken binnen en buiten in heel Vlaanderen',
    seoOmschrijving:
      'Professionele binnen- en buitenschilderwerken, lakwerken en afwerking in heel Vlaanderen. Vraag uw vrijblijvende offerte aan bij Derycke.',
    intro:
      'Een goed schilderwerk herkent u vooral aan wat u niet ziet: geen randen, geen oneffenheden, geen kleurverschil. Dat resultaat begint bij een zorgvuldige voorbereiding van elke ondergrond.',
    beeld: {
      src: schilderwerkLijn,
      alt: 'Strakke verflijn tussen een warmgrijze muur en een witte plafondlijst, met een borstel op een ladder',
    },
    detailbeeld: {
      src: lakwerkDeur,
      alt: 'Gelakte paneeldeur in warm steengrijs met bronzen deurklink',
    },
    wanneer: [
      'U renoveert of verhuist en wilt muren en plafonds volledig opnieuw laten schilderen.',
      'Deuren, kaders, trappen of plinten zijn aan een nieuwe laklaag toe.',
      'Een woning of appartement moet verkoop- of verhuurklaar worden.',
      'Gevel, ramen of buitenschrijnwerk hebben bescherming en een frisse kleur nodig.',
    ],
    werken: [
      {
        titel: 'Binnenschilderwerken',
        tekst: 'Muren en plafonds, inclusief het voorbereidende werk: afplakken, schuren, plamuren en het juiste grondwerk voor de ondergrond.',
      },
      {
        titel: 'Lakwerken',
        tekst: 'Deuren, deurkaders, trappen, plinten en radiatoren met een gelijkmatige, duurzame laklaag.',
      },
      {
        titel: 'Buitenschilderwerken',
        tekst: 'Gevels en buitenschrijnwerk, afgestemd op de ondergrond en de weersomstandigheden.',
      },
      {
        titel: 'Afwerking',
        tekst: 'Strakke aansluitingen, nette kitvoegen en een werkplek die we opgeruimd achterlaten.',
      },
    ],
    offerte: [
      'Welke ruimtes of gevels het betreft, met een schatting van de oppervlakte.',
      'De huidige staat: barsten, vochtplekken, oude verflagen of nieuwe pleisters.',
      'Of er ook deuren, kaders, trappen of ander schrijnwerk gelakt moeten worden.',
      "Enkele foto's van de ruimtes, bij voorkeur bij daglicht.",
    ],
    faq: [
      {
        vraag: 'Moet ik de kleuren al gekozen hebben?',
        antwoord:
          'Nee. Een eerste idee helpt, maar de definitieve kleurkeuze kan later volgen. We bespreken graag wat haalbaar is voor de ruimte en de ondergrond.',
      },
      {
        vraag: 'Kunnen schilderwerken gecombineerd worden met andere renovatiewerken?',
        antwoord:
          'Ja. Schilderwerken komen vaak als laatste stap na pleister-, gyproc- of vloerwerken. Door alles samen te plannen, sluiten de werken beter op elkaar aan.',
      },
    ],
  },
  {
    slug: 'badkamerrenovaties',
    titel: 'Badkamerrenovaties',
    kort: 'Volledige renovaties, sanitair, douches en tegelwerken.',
    seoTitel: 'Badkamerrenovatie in heel Vlaanderen',
    seoOmschrijving:
      'Volledige badkamerrenovatie: sanitair, inloopdouches en tegelwerken met oog voor detail. Actief in heel Vlaanderen. Vraag uw offerte aan.',
    intro:
      'Een badkamer gebruikt u elke dag. Daarom draait een renovatie niet alleen om de uitstraling, maar ook om goed doordachte aansluitingen, waterdichte details en tegelwerk dat tot in de hoeken klopt.',
    beeld: {
      src: badkamer,
      alt: 'Gerenoveerde badkamer met inloopdouche, grote grijze tegels en een eiken badmeubel',
    },
    detailbeeld: {
      src: tegelwerk,
      alt: 'Detail van tegelwerk met een ingewerkte nis en strakke voegen in een douche',
    },
    wanneer: [
      'Uw badkamer is verouderd en u wilt alles vernieuwen, van afbraak tot afwerking.',
      'U wilt een bad vervangen door een inloopdouche.',
      'Tegels, voegen of sanitair zijn beschadigd of niet meer waterdicht.',
      'U koopt of verhuurt een woning en wilt de badkamer eerst laten opfrissen.',
    ],
    werken: [
      {
        titel: 'Volledige renovatie',
        tekst: 'Van het verwijderen van de oude badkamer tot de laatste afwerking, met één aanspreekpunt.',
      },
      {
        titel: 'Sanitair',
        tekst: 'Plaatsen van lavabo, badmeubel, toilet, bad of douche en de bijbehorende kranen.',
      },
      {
        titel: 'Douches',
        tekst: 'Inloopdouches en douchecabines, met aandacht voor afschot, afvoer en waterdichting.',
      },
      {
        titel: 'Tegelwerken',
        tekst: 'Wand- en vloertegels, nissen en randafwerking, met een zorgvuldig voegenpatroon.',
      },
    ],
    offerte: [
      'De afmetingen van de badkamer en de plaats van ramen en deuren.',
      'Wat u wilt behouden en wat vervangen moet worden.',
      'Uw wensen: inloopdouche, bad, dubbele lavabo, ingewerkte nis, …',
      "Foto's van de huidige toestand en eventueel inspiratiebeelden.",
    ],
    faq: [
      {
        vraag: 'Kan ik zelf tegels of sanitair kiezen?',
        antwoord:
          'Ja. U kiest de materialen die bij u passen. We bekijken samen of ze geschikt zijn voor de plaats waar ze komen, bijvoorbeeld voor de vloer van een inloopdouche.',
      },
      {
        vraag: 'Hoe lang duurt een badkamerrenovatie?',
        antwoord:
          'Dat hangt af van de omvang van de werken en de levertijd van de materialen. Na het plaatsbezoek krijgt u een planning die past bij uw project.',
      },
    ],
  },
  {
    slug: 'keukenrenovaties',
    titel: 'Keukenrenovaties',
    kort: 'Vernieuwing en modernisering van keukens.',
    seoTitel: 'Keukenrenovatie en modernisering in Vlaanderen',
    seoOmschrijving:
      'Uw keuken vernieuwen of moderniseren? Derycke verzorgt keukenrenovaties en de afwerking errond in heel Vlaanderen. Vraag uw vrijblijvende offerte aan.',
    intro:
      'Een keuken vernieuwen raakt aan meerdere vakgebieden tegelijk: wanden, vloeren, aansluitingen en afwerking. Wij zorgen dat die stappen in de juiste volgorde gebeuren en dat het geheel strak afgewerkt wordt.',
    beeld: {
      src: keuken,
      alt: 'Moderne keuken met matte antracietkleurige kasten, natuurstenen werkblad en eiken vloer',
    },
    detailbeeld: {
      src: leefkeuken,
      alt: 'Open leefkeuken met eiland in natuursteen, eiken kasten en grote raampartij naar de tuin',
    },
    wanneer: [
      'Uw keuken is functioneel versleten of past niet meer bij de rest van de woning.',
      'U wilt de indeling aanpassen, bijvoorbeeld naar een open leefkeuken.',
      'Na een verbouwing moeten wanden, vloer en keuken samen opnieuw afgewerkt worden.',
      'U wilt een bestaande keuken moderniseren zonder alles te vervangen.',
    ],
    werken: [
      {
        titel: 'Vernieuwing',
        tekst: 'Uitbreken van de bestaande keuken en voorbereiden van de ruimte voor de nieuwe opstelling.',
      },
      {
        titel: 'Modernisering',
        tekst: 'Een bestaande keuken een nieuw uitzicht geven, afhankelijk van wat behouden kan blijven.',
      },
      {
        titel: 'Wanden en vloer',
        tekst: 'Pleister-, schilder-, tegel- en vloerwerken rond de keuken, zodat alles op elkaar aansluit.',
      },
      {
        titel: 'Afwerking',
        tekst: 'Nette aansluitingen tussen werkblad, wand en vloer, en een opgeruimde oplevering.',
      },
    ],
    offerte: [
      'Een plan of schets van de ruimte met de belangrijkste afmetingen.',
      'Of u al een keukenontwerp of leverancier heeft.',
      'Welke werken rond de keuken nodig zijn: wanden, vloer, schilderwerk.',
      "Foto's van de huidige keuken.",
    ],
    faq: [
      {
        vraag: 'Ik heb mijn keuken al besteld. Kunnen jullie de werken errond uitvoeren?',
        antwoord:
          'Neem gerust contact op met de gegevens van uw keukenproject. We bekijken samen welke voorbereidende en afwerkende werken we kunnen opnemen.',
      },
    ],
  },
  {
    slug: 'vloerwerken',
    titel: 'Vloerwerken',
    kort: 'Tegels, parket, laminaat, vinyl en PVC.',
    seoTitel: 'Vloerwerken: tegels, parket, laminaat, vinyl en PVC',
    seoOmschrijving:
      'Plaatsing van tegelvloeren, parket, laminaat, vinyl en PVC in heel Vlaanderen. Vakkundig gelegd met aandacht voor plinten en aansluitingen.',
    intro:
      'Een vloer bepaalt de sfeer van een ruimte en gaat jaren mee. Of het nu om tegels, parket of een soepele vloer gaat: de kwaliteit zit in een vlakke ondergrond, rechte lijnen en verzorgde aansluitingen aan deuren en plinten.',
    beeld: {
      src: parket,
      alt: 'Lichte eiken visgraatparketvloer die aansluit op een witgeschilderde plint',
    },
    detailbeeld: {
      src: appartement,
      alt: 'Lege, lichte leefruimte met eiken vloer en grote ramen',
    },
    wanneer: [
      'U wilt een versleten of gedateerde vloer vervangen.',
      'Na een renovatie moet een volledige verdieping een nieuwe vloer krijgen.',
      'U twijfelt tussen tegels, parket of een soepele vloer en wilt advies.',
      'Een pand moet snel en verzorgd klaargemaakt worden voor verhuur of verkoop.',
    ],
    werken: [
      { titel: 'Tegels', tekst: 'Vloertegels in verschillende formaten, met een doordachte legrichting en voegverdeling.' },
      { titel: 'Parket', tekst: 'Houten vloeren in planken of patronen zoals visgraat.' },
      { titel: 'Laminaat', tekst: 'Een betaalbare en onderhoudsvriendelijke oplossing voor woon- en slaapkamers.' },
      { titel: 'Vinyl en PVC', tekst: 'Soepele, waterbestendige vloeren, ook geschikt voor keuken en badkamer.' },
    ],
    offerte: [
      'Het aantal vierkante meter en om welke ruimtes het gaat.',
      'Het type vloer dat u voor ogen heeft, of de vraag om advies.',
      'Wat er nu ligt en of die vloer verwijderd moet worden.',
      'Of er vloerverwarming aanwezig is.',
    ],
    faq: [
      {
        vraag: 'Welke vloer is het meest geschikt voor mijn woning?',
        antwoord:
          'Dat hangt af van de ruimte, het gebruik, een eventuele vloerverwarming en uw voorkeur. Bij het plaatsbezoek overlopen we de mogelijkheden.',
      },
      {
        vraag: 'Plaatsen jullie ook plinten?',
        antwoord:
          'Plinten horen bij een verzorgde afwerking. Vermeld in uw aanvraag of u nieuwe plinten wenst, dan nemen we die mee in de offerte.',
      },
    ],
  },
  {
    slug: 'algemene-renovaties',
    titel: 'Algemene renovaties',
    kort: 'Gyprocwerken, pleisterwerken en interieurafwerking.',
    seoTitel: 'Algemene renovaties: gyproc, pleisterwerk en interieurafwerking',
    seoOmschrijving:
      'Gyprocwerken, pleisterwerken en interieurafwerking voor particulieren en bedrijven in heel Vlaanderen. Vraag uw vrijblijvende offerte aan bij Derycke.',
    intro:
      'Veel renovaties beginnen met de wanden en plafonds. Nieuwe scheidingswanden, verlaagde plafonds of vlak pleisterwerk vormen de basis waarop schilder- en vloerwerken later strak kunnen aansluiten.',
    beeld: {
      src: pleisterwerk,
      alt: 'Ruimte in afwerkingsfase met vers pleisterwerk en een plafond met schaduwvoeg en inbouwspots',
    },
    detailbeeld: {
      src: inkomhal,
      alt: 'Gerenoveerde inkomhal met grijs geschilderde trap en witte plafondlijst',
    },
    wanneer: [
      'U wilt de indeling van een woning of kantoor aanpassen met nieuwe wanden.',
      'Muren en plafonds zijn oneffen, gebarsten of moeten opnieuw bezet worden.',
      'U wilt een verlaagd plafond, bijvoorbeeld om verlichting in te bouwen.',
      'Een pand moet volledig afgewerkt worden na ruwbouw of grondige renovatie.',
    ],
    werken: [
      {
        titel: 'Gyprocwerken',
        tekst: 'Scheidingswanden, voorzetwanden, verlaagde plafonds en koofconstructies.',
      },
      {
        titel: 'Pleisterwerken',
        tekst: 'Wanden en plafonds bezetten of herstellen tot een vlakke, schilderklare ondergrond.',
      },
      {
        titel: 'Interieurafwerking',
        tekst: 'De laatste stap van een renovatie: alles wat nodig is om een ruimte instapklaar te maken.',
      },
    ],
    offerte: [
      'Een plan, schets of beschrijving van de gewenste wijzigingen.',
      'De oppervlakte van de betrokken wanden en plafonds.',
      'Of de werken gevolgd worden door schilder- of vloerwerken.',
      "Foto's van de huidige toestand.",
    ],
    faq: [
      {
        vraag: 'Kunnen jullie een volledige ruimte van ruwbouw tot afwerking opvolgen?',
        antwoord:
          'Gyproc-, pleister-, schilder- en vloerwerken behoren tot onze diensten. Beschrijf uw project, dan bekijken we samen welke stappen we kunnen opnemen.',
      },
    ],
  },
];

export const typeWerken = [
  ...diensten.map((d) => d.titel),
  'Combinatie van werken',
  'Andere',
] as const;
