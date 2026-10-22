// Creates the MapLibre map in the shell's #map element and keeps it in step with the menu. No React in here.
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import dopsUrl from '../../data/dops.geojson?url';
import addedUrl from '../../data/added-boundaries.geojson?url';
import landUrl from '../../data/natural-earth-world.geojson?url';
import zonesUrl from '../../data/rioja-zones.geojson?url';
import { ROOT } from '../site';
import { countryConfig } from '../countries';
import overrides from '../../data/dop-overrides.json';
import places from '../../data/places.json';
import type { Overrides } from '../dops';
import { strings } from '../strings';
import type { View } from '../url';
import { buildBoundaries, labelMinZoom, oceanFromLand, type Collection, type PlaceRow } from './boundaries';
import { addedZones, boundsOf, framedFeatures, withZoneIds, type Focus } from './focus';
import { addFlags } from './flags';
import { addLabels, mapName, type Labels } from './labels';
import { TAP_RADIUS_PX, frameBox, nearestPlace, revealBox, revealPadding, zoneVisibility, type Pt, type QuizView, type Shape } from './quiz';
import { basemapPaint, imageryFailed, layerVisibility, reliefExaggeration, type MenuState } from './layers';
import { ESRI_PROTOCOL_TILES, registerImagery } from './imagery';
import { addMapNames, applyMapNames, registerGlyphs } from './mapNames';
import { addBaseMap, applyBaseMap } from './osmBase';
import { SELECTED, buildStyle, esriTemplate } from './style';
import { tilesEnabled } from './tiles';
import { stateSetter } from './terrainCache';
import { loadJson } from './dataFile';
import { cameraEase, flightMs, type Cam } from './flight';
import { motionScale } from '../app/motion';

export interface MapController {
  map: MapLibreMap;
  /** Menu changes and imagery state in; paint and visibility out. */
  apply(menu: MenuState, imagery: boolean): void;
  /** Highlights a place by id (null clears it). */
  select(id: string | null): void;
  /** Shows a card's place: frames it, dims the rest, highlights the selection. The first call keeps a restored view. */
  focus(focus: Focus, animate: boolean): void;
  /** "Reset view": frames the open card again from the start camera (tilted as at launch, north up), whatever the learner did to the map. */
  reset(): void;
  /** Lights up places or zones by id while a card's row or the place under the mouse is hovered; null clears it. Never moves the map. */
  hover(ids: readonly string[] | null): void;
  /** Leaving a guide for the map (owner, 18 Oct 2026: "Fly to Rueda doesn't really fly"): the camera steps back now, under the closing
   *  guide; `land` then flies back in to the very view the learner had, tilted on the relief. */
  swoop(): void;
  land(): void;
  /** Quiz mode: flat, north up, names hidden as asked, taps find the nearest place. Null goes back to Explore. */
  quiz(q: QuizView | null): void;
  remove(): void;
}

export interface MapEvents {
  /** The atlas base is showing because imagery is missing or failed. */
  onImageryFailed(): void;
  /** The boundary or base map files did not load, so there are no places on the map. */
  onDataFailed?(): void;
  /** A boundary was clicked. */
  onPick?(placeId: string): void;
  /** The camera came to rest (also after the first frame), for the address bar. */
  onView?(view: View): void;
}

const asCollection = (u: string): Promise<Collection> => loadJson<Collection>(u);

/** The tilt the map opens with, and goes back to on "Reset view". */
const START_PITCH = 45;


export function createMap(container: HTMLElement, menu: MenuState, events: MapEvents, restored?: View | null, reliefFrom?: number): MapController {
  const esriKey = import.meta.env.VITE_ESRI_API_KEY || undefined;
  const tiles = tilesEnabled();
  const hasImagery = tiles && !!esriKey;
  // If IGN keeps failing, Esri stops skipping Spain and its tiles reload with a new URL.
  const releaseImagery = hasImagery ? registerImagery(esriTemplate(esriKey as string), { onPnoaDown: () => (map.getSource('satellite') as maplibregl.RasterTileSource | undefined)?.setTiles([ESRI_PROTOCOL_TILES(Date.now())]) }) : () => {};
  if (tiles) registerGlyphs(ROOT);
  const map = new maplibregl.Map({
    container,
    style: buildStyle({ esriKey, tiles, menu, reliefFrom }),
    ...(restored ? { center: [restored.lng, restored.lat] as [number, number], zoom: restored.zoom, bearing: restored.bearing } : { bounds: countryConfig(undefined).bounds, fitBoundsOptions: { padding: 40 } }),
    pitch: restored?.pitch ?? START_PITCH,
    maxPitch: 70,
    // Portugal's outlines are built from DGT's CAOP 2025 (CC BY 4.0 asks for the credit; PR #214 review, 22 Oct 2026)
    // France's from INAO's parcel delimitation, which only INAO's own plans bind (decision #58).
    attributionControl: { compact: true, customAttribution: ['Portugal outlines: DGT, CAOP 2025', 'France outlines: INAO, for information'] },
    antialias: true,
  });
  // The credits start folded to their small "i" on every screen (site visual review, 18 Oct 2026): MapLibre only folds them on narrow
  // screens or after the first drag, and leaves a full-width line of grey text over the map on a laptop. One tap opens them. Done
  // before MapLibre fills them: once the box is marked compact, it does not unfold it again on its own.
  const attrib = container.querySelector('.maplibregl-ctrl-attrib');
  attrib?.classList.add('maplibregl-compact');
  attrib?.classList.remove('maplibregl-compact-show');
  let labels: Labels | null = null;
  let selected: string | null = null;
  let boundaries: Collection | null = null;
  let zones: Collection | null = null;
  let want: Focus | null = null;
  let framePending = false;
  let skipFrame = !!restored; // a restored view is not framed over
  let animateFrame = false;
  let landing: { center: maplibregl.LngLat; zoom: number; pitch: number; bearing: number } | null = null; // where a swoop lands
  let resetCamera = false; // the next frame uses the start camera instead of keeping the learner's tilt and turn
  let dimmedRegion: string | null | undefined;
  let selectedZone: string | null = null;
  let current = menu;
  let imagery = hasImagery;
  let quizView: QuizView | null = null;
  let quizSel: string | null = null;
  let quizZoneSel: string | null = null;
  let quizFrame: string | null = null; // the reveal last framed, so a repeat call does not move the camera again
  let beforeQuiz: { pitch: number; bearing: number } | null = null;
  let revealMarks: maplibregl.Marker[] = [];

  const terrain = () => ({ source: 'terrain', exaggeration: reliefExaggeration(map.getZoom()) });
  // The relief height follows the zoom (src/map/layers.ts). MapLibre reads the terrain's exaggeration on every frame, so setting it
  // as the camera moves changes it smoothly; a new setTerrain would rebuild the draped textures on each step.
  map.on('zoom', () => { if (map.terrain) map.terrain.exaggeration = reliefExaggeration(map.getZoom()); });

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
    map.setPaintProperty('borders-casing', 'line-color', p.bordersCasing.color);
    map.setPaintProperty('borders-casing', 'line-opacity', p.bordersCasing.opacity);
    if (map.getLayer('hillshade')) map.setPaintProperty('hillshade', 'hillshade-exaggeration', p.hillshadeExaggeration);
    map.setPaintProperty('dos-fill', 'fill-opacity', p.dosFillOpacity as never);
    map.setPaintProperty('dos-line', 'line-width', p.dosLineWidth as never);
    map.setPaintProperty('dos-line', 'line-opacity', p.dosLineOpacity as never);
    map.setPaintProperty('dos-line', 'line-dasharray', p.dosLineDash);
    const own = ['get', m.colourBy === 'region' ? 'color' : 'climate'];
    const sel = ['boolean', ['feature-state', 'sel'], false];
    map.setPaintProperty('dos-fill', 'fill-color', ['case', sel, SELECTED.fill, own] as never);
    map.setPaintProperty('dos-line', 'line-color', ['case', sel, SELECTED.line, own] as never);
    if (tiles) map.setTerrain(m.relief ? terrain() : null);
    syncNames();
    render();
  };
  const namesShown = () => current.boundaries && !quizView?.hideNames;
  // Place labels follow the boundaries switch; the photo's own names (towns, rivers) stay unless a quiz hides names.
  const syncNames = () => {
    labels?.setVisible(namesShown());
    if (ready) applyMapNames(map, current.satellite && imagery, !quizView?.hideNames);
    if (ready) applyBaseMap(map, !(current.satellite && imagery));
  };
  // With 3D relief on, MapLibre 4.7 caches the flat layers as textures on the terrain and does not redraw them when GeoJSON
  // arrives later, so country borders stayed missing until a menu toggle (#40). Once the world map has loaded, take the terrain
  // off and put it back to rebuild those textures (setting the same terrain again was not enough in a headless check).
  const redrape = () => {
    if (!tiles || !current.relief) return;
    map.setTerrain(null);
    map.setTerrain(terrain());
  };

  map.once('load', () => {
    ready = true;
    if (tiles) addMapNames(map, current.satellite && imagery, !quizView?.hideNames);
    if (tiles) addBaseMap(map, !(current.satellite && imagery));
    apply(current, imagery);
    render();
    const dos = map.getSource('dos') as maplibregl.GeoJSONSource;
    Promise.all([asCollection(dopsUrl), asCollection(addedUrl), asCollection(landUrl), asCollection(zonesUrl)]).then(([dops, added, land, zoneFile]) => {
      boundaries = buildBoundaries(places.places as PlaceRow[], dops, overrides as unknown as Overrides, added);
      const zoneRows = (places.places as PlaceRow[]).filter((p) => p.kind === 'zone');
      const zoneIds = new Map(zoneRows.map((p) => [p.name, p.id]));
      const zoneNames = new Map(zoneRows.map((p) => [p.id, p.name]));
      const rioja = withZoneIds(zoneFile, (name) => zoneIds.get(name));
      zones = { ...rioja, features: [...rioja.features, ...addedZones(added, (id) => zoneNames.get(id))] };
      dos.setData(boundaries as never);
      (map.getSource('zones') as maplibregl.GeoJSONSource).setData(zones as never);
      hovered = []; // new data has no feature state
      hover(hoverWanted);
      (map.getSource('land') as maplibregl.GeoJSONSource).setData(land as never);
      (map.getSource('ocean') as maplibregl.GeoJSONSource).setData(oceanFromLand(land) as never);
      const onLand = (e: maplibregl.MapSourceDataEvent) => {
        if (e.sourceId !== 'land' || !map.isSourceLoaded('land')) return;
        map.off('sourcedata', onLand);
        redrape();
      };
      map.on('sourcedata', onLand);
      labels = addLabels(map, boundaries.features.map((f) => ({
        id: String(f.properties.id), name: String(f.properties.name), kind: String(f.properties.kind),
        at: centerOf(places.places as Array<PlaceRow & { centroid?: [number, number] | null }>, String(f.properties.id)),
        minZoom: labelMinZoom(Number(f.properties.span)),
      })));
      labels.setVisible(namesShown());
      render();
      applyQuiz();
    }).catch(() => events.onDataFailed?.());
  });

  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  // A key-place chip's "Fly to" lands close enough to see the town or the river (flags.ts).
  const flags = addFlags(map, (at) => {
    const from = map.getCenter();
    map.flyTo({ center: at, zoom: 12, easing: cameraEase,
      duration: reduceMotion() ? 0 : flightMs({ lng: from.lng, lat: from.lat, zoom: map.getZoom() }, { lng: at[0], lat: at[1], zoom: 12 }, motionScale()) });
  }, () => labels?.refresh());
  /** Room beside the floating card (a bottom sheet on a narrow screen), as in the approved mock. */
  const padding = () => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    // The visible card: a quiz kept behind an opened place still has its card in the DOM, hidden (PR #63 review).
    const card = [...document.querySelectorAll('.card')].find((c) => c.getClientRects().length > 0)?.getBoundingClientRect();
    // The same breakpoint as the CSS, in em so a larger text setting gets the bottom-sheet layout sooner.
    if (!matchMedia('(max-width: 51.25em) and (orientation: portrait)').matches) return { left: Math.round((card?.right ?? 0) + rem), top: Math.round(rem * 4.6), bottom: Math.round(rem * 1.5), right: Math.round(rem * 5) };
    return { left: Math.round(rem), top: Math.round(rem * 4.6), bottom: Math.round((card ? window.innerHeight - card.top : window.innerHeight * 0.52) + rem), right: Math.round(rem * 4) };
  };
  const setState = stateSetter(map);
  const FRAME_ZOOM = { region: 9, place: 10.5, zone: 10.5 };

  let pin: maplibregl.Marker | null = null;
  let pinKey = '';
  /** The guide's named point gets a labelled pin; any other focus takes it away. */
  function syncPin() {
    const frame = want?.frame;
    const key = want?.pin && frame && 'point' in frame ? `${want.pin}|${frame.point.join(',')}` : '';
    if (key === pinKey) return;
    pinKey = key;
    pin?.remove();
    pin = null;
    if (!key || !want?.pin || !frame || !('point' in frame)) return;
    const el = document.createElement('div');
    el.className = 'flypin';
    el.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.textContent = want.pin;
    el.append(label, document.createElement('i'), document.createElement('b'));
    pin = new maplibregl.Marker({ element: el, anchor: 'bottom', offset: [0, 7] }).setLngLat(frame.point).addTo(map);
  }

  /** Puts the wanted focus on the map. Safe to call early: what needs boundary data waits for it. */
  function render() {
    if (!want || quizView) return;
    syncPin();
    flags.show(want.select);
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
    const animate = animateFrame && !reduceMotion();
    // The camera's time follows the distance it travels, with an ease that starts and lands softly (owner point 8, src/map/flight.ts).
    const here = (): Cam => ({ lng: map.getCenter().lng, lat: map.getCenter().lat, zoom: map.getZoom() });
    const timed = (to: { center?: maplibregl.LngLatLike; zoom?: number } | undefined) => {
      if (!animate || !to?.center || to.zoom === undefined) return animate ? 900 : 0;
      const c = maplibregl.LngLat.convert(to.center);
      return flightMs(here(), { lng: c.lng, lat: c.lat, zoom: to.zoom }, motionScale());
    };
    const duration = animate ? 900 : 0;
    const keep = resetCamera ? { pitch: START_PITCH, bearing: 0, duration } : { pitch: map.getPitch(), bearing: map.getBearing(), duration };
    const fit = (box: maplibregl.LngLatBoundsLike, maxZoom?: number) => {
      const opts = { padding: padding(), bearing: keep.bearing, ...(maxZoom ? { maxZoom } : {}) };
      map.fitBounds(box, { ...keep, ...opts, duration: timed(map.cameraForBounds(box, opts)), easing: cameraEase });
    };
    if (!want.frame) {
      framePending = false;
      fit(want.bounds ?? countryConfig(want.country).bounds);
    } else if ('point' in want.frame) {
      framePending = false;
      const to = { center: want.frame.point, zoom: want.frame.zoom };
      map.flyTo({ ...to, padding: padding(), pitch: keep.pitch, bearing: keep.bearing, duration: animate ? Math.max(1200, timed(to)) : 0, easing: cameraEase });
    } else if (boundaries && zones) {
      framePending = false;
      const box = boundsOf(framedFeatures(want.frame, boundaries, zones));
      if (!box) { // a place with no boundary yet: the view stays where it is, only levelled on a reset
        if (resetCamera) map.easeTo({ pitch: keep.pitch, bearing: keep.bearing, duration });
        resetCamera = false;
        return;
      }
      const kind = 'region' in want.frame ? 'region' : 'place' in want.frame ? 'place' : 'zone';
      fit([[box[0], box[1]], [box[2], box[3]]], FRAME_ZOOM[kind]);
    }
    if (!framePending) resetCamera = false;
  }

  map.on('moveend', () => {
    if (landing) return; // the step back before a fly-in is not a view to keep in the address (PR #95 review)
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
    if (quizView) {
      const id = nearestPlace([e.point.x, e.point.y], shapesOnScreen(), TAP_RADIUS_PX);
      if (id) events.onPick?.(id);
      return;
    }
    const zoneHit = map.getLayoutProperty('zones-fill', 'visibility') === 'visible' ? map.queryRenderedFeatures(e.point, { layers: ['zones-fill'] }) : [];
    const hit = zoneHit[0] ?? (map.getLayer('dos-fill') ? map.queryRenderedFeatures(e.point, { layers: ['dos-fill'] })[0] : undefined);
    const id = hit?.properties?.id;
    if (id) events.onPick?.(String(id));
  });
  map.on('mouseenter', 'dos-fill', () => { map.getCanvas().style.cursor = 'pointer'; });
  map.on('mouseleave', 'dos-fill', () => { map.getCanvas().style.cursor = ''; hover(null); });
  // The place under the mouse lights up as a card's row does (not in the quiz, where the map's look is the question's).
  map.on('mousemove', 'dos-fill', (e) => {
    if (quizView) return;
    const zoneHit = map.getLayoutProperty('zones-fill', 'visibility') === 'visible' ? map.queryRenderedFeatures(e.point, { layers: ['zones-fill'] }) : [];
    const id = (zoneHit[0] ?? e.features?.[0])?.properties?.id;
    hover(id ? [String(id)] : null);
  });

  let hovered: Array<{ source: string; id: string }> = [];
  let hoverWanted: readonly string[] | null = null; // replayed once the boundaries arrive, so an early hover is not lost
  function hover(ids: readonly string[] | null) {
    hoverWanted = ids;
    const next = (quizView ? [] : ids ?? []).flatMap((id) => {
      if (boundaries?.features.some((f) => String(f.properties.id) === id)) return [{ source: 'dos', id }];
      if (zones?.features.some((f) => String(f.properties.id) === id)) return [{ source: 'zones', id }];
      return [];
    });
    const key = (h: { source: string; id: string }) => `${h.source}/${h.id}`;
    if (next.map(key).join() === hovered.map(key).join()) return;
    hovered.forEach((h) => setState(h.source, h.id, { hover: false }));
    hovered = next;
    hovered.forEach((h) => setState(h.source, h.id, { hover: true }));
  }

  /** The places' outlines in screen pixels, for the nearest-place tap. */
  function shapesOnScreen(): Shape[] {
    const project = (c: number[]): Pt => { const p = map.project([c[0], c[1]]); return [p.x, p.y]; };
    // Zones first: inside a zone the tap means the zone, not the DOCa beneath it (ties go to the first).
    const features = [...(map.getLayoutProperty('zones-fill', 'visibility') === 'visible' ? zones?.features ?? [] : []), ...(boundaries?.features ?? [])];
    return features.map((f) => {
      const g = f.geometry as unknown as { type: string; coordinates: number[][][] | number[][][][] };
      const polys = (g.type === 'Polygon' ? [g.coordinates] : g.coordinates) as number[][][][];
      return { id: String(f.properties.id), polygons: polys.map((poly) => poly.map((ring) => ring.map(project))) };
    });
  }

  /** Puts the quiz's view on the map; what needs boundary data waits for it (called again when it arrives). */
  function applyQuiz() {
    const q = quizView;
    if (!q || !ready || !boundaries) return;
    syncNames();
    const keep = q.dimExcept ? new Set(q.dimExcept) : null;
    for (const f of boundaries.features) setState('dos', String(f.properties.id), { dim: !!keep && !keep.has(String(f.properties.id)) });
    if (quizSel && quizSel !== q.select) setState('dos', quizSel, { sel: false });
    quizSel = q.select && boundaries.features.some((f) => f.properties.id === q.select) ? q.select : null;
    if (quizSel) setState('dos', quizSel, { sel: true });
    const zsel = q.select && zones?.features.some((f) => f.properties.id === q.select) ? q.select : null;
    if (quizZoneSel && quizZoneSel !== zsel) setState('zones', quizZoneSel, { sel: false });
    quizZoneSel = zsel;
    if (zsel) setState('zones', zsel, { sel: true });
    for (const id of ['zones-fill', 'zones-line']) if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', zoneVisibility(q));
    const places = [...boundaries.features, ...(zones?.features ?? [])];
    revealMarks.forEach((m) => m.remove());
    revealMarks = [];
    const key = q.frame ? `frame|${q.frame.join(',')}` : q.reveal ? `${q.reveal.answer}|${q.reveal.picked ?? ''}` : '';
    const duration = reduceMotion() ? 0 : 900;
    const flat = { pitch: 0, bearing: 0, duration };
    if (q.reveal) {
      for (const [id, cls, tag] of [[q.reveal.answer, 'answer', strings.quiz.answerTag], [q.reveal.picked, 'miss', strings.quiz.pickTag]] as const) {
        const f = id && places.find((x) => x.properties.id === id);
        const box = f && boundsOf([f]);
        if (!f || !box) continue;
        const el = document.createElement('div');
        el.className = `lbl do quiz-${cls}`;
        el.textContent = mapName(String(f.properties.name));
        el.title = tag;
        el.setAttribute('aria-hidden', 'true');
        revealMarks.push(new maplibregl.Marker({ element: el }).setLngLat([(box[0] + box[2]) / 2, (box[1] + box[3]) / 2]).addTo(map));
      }
    }
    if (key === quizFrame) return;
    quizFrame = key;
    const view = { width: window.innerWidth, height: window.innerHeight };
    // The visible card: a quiz kept behind an opened place still has its card in the DOM, hidden (PR #63 review).
    const card = [...document.querySelectorAll('.card')].find((c) => c.getClientRects().length > 0)?.getBoundingClientRect();
    const box = q.frame ? frameBox(places, q.frame) : q.reveal ? revealBox(places, q.reveal) : null;
    if (box) map.fitBounds([[box[0], box[1]], [box[2], box[3]]], { ...flat, padding: revealPadding(view, card), maxZoom: 8.5 });
    else map.fitBounds(countryConfig(undefined).bounds, { ...flat, padding: padding() }); // Study covers Spain's course only, so far
  }

  function leaveQuiz() {
    revealMarks.forEach((m) => m.remove());
    revealMarks = [];
    if (boundaries) {
      for (const f of boundaries.features) setState('dos', String(f.properties.id), { dim: false });
      if (quizSel) setState('dos', quizSel, { sel: false });
      if (selected) setState('dos', selected, { sel: false });
    }
    if (quizZoneSel) setState('zones', quizZoneSel, { sel: false });
    quizZoneSel = null;
    quizSel = null;
    quizFrame = null;
    selected = null;
    dimmedRegion = undefined;
    syncNames();
    if (beforeQuiz) map.easeTo({ ...beforeQuiz, duration: reduceMotion() ? 0 : 400 });
    beforeQuiz = null;
    if (want) { framePending = true; animateFrame = true; }
    render();
  }

  function focus(f: Focus, animate: boolean, reframe: boolean) {
    want = f;
    if (reframe) {
      landing = null; // a new card frames its own place from wherever the camera is
      resetCamera = false; // a new card keeps the learner's tilt; a reset still pending does not carry over to it
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
    swoop() {
      // a camera still flying to its card has no view of its own to come back to: the frame is left to finish (PR #95 review)
      if (!want || quizView || reduceMotion() || map.isMoving()) return;
      landing = { center: map.getCenter(), zoom: map.getZoom(), pitch: map.getPitch(), bearing: map.getBearing() };
      map.jumpTo({ zoom: Math.max(5.2, landing.zoom - 2.6), pitch: 0 });
    },
    land() {
      const to = landing;
      landing = null;
      if (!to) return;
      const from = map.getCenter();
      map.flyTo({ ...to, easing: cameraEase,
        duration: flightMs({ lng: from.lng, lat: from.lat, zoom: map.getZoom() }, { lng: to.center.lng, lat: to.center.lat, zoom: to.zoom }, motionScale()) });
    },
    hover,
    reset() {
      if (!want || quizView) return;
      resetCamera = true;
      framePending = true;
      skipFrame = false;
      animateFrame = true;
      if (ready) render();
    },
    quiz(q) {
      const was = quizView;
      quizView = q;
      if (q && !was) {
        pin?.remove();
        pin = null;
        pinKey = '';
        flags.show(null);
        hover(null);
        resetCamera = false;
        beforeQuiz = { pitch: map.getPitch(), bearing: map.getBearing() };
        map.easeTo({ pitch: 0, bearing: 0, duration: reduceMotion() ? 0 : 400 });
        // Explore's dimming and selection give way to the quiz's.
        if (boundaries) {
          for (const f of boundaries.features) setState('dos', String(f.properties.id), { dim: false });
          if (selected) setState('dos', selected, { sel: false });
          if (selectedZone) setState('zones', selectedZone, { sel: false });
        }
        selected = null;
        selectedZone = null;
        dimmedRegion = undefined;
      }
      if (!q && was) { if (ready) leaveQuiz(); return; }
      if (q) { syncNames(); applyQuiz(); }
    },
    remove() { releaseImagery(); pin?.remove(); flags.remove(); labels?.remove(); map.remove(); },
  };
}

function centerOf(rows: Array<{ id: string; centroid?: [number, number] | null }>, id: string): [number, number] | null {
  return rows.find((p) => p.id === id)?.centroid ?? null;
}
