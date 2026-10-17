import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildBoundaries, labelMinZoom, oceanFromLand, spanOf, type Collection } from '../../src/map/boundaries';
import { IMAGERY_ERROR_LIMIT, basemapPaint, imageryFailed, layerVisibility } from '../../src/map/layers';
import { NO_REGION_COLOR, REGION_COLORS, regionColor } from '../../src/map/regionColors';
import { buildStyle } from '../../src/map/style';

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
  it('adds the keyed Esri source with a key', () => {
    const s = buildStyle({ esriKey: 'abc', tiles: true, menu: on });
    expect(urls(s)).toContain('ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=abc');
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
      if (p.boundary === 'mapa-2014' || p.boundary === 'added') expect(drawn.has(p.id), p.id).toBe(true);
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
