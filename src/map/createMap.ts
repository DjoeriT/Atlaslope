// Creates the MapLibre map in the shell's #map element and keeps it in step with the menu. No React in here.
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import dopsUrl from '../../data/dops.geojson?url';
import addedUrl from '../../data/added-boundaries.geojson?url';
import landUrl from '../../data/natural-earth-world.geojson?url';
import zonesUrl from '../../data/rioja-zones.geojson?url';
import overrides from '../../data/dop-overrides.json';
import places from '../../data/places.json';
import type { Overrides } from '../dops';
import { strings } from '../strings';
import type { View } from '../url';
import { buildBoundaries, labelMinZoom, oceanFromLand, type Collection, type PlaceRow } from './boundaries';
import { boundsOf, framedFeatures, withZoneIds, type Focus } from './focus';
import { addLabels, type Labels } from './labels';
import { TAP_RADIUS_PX, frameBox, nearestPlace, revealBox, revealPadding, zoneVisibility, type Pt, type QuizView, type Shape } from './quiz';
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

const SPAIN_BOUNDS: [[number, number], [number, number]] = [[-9.4, 35.9], [3.4, 43.9]];
const asCollection = (u: string): Promise<Collection> => fetch(u).then((r) => { if (!r.ok) throw new Error(`${u}: ${r.status}`); return r.json(); });

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
  let quizView: QuizView | null = null;
  let quizSel: string | null = null;
  let quizZoneSel: string | null = null;
  let quizFrame: string | null = null; // the reveal last framed, so a repeat call does not move the camera again
  let beforeQuiz: { pitch: number; bearing: number } | null = null;
  let revealMarks: maplibregl.Marker[] = [];

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
    map.setPaintProperty('dos-line', 'line-dasharray', p.dosLineDash);
    redrape();
    labels?.setVisible(namesShown());
    render();
  };
  const namesShown = () => current.boundaries && !quizView?.hideNames;
  // With 3D relief on, MapLibre 4.7 caches the flat layers as textures on the terrain and does not redraw them after a paint
  // change or late-arriving GeoJSON, so borders stayed missing until a menu toggle (#40). Setting the terrain afresh redraws them.
  const redrape = () => {
    if (!tiles) return;
    map.setTerrain(null);
    if (current.relief) map.setTerrain({ source: 'terrain', exaggeration: TERRAIN_EXAGGERATION });
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
      map.once('idle', redrape);
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
    if (!want || quizView) return;
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
  map.on('mouseleave', 'dos-fill', () => { map.getCanvas().style.cursor = ''; });

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
    labels?.setVisible(namesShown());
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
        el.textContent = String(f.properties.name);
        el.title = tag;
        el.setAttribute('aria-hidden', 'true');
        revealMarks.push(new maplibregl.Marker({ element: el }).setLngLat([(box[0] + box[2]) / 2, (box[1] + box[3]) / 2]).addTo(map));
      }
    }
    if (key === quizFrame) return;
    quizFrame = key;
    const view = { width: window.innerWidth, height: window.innerHeight };
    const card = document.querySelector('.card')?.getBoundingClientRect();
    const box = q.frame ? frameBox(places, q.frame) : q.reveal ? revealBox(places, q.reveal) : null;
    if (box) map.fitBounds([[box[0], box[1]], [box[2], box[3]]], { ...flat, padding: revealPadding(view, card), maxZoom: 8.5 });
    else map.fitBounds(SPAIN_BOUNDS, { ...flat, padding: padding() });
  }

  function leaveQuiz() {
    revealMarks.forEach((m) => m.remove());
    revealMarks = [];
    if (boundaries) {
      for (const f of boundaries.features) setState('dos', String(f.properties.id), { dim: false });
      if (quizSel) setState('dos', quizSel, { sel: false });
      if (selected) setState('dos', selected, { sel: false });
    }
    if (quizZoneSel) map.setFeatureState({ source: 'zones', id: quizZoneSel }, { sel: false });
    quizZoneSel = null;
    quizSel = null;
    quizFrame = null;
    selected = null;
    dimmedRegion = undefined;
    labels?.setVisible(namesShown());
    if (beforeQuiz) map.easeTo({ ...beforeQuiz, duration: reduceMotion() ? 0 : 400 });
    beforeQuiz = null;
    if (want) { framePending = true; animateFrame = true; }
    render();
  }

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
    quiz(q) {
      const was = quizView;
      quizView = q;
      if (q && !was) {
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
      if (q) { labels?.setVisible(namesShown()); applyQuiz(); }
    },
    remove() { labels?.remove(); map.remove(); },
  };
}

function centerOf(rows: Array<{ id: string; centroid?: [number, number] | null }>, id: string): [number, number] | null {
  return rows.find((p) => p.id === id)?.centroid ?? null;
}
