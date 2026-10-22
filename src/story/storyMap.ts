// The story's map: a second instance of the app map (createMap), set for reading: terrain at a fixed x1.5, no boundaries, no scroll
// zoom, the focus outline with the land outside faded, and the camera flown per step (camera.ts). No React in here.
import maplibregl, { type GeoJSONSource, type Map as MapLibreMap } from 'maplibre-gl';
import { createMap } from '../map/createMap';
import { DEFAULT_MENU } from '../map/layers';
import { boundsOf } from '../map/focus';
import type { Collection } from '../map/boundaries';
import { fitView, flyLegs, stripZoomShift, type Cam, type Target } from './camera';
import type { LngLat, Story, StoryStep } from './format';
import { createFacts, type FactView } from './factMarkers';
import { storyLayers } from './layers';
import { GEOLOGY_MINZOOM } from './layerRules';
import { faded, outlined, outside, type Credited } from './view';

/** Terrain height in the story (design choice, stated in the credit line). The app map's own height follows the zoom instead. */
export const STORY_EXAGGERATION = 1.5;
/** The tours open around zoom 6.7, so their relief starts a zoom lower than the atlas's (RELIEF_MIN_ZOOM) and shows at every stop. */
const STORY_RELIEF_FROM = 6;
const CHAMP = '#E9D8B4';
const EMPTY: Collection = { type: 'FeatureCollection', features: [] };

/** What one step puts on the map. */
export interface StopView {
  step: StoryStep;
  target: Target;
  /** A dot at the stop's point (fly stops with a point, unless the step says dot: false). */
  dot?: LngLat;
  markers: Array<{ at: LngLat; label: string }>;
  /** Fact markers: a dot that opens a card with a sentence of the guide and its source. */
  facts: FactView[];
}

export interface StoryMapEvents {
  /** The reader dragged, pinched or zoomed the map. */
  onUserMove(): void;
  /** The camera moved (for the locator). */
  onMove(map: MapLibreMap): void;
  /** The layers on show changed (for the credit line). */
  onLayers(shown: Credited[], imagery: boolean): void;
}

export interface StoryMap {
  map: MapLibreMap;
  show(view: StopView, instant: boolean): void;
  /** The terrain height the reader chose (the mock's x1.5 / x1.3 toggle). */
  setHeight(k: number): void;
  remove(): void;
}

/** Up to about 300 points along the features' outlines (for fitting a view to a place's shape, not its box). */
function outlinePoints(features: Collection['features']): LngLat[] {
  const all: LngLat[] = [];
  const walk = (c: unknown) => {
    if (Array.isArray(c) && typeof c[0] === 'number') all.push([c[0], c[1] as number]);
    else if (Array.isArray(c)) c.forEach(walk);
  };
  features.forEach((f) => walk((f.geometry as { coordinates: unknown }).coordinates));
  const step = Math.max(1, Math.ceil(all.length / 300));
  return all.filter((_, i) => i % step === 0);
}

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function createStoryMap(container: HTMLElement, story: Story, start: Cam, events: StoryMapEvents): StoryMap {
  let imagery = true;
  let lastShown: Credited[] | null = null; // re-sent when the imagery fails, so its credit goes
  const ctl = createMap(container, { ...DEFAULT_MENU, boundaries: false, relief: false }, { onImageryFailed: () => { imagery = false; if (lastShown) events.onLayers(lastShown, false); } },
    { lng: start.center[0], lat: start.center[1], zoom: start.zoom, bearing: start.bearing, pitch: start.pitch }, STORY_RELIEF_FROM);
  const map = ctl.map;
  map.setMaxPitch(80);
  // Speed on a slow link: the relief (terrain and hillshade, about 60 tile requests for the first view) starts after the first picture is drawn.
  map.once('idle', () => ctl.apply({ ...DEFAULT_MENU, boundaries: false }, imagery));
  map.scrollZoom.disable(); // the page scrolls over the map; zoom stays on the buttons and pinch
  map.keyboard.disable();
  map.addControl(new maplibregl.NavigationControl({ showCompass: false, visualizePitch: true }), 'top-right');

  // createMap sets the height by zoom on every zoom and terrain change; these run after its handlers and hold the story's fixed height.
  let height = STORY_EXAGGERATION;
  const holdHeight = () => { if (map.terrain && map.terrain.exaggeration !== height) map.terrain.exaggeration = height; };
  map.on('zoom', holdHeight);
  map.on('terrain', holdHeight);

  const layers = storyLayers();
  const facts = createFacts(map);
  const marks: maplibregl.Marker[] = [];
  let loaded = false;
  let shapes: { places: Collection; zones: Collection } | null = null;
  let current: StopView | null = null;
  let framed = false; // the current view's camera has been set (a bounds view waits for the shapes)
  let flight = 0;

  // The place and zone shapes the app map loads; the story reads them back rather than parsing the files twice.
  const readShapes = () => {
    const dos = map.getSource('dos') as GeoJSONSource | undefined, zones = map.getSource('zones') as GeoJSONSource | undefined;
    if (shapes || !dos || !zones) return;
    void Promise.all([dos.getData(), zones.getData()]).then(([p, z]) => {
      const places = p as unknown as Collection, zoneShapes = z as unknown as Collection;
      if (shapes || !places.features?.length || !zoneShapes.features?.length) return;
      shapes = { places, zones: zoneShapes };
      map.off('sourcedata', onData);
      if (current) { drawFocus(current); if (!framed) show(current, true); }
    });
  };
  const onData = (e: maplibregl.MapSourceDataEvent) => { if ((e.sourceId === 'dos' || e.sourceId === 'zones') && e.isSourceLoaded) readShapes(); };
  map.on('sourcedata', onData);

  const featuresOf = (ids: readonly string[]) => {
    if (!shapes) return [];
    const zoneHits = shapes.zones.features.filter((f) => ids.includes(String(f.properties.id)));
    const placeHits = shapes.places.features.filter((f) => ids.includes(String(f.properties.id)) && !zoneHits.some((z) => z.properties.id === f.properties.id));
    return [...placeHits, ...zoneHits];
  };

  map.once('load', () => {
    loaded = true;
    map.addSource('story-fade', { type: 'geojson', data: EMPTY as never });
    map.addSource('story-focus', { type: 'geojson', data: EMPTY as never });
    // Land outside the focus: black at 25% darkens without shifting the satellite hues (white washed them out in the mock).
    map.addLayer({ id: 'story-fade', type: 'fill', source: 'story-fade', paint: { 'fill-color': '#000000', 'fill-opacity': 0.25, 'fill-antialias': false } });
    // Focus border: 3 px champagne over a 5.5 px black line at 60%.
    map.addLayer({ id: 'story-focus-casing', type: 'line', source: 'story-focus', layout: { 'line-join': 'round' }, paint: { 'line-color': '#000000', 'line-width': 5.5, 'line-opacity': 0.6 } });
    map.addLayer({ id: 'story-focus-line', type: 'line', source: 'story-focus', layout: { 'line-join': 'round' }, paint: { 'line-color': CHAMP, 'line-width': 3 } });
    layers.setup(map, story);
    holdHeight();
    readShapes();
    if (current) show(current, true);
  });

  function drawFocus(v: StopView) {
    if (!loaded || !shapes) return;
    (map.getSource('story-focus') as GeoJSONSource).setData({ type: 'FeatureCollection', features: featuresOf(outlined(v.step.focus)) } as never);
    const fade = featuresOf([faded(v.step.focus)]).map((f) => f.geometry as { type: string; coordinates: unknown });
    (map.getSource('story-fade') as GeoJSONSource).setData((fade.length ? outside(fade) : EMPTY) as never);
  }

  function padding() {
    const r = container.getBoundingClientRect();
    const p = Math.round(Math.min(r.width, r.height) * 0.1);
    // The credit bar covers the foot of the map and the legend line sits at the top, under the stop bar: keep the stop's dot clear of both.
    const bar = (cls: string) => { const e = container.parentElement?.querySelector<HTMLElement>(cls); return e && !e.hidden ? e.offsetHeight : 0; };
    return { top: p + 40 + bar('.story-legend'), bottom: p + Math.max(30, bar('.story-credit') + 12), left: p, right: p + 30 };
  }

  /** The target as a camera; null for a place's bounds before the shapes are in. */
  function camOf(t: Target, geology: boolean): Cam | null {
    const cam = frameOf(t);
    // The MAGNA service draws nothing below its own scale (blank tiles under zoom 10): a geology stop never looks from further out.
    return cam && geology ? { ...cam, zoom: Math.max(cam.zoom, GEOLOGY_MINZOOM) } : cam;
  }

  function frameOf(t: Target): Cam | null {
    if (t.kind === 'view') {
      // The fixed views are tuned for the desktop column; a smaller map (the phone strip) backs off to show the same ground.
      const r = container.getBoundingClientRect();
      const cam = { ...t, zoom: t.zoom + stripZoomShift(r.width, r.height) };
      const pts = t.fit ? outlinePoints(featuresOf([t.fit])) : [];
      // A view that is to show a whole place (the valley overview) backs off, tilt and strip counted, until the place is in.
      return pts.length ? fitView(cam, pts, r.width, r.height, padding()) : cam;
    }
    const box = boundsOf(featuresOf([t.place]));
    if (!box) return null;
    const fit = map.cameraForBounds([[box[0], box[1]], [box[2], box[3]]], { padding: padding() });
    if (!fit?.center || fit.zoom === undefined) return null;
    const c = maplibregl.LngLat.convert(fit.center);
    return { center: [c.lng, c.lat], zoom: fit.zoom + t.zoomShift, pitch: t.pitch, bearing: t.bearing };
  }

  function show(v: StopView, instant: boolean) {
    current = v;
    framed = false;
    if (!loaded) return;
    drawFocus(v);
    marks.splice(0).forEach((m) => m.remove());
    const el = (cls: string, text?: string) => { const d = document.createElement('div'); d.className = cls; if (text) d.textContent = text; d.setAttribute('aria-hidden', 'true'); return d; };
    for (const m of v.markers) marks.push(new maplibregl.Marker({ element: el('story-mk', m.label), anchor: 'left', offset: [16, 0] }).setLngLat(m.at).addTo(map));
    if (v.dot) marks.push(new maplibregl.Marker({ element: el('story-dot') }).setLngLat(v.dot).addTo(map));
    facts.show(v.facts);
    const cam = camOf(v.target, !!v.step.layers?.includes('geology'));
    lastShown = layers.show(map, v, cam);
    events.onLayers(lastShown, imagery);
    if (!cam) return; // framed once the shapes arrive
    framed = true;
    const token = ++flight;
    map.stop();
    if (instant || reduceMotion()) { map.jumpTo(cam); return; } // jumps: first load and reduced motion only
    const c = map.getCenter();
    const legs = flyLegs({ center: [c.lng, c.lat], zoom: map.getZoom(), pitch: map.getPitch(), bearing: map.getBearing() }, cam);
    const fly = (i: number) => {
      const { duration, curve, ...to } = legs[i];
      map.flyTo({ ...to, duration, curve, essential: true });
      if (i + 1 < legs.length) map.once('moveend', () => { if (token === flight) fly(i + 1); });
    };
    fly(0);
  }

  // The reader took the map: drop the pending second leg of a flight so it does not take it back.
  map.on('movestart', (e) => { if ((e as { originalEvent?: unknown }).originalEvent) { flight++; events.onUserMove(); } });
  map.on('move', () => events.onMove(map));

  return {
    map,
    show,
    setHeight(k) { height = k; holdHeight(); },
    remove() { marks.forEach((m) => m.remove()); facts.remove(); layers.remove(); ctl.remove(); },
  };
}

/** A step's view, from the story, its guide stop and the story's named points. */
export function stopView(step: StoryStep, target: Target, stopPoint: LngLat | undefined, named: (name: string) => LngLat | undefined): StopView {
  const markers = (step.markers ?? []).flatMap((m) => {
    const at = typeof m.at === 'string' ? named(m.at) : m.at;
    const label = m.label ?? (typeof m.at === 'string' ? m.at : '');
    return at ? [{ at, label }] : [];
  });
  const facts = (step.facts ?? []).flatMap((f) => {
    const at = typeof f.at === 'string' ? named(f.at) : f.at;
    return at ? [{ at, label: f.label, text: f.text, cite: f.cite }] : [];
  });
  return { step, target, markers, facts, dot: step.dot === false ? undefined : stopPoint };
}
