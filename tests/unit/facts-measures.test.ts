import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { countryMeasures, regionMeasuresOf } from '../../src/facts';
import type { Place } from '../../src/tree';

const real: Place[] = JSON.parse(readFileSync('data/places.json', 'utf8')).places;

describe('comparison measures', () => {
  it('has a Spain row', () => {
    expect(countryMeasures('spain')!.altitude?.samples).toBeGreaterThan(0);
    expect(countryMeasures('spain')!.koppen.length).toBeGreaterThan(0);
  });
  it('has a France row with Köppen only (its altitude waits for DEM tiles, 23 Oct 2026)', () => {
    expect(countryMeasures('france')!.koppen[0].code).toBe('Cfb');
    expect(countryMeasures('france')!.altitude).toBeUndefined();
  });
  it('has an Italy row with Köppen only, like France', () => {
    expect(countryMeasures('italy')!.koppen[0].code).toBe('Csa');
    expect(countryMeasures('italy')!.altitude).toBeUndefined();
  });
  it('has a row for every study region', () => {
    // Portugal, France and Italy included since 23 Oct 2026 (Tools/data/koppen_country.sh).
    const regions = [...new Set(real.map((p) => p.region))];
    expect(regions.length).toBeGreaterThan(0);
    for (const r of regions) expect(regionMeasuresOf(r)?.altitude.samples, r).toBeGreaterThan(0);
  });
});
