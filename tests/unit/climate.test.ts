import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CLIMATE_GROUPS, NO_CLIMATE_COLOR, climateColor, climateGroupOf } from '../../src/map/climate';
import { buildStyle } from '../../src/map/style';
import { mainGrapes } from '../../src/cards/Cards';

const places = JSON.parse(readFileSync('data/places.json', 'utf8')).places as { id: string; boundary: string }[];
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
    const onMap = places.filter((p) => ['mapa-2014', 'added', 'rioja-zones'].includes(p.boundary));
    for (const p of onMap) expect(codes, p.id).toContain(measures[p.id]?.koppen[0]?.code);
  });
  it('uses six distinct colours, none of them the selection wine', () => {
    const colors = CLIMATE_GROUPS.map((g) => g.color);
    expect(new Set(colors).size).toBe(6);
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
