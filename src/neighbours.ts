// Neighbours: DOs whose polygons touch or overlap. A bounding-box test first, then a real intersection test on the few candidates.
import booleanIntersects from '@turf/boolean-intersects';
import { bbox, type Box } from './regions';

interface Feature { type: 'Feature'; properties: Record<string, unknown>; geometry: unknown }

const overlaps = (a: Box, b: Box) => a[0][0] <= b[1][0] && b[0][0] <= a[1][0] && a[0][1] <= b[1][1] && b[0][1] <= a[1][1];

/** Returns a lookup code -> neighbour codes. Computed per code on first use and cached, so the first paint does not wait for it. */
export function neighbourFinder(features: Feature[]): (code: string) => string[] {
  const boxes = features.map((f) => bbox(f.geometry));
  const cache = new Map<string, string[]>();
  return (code) => {
    if (cache.has(code)) return cache.get(code)!;
    const i = features.findIndex((f) => f.properties.code === code);
    const found: string[] = [];
    if (i >= 0) {
      features.forEach((g, j) => {
        // turf's types want its own Feature type; the shapes are plain GeoJSON.
        if (j !== i && overlaps(boxes[i], boxes[j]) && booleanIntersects(features[i] as never, g as never)) found.push(String(g.properties.code));
      });
    }
    cache.set(code, found);
    return found;
  };
}
