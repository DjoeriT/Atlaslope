import measuresFile from '../../data/place-measures.json';
import { ROOT } from '../site';
import photosFile from '../../data/photos.json';
import photoSizesFile from '../../data/photo-sizes.json';
import sourcesFile from '../../content/sources.json';
import type { Measures, Photo, ShownPhoto, Sheet, SheetFile, Sources } from './types';

export { checkSheets } from './check';
export * from './format';
export * from './guides';
export * from './types';

// Every region file under content/facts/ is bundled; a region without a file simply has no sheets yet.
const modules = import.meta.glob<SheetFile>('../../content/facts/*.json', { eager: true, import: 'default' });

export const sheetFiles: SheetFile[] = Object.values(modules);
export const sources = sourcesFile as Sources;
const sheets = new Map<string, Sheet>(sheetFiles.flatMap((f) => f.sheets.map((s) => [s.id, s] as const)));
const measuresDoc = measuresFile as unknown as {
  places: Record<string, Measures>;
  country: { spain: Measures };
  regions: Record<string, Measures>;
};
const measures = measuresDoc.places;
const photos = (photosFile as unknown as { photos: Record<string, Photo> }).photos;
const photoSizes = photoSizesFile as { sizes: number[]; photos: Record<string, { w: number; h: number; blur: string }> };

export const sheetOf = (placeId: string): Sheet | undefined => sheets.get(placeId);
export const measuresOf = (placeId: string): Measures | undefined => measures[placeId];
/** All of Spain's land, measured the same way as a place, for comparisons. */
export const spainMeasures = (): Measures => measuresDoc.country.spain;
/** A study region's appellation-level land, measured the same way as a place, for comparisons. */
export const regionMeasuresOf = (regionId: string): Measures | undefined => measuresDoc.regions[regionId];

/** Up to three photos of a place, in numbered order. `src` (the full 1200 px file) and the `srcSet` widths start at the site root (ROOT). */
export function photosOf(placeId: string): ShownPhoto[] {
  return Object.entries(photos)
    .filter(([key]) => key.startsWith(placeId + '-') && /^\d+$/.test(key.slice(placeId.length + 1)))
    .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
    .slice(0, 3)
    .map(([key, p]) => ({ ...p, src: `${ROOT}photos/${key}.webp`, ...sizesOf(key) }));
}

/** The smaller copies and the blur preview Tools/data/photo_sizes.py made for one photo; none for a photo it has not seen yet. */
function sizesOf(key: string): Pick<ShownPhoto, 'srcSet' | 'blur'> {
  const s = photoSizes.photos[key];
  if (!s) return {};
  const small = photoSizes.sizes.filter((w) => w < s.w).map((w) => `${ROOT}photos/${w}/${key}.webp ${w}w`);
  return { srcSet: [...small, `${ROOT}photos/${key}.webp ${s.w}w`].join(', '), blur: s.blur };
}

/** The grape names a place answers to in search: local names and usual names of its main grapes. */
export function grapeNames(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const s of sheets.values()) {
    const names = s.grapes.main.flatMap((g) => (g.grape ? [g.local, g.grape] : [g.local]));
    if (names.length) out[s.id] = names;
  }
  return out;
}
