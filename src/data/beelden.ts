/**
 * ─────────────────────────────────────────────────────────────
 *  BEELDEN — één bron voor alle foto's van de site
 * ─────────────────────────────────────────────────────────────
 *  Alle foto's staan in src/assets/beelden/.
 *
 *  Een eigen foto van Derycke gebruiken?
 *  1. Zet het bestand in src/assets/beelden/ (JPG, minstens 2000 px breed).
 *  2. Vervang hieronder de import door uw bestand.
 *  3. Zet `inspiratie: false` bij dat beeld.
 *  Zolang `inspiratie: true` staat, toont de site het label "Inspiratiebeeld".
 *  Een inspiratiebeeld wordt nooit voorgesteld als werk van Derycke.
 */
import type { ImageMetadata } from 'astro';

import heroWoonkamer from '../assets/beelden/hero-woonkamer.jpg';
import heroWoonkamerVoor from '../assets/beelden/hero-woonkamer-voor.jpg';
import badkamer from '../assets/beelden/badkamer.jpg';
import badkamerVoor from '../assets/beelden/badkamer-voor.jpg';
import schilderwerkLijn from '../assets/beelden/schilderwerk-lijn.jpg';
import lakwerkDeur from '../assets/beelden/lakwerk-deur.jpg';
import gevel from '../assets/beelden/gevel.jpg';
import tegelwerk from '../assets/beelden/tegelwerk-detail.jpg';
import keuken from '../assets/beelden/keuken.jpg';
import leefkeuken from '../assets/beelden/leefkeuken.jpg';
import parket from '../assets/beelden/parket.jpg';
import appartement from '../assets/beelden/appartement.jpg';
import pleisterwerk from '../assets/beelden/pleisterwerk.jpg';
import inkomhal from '../assets/beelden/inkomhal.jpg';

export type Beeld = { src: ImageMetadata; alt: string; inspiratie: boolean };

const b = (src: ImageMetadata, alt: string, inspiratie = true): Beeld => ({ src, alt, inspiratie });

export const beelden = {
  hero: b(heroWoonkamer, 'Lichte, gerenoveerde woonkamer met kalkwitte muren, een hoog raam en een eiken visgraatvloer'),
  heroVoor: b(heroWoonkamerVoor, 'Dezelfde woonkamer vóór de renovatie, met verouderd behang en versleten vasttapijt'),
  badkamer: b(badkamer, 'Gerenoveerde badkamer met inloopdouche, grote grijze tegels en een eiken badmeubel'),
  badkamerVoor: b(badkamerVoor, 'Dezelfde badkamer vóór de renovatie, met oude wandtegels en een ligbad'),
  schilderwerkLijn: b(schilderwerkLijn, 'Strakke verflijn tussen een warmgrijze muur en een witte plafondlijst'),
  lakwerkDeur: b(lakwerkDeur, 'Gelakte paneeldeur in warm steengrijs met bronzen deurklink'),
  gevel: b(gevel, 'Gerenoveerde gevel in een lichte minerale verf'),
  tegelwerk: b(tegelwerk, 'Detail van tegelwerk met een ingewerkte nis en strakke voegen in een douche'),
  keuken: b(keuken, 'Gerenoveerde keuken met matte fronten en een werkblad in natuursteen'),
  leefkeuken: b(leefkeuken, 'Open leefkeuken met eiland in natuursteen en eiken kasten'),
  parket: b(parket, 'Eiken visgraatparket dat strak aansluit op een witte plint'),
  appartement: b(appartement, 'Leeg, instapklaar appartement met lichte muren, eiken vloer en grote ramen'),
  pleisterwerk: b(pleisterwerk, 'Glad pleisterwerk op een binnenmuur, klaar om geschilderd te worden'),
  inkomhal: b(inkomhal, 'Inkomhal met een grijs gelakte trap en eiken treden'),
};

/** Voor/na-paren voor de schuifregelaar. */
export const voorNa = [
  { titel: 'Woonkamer', voor: beelden.heroVoor, na: beelden.hero },
  { titel: 'Badkamer', voor: beelden.badkamerVoor, na: beelden.badkamer },
];

const inspiratieSet = new Set(Object.values(beelden).filter((x) => x.inspiratie).map((x) => x.src));

/** Hoort dit beeld bij de inspiratiebeelden? (Bepaalt het label "Inspiratiebeeld".) */
export function isInspiratie(src: ImageMetadata) {
  return inspiratieSet.has(src);
}
