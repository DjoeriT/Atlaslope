// Place names as page elements (Newsreader, screen size, no glyph server: decision #25), hidden when they would overlap.
import maplibregl, { type FilterSpecification, type Map as MapLibreMap, type Marker } from 'maplibre-gl';

/** The map's own town and village names (mapNames.ts), which give way to the wine places' names. */
const TOWN_LAYERS = ['osm-city', 'osm-town', 'osm-village'];

export interface LabelSpec {
  id: string;
  name: string;
  kind: string;
  at: [number, number] | null;
  minZoom: number;
}

export interface Labels {
  setVisible(on: boolean): void;
  remove(): void;
}

/** Collision priority: DOCa first, then the rest. Lower wins. */
const priority = (kind: string) => (kind === 'DOCa' ? 0 : 1);

export function addLabels(map: MapLibreMap, specs: LabelSpec[]): Labels {
  const items: Array<{ marker: Marker; el: HTMLElement; minZoom: number; prio: number }> = [];
  for (const s of specs) {
    if (!s.at) continue;
    const el = document.createElement('div');
    el.className = `lbl do${s.kind === 'DOCa' ? ' docalvl' : ''}`;
    el.textContent = s.name;
    el.setAttribute('aria-hidden', 'true'); // the cards carry the names for screen readers
    items.push({ marker: new maplibregl.Marker({ element: el }).setLngLat(s.at).addTo(map), el, minZoom: s.minZoom, prio: priority(s.kind) });
  }
  let shown = true;
  let kept: DOMRect[] = [];

  const update = () => {
    const z = map.getZoom();
    kept = [];
    const W = window.innerWidth, H = window.innerHeight;
    // The map's own buttons and legend count as taken, so a name never runs under them (site visual review, 18 Oct 2026).
    const chrome = [...document.querySelectorAll('.bottomright, .legend')].map((c) => c.getBoundingClientRect()).filter((r) => r.width > 0);
    const order = items.filter((i) => shown && z >= i.minZoom).sort((a, b) => a.prio - b.prio);
    for (const i of items) i.el.style.visibility = 'hidden';
    for (const { el } of order) {
      el.style.visibility = 'visible';
      const r = el.getBoundingClientRect();
      const off = r.right < 0 || r.left > W || r.bottom < 0 || r.top > H;
      const hit = [...chrome, ...kept].some((k) => !(r.right + 2 < k.left || r.left - 2 > k.right || r.bottom + 1 < k.top || r.top - 1 > k.bottom));
      if (off || hit) el.style.visibility = 'hidden';
      else kept.push(r);
    }
  };
  // Town and village names (mapNames.ts) are drawn by the map itself, so its collision check cannot see these page elements. After
  // each move, a town whose name would touch a wine place's name is left out, so the wine place wins (site visual review, 18 Oct 2026:
  // "Bilbao" under "Bizkaiko Txakolina", "Pago de Otazu" over "Pamplona"). The town name's box is estimated from its length.
  const base = new Map<string, FilterSpecification | undefined>();
  let hiddenKey = '';
  const yieldTowns = () => {
    const layers = TOWN_LAYERS.filter((id) => map.getLayer(id));
    if (layers.length === 0) return;
    for (const id of layers) if (!base.has(id)) base.set(id, map.getFilter(id) as FilterSpecification | undefined);
    const box = map.getCanvasContainer().getBoundingClientRect();
    const hide = new Set<string>();
    if (kept.length > 0) {
      for (const f of map.querySourceFeatures('osm', { sourceLayer: 'place' })) {
        const name = f.properties?.name;
        if (typeof name !== 'string' || hide.has(name) || f.geometry.type !== 'Point') continue;
        const p = map.project(f.geometry.coordinates as [number, number]);
        const x = box.left + p.x, y = box.top + p.y, half = name.length * 3.5 + 4;
        if (kept.some((k) => x + half > k.left && x - half < k.right && y + 9 > k.top && y - 9 < k.bottom)) hide.add(name);
      }
    }
    const key = [...hide].sort().join('|');
    if (key === hiddenKey) return;
    hiddenKey = key;
    for (const id of layers) {
      const own = base.get(id);
      const notHidden: FilterSpecification = ['!', ['in', ['get', 'name'], ['literal', [...hide]]]];
      map.setFilter(id, hide.size === 0 ? own ?? null : own ? ['all', own, notHidden] as FilterSpecification : notHidden);
    }
  };

  map.on('zoom', update);
  map.on('moveend', update);
  map.on('pitchend', update);
  map.on('rotateend', update);
  // After a move, and as the names' tiles arrive. Not on 'idle': with a tile host failing, the map may never go idle.
  let timer = 0;
  const soon = () => { clearTimeout(timer); timer = window.setTimeout(yieldTowns, 250); };
  const onData = (e: maplibregl.MapSourceDataEvent) => { if (e.sourceId === 'osm') soon(); };
  map.on('moveend', soon);
  map.on('sourcedata', onData);
  update();

  return {
    setVisible(on) { shown = on; update(); yieldTowns(); },
    remove() {
      map.off('zoom', update); map.off('moveend', update); map.off('pitchend', update); map.off('rotateend', update); map.off('moveend', soon); map.off('sourcedata', onData);
      clearTimeout(timer);
      items.forEach((i) => i.marker.remove());
    },
  };
}
