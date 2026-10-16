// Study regions: colours and preset views. Views come from the union bounding box of each region's polygons.
import type { DopProps } from './dops';

export type Box = [[number, number], [number, number]];

/** Region fill colours. The first seven are the round 2.1 mock's legend palette; the last three are added in the same muted range. */
export const REGION_COLOURS: Record<string, string> = {
  'green-spain': '#7E9F7A',
  'castilla-y-leon': '#A97582',
  rioja: '#9E4A55',
  ebro: '#C59A5A',
  cataluna: '#CF8E77',
  mediterranean: '#D6A88C',
  meseta: '#CDB673',
  andalucia: '#B87E5E',
  baleares: '#8FB3AE',
  canarias: '#7F9FB0',
};

export const SPAIN_BOX: Box = [[-9.4, 35.9], [3.4, 43.9]];

interface Feature { properties: Record<string, unknown>; geometry: unknown }

/** Bounding box of any GeoJSON geometry. */
export function bbox(geometry: unknown): Box {
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  const walk = (c: unknown): void => {
    if (Array.isArray(c) && typeof c[0] === 'number') {
      const [x, y] = c as number[];
      if (x < w) w = x; if (x > e) e = x; if (y < s) s = y; if (y > n) n = y;
    } else if (Array.isArray(c)) c.forEach(walk);
  };
  walk((geometry as { coordinates: unknown }).coordinates);
  return [[w, s], [e, n]];
}

export function union(a: Box, b: Box): Box {
  return [[Math.min(a[0][0], b[0][0]), Math.min(a[0][1], b[0][1])], [Math.max(a[1][0], b[1][0]), Math.max(a[1][1], b[1][1])]];
}

export interface View { id: string; label: string; box: Box; pitch?: number }

/** Spain, then each study region in the order given, then Rioja close up (DO23, tilted). Regions without polygons are left out. */
export function presetViews(features: Feature[], regions: Record<string, string>): View[] {
  const boxes = new Map<string, Box>();
  for (const f of features) {
    const r = String((f.properties as unknown as DopProps).region);
    const b = bbox(f.geometry);
    boxes.set(r, boxes.has(r) ? union(boxes.get(r)!, b) : b);
  }
  const views: View[] = [{ id: 'spain', label: 'Spain', box: SPAIN_BOX }];
  for (const [id, label] of Object.entries(regions)) {
    const box = boxes.get(id);
    if (box) views.push({ id, label, box });
  }
  const rioja = features.find((f) => f.properties.code === 'DO23');
  if (rioja) views.push({ id: 'rioja-close', label: 'Rioja, in 3D', box: bbox(rioja.geometry), pitch: 60 });
  return views;
}
