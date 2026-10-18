// Key places of the selected region as name chips (owner card 18 Oct 2026, style B; mock https://claude.ai/artifact/UAK5M2TrtMtfupVUfyEaAw).
// Only places an official source names, 3 to 5 a region (content/flags.json). A tap opens the sourced line and a fly-to.
import maplibregl, { type Map as MapLibreMap, type Marker, type Popup } from 'maplibre-gl';
import flagsFile from '../../content/flags.json';
import { sourceRefs, sources, type Cite } from '../facts';
import { strings } from '../strings';

export interface Flag {
  id: string;
  name: string;
  at: [number, number];
  /** One idea each (Review/visual-style.md, Content). */
  lines: string[];
  cite: Cite[];
}

export interface FlagSet {
  places: string[];
  flags: Flag[];
}

export const flagSets = (flagsFile as unknown as { sets: FlagSet[] }).sets;

/** The flags shown while this place is selected: its own set, or none. */
export function flagsFor(placeId: string | null): Flag[] {
  if (!placeId) return [];
  return flagSets.find((s) => s.places.includes(placeId))?.flags ?? [];
}

/** Below this zoom the chips would sit on top of each other and of the place names. */
const MIN_ZOOM = 7;

export interface Flags {
  show(placeId: string | null): void;
  remove(): void;
}

const t = strings.map;

/** `onUpdate` runs after the chips move or hide, so the place names can give way to them again (labels.ts). */
export function addFlags(map: MapLibreMap, fly: (at: [number, number]) => void, onUpdate: () => void): Flags {
  let shownKey = '';
  let chips: Array<{ flag: Flag; el: HTMLButtonElement; marker: Marker }> = [];
  let popup: Popup | null = null;
  let openId: string | null = null;

  const close = (refocus = false) => {
    const chip = chips.find((c) => c.flag.id === openId);
    const p = popup;
    popup = null;
    openId = null;
    p?.remove();
    for (const c of chips) { c.el.classList.remove('open'); c.el.setAttribute('aria-expanded', 'false'); }
    if (refocus) chip?.el.focus();
  };

  const content = (f: Flag) => {
    const box = document.createElement('div');
    box.className = 'flagpop';
    const h = document.createElement('h3');
    h.textContent = f.name;
    const lines = f.lines.map((line) => { const p = document.createElement('p'); p.textContent = line; return p; });
    const src = document.createElement('p');
    src.className = 'src';
    const refs = sourceRefs(f.cite, sources);
    // Two sources with the same short tag (two EU single documents) show their full titles, so the reader can tell them apart.
    const twin = new Set(refs.map((r) => r.short)).size < refs.length;
    refs.forEach((r, i) => {
      if (i > 0) src.append('; ');
      const a = document.createElement('a');
      a.href = r.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = [twin ? r.title : r.short, r.pages].filter(Boolean).join(' · ');
      a.title = r.title;
      src.append(a);
    });
    const go = document.createElement('button');
    go.type = 'button';
    go.className = 'btn primary';
    go.textContent = t.flagFly(f.name);
    go.addEventListener('click', () => { close(); fly(f.at); });
    box.append(h, ...lines, src, go);
    return box;
  };

  const open = (c: (typeof chips)[number]) => {
    if (openId === c.flag.id) { close(); return; }
    close();
    openId = c.flag.id;
    c.el.classList.add('open');
    c.el.setAttribute('aria-expanded', 'true');
    const p = new maplibregl.Popup({ className: 'flagpopup', offset: 22, maxWidth: '18rem', closeButton: true, closeOnClick: true, focusAfterOpen: false })
      .setLngLat(c.flag.at).setDOMContent(content(c.flag)).addTo(map);
    const el = p.getElement();
    const cross = el?.querySelector<HTMLButtonElement>('.maplibregl-popup-close-button');
    cross?.setAttribute('aria-label', t.flagClose);
    // Keyboard: focus goes into the box, and the cross or Escape brings it back to the chip.
    cross?.addEventListener('click', () => c.el.focus());
    el?.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(true); } });
    p.on('close', () => { if (popup === p) close(); });
    popup = p;
    el?.querySelector<HTMLButtonElement>('.btn')?.focus({ preventScroll: true });
  };

  // A chip that would touch an earlier one, the card, the map's own buttons or the map's edge moves just above or below its point; if both are taken too, it is
  // hidden. The file's order is the priority, and the open chip always shows.
  const SHIFTS: Array<[number, number]> = [[0, 0], [0, -36], [0, 36]];
  const update = () => {
    const low = map.getZoom() < MIN_ZOOM;
    const chrome = [...document.querySelectorAll('.bottomright, .legend, .card')].map((c) => c.getBoundingClientRect()).filter((r) => r.width > 0);
    const kept: DOMRect[] = [];
    const box = map.getContainer().getBoundingClientRect();
    const out = (r: DOMRect) => r.left < box.left + 4 || r.right > box.right - 4 || r.top < box.top + 4 || r.bottom > box.bottom - 4;
    const hits = (r: DOMRect) => out(r) || [...chrome, ...kept].some((k) => !(r.right + 4 < k.left || r.left - 4 > k.right || r.bottom + 2 < k.top || r.top - 2 > k.bottom));
    for (const c of chips) {
      c.el.style.visibility = 'visible';
      let placed = false;
      for (const shift of low ? [] : SHIFTS) {
        c.marker.setOffset(shift);
        if (!hits(c.el.getBoundingClientRect())) { placed = true; break; }
      }
      if (!placed && !low && c.flag.id === openId) { c.marker.setOffset(SHIFTS[0]); placed = true; }
      c.el.style.visibility = placed ? 'visible' : 'hidden';
      c.el.tabIndex = placed ? 0 : -1;
      if (placed) kept.push(c.el.getBoundingClientRect());
    }
    onUpdate();
  };

  const clear = () => {
    close();
    chips.forEach((c) => c.marker.remove());
    chips = [];
  };

  // The card opening or the window turning moves no camera, so a resize and every show() re-place the chips too.
  map.on('moveend', update);
  map.on('zoomend', update);
  map.on('resize', update);

  return {
    show(placeId) {
      const flags = flagsFor(placeId);
      const key = flags.map((f) => f.id).join('|');
      if (key === shownKey) { update(); return; }
      shownKey = key;
      clear();
      for (const flag of flags) {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'mapflag';
        el.textContent = flag.name;
        const chip = { flag, el, marker: new maplibregl.Marker({ element: el }).setLngLat(flag.at).addTo(map) };
        // After the marker is made: MapLibre names every marker "Map marker".
        el.setAttribute('aria-label', t.flagLabel(flag.name));
        el.setAttribute('aria-expanded', 'false');
        // The map would also read the click as a tap on the place under the chip.
        el.addEventListener('click', (e) => { e.stopPropagation(); open(chip); });
        chips.push(chip);
      }
      update();
    },
    remove() {
      map.off('moveend', update);
      map.off('zoomend', update);
      map.off('resize', update);
      clear();
    },
  };
}
