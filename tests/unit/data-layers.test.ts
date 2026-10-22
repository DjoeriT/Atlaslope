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

describe('world background (Natural Earth, Tools/data/build_world.py)', () => {
  const world = read('natural-earth-world.geojson');
  const land = world.features.find((f: any) => f.properties.layer === 'land');
  // Point in polygon on the outer rings: true when some land outline holds the point.
  const onLand = ([x, y]: [number, number]) => land.geometry.coordinates.some((poly: number[][][]) => {
    let inside = false;
    const r = poly[0];
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      if ((r[i][1] > y) !== (r[j][1] > y) && x < ((r[j][0] - r[i][0]) * (y - r[i][1])) / (r[j][1] - r[i][1]) + r[i][0]) inside = !inside;
    }
    return inside;
  });
  it('is one land feature and one border feature, so no box edges show', () => {
    expect(world.features.map((f: any) => f.properties.layer).sort()).toEqual(['border', 'land']);
    expect(land.geometry.type).toBe('MultiPolygon');
  });
  it('has land outside Spain\'s old boxes and keeps Spain and the Canaries', () => {
    const cases: Array<[string, [number, number], boolean]> = [
      ['Madrid', [-3.7, 40.4], true], ['Tenerife', [-16.6, 28.3], true], ['Paris', [2.35, 48.85], true], ['Marrakesh', [-8.0, 31.6], true],
      ['Bordeaux', [-0.58, 44.84], true], ['Denver', [-105.0, 39.7], true], ['Atlantic between the Canaries and Cádiz', [-12, 33], false],
      ['Bay of Biscay', [-5, 45], false],
    ];
    for (const [name, at, want] of cases) expect(onLand(at), name).toBe(want);
  });
  it('has no island inside a lake, since the sea tint cuts out outer rings only (oceanFromLand)', () => {
    const lakes = land.geometry.coordinates.flatMap((poly: number[][][]) => poly.slice(1));
    const inRing = (r: number[][], [x, y]: number[]) => {
      let inside = false;
      for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
        if ((r[i][1] > y) !== (r[j][1] > y) && x < ((r[j][0] - r[i][0]) * (y - r[i][1])) / (r[j][1] - r[i][1]) + r[i][0]) inside = !inside;
      }
      return inside;
    };
    const islands = land.geometry.coordinates.filter((poly: number[][][]) => lakes.some((lake: number[][]) => inRing(lake, poly[0][0])));
    expect(islands).toHaveLength(0);
  });
  it('stays under 1 MB', () => expect(statSync('data/natural-earth-world.geojson').size).toBeLessThan(1_000_000));
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
  const parcels = read('added-parcels.json').places;
  // Portugal's outlines come from the parish lists in its specs (Tools/data/build_pt_areas.py), checked by their own test.
  const pt = Object.keys(read('countries/pt/areas-spec.json')).filter((k) => !k.startsWith('$'));
  it('has one polygon per listed place, built from every listed municipality or parcel', () => {
    expect(added.features.map((f: any) => f.properties.id).sort()).toEqual([...Object.keys(lists), ...Object.keys(parcels), ...pt].sort());
    for (const f of added.features) {
      const id = f.properties.id;
      if (pt.includes(id)) continue;
      if (lists[id]) expect(f.properties.municipalities, id).toBe(lists[id].municipalities.length);
      else expect(f.properties.parcels, id).toBe(parcels[id].parcels.length);
    }
  });
  it('matches the area the Urbezo pliego states (232.02 ha) within 2%', () => {
    const u = added.features.find((f: any) => f.properties.id === 'urbezo');
    expect(Math.abs(u.properties.km2 * 100 - 232.0214) / 232.0214).toBeLessThan(0.02);
  });
  it('matches the area the Cebreros pliego states (1,663.16 km²) within 2%', () => {
    const c = added.features.find((f: any) => f.properties.id === 'cebreros');
    expect(Math.abs(c.properties.km2 - 1663.16) / 1663.16).toBeLessThan(0.02);
  });
});

describe('Portugal outlines', () => {
  const areas = read('countries/pt/areas.geojson').features;
  it('has Douro and its three subregions, which add up to the whole', () => {
    const km2 = (id: string) => areas.find((f: any) => f.properties.id === id)?.properties.km2;
    expect(areas.map((f: any) => f.properties.id).sort()).toEqual(['baixo-corgo', 'cima-corgo', 'douro', 'douro-superior', 'vinho-verde']);
    expect(km2('baixo-corgo') + km2('cima-corgo') + km2('douro-superior')).toBeCloseTo(km2('douro'), 0);
  });
});
