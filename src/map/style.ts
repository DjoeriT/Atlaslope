// The MapLibre style: tile sources (imagery, terrain), the atlas base and the place boundaries. Sources and terms: data/SOURCES.md.
import type { StyleSpecification } from 'maplibre-gl';
import { ESRI_PROTOCOL_TILES, PNOA_ATTRIBUTION, PNOA_MAX_ZOOM, PNOA_MIN_ZOOM, PNOA_PROTOCOL_TILES, rasterTileSize } from './imagery';
import { basemapPaint, layerVisibility, type MenuState } from './layers';
import { GLYPHS_URL } from './mapNames';

// The patterns .github/workflows/live-map-check.yml matches on.
export const ESRI_TILES = 'https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
export const TERRAIN_TILES = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
export const ESRI_ATTRIBUTION = 'Imagery: Esri, Maxar, Earthstar Geographics, and the GIS User Community';
export const TERRAIN_ATTRIBUTION = 'Terrain: Mapzen, AWS Open Data';
export const TERRAIN_EXAGGERATION = 1.3;

/** The keyed Esri tile URL; src/map/imagery.ts fetches it behind the `esri://` protocol. */
export const esriTemplate = (key: string) => `${ESRI_TILES}?token=${encodeURIComponent(key)}`;

export interface StyleOptions {
  /** Build-time Esri key; empty means no imagery source at all (the atlas base and a note). */
  esriKey?: string;
  /** Tests: no tile source of any kind, so no tile request. */
  tiles: boolean;
  menu: MenuState;
  /** Screen pixel ratio; 2x screens get the next zoom of imagery. */
  dpr?: number;
}

const empty = { type: 'FeatureCollection', features: [] } as const;

/** Sources start empty; the app fills the geojson ones once the data files arrive. */
export function buildStyle({ esriKey, tiles, menu, dpr }: StyleOptions): StyleSpecification {
  const imagery = tiles && !!esriKey;
  const sat = menu.satellite && imagery;
  const paint = basemapPaint(sat);
  const vis = layerVisibility(menu, imagery);
  const sources: StyleSpecification['sources'] = {
    land: { type: 'geojson', data: empty as never },
    ocean: { type: 'geojson', data: empty as never },
    dos: { type: 'geojson', data: empty as never, promoteId: 'id' },
    zones: { type: 'geojson', data: empty as never, promoteId: 'id' },
  };
  if (imagery) {
    const tileSize = rasterTileSize(dpr);
    sources.satellite = { type: 'raster', tiles: [ESRI_PROTOCOL_TILES()], tileSize, maxzoom: 18, attribution: ESRI_ATTRIBUTION };
    sources.pnoa = { type: 'raster', tiles: [PNOA_PROTOCOL_TILES], tileSize, minzoom: PNOA_MIN_ZOOM, maxzoom: PNOA_MAX_ZOOM, attribution: PNOA_ATTRIBUTION };
  }
  if (tiles) {
    sources.terrain = { type: 'raster-dem', tiles: [TERRAIN_TILES], tileSize: 256, encoding: 'terrarium', maxzoom: 13, attribution: TERRAIN_ATTRIBUTION };
  }
  const isLand = ['==', ['get', 'layer'], 'land'] as never;
  const isBorder = ['==', ['get', 'layer'], 'border'] as never;
  const layers: StyleSpecification['layers'] = [
    { id: 'bg', type: 'background', paint: { 'background-color': '#C9D6DB' } },
    { id: 'land', type: 'fill', source: 'land', filter: isLand, paint: { 'fill-color': '#EFE9DC' } },
  ];
  if (imagery) {
    const photo = { 'raster-saturation': -0.15, 'raster-contrast': 0.05 };
    layers.push(
      { id: 'satellite', type: 'raster', source: 'satellite', layout: { visibility: vis.satellite }, paint: photo },
      // Spain's own photo over Esri; its tiles are cut to Spain, so Esri shows around it.
      { id: 'pnoa', type: 'raster', source: 'pnoa', layout: { visibility: vis.pnoa }, paint: photo },
    );
  }
  if (tiles) {
    layers.push({
      id: 'hillshade', type: 'hillshade', source: 'terrain', layout: { visibility: vis.hillshade },
      paint: { 'hillshade-exaggeration': paint.hillshadeExaggeration, 'hillshade-shadow-color': '#5A4A3A', 'hillshade-highlight-color': '#FFFFFF', 'hillshade-accent-color': '#8A7A66' },
    });
  }
  layers.push(
    { id: 'ocean', type: 'fill', source: 'ocean', paint: { 'fill-color': paint.ocean.color, 'fill-opacity': paint.ocean.opacity } },
    { id: 'coast', type: 'line', source: 'land', filter: isLand, paint: { 'line-color': paint.coast, 'line-width': ['interpolate', ['linear'], ['zoom'], 5, 1.2, 9, 2], 'line-opacity': 0.9 } },
    {
      id: 'borders-casing', type: 'line', source: 'land', filter: isBorder, layout: { 'line-join': 'round' },
      paint: { 'line-color': paint.bordersCasing.color, 'line-opacity': paint.bordersCasing.opacity, 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 2.5, 9, 4] },
    },
    { id: 'borders', type: 'line', source: 'land', filter: isBorder, paint: { 'line-color': paint.borders, 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 1.1, 9, 1.8], 'line-dasharray': [3, 2] } },
    { id: 'dos-casing', type: 'line', source: 'dos', layout: { visibility: vis['dos-casing'] }, paint: { 'line-color': '#FFFFFF', 'line-width': 3.6, 'line-opacity': 0.55 } },
    {
      id: 'dos-fill', type: 'fill', source: 'dos', layout: { visibility: vis['dos-fill'] },
      paint: { 'fill-color': ['case', ['boolean', ['feature-state', 'sel'], false], '#8C2340', ['get', menu.colourBy === 'region' ? 'color' : 'climate']], 'fill-opacity': paint.dosFillOpacity as never },
    },
    {
      id: 'dos-line', type: 'line', source: 'dos', layout: { visibility: vis['dos-line'] },
      paint: { 'line-color': ['case', ['boolean', ['feature-state', 'sel'], false], '#8C2340', ['get', menu.colourBy === 'region' ? 'color' : 'climate']], 'line-width': paint.dosLineWidth as never, 'line-dasharray': paint.dosLineDash, 'line-opacity': paint.dosLineOpacity as never },
    },
    // The three Rioja zones: hidden until a Rioja card is open (createMap.ts), then drawn over the DOCa.
    {
      id: 'zones-fill', type: 'fill', source: 'zones', layout: { visibility: 'none' },
      paint: { 'fill-color': ['case', ['boolean', ['feature-state', 'sel'], false], '#8C2340', '#AE4656'], 'fill-opacity': ['case', ['boolean', ['feature-state', 'sel'], false], 0.8, ['boolean', ['feature-state', 'hover'], false], 0.6, 0.3] },
    },
    { id: 'zones-line', type: 'line', source: 'zones', layout: { visibility: 'none' }, paint: { 'line-color': '#FFFFFF', 'line-width': 2, 'line-opacity': 0.9 } },
  );
  // The place names (src/map/mapNames.ts) are added once the map has loaded, so a slow or blocked name server never holds it up.
  return { version: 8, sources, layers, ...(tiles ? { glyphs: GLYPHS_URL } : {}) };
}
