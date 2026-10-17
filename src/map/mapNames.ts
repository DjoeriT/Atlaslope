// Names of what the photo shows: towns and villages, rivers and lakes, peaks and main roads, from OpenStreetMap (OpenMapTiles
// schema, served by OpenFreeMap) and set in the app's own fonts (public/glyphs/, built by Tools/glyphs/build_glyphs.mjs).
// They sit under the places' outlines and labels, and hide with them in a quiz that hides names. Terms: data/SOURCES.md.
import maplibregl, { type LayerSpecification, type SourceSpecification } from 'maplibre-gl';

export const OSM_TILEJSON = 'https://tiles.openfreemap.org/planet';
export const OSM_ATTRIBUTION = '<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>';
/** Font stacks built into public/glyphs/; any other stack or range gets an empty answer instead of a 404. */
export const GLYPH_STACKS = ['Plex Sans Regular', 'Plex Sans Medium', 'Plex Sans SemiBold', 'Newsreader Italic', 'Newsreader Medium'];
export const GLYPH_RANGES = ['0-255', '256-511', '8192-8447'];
export const GLYPHS_URL = 'glyphs://{fontstack}/{range}';

export const MAP_NAME_LAYERS = ['osm-water', 'osm-river', 'osm-road', 'osm-peak', 'osm-village', 'osm-town', 'osm-city'] as const;

export function osmSource(): SourceSpecification {
  return { type: 'vector', url: OSM_TILEJSON, attribution: OSM_ATTRIBUTION };
}

/** Colours over the photo (sat) and over the plain atlas. */
export function namePaint(sat: boolean) {
  return {
    text: sat ? '#FFFFFF' : '#2B2420',
    halo: sat ? 'rgba(18,14,12,0.78)' : 'rgba(255,255,255,0.92)',
    water: sat ? '#D6ECF7' : '#2F6A84',
    waterHalo: sat ? 'rgba(10,24,34,0.75)' : 'rgba(255,255,255,0.9)',
    muted: sat ? '#F1ECE4' : '#5A4E46',
  };
}

const NAME = ['coalesce', ['get', 'name'], ['get', 'name_en']] as const;

export function mapNameLayers(sat: boolean, visible: boolean): LayerSpecification[] {
  const p = namePaint(sat);
  const visibility = visible ? 'visible' : 'none';
  const halo = { 'text-halo-color': p.halo, 'text-halo-width': 1.4, 'text-halo-blur': 0.4 };
  return [
    {
      id: 'osm-water', type: 'symbol', source: 'osm', 'source-layer': 'water_name', minzoom: 10,
      filter: ['in', ['get', 'class'], ['literal', ['lake', 'bay', 'strait']]],
      layout: { visibility, 'text-field': NAME, 'text-font': ['Newsreader Italic'], 'text-size': 13, 'text-max-width': 8 },
      paint: { 'text-color': p.water, 'text-halo-color': p.waterHalo, 'text-halo-width': 1.4 },
    },
    {
      id: 'osm-river', type: 'symbol', source: 'osm', 'source-layer': 'waterway', minzoom: 9,
      filter: ['any', ['==', ['get', 'class'], 'river'], ['all', ['>=', ['zoom'], 13], ['in', ['get', 'class'], ['literal', ['stream', 'canal']]]]],
      layout: {
        visibility, 'symbol-placement': 'line', 'symbol-spacing': 400, 'text-field': NAME, 'text-font': ['Newsreader Italic'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 9, 12, 14, 15], 'text-letter-spacing': 0.04, 'text-max-angle': 30,
      },
      paint: { 'text-color': p.water, 'text-halo-color': p.waterHalo, 'text-halo-width': 1.4 },
    },
    {
      id: 'osm-road', type: 'symbol', source: 'osm', 'source-layer': 'transportation_name', minzoom: 11,
      filter: ['all', ['in', ['get', 'class'], ['literal', ['motorway', 'trunk', 'primary']]], ['has', 'ref']],
      layout: {
        visibility, 'symbol-placement': 'line', 'symbol-spacing': 500, 'text-field': ['get', 'ref'], 'text-font': ['Plex Sans Medium'],
        'text-size': 10.5, 'text-letter-spacing': 0.06, 'text-rotation-alignment': 'viewport',
      },
      paint: { 'text-color': p.muted, ...halo, 'text-halo-width': 1.2 },
    },
    {
      id: 'osm-peak', type: 'symbol', source: 'osm', 'source-layer': 'mountain_peak', minzoom: 11,
      filter: ['all', ['==', ['get', 'class'], 'peak'], ['has', 'name']],
      layout: {
        visibility, 'text-field': ['format', NAME, {}, '\n', {}, ['concat', ['to-string', ['get', 'ele']], ' m'], { 'font-scale': 0.85, 'text-font': ['literal', ['Plex Sans Regular']] }],
        'text-font': ['Plex Sans Medium'], 'text-size': 11, 'text-anchor': 'top', 'text-offset': [0, 0.3], 'text-max-width': 8,
      },
      paint: { 'text-color': p.muted, ...halo },
    },
    {
      id: 'osm-village', type: 'symbol', source: 'osm', 'source-layer': 'place', minzoom: 11,
      filter: ['in', ['get', 'class'], ['literal', ['village', 'suburb', 'hamlet']]],
      layout: {
        visibility, 'text-field': NAME, 'text-font': ['Plex Sans Regular'], 'text-max-width': 8,
        'text-size': ['interpolate', ['linear'], ['zoom'], 11, 11, 15, 13.5],
        'symbol-sort-key': ['get', 'rank'],
      },
      paint: { 'text-color': p.text, ...halo },
    },
    {
      id: 'osm-town', type: 'symbol', source: 'osm', 'source-layer': 'place', minzoom: 9,
      filter: ['==', ['get', 'class'], 'town'],
      layout: {
        visibility, 'text-field': NAME, 'text-font': ['Plex Sans Medium'], 'text-max-width': 8,
        'text-size': ['interpolate', ['linear'], ['zoom'], 9, 12, 14, 15.5], 'symbol-sort-key': ['get', 'rank'],
      },
      paint: { 'text-color': p.text, ...halo },
    },
    {
      id: 'osm-city', type: 'symbol', source: 'osm', 'source-layer': 'place', minzoom: 7,
      filter: ['==', ['get', 'class'], 'city'],
      layout: {
        visibility, 'text-field': NAME, 'text-font': ['Plex Sans SemiBold'], 'text-max-width': 8, 'text-letter-spacing': 0.02,
        'text-size': ['interpolate', ['linear'], ['zoom'], 7, 12, 12, 17], 'symbol-sort-key': ['get', 'rank'],
      },
      paint: { 'text-color': p.text, ...halo },
    },
  ] as LayerSpecification[];
}

/** Repaints the names for the photo or the plain atlas and shows or hides them. */
export function applyMapNames(map: maplibregl.Map, sat: boolean, visible: boolean): void {
  for (const layer of mapNameLayers(sat, visible)) {
    if (!map.getLayer(layer.id)) continue;
    map.setLayoutProperty(layer.id, 'visibility', visible ? 'visible' : 'none');
    for (const [k, v] of Object.entries((layer as { paint: Record<string, unknown> }).paint)) map.setPaintProperty(layer.id, k, v);
  }
}

/** The empty glyph answer for a stack or range we did not build: MapLibre draws nothing for those characters. */
function emptyRange(): ArrayBuffer {
  return new ArrayBuffer(0);
}

/** Registers `glyphs://`: our own lettering from public/glyphs/, nothing for anything else. Call once, before the map is made. */
export function registerGlyphs(base: string): void {
  maplibregl.addProtocol('glyphs', async (params, abort) => {
    const [stack, range] = params.url.replace('glyphs://', '').split('/').map(decodeURIComponent);
    const known = GLYPH_STACKS.includes(stack.split(',')[0]) && GLYPH_RANGES.includes(range.replace('.pbf', ''));
    if (!known) return { data: emptyRange() };
    const r = await fetch(`${base}glyphs/${encodeURIComponent(stack.split(',')[0])}/${range}.pbf`, { signal: abort.signal });
    if (!r.ok) return { data: emptyRange() };
    return { data: await r.arrayBuffer() };
  });
}
