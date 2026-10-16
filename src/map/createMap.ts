// Creates the MapLibre map in the shell's #map element and keeps it in step with the menu. No React in here.
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import dopsUrl from '../../data/dops.geojson?url';
import addedUrl from '../../data/added-boundaries.geojson?url';
import landUrl from '../../data/natural-earth-spain.geojson?url';
import zonesUrl from '../../data/rioja-zones.geojson?url';
import overrides from '../../data/dop-overrides.json';
import places from '../../data/places.json';
import type { Overrides } from '../dops';
import type { View } from '../url';
import { buildBoundaries, labelMinZoom, oceanFromLand, type Collection, type PlaceRow } from './boundaries';
import { boundsOf, framedFeatures, withZoneIds, type Focus } from './focus';
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
  /** Shows a card's place: frames it, dims the rest, highlights the selection. The first call keeps a restored view. */
  focus(focus: Focus, animate: boolean): void;
  remove(): void;
}

export interface MapEvents {
  /** The atlas base is showing because imagery is missing or failed. */
  onImageryFailed(): void;
  /** A boundary was clicked. */
  onPick?(placeId: string): void;
  /** The camera came to rest (also after the first frame), for the address bar. */
  onView?(view: View): void;
}

const SPAIN_BOUNDS: [[number, number], [number, number]] = [[-9.4, 35.9], [3.4, 43.9]];
const asCollection = (u: string): Promise<Collection> => fetch(u).then((r) => r.json());

export function createMap(container: HTMLElement, menu: MenuState, events: MapEvents, restored?: View | null): MapController {
  const esriKey = import.meta.env.VITE_ESRI_API_KEY || undefined;
  const tiles = tilesEnabled();
  const hasImagery = tiles && !!esriKey;
  const map = new maplibregl.Map({
    container,
    style: buildStyle({ esriKey, tiles, menu }),
    ...(restored ? { center: [restored.lng, restored.lat] as [number, number], zoom: restored.zoom, bearing: restored.bearing } : { bounds: SPAIN_BOUNDS, fitBoundsOptions: { padding: 40 } }),
    pitch: restored?.pitch ?? 45,
    maxPitch: 70,
    attributionControl: { compact: true },
    antialias: true,
  });
  let labels: Labels | null = null;
  let selected: string | null = null;
  let boundaries: Collection | null = null;
  let zones: Collection | null = null;
  let want: Focus | null = null;
  let framePending = false;
  let skipFrame = !!restored; // a restored view is not framed over
  let animateFrame = false;
  let dimmedRegion: string | null | undefined;
  let selectedZone: string | null = null;
  let current = menu;
  let imagery = hasImagery;

  let ready = false; // the style must be loaded before paint or layout can change; until then apply() only remembers
  const apply = (m: MenuState, img: boolean) => {
    current = m;
    imagery = img;
    if (!ready) return;
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
    render();
  };

  map.once('load', () => {
    ready = true;
    apply(current, imagery);
    render();
    const dos = map.getSource('dos') as maplibregl.GeoJSONSource;
    Promise.all([asCollection(dopsUrl), asCollection(addedUrl), asCollection(landUrl), asCollection(zonesUrl)]).then(([dops, added, land, zoneFile]) => {
      boundaries = buildBoundaries(places.places as PlaceRow[], dops, overrides as unknown as Overrides, added);
      const zoneIds = new Map((places.places as PlaceRow[]).filter((p) => p.kind === 'zone').map((p) => [p.name, p.id]));
      zones = withZoneIds(zoneFile, (name) => zoneIds.get(name));
      dos.setData(boundaries as never);
      (map.getSource('zones') as maplibregl.GeoJSONSource).setData(zones as never);
      (map.getSource('land') as maplibregl.GeoJSONSource).setData(land as never);
      (map.getSource('ocean') as maplibregl.GeoJSONSource).setData(oceanFromLand(land) as never);
      labels = addLabels(map, boundaries.features.map((f) => ({
        id: String(f.properties.id), name: String(f.properties.name), kind: String(f.properties.kind),
        at: centerOf(places.places as Array<PlaceRow & { centroid?: [number, number] | null }>, String(f.properties.id)),
        minZoom: labelMinZoom(Number(f.properties.span)),
      })));
      labels.setVisible(current.boundaries);
      render();
    }).catch(() => { /* data failed to load: the base map stays; nothing to show yet */ });
  });

  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  /** Room beside the floating card (a bottom sheet on a narrow screen), as in the approved mock. */
  const padding = () => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const card = document.querySelector('.card')?.getBoundingClientRect();
    if (window.innerWidth > 820) return { left: Math.round((card?.right ?? 0) + rem), top: Math.round(rem * 4.6), bottom: Math.round(rem * 1.5), right: Math.round(rem * 5) };
    return { left: Math.round(rem), top: Math.round(rem * 4.6), bottom: Math.round(window.innerHeight * 0.52 + rem), right: Math.round(rem * 4) };
  };
  const setState = (source: string, id: string, state: Record<string, boolean>) => map.setFeatureState({ source, id }, state);
  const FRAME_ZOOM = { region: 9, place: 10.5, zone: 10.5 };

  /** Puts the wanted focus on the map. Safe to call early: what needs boundary data waits for it. */
  function render() {
    if (!want) return;
    if (boundaries && map.getSource('dos')) {
      if (dimmedRegion !== want.dimRegion) {
        for (const f of boundaries.features) setState('dos', String(f.properties.id), { dim: want.dimRegion !== null && f.properties.region !== want.dimRegion });
        dimmedRegion = want.dimRegion;
      }
      const sel = want.select !== null && boundaries.features.some((f) => f.properties.id === want!.select) ? want.select : null;
      if (selected !== sel) {
        if (selected) setState('dos', selected, { sel: false });
        selected = sel;
        if (sel) setState('dos', sel, { sel: true });
      }
    }
    if (zones) {
      const zsel = want.select !== null && zones.features.some((f) => f.properties.id === want!.select) ? want.select : null;
      if (selectedZone !== zsel) {
        if (selectedZone) setState('zones', selectedZone, { sel: false });
        selectedZone = zsel;
        if (zsel) setState('zones', zsel, { sel: true });
      }
    }
    const zoneVis = want.showZones && current.boundaries ? 'visible' : 'none';
    for (const id of ['zones-fill', 'zones-line']) if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', zoneVis);
    if (!framePending) return;
    const duration = animateFrame && !reduceMotion() ? 700 : 0;
    const keep = { pitch: map.getPitch(), bearing: map.getBearing(), duration };
    if (!want.frame) {
      framePending = false;
      map.fitBounds(SPAIN_BOUNDS, { ...keep, padding: padding() });
    } else if (boundaries && zones) {
      framePending = false;
      const box = boundsOf(framedFeatures(want.frame, boundaries, zones));
      if (!box) return; // a place with no boundary yet: the view stays where it is
      const kind = 'region' in want.frame ? 'region' : 'place' in want.frame ? 'place' : 'zone';
      map.fitBounds([[box[0], box[1]], [box[2], box[3]]], { ...keep, padding: padding(), maxZoom: FRAME_ZOOM[kind] });
    }
  }

  map.on('moveend', () => {
    const c = map.getCenter();
    events.onView?.({ lng: c.lng, lat: c.lat, zoom: map.getZoom(), bearing: map.getBearing(), pitch: map.getPitch() });
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

  // One click handler: a Rioja zone, when the zones are drawn, wins over the DOCa beneath it.
  map.on('click', (e) => {
    const zoneHit = map.getLayoutProperty('zones-fill', 'visibility') === 'visible' ? map.queryRenderedFeatures(e.point, { layers: ['zones-fill'] }) : [];
    const hit = zoneHit[0] ?? (map.getLayer('dos-fill') ? map.queryRenderedFeatures(e.point, { layers: ['dos-fill'] })[0] : undefined);
    const id = hit?.properties?.id;
    if (id) events.onPick?.(String(id));
  });
  map.on('mouseenter', 'dos-fill', () => { map.getCanvas().style.cursor = 'pointer'; });
  map.on('mouseleave', 'dos-fill', () => { map.getCanvas().style.cursor = ''; });

  function focus(f: Focus, animate: boolean, reframe: boolean) {
    want = f;
    if (reframe) {
      framePending = !skipFrame;
      skipFrame = false;
      animateFrame = animate;
    }
    if (ready) render();
  }

  return {
    map,
    apply,
    select(id) {
      focus({ ...(want ?? { frame: null, dimRegion: null, showZones: false }), select: id }, false, false);
    },
    focus(f, animate) { focus(f, animate, true); },
    remove() { labels?.remove(); map.remove(); },
  };
}

function centerOf(rows: Array<{ id: string; centroid?: [number, number] | null }>, id: string): [number, number] | null {
  return rows.find((p) => p.id === id)?.centroid ?? null;
}
