import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { zoneLabelPoints } from '../../src/story/layers';

// The zone names layer labels each zone once, even where a zone is a MultiPolygon (Rioja Alavesa showed twice).
const zones = JSON.parse(readFileSync('data/rioja-zones.geojson', 'utf8')) as GeoJSON.FeatureCollection;

describe('zoneLabelPoints', () => {
  it('gives one point per zone, inside the zone bounds', () => {
    const pts = zoneLabelPoints(zones);
    expect(pts.features).toHaveLength(zones.features.length);
    const names = pts.features.map((f) => (f.properties as { zone: string }).zone);
    expect(new Set(names).size).toBe(names.length);
    pts.features.forEach((f) => {
      expect(f.geometry.type).toBe('Point');
      const [x, y] = (f.geometry as GeoJSON.Point).coordinates;
      expect(x).toBeGreaterThan(-4); expect(x).toBeLessThan(0);
      expect(y).toBeGreaterThan(41.9); expect(y).toBeLessThan(43);
    });
  });
});
