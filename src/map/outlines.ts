// Each country's added outlines (data/added-boundaries.geojson) are a file of their own, fetched when the map first shows that
// country, so a first visit (the Spain map) does not download every other country's places (owner option A, decision #38).
// The build splits the file with splitOutlines (vite.config.ts, virtual:outlines); createMap.ts asks for a country with countryOf.
import { DEFAULT_COUNTRY } from '../countries';
import type { Box, Collection } from './boundaries';

/** One country's outlines file: its URL and the box around each outline in it. */
export interface OutlineFile { url: string; boxes: Box[] }

/** The part of data/places.json this needs: which country each study region belongs to, and each place's region and kind. */
export interface PlacesFile {
  courses: Array<{ country: string; groups: Array<{ id: string }> }>;
  places: Array<{ id: string; region: string; kind?: string }>;
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

/**
 * A light copy of outlines for the view from above (zoom below OUTLINES_MIN_ZOOM): each ring cut to the points that move it by more
 * than `tolerance` degrees (Douglas-Peucker; 0.02, about 1.6 km, is one screen pixel at zoom 6, where the full outlines take over),
 * corners rounded to 3 decimals (about 100 m). Pieces and holes under `minSize` degrees
 * across are left out (France's outlines are thousands of small parcels), except each place's biggest piece, so no place is lost.
 * The full outlines replace it once the map shows that country close in.
 */
export function overviewOf(c: Collection, tolerance = 0.02, minSize = 0.04): Collection {
  const round = (p: number[]) => [Math.round(p[0] * 1000) / 1000, Math.round(p[1] * 1000) / 1000];
  const ring = (r: number[][]): number[][] => {
    const kept = new Uint8Array(r.length);
    kept[0] = kept[r.length - 1] = 1;
    const stack: Array<[number, number]> = [[0, r.length - 1]];
    while (stack.length) {
      const [a, b] = stack.pop() as [number, number];
      const [ax, ay] = r[a], [bx, by] = r[b];
      const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
      let far = -1, best = tolerance;
      for (let i = a + 1; i < b; i++) {
        const d = len ? Math.abs(dy * (r[i][0] - ax) - dx * (r[i][1] - ay)) / len : Math.hypot(r[i][0] - ax, r[i][1] - ay);
        if (d > best) { best = d; far = i; }
      }
      if (far >= 0) { kept[far] = 1; stack.push([a, far], [far, b]); }
    }
    const out = r.filter((_, i) => kept[i]).map(round);
    return out.length >= 4 ? out : r.slice(0, 4).map(round);
  };
  const size = (r: number[][]) => spanOfRing(r);
  const polygon = (p: number[][][]) => [ring(p[0]), ...p.slice(1).filter((h) => size(h) >= minSize).map(ring)];
  const features = c.features.map((f) => {
    const g = f.geometry;
    if (g.type === 'Polygon') return { ...f, geometry: { type: 'Polygon', coordinates: polygon(g.coordinates as number[][][]) } };
    if (g.type !== 'MultiPolygon') return f;
    const polys = g.coordinates as number[][][][];
    const biggest = polys.reduce((b, p) => (size(p[0]) > size(b[0]) ? p : b), polys[0]);
    const kept = polys.filter((p) => p === biggest || size(p[0]) >= minSize).map(polygon);
    return { ...f, geometry: { type: 'MultiPolygon', coordinates: kept } };
  });
  return { type: 'FeatureCollection', features };
}

function spanOfRing(r: number[][]): number {
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  for (const [x, y] of r) { w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y); }
  return Math.max(e - w, n - s);
}

/**
 * The overview file: every country but the default one (whose full outlines come with the first load), places only (a zone is only
 * drawn on its own place's view, which is close in), each outline light (overviewOf) and carrying only its place id.
 */
export function overviewOutlines(parts: Record<string, Collection>, file: PlacesFile): Collection {
  const zones = new Set(file.places.filter((p) => p.kind === 'zone').map((p) => p.id));
  const features = Object.entries(parts).filter(([c]) => c !== DEFAULT_COUNTRY).flatMap(([, fc]) => fc.features)
    .filter((f) => !zones.has(String(f.properties.id)))
    .map((f) => ({ ...f, properties: { id: f.properties.id } }));
  return overviewOf({ type: 'FeatureCollection', features });
}
