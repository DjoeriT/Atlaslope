// Fact markers: a champagne dot with a black ring. Click, Enter or Space (a real button) opens a black card with one sentence of the guide
// and its source; Escape closes it and returns focus to the dot. No React: storyMap.ts owns the markers.
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl';
import { sourceRefs, sources } from '../facts';
import { strings } from '../strings';
import type { LngLat } from './format';

export interface FactView { at: LngLat; label: string; text: string; cite: string[] }

export interface Facts {
  /** Replaces the markers on the map with these. */
  show(facts: readonly FactView[]): void;
  remove(): void;
}

const para = (cls: string, text?: string) => { const p = document.createElement('p'); p.className = cls; if (text) p.textContent = text; return p; };

function sourceLine(cite: string[]): HTMLElement {
  const line = para('fs');
  sourceRefs(cite, sources).forEach((r, i) => {
    if (i > 0) line.append('; ');
    const a = document.createElement('a');
    a.href = r.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.textContent = [r.short, r.pages].filter(Boolean).join(' · ');
    line.append(a);
  });
  return line;
}

export function createFacts(map: MapLibreMap): Facts {
  let marks: maplibregl.Marker[] = [];
  let pop: maplibregl.Popup | null = null;
  let from: HTMLElement | null = null;

  const close = (refocus: boolean) => {
    const p = pop;
    pop = null;
    p?.remove();
    if (p && refocus) from?.focus();
  };
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && pop) { e.preventDefault(); close(true); } }; // handled: the app's own Escape (leave the story) then stays out

  function open(f: FactView, button: HTMLElement) {
    close(false);
    const root = document.createElement('div');
    root.append(para('fw', f.label), para('ft', f.text), sourceLine(f.cite));
    from = button;
    const p = new maplibregl.Popup({ className: 'story-factpop', offset: 16, maxWidth: '15rem', closeButton: true, closeOnClick: true, focusAfterOpen: true })
      .setLngLat(f.at).setDOMContent(root).addTo(map);
    p.on('close', () => { if (pop === p) pop = null; });
    pop = p;
  }

  document.addEventListener('keydown', onKey);
  return {
    show(facts) {
      close(false);
      marks.forEach((m) => m.remove());
      marks = facts.map((f) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'story-fk';
        b.addEventListener('click', (e) => { e.stopPropagation(); open(f, b); });
        const mk = new maplibregl.Marker({ element: b }).setLngLat(f.at).addTo(map);
        b.setAttribute('aria-label', strings.story.factLabel(f.label)); // after addTo: MapLibre sets "Map marker" there
        return mk;
      });
    },
    remove() {
      close(false);
      marks.forEach((m) => m.remove());
      marks = [];
      document.removeEventListener('keydown', onKey);
    },
  };
}
