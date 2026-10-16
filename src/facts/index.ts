import measuresFile from '../../data/place-measures.json';
import photosFile from '../../data/photos.json';
import sourcesFile from '../../content/sources.json';
import type { Measures, Photo, Sheet, SheetFile, Sources } from './types';

export { checkSheets } from './check';
export * from './types';

// Every region file under content/facts/ is bundled; a region without a file simply has no sheets yet.
const modules = import.meta.glob<SheetFile>('../../content/facts/*.json', { eager: true, import: 'default' });

export const sheetFiles: SheetFile[] = Object.values(modules);
export const sources = sourcesFile as Sources;
const sheets = new Map<string, Sheet>(sheetFiles.flatMap((f) => f.sheets.map((s) => [s.id, s] as const)));
const measures = (measuresFile as unknown as { places: Record<string, Measures> }).places;
const photos = (photosFile as unknown as { photos: Record<string, Photo> }).photos;

export const sheetOf = (placeId: string): Sheet | undefined => sheets.get(placeId);
export const measuresOf = (placeId: string): Measures | undefined => measures[placeId];

/** Up to three photos of a place, in numbered order. `src` is relative to the site root. */
export function photosOf(placeId: string): Array<Photo & { src: string }> {
  return Object.entries(photos)
    .filter(([key]) => key.startsWith(placeId + '-') && /^\d+$/.test(key.slice(placeId.length + 1)))
    .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
    .slice(0, 3)
    .map(([key, p]) => ({ ...p, src: `photos/${key}.webp` }));
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
