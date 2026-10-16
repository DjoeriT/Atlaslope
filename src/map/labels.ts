// Place names as page elements (Newsreader, screen size, no glyph server: decision #25), hidden when they would overlap.
import maplibregl, { type Map as MapLibreMap, type Marker } from 'maplibre-gl';

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

  const update = () => {
    const z = map.getZoom();
    const kept: DOMRect[] = [];
    const W = window.innerWidth, H = window.innerHeight;
    const order = items.filter((i) => shown && z >= i.minZoom).sort((a, b) => a.prio - b.prio);
    for (const i of items) i.el.style.visibility = 'hidden';
    for (const { el } of order) {
      el.style.visibility = 'visible';
      const r = el.getBoundingClientRect();
      const off = r.right < 0 || r.left > W || r.bottom < 0 || r.top > H;
      const hit = kept.some((k) => !(r.right + 2 < k.left || r.left - 2 > k.right || r.bottom + 1 < k.top || r.top - 1 > k.bottom));
      if (off || hit) el.style.visibility = 'hidden';
      else kept.push(r);
    }
  };
  map.on('zoom', update);
  map.on('moveend', update);
  map.on('pitchend', update);
  map.on('rotateend', update);
  update();

  return {
    setVisible(on) { shown = on; update(); },
    remove() { map.off('zoom', update); map.off('moveend', update); map.off('pitchend', update); map.off('rotateend', update); items.forEach((i) => i.marker.remove()); },
  };
}
