import { readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// The layers built in GitHub Actions by Tools/data/remote_build.sh. Sizes are raw bytes; the 2 MB budget is for compressed transfer.
const read = (f: string) => JSON.parse(readFileSync(`data/${f}`, 'utf8'));

describe('atlas base (Natural Earth)', () => {
  const ne = read('natural-earth-spain.geojson');
  it('has land and borders for the mainland box and land for the Canaries box', () => {
    const keys = new Set(ne.features.map((f: any) => `${f.properties.layer}/${f.properties.box}`));
    for (const k of ['land/main', 'border/main', 'land/canarias']) expect(keys.has(k), k).toBe(true);
  });
  it('stays under 400 KB', () => expect(statSync('data/natural-earth-spain.geojson').size).toBeLessThan(400_000));
});

describe('climate (Köppen-Geiger)', () => {
  const kg = read('koppen-spain.geojson');
  it('names every class and box, and holds Spain\'s main classes', () => {
    for (const f of kg.features) {
      expect(f.properties.code).toMatch(/^[A-E][A-Za-z]{1,2}$/);
      expect(f.properties.name.length).toBeGreaterThan(3);
      expect(['main', 'canarias']).toContain(f.properties.box);
    }
    const codes = new Set(kg.features.map((f: any) => f.properties.code));
    for (const c of ['Csa', 'Csb', 'BSk', 'Cfb']) expect(codes.has(c), c).toBe(true);
  });
  it('stays under 1.2 MB', () => expect(statSync('data/koppen-spain.geojson').size).toBeLessThan(1_200_000));
});

describe('added boundaries', () => {
  const added = read('added-boundaries.geojson');
  const lists = read('added-municipalities.json').places;
  it('has one polygon per listed place, built from every listed municipality', () => {
    expect(added.features.map((f: any) => f.properties.id).sort()).toEqual(Object.keys(lists).sort());
    for (const f of added.features) expect(f.properties.municipalities).toBe(lists[f.properties.id].municipalities.length);
  });
  it('matches the area the Cebreros pliego states (1,663.16 km²) within 2%', () => {
    const c = added.features.find((f: any) => f.properties.id === 'cebreros');
    expect(Math.abs(c.properties.km2 - 1663.16) / 1663.16).toBeLessThan(0.02);
  });
});
