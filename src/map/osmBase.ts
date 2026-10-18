// The road map under the plain atlas: water, rivers, woods, vineyards, towns' built-up areas, roads and railways, from OpenStreetMap
// (OpenMapTiles schema, served by OpenFreeMap, the same source as the names in src/map/mapNames.ts). With satellite off, close in
// showed only our flat land colour and the shading, which read as a blur (owner, 18 Oct 2026, point 7). It shows only with
// satellite off; over the photo the photo carries all of this itself. Terms: data/SOURCES.md.
import type maplibregl from 'maplibre-gl';
import type { LayerSpecification } from 'maplibre-gl';

export const BASE_MAP_LAYERS = [
  'base-wood', 'base-vineyard', 'base-urban', 'base-water-area', 'base-waterway', 'base-building',
  'base-rail', 'base-road-casing', 'base-road',
] as const;

/** Paper, ink and champagne from Review/visual-style.md, kept quiet so the wine places stay the hero. Vineyards get their own tint. */
export const BASE_COLOURS = {
  wood: '#DCE3CF',
  vineyard: '#E2D3A8',
  urban: '#E4DDD0',
  building: '#D6CCBB',
  water: '#9DBCCB', // the atlas sea (src/map/layers.ts), so lakes and reservoirs read as water
  river: '#7FA6B8',
  rail: '#9A9186',
  casing: '#B9AE9C',
  road: '#FFFFFF',
  major: '#EFE2C4', // motorways and trunk roads: a light champagne with the same casing
};

const roadWidth = (minor: number, major: number) => [
  'interpolate', ['exponential', 1.5], ['zoom'],
  8, ['match', ['get', 'class'], ['motorway', 'trunk'], major * 0.5, minor * 0.3],
  12, ['match', ['get', 'class'], ['motorway', 'trunk'], major, ['primary', 'secondary'], minor * 1.2, minor * 0.7],
  16, ['match', ['get', 'class'], ['motorway', 'trunk'], major * 3.5, ['primary', 'secondary'], minor * 3.5, minor * 2.5],
];

/** Which roads show at a zoom: the main network from a region view, local roads only close in. A filter sees the tile's whole
 * zoom, not the camera's, so the steps are whole zooms. */
const ROADS = ['any',
  ['in', ['get', 'class'], ['literal', ['motorway', 'trunk']]],
  ['all', ['>=', ['zoom'], 9], ['==', ['get', 'class'], 'primary']],
  ['all', ['>=', ['zoom'], 10], ['==', ['get', 'class'], 'secondary']],
  ['all', ['>=', ['zoom'], 12], ['==', ['get', 'class'], 'tertiary']],
  ['all', ['>=', ['zoom'], 13], ['in', ['get', 'class'], ['literal', ['minor', 'service']]]],
];

export function baseMapLayers(visible: boolean): LayerSpecification[] {
  const visibility = visible ? 'visible' : 'none';
  const c = BASE_COLOURS;
  return [
    {
      id: 'base-wood', type: 'fill', source: 'osm', 'source-layer': 'landcover', minzoom: 9,
      filter: ['==', ['get', 'class'], 'wood'],
      layout: { visibility }, paint: { 'fill-color': c.wood, 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 9, 0, 11, 0.8] },
    },
    {
      // A wine atlas shows where the vines are: OSM marks vineyards as farmland of the kind "vineyard".
      id: 'base-vineyard', type: 'fill', source: 'osm', 'source-layer': 'landcover', minzoom: 10,
      filter: ['==', ['get', 'subclass'], 'vineyard'],
      layout: { visibility }, paint: { 'fill-color': c.vineyard, 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0, 12, 0.9] },
    },
    {
      id: 'base-urban', type: 'fill', source: 'osm', 'source-layer': 'landuse', minzoom: 9,
      filter: ['in', ['get', 'class'], ['literal', ['residential', 'commercial', 'industrial', 'retail']]],
      layout: { visibility }, paint: { 'fill-color': c.urban, 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 9, 0, 11, 0.9] },
    },
    {
      id: 'base-water-area', type: 'fill', source: 'osm', 'source-layer': 'water', minzoom: 7,
      filter: ['!=', ['get', 'class'], 'ocean'],
      layout: { visibility }, paint: { 'fill-color': c.water },
    },
    {
      id: 'base-waterway', type: 'line', source: 'osm', 'source-layer': 'waterway', minzoom: 8,
      filter: ['any', ['==', ['get', 'class'], 'river'], ['all', ['>=', ['zoom'], 12], ['in', ['get', 'class'], ['literal', ['stream', 'canal']]]]],
      layout: { visibility, 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': c.river,
        'line-width': ['interpolate', ['exponential', 1.4], ['zoom'], 8, ['match', ['get', 'class'], 'river', 0.8, 0.4], 14, ['match', ['get', 'class'], 'river', 3, 1.2]],
      },
    },
    {
      id: 'base-building', type: 'fill', source: 'osm', 'source-layer': 'building', minzoom: 14,
      layout: { visibility }, paint: { 'fill-color': c.building, 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15, 0.8] },
    },
    {
      id: 'base-rail', type: 'line', source: 'osm', 'source-layer': 'transportation', minzoom: 10,
      filter: ['all', ['==', ['get', 'class'], 'rail'], ['!=', ['get', 'brunnel'], 'tunnel']],
      layout: { visibility },
      paint: { 'line-color': c.rail, 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.6, 15, 1.4], 'line-dasharray': [4, 3] },
    },
    {
      id: 'base-road-casing', type: 'line', source: 'osm', 'source-layer': 'transportation', minzoom: 7,
      filter: ['all', ROADS, ['!=', ['get', 'brunnel'], 'tunnel']],
      layout: { visibility, 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': c.casing, 'line-width': roadWidth(2.6, 3.6), 'line-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.5, 10, 1] },
    },
    {
      id: 'base-road', type: 'line', source: 'osm', 'source-layer': 'transportation', minzoom: 7,
      filter: ['all', ROADS, ['!=', ['get', 'brunnel'], 'tunnel']],
      layout: { visibility, 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': ['match', ['get', 'class'], ['motorway', 'trunk'], c.major, c.road], 'line-width': roadWidth(1.6, 2.4) },
    },
  ] as LayerSpecification[];
}

/**
 * Adds the road map under the shading and the places, after the names have added the `osm` source (src/map/mapNames.ts), so a
 * slow or blocked tile server never holds up the map's first 'load'.
 */
export function addBaseMap(map: maplibregl.Map, visible: boolean): void {
  if (!map.getSource('osm') || map.getLayer(BASE_MAP_LAYERS[0])) return;
  const before = map.getLayer('hillshade') ? 'hillshade' : 'ocean';
  for (const layer of baseMapLayers(visible)) map.addLayer(layer, before);
}

/** Shows the road map with satellite off, hides it over the photo. */
export function applyBaseMap(map: maplibregl.Map, visible: boolean): void {
  for (const id of BASE_MAP_LAYERS) if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
}
