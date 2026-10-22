import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildBoundaries, labelMinZoom, oceanFromLand, spanOf, type Collection } from '../../src/map/boundaries';
import { IMAGERY_ERROR_LIMIT, RELIEF_STOPS, basemapPaint, imageryFailed, layerVisibility, reliefExaggeration } from '../../src/map/layers';
import { NO_REGION_COLOR, REGION_COLORS, regionColor } from '../../src/map/regionColors';
import { buildStyle, esriTemplate } from '../../src/map/style';
import { rasterTileSize, tileXYZ } from '../../src/map/imagery';
import { addedZones } from '../../src/map/focus';

const read = (f: string) => JSON.parse(readFileSync(`data/${f}`, 'utf8'));
const on = { satellite: true, relief: true, boundaries: true, colourBy: 'climate' } as const;

describe('layer list per menu state', () => {
  it('shows everything with imagery on', () => {
    const v = layerVisibility(on, true);
    expect(v.satellite).toBe('visible');
    expect(v.hillshade).toBe('visible');
    expect(v['dos-fill']).toBe('visible');
    expect(v['dos-casing']).toBe('visible');
  });
  it('hides imagery and its boundary casing when satellite is off', () => {
    const v = layerVisibility({ ...on, satellite: false }, true);
    expect(v.satellite).toBe('none');
    expect(v['dos-casing']).toBe('none');
    expect(v['dos-fill']).toBe('visible');
  });
  it('hides relief and boundaries on their own', () => {
    expect(layerVisibility({ ...on, relief: false }, true).hillshade).toBe('none');
    const v = layerVisibility({ ...on, boundaries: false }, true);
    expect([v['dos-fill'], v['dos-line'], v['dos-casing']]).toEqual(['none', 'none', 'none']);
  });
  it('shows the atlas base when imagery is unavailable, whatever the menu says', () => {
    const v = layerVisibility(on, false);
    expect(v.satellite).toBe('none');
    expect(v.land).toBe('visible');
  });
  it('puts a halo under country borders, light on the atlas and dark over imagery (#40)', () => {
    const ids = buildStyle({ tiles: false, menu: on }).layers.map((l) => l.id);
    expect(ids.indexOf('borders-casing')).toBe(ids.indexOf('borders') - 1);
    expect(basemapPaint(false).bordersCasing.color).toBe('#FFFFFF');
    expect(basemapPaint(true).bordersCasing.color).not.toBe(basemapPaint(true).borders);
  });
  it('thins the place fills from a region view over the photo, so the land shows, but keeps the Spain-wide look and the atlas', () => {
    const sat = JSON.stringify(basemapPaint(true).dosFillOpacity);
    expect(sat).toMatch(/^\["interpolate",\["linear"\],\["zoom"\],6,.*,9,.*,12,/);
    // Spain-wide (zoom 6 and out) keeps the colours and outlines the owner likes (release 13 values), for every state.
    const at6 = (e: unknown) => JSON.stringify((e as unknown[]).slice(3, 5));
    const sel = ['boolean', ['feature-state', 'sel'], false];
    const hover = ['boolean', ['feature-state', 'hover'], false];
    const dim = ['boolean', ['feature-state', 'dim'], false];
    expect(at6(basemapPaint(true).dosFillOpacity)).toBe(JSON.stringify([6, ['case', sel, 0.82, hover, 0.85, dim, 0.06, 0.6]]));
    expect(at6(basemapPaint(true).dosLineOpacity)).toBe(JSON.stringify([6, ['case', hover, 1, dim, 0.2, 0.7]]));
    expect(at6(basemapPaint(true).dosLineWidth)).toBe(JSON.stringify([6, ['case', sel, 3, hover, 2.8, 1.6]]));
    // The plain atlas keeps its look up to a region view, then thins so the road map shows close in (owner, 18 Oct 2026, point 7).
    expect(at6(basemapPaint(false).dosFillOpacity)).toBe(JSON.stringify([8, ['case', sel, 0.65, hover, 0.85, dim, 0.06, 0.5]]));
  });
  it('raises the relief most Spain-wide and eases it off close in (owner, 18 Oct 2026, point 6)', () => {
    expect(reliefExaggeration(4)).toBe(RELIEF_STOPS[0][1]);
    expect(reliefExaggeration(20)).toBe(RELIEF_STOPS[RELIEF_STOPS.length - 1][1]);
    expect(reliefExaggeration(9)).toBeCloseTo(2.25);
    // Never below the release 22 value of 1.3, and falling as the zoom rises.
    const zooms = [4, 6, 8, 9, 10, 11, 12, 13, 14, 16];
    const ex = zooms.map((z) => reliefExaggeration(z));
    ex.forEach((e, i) => { expect(e).toBeGreaterThan(1.3); if (i) expect(e).toBeLessThanOrEqual(ex[i - 1]); });
  });
  it('draws boundaries stronger over imagery than on the atlas', () => {
    expect(basemapPaint(true).dosFillOpacity).not.toEqual(basemapPaint(false).dosFillOpacity);
    expect(basemapPaint(true).ocean.opacity).toBeLessThan(1);
  });
});

describe('imagery fallback decision', () => {
  it('falls back without a key', () => expect(imageryFailed({ hasKey: false, errors: 0, loaded: 0 })).toBe(true));
  it('waits while imagery is still loading', () => expect(imageryFailed({ hasKey: true, errors: 0, loaded: 0 })).toBe(false));
  it('does not fall back on a few bad tiles once some loaded', () => expect(imageryFailed({ hasKey: true, errors: 10, loaded: 4 })).toBe(false));
  it('falls back when tiles keep failing and none loaded', () => {
    expect(imageryFailed({ hasKey: true, errors: IMAGERY_ERROR_LIMIT - 1, loaded: 0 })).toBe(false);
    expect(imageryFailed({ hasKey: true, errors: IMAGERY_ERROR_LIMIT, loaded: 0 })).toBe(true);
  });
});

describe('style and tile requests', () => {
  const urls = (s: ReturnType<typeof buildStyle>) => JSON.stringify(s.sources);
  it('has no tile source when tiles are off', () => {
    const s = buildStyle({ esriKey: 'k', tiles: false, menu: on });
    expect(urls(s)).not.toMatch(/https?:/);
    expect(s.layers.map((l) => l.id)).not.toContain('satellite');
  });
  it('has terrain but no imagery without a key', () => {
    const s = buildStyle({ tiles: true, menu: on });
    expect(Object.keys(s.sources)).toContain('terrain');
    expect(Object.keys(s.sources)).not.toContain('satellite');
  });
  it('adds Esri and, over it, IGN\'s PNOA photo with a key', () => {
    const s = buildStyle({ esriKey: 'abc', tiles: true, menu: on });
    expect(esriTemplate('abc')).toBe('https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=abc');
    expect(Object.keys(s.sources)).toEqual(expect.arrayContaining(['satellite', 'pnoa']));
    const ids = s.layers.map((l) => l.id);
    expect(ids.indexOf('pnoa')).toBe(ids.indexOf('satellite') + 1);
  });
  it('fetches the next zoom of imagery on 2x screens (sharp, not stretched)', () => {
    expect(rasterTileSize(1)).toBe(256);
    expect(rasterTileSize(2)).toBe(128);
    const s = buildStyle({ esriKey: 'abc', tiles: true, menu: on, dpr: 2 });
    expect((s.sources.satellite as { tileSize: number }).tileSize).toBe(128);
    expect((s.sources.pnoa as { tileSize: number }).tileSize).toBe(128);
  });
  it('reads tile numbers from a protocol URL, with or without a reload marker', () => {
    expect(tileXYZ('esri://12/2010/1490?r=5')).toEqual([12, 2010, 1490]);
    expect(tileXYZ('pnoa://15/16150/12005')).toEqual([15, 16150, 12005]);
  });
});

describe('colour per study region', () => {
  it('gives each of the ten study regions its own colour', () => {
    const regions = read('places.json').courses[0].groups.map((g: { id: string }) => g.id);
    expect(regions).toHaveLength(10);
    const colours = regions.map(regionColor);
    expect(new Set(colours).size).toBe(10);
    expect(colours).not.toContain(NO_REGION_COLOR);
    expect(Object.keys(REGION_COLORS).sort()).toEqual([...regions].sort());
  });
  it('falls back to grey for an unknown region', () => expect(regionColor('nowhere')).toBe(NO_REGION_COLOR));
});

describe('boundaries joined to places', () => {
  const places = read('places.json').places;
  const result = buildBoundaries(places, read('dops.geojson'), read('dop-overrides.json'), read('added-boundaries.geojson'));
  it('draws a coloured polygon for every place with a boundary file', () => {
    const drawn = new Set(result.features.map((f) => f.properties.id));
    for (const p of places) {
      // Zones with an added outline (France's climats) are drawn by the zones source instead (addedZones, src/map/focus.ts).
      if (p.boundary === 'mapa-2014' || p.boundary === 'added') expect(drawn.has(p.id), p.id).toBe(p.kind !== 'zone');
    }
    for (const f of result.features) expect(f.properties.color).toMatch(/^#[0-9A-F]{6}$/);
  });
  it('uses the place id as the feature id, once each', () => {
    const ids = result.features.map((f) => f.properties.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('labels and sea', () => {
  it('names big places first', () => {
    expect(labelMinZoom(2)).toBe(0);
    expect(labelMinZoom(0.7)).toBeLessThan(labelMinZoom(0.2));
  });
  it('measures a span in degrees', () => expect(spanOf({ type: 'Polygon', coordinates: [[[0, 0], [2, 0], [2, 1], [0, 0]]] })).toBe(2));
  it('cuts the land out of the sea', () => {
    const land: Collection = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] } }] };
    const sea = oceanFromLand(land, [[-1, -1, 2, 2], [10, 10, 11, 11]]);
    expect((sea.features[0].geometry.coordinates as unknown[]).length).toBe(2);
    expect((sea.features[1].geometry.coordinates as unknown[]).length).toBe(1);
  });
  it('covers the whole world by default, so the tint has no box edges', () => {
    const land: Collection = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'MultiPolygon', coordinates: [[[[-16, 28], [-15, 28], [-15, 29], [-16, 28]]], [[[100, 10], [101, 10], [101, 11], [100, 10]]]] } },
      { type: 'Feature', properties: { layer: 'border' }, geometry: { type: 'MultiLineString', coordinates: [[[0, 42], [1, 43]]] } }] };
    const sea = oceanFromLand(land);
    expect(sea.features).toHaveLength(1);
    expect((sea.features[0].geometry.coordinates as unknown[][])[0]).toEqual([[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]);
    expect((sea.features[0].geometry.coordinates as unknown[]).length).toBe(3);
  });
});

describe('France zones on the map (#55)', () => {
  it('draws Chablis Premier and Grand Cru and every climat as zones, not as places', () => {
    const places = read('places.json').places as Array<{ id: string; name: string; kind: string }>;
    const names = new Map(places.filter((p) => p.kind === 'zone').map((p) => [p.id, p.name]));
    const zones = addedZones(read('added-boundaries.geojson'), (id) => names.get(id));
    expect(zones).toHaveLength(19);
    expect(zones.find((f) => f.properties.id === 'les-clos')?.properties.name).toBe('Les Clos');
    expect(zones.every((f) => f.properties.zone === f.properties.name)).toBe(true);
  });
});
