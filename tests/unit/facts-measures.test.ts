import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { countryMeasures, regionMeasuresOf } from '../../src/facts';
import type { Place } from '../../src/tree';

const real: Place[] = JSON.parse(readFileSync('data/places.json', 'utf8')).places;

describe('comparison measures', () => {
  it('has a Spain row', () => {
    expect(countryMeasures('spain')!.altitude.samples).toBeGreaterThan(0);
    expect(countryMeasures('spain')!.koppen.length).toBeGreaterThan(0);
  });
  it('has a row for every study region', () => {
    // Portugal (pilot, 22 Oct 2026): its places have no measures yet; Köppen for Portugal needs the Beck et al. raster, not on this Mac.
    // France, Italy and Germany (pilots, #149): the same, their places are not measured yet.
    const regions = [...new Set(real.filter((p) => p.parent !== 'portugal' && !/^(fr|it|de)-/.test(p.region)).map((p) => p.region))];
    expect(regions.length).toBeGreaterThan(0);
    for (const r of regions) expect(regionMeasuresOf(r)?.altitude.samples, r).toBeGreaterThan(0);
  });
});
