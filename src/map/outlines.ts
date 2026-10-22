// Each country's added outlines (data/added-boundaries.geojson) are a file of their own, fetched when the map first shows that
// country, so a first visit (the Spain map) does not download every other country's places (owner option A, decision #38).
// The build splits the file with splitOutlines (vite.config.ts, virtual:outlines); createMap.ts asks for a country with countryOf.
import type { Bounds } from '../countries';
import { DEFAULT_COUNTRY } from '../countries';
import type { Collection } from './boundaries';

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

/** The countries whose map bounds overlap the view, from OUTLINES_MIN_ZOOM in. */
export function countriesInView(view: Bounds, zoom: number, bounds: Record<string, Bounds>): string[] {
  if (zoom < OUTLINES_MIN_ZOOM) return [];
  const [[w, s], [e, n]] = view;
  return Object.entries(bounds).filter(([, [[cw, cs], [ce, cn]]]) => cw <= e && ce >= w && cs <= n && cn >= s).map(([id]) => id);
}
