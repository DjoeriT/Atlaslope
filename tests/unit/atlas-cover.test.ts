import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { COVER_PHOTO, coverCounts, liveBounds, liveCountries } from '../../src/cards/atlasCover';
import { COUNTRIES } from '../../src/countries';
import { loadTree } from '../../src/tree';

const tree = loadTree(JSON.parse(readFileSync('data/places.json', 'utf8')));

describe('atlas cover counts', () => {
  it('lists the countries that have places, with places (zones left out) and regions from the tree', () => {
    const live = liveCountries(tree);
    expect(live.map((c) => c.id)).toEqual(['spain']);
    const spain = live[0];
    expect(spain.places).toBe(tree.regionsOf('spain').flatMap((r) => tree.placesInRegion(r.id)).length);
    expect(spain.places).toBeLessThan(tree.places.length); // the zones are not counted
    expect(spain.regions).toBe(tree.regionsOf('spain').length);
  });
  it('sums the closing line over live countries', () => {
    const spain = liveCountries(tree)[0];
    expect(coverCounts(tree, 15)).toEqual({ places: spain.places, regions: spain.regions, tours: 15 });
  });
  it('fits the map to the bounds of the live countries only', () => {
    expect(liveBounds(tree)).toEqual(COUNTRIES.spain.bounds);
  });
  it('names a cover photo that has a checked crop', () => {
    const crops = JSON.parse(readFileSync('src/home/photoCrops.json', 'utf8'));
    expect(crops[COVER_PHOTO]).toBeDefined();
  });
});
