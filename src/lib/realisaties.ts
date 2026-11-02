import { getCollection } from 'astro:content';

/** Gepubliceerde realisaties, nieuwste eerst. Echte realisaties komen vóór inspiratiebeelden. */
export async function gepubliceerdeRealisaties() {
  const alle = await getCollection('realisaties', ({ data }) => data.status === 'gepubliceerd');
  return alle.sort((a, b) => {
    if (a.data.inspiratie !== b.data.inspiratie) return a.data.inspiratie ? 1 : -1;
    return b.data.datum.getTime() - a.data.datum.getTime();
  });
}
