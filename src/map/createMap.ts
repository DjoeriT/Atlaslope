// Creates the MapLibre map in the shell's #map element and keeps it in step with the menu. No React in here.
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import dopsUrl from '../../data/dops.geojson?url';
import addedUrl from '../../data/added-boundaries.geojson?url';
import landUrl from '../../data/natural-earth-spain.geojson?url';
import overrides from '../../data/dop-overrides.json';
import places from '../../data/places.json';
import type { Overrides } from '../dops';
import { buildBoundaries, labelMinZoom, oceanFromLand, type Collection, type PlaceRow } from './boundaries';
import { addLabels, type Labels } from './labels';
import { basemapPaint, imageryFailed, layerVisibility, type MenuState } from './layers';
import { TERRAIN_EXAGGERATION, buildStyle } from './style';
import { tilesEnabled } from './tiles';

export interface MapController {
  map: MapLibreMap;
  /** Menu changes and imagery state in; paint and visibility out. */
  apply(menu: MenuState, imagery: boolean): void;
  /** Highlights a place by id (null clears it). */
  select(id: string | null): void;
  remove(): void;
}

export interface MapEvents {
  /** The atlas base is showing because imagery is missing or failed. */
  onImageryFailed(): void;
  /** A boundary was clicked. */
  onPick?(placeId: string): void;
}

const SPAIN_BOUNDS: [[number, number], [number, number]] = [[-9.4, 35.9], [3.4, 43.9]];
const asCollection = (u: string): Promise<Collection> => fetch(u).then((r) => r.json());

export function createMap(container: HTMLElement, menu: MenuState, events: MapEvents): MapController {
  const esriKey = import.meta.env.VITE_ESRI_API_KEY || undefined;
  const tiles = tilesEnabled();
  const hasImagery = tiles && !!esriKey;
  const map = new maplibregl.Map({
    container,
    style: buildStyle({ esriKey, tiles, menu }),
    bounds: SPAIN_BOUNDS,
    fitBoundsOptions: { padding: 40 },
    pitch: 45,
    maxPitch: 70,
    attributionControl: { compact: true },
    antialias: true,
  });
  let labels: Labels | null = null;
  let selected: string | null = null;
  let current = menu;
  let imagery = hasImagery;

  const apply = (m: MenuState, img: boolean) => {
    current = m;
    imagery = img;
    const vis = layerVisibility(m, img);
    const sat = m.satellite && img;
    const p = basemapPaint(sat);
    const set = (id: keyof typeof vis) => map.getLayer(id) && map.setLayoutProperty(id, 'visibility', vis[id]);
    (Object.keys(vis) as Array<keyof typeof vis>).forEach((id) => { if (id !== 'land' && id !== 'ocean' && id !== 'coast' && id !== 'borders') set(id); });
    map.setPaintProperty('ocean', 'fill-color', p.ocean.color);
    map.setPaintProperty('ocean', 'fill-opacity', p.ocean.opacity);
    map.setPaintProperty('coast', 'line-color', p.coast);
    map.setPaintProperty('borders', 'line-color', p.borders);
    if (map.getLayer('hillshade')) map.setPaintProperty('hillshade', 'hillshade-exaggeration', p.hillshadeExaggeration);
    map.setPaintProperty('dos-fill', 'fill-opacity', p.dosFillOpacity as never);
    map.setPaintProperty('dos-line', 'line-width', p.dosLineWidth as never);
    map.setPaintProperty('dos-line', 'line-dasharray', p.dosLineDash);
    if (tiles) map.setTerrain(m.relief ? { source: 'terrain', exaggeration: TERRAIN_EXAGGERATION } : null);
    labels?.setVisible(m.boundaries);
  };

  map.once('load', () => {
    apply(current, imagery);
    const dos = map.getSource('dos') as maplibregl.GeoJSONSource;
    Promise.all([asCollection(dopsUrl), asCollection(addedUrl), asCollection(landUrl)]).then(([dops, added, land]) => {
      const boundaries = buildBoundaries(places.places as PlaceRow[], dops, overrides as unknown as Overrides, added);
      dos.setData(boundaries as never);
      (map.getSource('land') as maplibregl.GeoJSONSource).setData(land as never);
      (map.getSource('ocean') as maplibregl.GeoJSONSource).setData(oceanFromLand(land) as never);
      labels = addLabels(map, boundaries.features.map((f) => ({
        id: String(f.properties.id), name: String(f.properties.name), kind: String(f.properties.kind),
        at: centerOf(places.places as Array<PlaceRow & { centroid?: [number, number] | null }>, String(f.properties.id)),
        minZoom: labelMinZoom(Number(f.properties.span)),
      })));
      labels.setVisible(current.boundaries);
      if (selected) map.setFeatureState({ source: 'dos', id: selected }, { sel: true });
    }).catch(() => { /* data failed to load: the base map stays; nothing to show yet */ });
  });

  // Imagery health: count tile errors and loads for the satellite source only.
  let errors = 0, loaded = 0, reported = false;
  const check = () => {
    if (reported) return;
    if (imageryFailed({ hasKey: hasImagery, errors, loaded })) { reported = true; apply(current, false); events.onImageryFailed(); }
  };
  if (!hasImagery) queueMicrotask(check); // no key, or tiles off: the atlas base and the note from the start
  map.on('error', (e) => { if ((e as { sourceId?: string }).sourceId === 'satellite') { errors++; check(); } });
  map.on('data', (e) => { if (e.dataType === 'source' && (e as { sourceId?: string }).sourceId === 'satellite' && (e as { tile?: unknown }).tile) loaded++; });

  map.on('click', 'dos-fill', (e) => { const id = e.features?.[0]?.properties?.id; if (id) events.onPick?.(String(id)); });
  map.on('mouseenter', 'dos-fill', () => { map.getCanvas().style.cursor = 'pointer'; });
  map.on('mouseleave', 'dos-fill', () => { map.getCanvas().style.cursor = ''; });

  return {
    map,
    apply,
    select(id) {
      if (!map.getSource('dos')) return;
      if (selected) map.setFeatureState({ source: 'dos', id: selected }, { sel: false });
      selected = id;
      if (id) map.setFeatureState({ source: 'dos', id }, { sel: true });
    },
    remove() { labels?.remove(); map.remove(); },
  };
}

function centerOf(rows: Array<{ id: string; centroid?: [number, number] | null }>, id: string): [number, number] | null {
  return rows.find((p) => p.id === id)?.centroid ?? null;
}
