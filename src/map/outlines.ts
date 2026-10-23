// Each country's added outlines (data/added-boundaries.geojson) are a file of their own, fetched when the map first shows that
// country, so a first visit (the Spain map) does not download every other country's places (owner option A, decision #38).
// The build splits the file with splitOutlines (vite.config.ts, virtual:outlines); createMap.ts asks for a country with countryOf.
import { DEFAULT_COUNTRY } from '../countries';
import type { Box, Collection } from './boundaries';

/** One country's outlines file: its URL and the box around each outline in it. */
export interface OutlineFile { url: string; boxes: Box[] }

/** The part of data/places.json this needs: which country each study region belongs to, and each place's region. */
export interface PlacesFile {
  courses: Array<{ country: string; groups: Array<{ id: string }> }>;
  places: Array<{ id: string; region: string }>;
}

/** Country id by place id and by study region id. */
export function countryIndex(file: PlacesFile): Map<string, string> {
  const index = new Map<string, string>();
  for (const c of file.courses) for (const g of c.groups) index.set(g.id, c.country);
  for (const p of file.places) {
    const c = index.get(p.region);
    if (c) index.set(p.id, c);
  }
  return index;
}

/** The added outlines per country id. An outline whose place has no country stays with the default country, so nothing is dropped. */
export function splitOutlines(added: Collection, file: PlacesFile): Record<string, Collection> {
  const index = countryIndex(file);
  const out: Record<string, Collection> = { [DEFAULT_COUNTRY]: { type: 'FeatureCollection', features: [] } };
  for (const f of added.features) {
    const c = index.get(String(f.properties.id)) ?? DEFAULT_COUNTRY;
    (out[c] ??= { type: 'FeatureCollection', features: [] }).features.push(f);
  }
  return out;
}

/** The country a focus frame looks at: its region's or place's country (the default country when unknown). */
export const countryOf = (index: Map<string, string>, id: string): string => index.get(id) ?? DEFAULT_COUNTRY;

/** Below this zoom (the atlas cover, a whole country) the view alone fetches no other country's outlines; opening one does. */
export const OUTLINES_MIN_ZOOM = 6;

/** The box around a collection's outlines, or null when it has none. */
export function boxOf(c: Collection): Box | null {
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  const walk = (x: unknown): void => {
    if (Array.isArray(x) && typeof x[0] === 'number') { w = Math.min(w, x[0]); e = Math.max(e, x[0]); s = Math.min(s, x[1] as number); n = Math.max(n, x[1] as number); }
    else if (Array.isArray(x)) x.forEach(walk);
  };
  for (const f of c.features) walk(f.geometry.coordinates);
  return w <= e ? [w, s, e, n] : null;
}

/** Each outline's box, for the file list the map carries (a few KB, where the outlines themselves are hundreds). */
export const boxesOf = (c: Collection): Box[] => c.features.map((f) => boxOf({ type: 'FeatureCollection', features: [f] })).filter((b): b is Box => b !== null);

/** The countries with an outline whose box overlaps the view, from OUTLINES_MIN_ZOOM in. */
export function countriesInView(view: Box, zoom: number, files: Record<string, OutlineFile>): string[] {
  if (zoom < OUTLINES_MIN_ZOOM) return [];
  const [w, s, e, n] = view;
  const meets = ([bw, bs, be, bn]: Box) => bw <= e && be >= w && bs <= n && bn >= s;
  return Object.entries(files).filter(([, f]) => f.boxes.some(meets)).map(([id]) => id);
}
