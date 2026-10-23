import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { buildBoundaries } from '../../src/map/boundaries';
import { OUTLINES_MIN_ZOOM, boxOf, boxesOf, countriesInView, countryIndex, countryOf, overviewOf, overviewOutlines, splitOutlines } from '../../src/map/outlines';
import { COUNTRIES, DEFAULT_COUNTRY } from '../../src/countries';

const read = (f: string) => JSON.parse(readFileSync(`data/${f}`, 'utf8'));

describe('per-country outline files', () => {
  const file = read('places.json');
  const added = read('added-boundaries.geojson');
  const parts = splitOutlines(added, file);
  const index = countryIndex(file);

  it('puts every added outline in exactly one country file, unchanged', () => {
    const all = Object.values(parts).flatMap((c) => c.features);
    expect(all.length).toBe(added.features.length);
    expect(new Set(all)).toEqual(new Set(added.features));
  });

  it("puts each outline in its place's own country", () => {
    for (const [country, c] of Object.entries(parts)) {
      for (const f of c.features) expect(countryOf(index, String(f.properties.id)), String(f.properties.id)).toBe(country);
    }
  });

  it('has a file for every country with added outlines, and only countries the app knows', () => {
    for (const id of Object.keys(parts)) expect(COUNTRIES[id], id).toBeDefined();
    for (const c of file.courses) expect(parts[c.country]?.features.length ?? 0, c.country).toBeGreaterThan(0);
  });

  it('draws the same places from all country files as from the whole file', () => {
    const merged = { type: 'FeatureCollection' as const, features: Object.values(parts).flatMap((c) => c.features) };
    const ids = (a: typeof added) => buildBoundaries(file.places, read('dops.geojson'), read('dop-overrides.json'), a).features.map((f) => f.properties.id).sort();
    expect(ids(merged)).toEqual(ids(added));
  });

  it('keeps an outline whose place has no country with the default country', () => {
    const stray = { type: 'Feature' as const, properties: { id: 'nowhere' }, geometry: { type: 'Point', coordinates: [0, 0] } };
    const out = splitOutlines({ type: 'FeatureCollection', features: [stray] }, file);
    expect(out[DEFAULT_COUNTRY].features).toEqual([stray]);
  });

  it('frames a region or a place in its own country', () => {
    expect(countryOf(index, 'pauillac')).toBe('france');
    expect(countryOf(index, 'douro')).toBe('portugal');
    expect(countryOf(index, 'rioja')).toBe('spain');
  });
});

describe('countries the view reaches', () => {
  const parts = splitOutlines(read('added-boundaries.geojson'), read('places.json'));
  const files = Object.fromEntries(Object.entries(parts).map(([c, fc]) => [c, { url: c, boxes: boxesOf(fc) }]));
  it('asks for none on a whole-country or cover view', () => {
    expect(countriesInView([-10, 35, 9, 52], OUTLINES_MIN_ZOOM - 0.5, files)).toEqual([]);
  });
  it('asks for the countries whose outlines a close view reaches, and not the others', () => {
    expect(countriesInView([-1.2, 44.6, -0.2, 45.4], 9, files)).toEqual(['france']); // the Médoc
    expect(countriesInView([-8.8, 41, -7.5, 41.4], 9, files)).toContain('portugal'); // the Douro
    expect(countriesInView([-11, 41, -4.5, 43.8], 7, files)).not.toContain('france'); // Galicia
    expect(countriesInView([-2.9, 42.3, -1.8, 42.7], 9, files)).not.toContain('france'); // Rioja, inside the box around all of France
  });
  it('boxes nothing for no outlines', () => expect(boxOf({ type: 'FeatureCollection', features: [] })).toBeNull());
});

describe('the overview from above', () => {
  const file = read('places.json');
  const parts = splitOutlines(read('added-boundaries.geojson'), file);
  const overview = overviewOutlines(parts, file);
  const ids = new Set(overview.features.map((f) => String(f.properties.id)));
  const zones = new Set(file.places.filter((p: { kind: string }) => p.kind === 'zone').map((p: { id: string }) => p.id));

  it('has every place of every other country, and no zone', () => {
    const want = Object.entries(parts).filter(([c]) => c !== DEFAULT_COUNTRY).flatMap(([, fc]) => fc.features)
      .map((f) => String(f.properties.id)).filter((id) => !zones.has(id));
    expect(want.length).toBeGreaterThan(0);
    expect(ids).toEqual(new Set(want));
    expect(parts[DEFAULT_COUNTRY].features.some((f) => ids.has(String(f.properties.id)))).toBe(false);
  });
  it('keeps every place drawable: polygons with at least one closed ring of 4 points', () => {
    for (const f of overview.features) {
      const polys = (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates) as number[][][][];
      expect(polys.length, String(f.properties.id)).toBeGreaterThan(0);
      for (const p of polys) for (const r of p) expect(r.length).toBeGreaterThanOrEqual(4);
    }
  });
  it('stays close to the full outline: each place keeps its box within 0.05 degrees', () => {
    const full = new Map(Object.values(parts).flatMap((c) => c.features).map((f) => [String(f.properties.id), f]));
    for (const f of overview.features) {
      const a = boxOf({ type: 'FeatureCollection', features: [full.get(String(f.properties.id)) as never] }) as number[];
      const b = boxOf({ type: 'FeatureCollection', features: [f] }) as number[];
      // the biggest piece is kept, so a place made of far-apart small pieces may shrink; it never grows
      expect(b[0], String(f.properties.id)).toBeGreaterThanOrEqual(a[0] - 0.05);
      expect(b[2], String(f.properties.id)).toBeLessThanOrEqual(a[2] + 0.05);
    }
  });
  it('is light: under 50 KB gzipped for all other countries (part of the first load, decision #38)', () => {
    expect(gzipSync(JSON.stringify(overview), { level: 9 }).length).toBeLessThan(50_000);
  });
  it('drops small pieces and holes but never a whole place', () => {
    const square = (x: number, y: number, d: number) => [[x, y], [x + d, y], [x + d, y + d], [x, y + d], [x, y]];
    const tiny: never = { type: 'Feature', properties: { id: 'a' }, geometry: { type: 'MultiPolygon', coordinates: [[square(0, 0, 0.001)], [square(1, 1, 0.002)]] } } as never;
    const big: never = { type: 'Feature', properties: { id: 'b' }, geometry: { type: 'Polygon', coordinates: [square(0, 0, 1), square(0.5, 0.5, 0.001)] } } as never;
    const [a, b] = overviewOf({ type: 'FeatureCollection', features: [tiny, big] }).features;
    expect(a.geometry.coordinates).toHaveLength(1); // only the biggest of two specks
    expect(b.geometry.coordinates).toHaveLength(1); // the speck of a hole is gone
  });
});
