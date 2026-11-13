import { REGELS } from './offerte-regels';

/** Verkleint een foto in de browser tot max. REGELS.maxPixels (JPEG). Onleesbare formaten blijven ongewijzigd. */
export async function verklein(f: File): Promise<File> {
  try {
    const bmp = await createImageBitmap(f);
    const schaal = Math.min(1, REGELS.maxPixels / Math.max(bmp.width, bmp.height));
    if (schaal === 1 && f.size <= 900 * 1024 && f.type !== 'image/heic' && f.type !== 'image/heif') return f;
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * schaal);
    c.height = Math.round(bmp.height * schaal);
    c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close?.();
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/jpeg', 0.8));
    if (!blob) return f;
    return new File([blob], f.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    // Browser kan dit formaat niet lezen (bv. HEIC buiten Safari): origineel behouden
    return f;
  }
}

export function isBeeld(f: File) {
  return (REGELS.toegelatenTypes as readonly string[]).includes(f.type) || /\.(heic|heif)$/i.test(f.name);
}

export function mb(b: number) {
  return b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(b / 1024))} kB`;
}

/**
 * Voegt nieuwe bestanden toe aan een lijst foto's, met dezelfde controles in formulier en assistent.
 * Geeft een foutmelding terug (of '') en de bijgewerkte lijst.
 */
export async function voegFotosToe(huidig: File[], nieuw: File[]): Promise<{ fotos: File[]; fout: string }> {
  const fotos = [...huidig];
  const fouten: string[] = [];
  const ruimte = REGELS.maxFotos - fotos.length;
  if (nieuw.length > ruimte) {
    fouten.push(`U kunt maximaal ${REGELS.maxFotos} foto's toevoegen.${ruimte > 0 ? ` Er is nog plaats voor ${ruimte}.` : ''}`);
  }
  for (const f of nieuw.slice(0, Math.max(0, ruimte))) {
    if (!isBeeld(f)) {
      fouten.push(`"${f.name}" is geen ondersteund beeldformaat. Gebruik JPG, PNG, WebP of HEIC.`);
      continue;
    }
    if (f.size > REGELS.maxBytesOrigineel) {
      fouten.push(`"${f.name}" is groter dan ${mb(REGELS.maxBytesOrigineel)}.`);
      continue;
    }
    const klein = await verklein(f);
    if (klein.size > REGELS.maxBytesPerFoto) {
      fouten.push(`"${f.name}" kon niet verkleind worden en is te groot. Probeer een JPG-foto.`);
      continue;
    }
    fotos.push(klein);
  }
  const totaal = fotos.reduce((s, f) => s + f.size, 0);
  if (totaal > REGELS.maxBytesTotaal) fouten.push(`De foto's zijn samen te groot (max. ${mb(REGELS.maxBytesTotaal)}). Verwijder er één of meer.`);
  return { fotos, fout: fouten.join(' ') };
}

/** Kleine voorvertoning; HEIC buiten Safari geeft geen beeld en valt terug op een icoon. */
export function voorbeeldUrl(f: File) {
  return f.type === 'image/heic' || f.type === 'image/heif' ? null : URL.createObjectURL(f);
}
