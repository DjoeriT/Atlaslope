// Joins the boundary files to the place list, so every polygon carries its place id, kind, study region and colour.
import { applyOverrides, type Overrides } from '../dops';
import { regionColor } from './regionColors';

interface Geo { type: string; coordinates: unknown }
interface Feature { type: 'Feature'; properties: Record<string, unknown>; geometry: Geo }
export interface Collection { type: 'FeatureCollection'; features: Feature[] }

export interface PlaceRow { id: string; name: string; kind: string; region: string; layerCode?: string | null }

/** Features for the `dos` source: id (the place id, also the feature id), name, kind, region, color, span (degrees). */
export function buildBoundaries(places: PlaceRow[], dops: Collection, overrides: Overrides, added: Collection): Collection {
  const byCode = new Map(places.filter((p) => p.layerCode).map((p) => [p.layerCode as string, p]));
  const byId = new Map(places.map((p) => [p.id, p]));
  const features: Feature[] = [];
  for (const f of applyOverrides(dops, overrides).features) {
    const p = byCode.get(String(f.properties.code));
    if (p) features.push(shape(p, f.geometry as Geo));
  }
  for (const f of added.features) {
    const p = byId.get(String(f.properties.id));
    if (p) features.push(shape(p, f.geometry));
  }
  return { type: 'FeatureCollection', features };
}

function shape(p: PlaceRow, geometry: Geo): Feature {
  return {
    type: 'Feature',
    properties: { id: p.id, name: p.name, kind: p.kind, region: p.region, color: regionColor(p.region), span: spanOf(geometry) },
    geometry,
  };
}

function* points(c: unknown): Generator<[number, number]> {
  if (Array.isArray(c) && typeof c[0] === 'number') yield c as [number, number];
  else if (Array.isArray(c)) for (const x of c) yield* points(x);
}

/** Longest side of the bounding box, in degrees: a cheap size for label priority. */
export function spanOf(g: Geo): number {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const [x, y] of points(g.coordinates)) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return Math.max(x1 - x0, y1 - y0);
}

/** Big places are named from the start, small ones as you zoom in. */
export function labelMinZoom(span: number): number {
  return span >= 1 ? 0 : span >= 0.5 ? 6 : 6.8;
}

export type Box = [west: number, south: number, east: number, north: number];

/** Clip boxes of data/natural-earth-spain.geojson (data/SOURCES.md): mainland and Balearics, Canaries. */
export const LAND_BOXES: Box[] = [[-10, 35, 5, 44.5], [-18.4, 27.5, -13.2, 29.5]];

/**
 * The sea as one polygon per clip box with the land cut out, so it can be tinted over imagery. The land is clipped to
 * the same boxes, so the sea stops at the same edges.
 */
export function oceanFromLand(land: Collection, boxes: Box[] = LAND_BOXES): Collection {
  const features = boxes.map(([w, s, e, n]) => {
    const holes: number[][][] = [];
    for (const f of land.features) {
      const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates as number[][][]] : (f.geometry.coordinates as number[][][][]);
      for (const poly of polys) {
        const ring = poly[0];
        const [x, y] = ring?.[0] ?? [NaN, NaN];
        if (ring && ring.length > 3 && x >= w - 1e-6 && x <= e + 1e-6 && y >= s - 1e-6 && y <= n + 1e-6) holes.push(ring);
      }
    }
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: { type: 'Polygon', coordinates: [[[w, s], [e, s], [e, n], [w, n], [w, s]], ...holes] },
    };
  });
  return { type: 'FeatureCollection', features };
}
