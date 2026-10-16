// Base map: satellite imagery, 3D terrain and hillshade, all streamed at view time. Sources and terms: data/SOURCES.md.
import type { StyleSpecification } from 'maplibre-gl';

// EOX Sentinel-2 cloudless 2020, WMTS served as XYZ (note {y} before {x}). [A] not probed from the build container;
// if the path is wrong, this is the one line to fix.
export const EOX_TILES = 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg';
export const EOX_ATTRIBUTION = 'Sentinel-2 cloudless by EOX IT Services GmbH (contains modified Copernicus Sentinel data 2020)';

export const TERRAIN_TILES = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
export const TERRAIN_ATTRIBUTION = 'Terrain: Mapzen, AWS Open Data';

// Close-in imagery: Esri World Imagery through a keyed developer account. Only added when the build has
// VITE_ESRI_API_KEY (see .env.example); without it EOX covers every zoom.
export const ESRI_TILES = 'https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
export const ESRI_ATTRIBUTION = 'Esri, Maxar, Earthstar Geographics, and the GIS User Community';
/** EOX shows up to this zoom; Esri fades in over the zoom before it. */
const HANDOVER: [number, number] = [9, 10];

// Labels need glyphs. OpenFreeMap (already the project's tile provider, free, no key) serves them.
export const GLYPHS = 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf';

export interface BaseOptions {
  fixture: boolean;     // tests: no raster, terrain or glyph requests
  esriKey?: string;     // build-time key for the close-in imagery; empty means EOX only
}

/** The base style. Fixture mode has no remote sources at all, so tests never touch the network. */
export function baseStyle({ fixture, esriKey }: BaseOptions): StyleSpecification {
  if (fixture) {
    return { version: 8, sources: {}, layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#C9D6DB' } }] };
  }
  const style: StyleSpecification = {
    version: 8,
    glyphs: GLYPHS,
    sources: {
      eox: { type: 'raster', tiles: [EOX_TILES], tileSize: 256, maxzoom: 14, attribution: EOX_ATTRIBUTION },
      terrain: { type: 'raster-dem', tiles: [TERRAIN_TILES], tileSize: 256, encoding: 'terrarium', maxzoom: 13, attribution: TERRAIN_ATTRIBUTION },
    },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': '#0b1016' } },
      { id: 'eox', type: 'raster', source: 'eox', ...(esriKey ? { maxzoom: HANDOVER[1] } : {}) },
      {
        id: 'hillshade', type: 'hillshade', source: 'terrain',
        paint: { 'hillshade-exaggeration': 0.25, 'hillshade-shadow-color': '#5A4A3A', 'hillshade-highlight-color': '#FFFFFF', 'hillshade-accent-color': '#8A7A66' },
      },
    ],
  };
  if (esriKey) {
    style.sources.esri = {
      type: 'raster', tiles: [`${ESRI_TILES}?token=${encodeURIComponent(esriKey)}`], tileSize: 256, maxzoom: 18, attribution: ESRI_ATTRIBUTION,
    };
    style.layers.splice(2, 0, {
      id: 'esri', type: 'raster', source: 'esri', minzoom: HANDOVER[0],
      paint: { 'raster-opacity': ['interpolate', ['linear'], ['zoom'], HANDOVER[0], 0, HANDOVER[1], 1] },
    });
  }
  // Slot for a second close-in imagery source: add it here, after Esri and before the hillshade, with its own SOURCES.md row.
  return style;
}

export const TERRAIN = { source: 'terrain', exaggeration: 1.3 };
