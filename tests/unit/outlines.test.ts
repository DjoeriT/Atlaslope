import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildBoundaries } from '../../src/map/boundaries';
import { OUTLINES_MIN_ZOOM, countriesInView, countryIndex, countryOf, splitOutlines } from '../../src/map/outlines';
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
  const bounds = Object.fromEntries(Object.values(COUNTRIES).map((c) => [c.id, c.bounds]));
  it('asks for none on a whole-country or cover view', () => {
    expect(countriesInView([[-10, 35], [9, 52]], OUTLINES_MIN_ZOOM - 0.5, bounds)).toEqual([]);
  });
  it('asks for the countries a close view overlaps', () => {
    const bordeaux = countriesInView([[-1.2, 44.6], [-0.2, 45.4]], 9, bounds);
    expect(bordeaux).toContain('france');
    expect(bordeaux).not.toContain('portugal');
    expect(countriesInView([[-8.8, 41], [-7.5, 41.4]], 9, bounds)).toContain('portugal');
  });
});
