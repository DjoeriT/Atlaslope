// Entry point: the atlas. Satellite and terrain under the corrected DO layer, a card per DO, search, preset views, theme.
import maplibregl, { type MapGeoJSONFeature } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import dopsUrl from '../data/dops.geojson?url';
import overridesJson from '../data/dop-overrides.json';
import { debugFlags, exposeForTests, loadFixture } from './debug';
import { applyOverrides, type DopProps, type Overrides } from './dops';
import { baseStyle, TERRAIN } from './basemap';
import { neighbourFinder } from './neighbours';
import { bbox, presetViews, REGION_COLOURS, SPAIN_BOX, union, type Box, type View } from './regions';
import { search, type Entry } from './search';
import { cardModel, renderCard } from './card';
import { initTheme } from './theme';

type Layer = { type: 'FeatureCollection'; features: Array<{ type: 'Feature'; properties: Record<string, unknown>; geometry: unknown }> };

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const flags = debugFlags(location.search);
const overrides = overridesJson as unknown as Overrides;
const status = $('status');

initTheme($<HTMLButtonElement>('theme'));

const map = new maplibregl.Map({
  container: 'map',
  style: baseStyle({ fixture: !!flags.fixture, esriKey: import.meta.env.VITE_ESRI_API_KEY }),
  bounds: SPAIN_BOX,
  maxPitch: 75,
  attributionControl: { compact: true },
});
exposeForTests(map);

async function loadLayer(): Promise<Layer> {
  if (flags.fixture) return (await loadFixture(flags.fixture)) as Layer;
  const raw = await (await fetch(dopsUrl)).json();
  return applyOverrides(raw, overrides);
}

// ---------- the DO layer ----------
const colourExpr = ['match', ['get', 'region'], ...Object.entries(REGION_COLOURS).flat(), '#999999'];
const sel = (a: unknown, b: unknown) => ['case', ['boolean', ['feature-state', 'sel'], false], a, b];
const hov = (a: unknown, b: unknown) => ['case', ['boolean', ['feature-state', 'hover'], false], a, b];

function addDoLayers(layer: Layer): void {
  map.addSource('dos', { type: 'geojson', data: layer as never, promoteId: 'code', attribution: 'DO boundaries © MAPA 2014' });
  map.addLayer({ id: 'dos-fill', type: 'fill', source: 'dos', paint: {
    'fill-color': sel('#7A2E3B', colourExpr) as never,
    'fill-opacity': sel(0.6, hov(0.6, 0.42)) as never,
  } });
  map.addLayer({ id: 'dos-line', type: 'line', source: 'dos', paint: {
    'line-color': sel('#7A2E3B', colourExpr) as never,
    'line-width': sel(3, hov(2.4, 1.2)) as never,
  } });
  if (map.getStyle().glyphs) {
    // Labels get their own source: if the glyph server fails, MapLibre drops every tile of the source that needs glyphs,
    // and the DO fills must not go with them.
    map.addSource('dos-labels', { type: 'geojson', data: layer as never });
    map.addLayer({ id: 'dos-label', type: 'symbol', source: 'dos-labels', layout: {
      'text-field': ['get', 'name'], 'text-font': ['Noto Sans Regular'], 'text-size': ['interpolate', ['linear'], ['zoom'], 5, 11, 9, 15],
      'text-allow-overlap': false, 'text-max-width': 8, 'symbol-sort-key': ['match', ['get', 'kind'], 'DOCa', 0, 'DO', 1, 2],
    }, paint: { 'text-color': '#fff', 'text-halo-color': 'rgba(0,0,0,.75)', 'text-halo-width': 1.4 } });
  }
}

// ---------- state ----------
let features: Layer['features'] = [];
let byCode = new Map<string, DopProps>();
let neighboursOf: (code: string) => string[] = () => [];
let selected: string | null = null;
let hovered: string | null = null;

const card = $('card');
const cardBody = $('card-body');

/** Room the card takes, so the map frames a DO beside or above it. */
function padding() {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const r = card.hidden ? null : card.getBoundingClientRect();
  if (window.innerWidth > 820) return { left: Math.round((r ? r.right : 0) + rem), top: Math.round(rem * 4.6), bottom: Math.round(rem * 1.6), right: Math.round(rem * 4.5) };
  return { left: Math.round(rem), top: Math.round(rem * 4.6), bottom: Math.round((r ? r.height : 0) + rem), right: Math.round(rem * 4) };
}

function frame(box: Box, pitch = map.getPitch(), animate = true): void {
  map.fitBounds(box, { padding: padding(), pitch, maxZoom: 11, duration: animate ? 900 : 0 });
}

function setSelected(code: string | null): void {
  if (selected) map.setFeatureState({ source: 'dos', id: selected }, { sel: false });
  selected = code;
  if (code) map.setFeatureState({ source: 'dos', id: code }, { sel: true });
}

function openCard(entry: Entry): void {
  const p = entry.code ? byCode.get(entry.code)! : overrides.missing.find((m) => m.name === entry.name)!;
  const neighbours = entry.code ? neighboursOf(entry.code).map((c) => ({ code: c, name: byCode.get(c)!.name })) : [];
  renderCard(cardBody, cardModel({ ...p, code: entry.code }, overrides.regions, neighbours), (c) => goTo({ code: c, name: byCode.get(c)!.name }, true));
  card.hidden = false;
  document.body.classList.add('card-open');
  setSelected(entry.code ?? null);
}

function closeCard(): void {
  card.hidden = true;
  document.body.classList.remove('card-open');
  setSelected(null);
}

/** Open the card, then move the map so the DO sits clear of it. */
function goTo(entry: Entry, focusCard = false): void {
  openCard(entry);
  const f = entry.code && features.find((x) => x.properties.code === entry.code);
  if (f) frame(bbox(f.geometry));
  if (focusCard) card.focus(); // the card itself, not its close button: an Enter still in flight would press that
}

$('card-close').addEventListener('click', closeCard);
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!$('views-menu').hidden) toggleViews(false);
  else if (!results.hidden) showResults([]);
  else if (!card.hidden) closeCard();
});

// ---------- search ----------
const input = $<HTMLInputElement>('search');
const results = $('search-results');
let entries: Entry[] = [];

function showResults(found: Entry[] | null): void {
  results.replaceChildren();
  if (found === null || (found.length === 0 && !input.value.trim())) {
    results.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    return;
  }
  if (!found.length) results.append(Object.assign(document.createElement('li'), { className: 'empty', textContent: 'No DO by that name' }));
  for (const e of found) {
    const b = document.createElement('button');
    b.type = 'button';
    const p = e.code ? byCode.get(e.code)! : overrides.missing.find((m) => m.name === e.name)!;
    b.append(e.name, Object.assign(document.createElement('small'), { textContent: e.code ? p.kind : `${p.kind}, no boundary yet` }));
    b.addEventListener('click', () => pick(e));
    const li = document.createElement('li');
    li.append(b);
    results.append(li);
  }
  results.hidden = false;
  input.setAttribute('aria-expanded', 'true');
}

function pick(e: Entry): void {
  input.value = e.name;
  showResults(null);
  goTo(e, true);
}

input.addEventListener('input', () => showResults(input.value.trim() ? search(entries, input.value) : null));
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const first = search(entries, input.value)[0];
    if (first) pick(first);
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    results.querySelector('button')?.focus();
  }
});
results.addEventListener('keydown', (e) => {
  const buttons = [...results.querySelectorAll('button')];
  const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
  if (e.key === 'ArrowDown') { e.preventDefault(); buttons[Math.min(i + 1, buttons.length - 1)]?.focus(); }
  if (e.key === 'ArrowUp') { e.preventDefault(); (i <= 0 ? input : buttons[i - 1]).focus(); }
});

// ---------- preset views ----------
const viewsBtn = $<HTMLButtonElement>('views-btn');
const viewsMenu = $('views-menu');
function toggleViews(open = viewsMenu.hidden): void {
  viewsMenu.hidden = !open;
  viewsBtn.setAttribute('aria-expanded', String(open));
  if (open) viewsMenu.querySelector('button')?.focus();
}
viewsBtn.addEventListener('click', () => toggleViews());
function buildViews(views: View[]): void {
  for (const v of views) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = v.label;
    b.addEventListener('click', () => {
      toggleViews(false);
      if (v.id === 'spain') closeCard();
      frame(v.box, v.pitch ?? 0);
    });
    viewsMenu.append(b);
  }
}

// ---------- legend ----------
const legend = document.querySelector('.legend')!;
for (const [id, name] of Object.entries(overrides.regions)) {
  const li = document.createElement('li');
  const swatch = document.createElement('i');
  swatch.style.background = REGION_COLOURS[id];
  li.append(swatch, name);
  legend.append(li);
}

// ---------- map controls ----------
$('zin').addEventListener('click', () => map.zoomIn());
$('zout').addEventListener('click', () => map.zoomOut());
const tilt = $<HTMLButtonElement>('tilt');
const north = $<HTMLButtonElement>('north');
tilt.addEventListener('click', () => map.easeTo({ pitch: map.getPitch() > 10 ? 0 : 60, duration: 900 }));
north.addEventListener('click', () => map.easeTo({ bearing: 0, duration: 600 }));
const syncTilt = () => {
  tilt.setAttribute('aria-pressed', String(map.getPitch() > 10));
  north.hidden = Math.abs(map.getBearing()) < 1;
};
map.on('pitchend', syncTilt);
map.on('rotateend', syncTilt);

// ---------- map events ----------
map.on('click', 'dos-fill', (e) => {
  const code = String((e.features?.[0] as MapGeoJSONFeature).properties.code);
  goTo({ code, name: byCode.get(code)!.name });
});
map.on('mousemove', 'dos-fill', (e) => {
  const code = String(e.features?.[0]?.properties.code);
  if (code === hovered) return;
  if (hovered) map.setFeatureState({ source: 'dos', id: hovered }, { hover: false });
  hovered = code;
  map.setFeatureState({ source: 'dos', id: code }, { hover: true });
  map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'dos-fill', () => {
  if (hovered) map.setFeatureState({ source: 'dos', id: hovered }, { hover: false });
  hovered = null;
  map.getCanvas().style.cursor = '';
});

map.on('load', async () => {
  if (!flags.fixture) {
    map.setTerrain(TERRAIN);
  }
  try {
    const layer = await loadLayer();
    features = layer.features;
    byCode = new Map(features.map((f) => [String(f.properties.code), f.properties as unknown as DopProps]));
    neighboursOf = neighbourFinder(features);
    entries = [
      ...[...byCode.values()].map((p) => ({ name: p.name, code: p.code })),
      ...(flags.fixture ? [] : overrides.missing.map((m) => ({ name: m.name }))),
    ];
    addDoLayers(layer);
    buildViews(flags.fixture ? [{ id: 'spain', label: 'Spain', box: SPAIN_BOX }] : presetViews(features, overrides.regions));
    if (flags.fixture && features.length) frame(features.map((f) => bbox(f.geometry)).reduce(union), 0, false);
    status.textContent = flags.fixture ? `Fixture: ${flags.fixture}` : 'Spain';
  } catch (err) {
    status.textContent = 'The DO layer did not load';
    console.error(err);
  }
  syncTilt();
  map.once('idle', () => { document.body.dataset.ready = 'true'; });
});
