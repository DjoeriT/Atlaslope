import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CLIMATE_GROUPS, NO_CLIMATE_COLOR, climateColor, climateGroupOf } from '../../src/map/climate';
import { buildStyle } from '../../src/map/style';
import { mainGrapes } from '../../src/cards/Cards';

const places = JSON.parse(readFileSync('data/places.json', 'utf8')).places as { id: string; boundary: string; parent: string; region: string }[];
const measures = JSON.parse(readFileSync('data/place-measures.json', 'utf8')).places as Record<string, { koppen: { code: string }[] }>;

describe('climate colours', () => {
  it('colours a place by the Köppen class with the largest share', () => {
    expect(climateGroupOf('jumilla')?.id).toBe('steppe'); // BSk 0.99
    expect(climateGroupOf('rias-baixas')?.codes).toContain(measures['rias-baixas'].koppen[0].code);
  });
  it('is grey for a place with no measure', () => {
    expect(climateColor('no-such-place')).toBe(NO_CLIMATE_COLOR);
  });
  it('has a group for every top class measured, so no place on the map is grey', () => {
    const codes = CLIMATE_GROUPS.flatMap((g) => g.codes);
    // Spain, Portugal, France and Italy (measured 23 Oct 2026, Tools/data/koppen_country.sh): every outlined place, zones too.
    const onMap = places.filter((p) => ['mapa-2014', 'added', 'rioja-zones'].includes(p.boundary));
    expect(onMap.filter((p) => p.region.startsWith('fr-')).length).toBeGreaterThan(100);
    expect(onMap.filter((p) => p.region.startsWith('it-')).length).toBe(87);
    for (const p of onMap) expect(codes, p.id).toContain(measures[p.id]?.koppen[0]?.code);
  });
  it('colours the Alpine places Cold', () => {
    expect(climateGroupOf('alto-adige')?.id).toBe('cold'); // Dfb 0.46
    expect(climateGroupOf('valtellina-superiore')?.id).toBe('cold'); // Dfc 0.29
  });
  it('uses seven distinct colours, none of them the selection wine', () => {
    const colors = CLIMATE_GROUPS.map((g) => g.color);
    expect(new Set(colors).size).toBe(7);
    expect(colors).not.toContain('#8C2340');
  });
  it('switches the map to region colours from the menu', () => {
    const fill = (colourBy: 'climate' | 'region') =>
      JSON.stringify(buildStyle({ tiles: false, menu: { satellite: true, relief: true, boundaries: true, colourBy } }).layers.find((l) => l.id === 'dos-fill'));
    expect(fill('climate')).toContain('"climate"');
    expect(fill('region')).toContain('"color"');
  });
});

describe('main grapes on the cards', () => {
  it('counts the first main grape of each fact sheet, most common first, and skips places without one', () => {
    const g = mainGrapes(['rioja', 'ribera-del-duero', 'toro', 'no-such-place'], 3);
    expect(g.length).toBeGreaterThan(0);
    expect(g[0]).toMatch(/Tempranillo|Tinta/);
  });
});
