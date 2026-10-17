import { describe, expect, it } from 'vitest';
import { validateStyleMin } from '@maplibre/maplibre-gl-style-spec';
import { buildStyle } from '../../src/map/style';
import { mapNameLayers, osmSource } from '../../src/map/mapNames';

// A style MapLibre rejects draws nothing at all, so the whole map, with the place names added after load, must validate.
describe('the map style is valid', () => {
  for (const satellite of [true, false]) {
    it(`with the photo ${satellite ? 'on' : 'off'}`, () => {
      const s = buildStyle({ esriKey: 'k', tiles: true, menu: { satellite, relief: true, boundaries: true, colourBy: 'climate' } });
      s.sources.osm = osmSource();
      s.layers.push(...mapNameLayers(satellite, true));
      expect(validateStyleMin(s)).toEqual([]);
    });
  }
});
