// The DO card: what it says (cardModel) and how it is drawn (renderCard).
import type { Kind } from './dops';

export const KIND_LONG: Record<Kind, string> = {
  DOCa: 'Denominación de Origen Calificada',
  DO: 'Denominación de Origen',
  VC: 'Vino de Calidad con Indicación Geográfica',
  VP: 'Vino de Pago',
};

export interface CardModel {
  name: string;
  level: string;        // "DOCa · Denominación de Origen Calificada"
  region: string;       // long study region name
  neighbours: Array<{ code: string; name: string }>;
  note?: string;        // from the overrides, or "No boundary in the atlas yet" for a polygon-less DOP
}

export const NO_BOUNDARY = 'No boundary in the atlas yet';

export function cardModel(
  p: { name: string; kind: Kind; region: string; note?: string; code?: string },
  regions: Record<string, string>,
  neighbours: Array<{ code: string; name: string }>,
): CardModel {
  const note = p.code ? p.note : [NO_BOUNDARY, p.note].filter(Boolean).join('. ');
  return {
    name: p.name,
    level: `${p.kind} · ${KIND_LONG[p.kind]}`,
    region: regions[p.region] ?? p.region,
    neighbours: [...neighbours].sort((a, b) => a.name.localeCompare(b.name, 'es')),
    ...(note ? { note } : {}),
  };
}

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> = {}, ...kids: (Node | string)[]) => {
  const e = Object.assign(document.createElement(tag), props);
  e.append(...kids);
  return e;
};

/** Fills the card body. `onNeighbour` moves to a neighbour. */
export function renderCard(body: HTMLElement, m: CardModel, onNeighbour: (code: string) => void): void {
  const facts = el('dl', { className: 'facts' },
    el('dt', {}, 'Level'), el('dd', {}, m.level),
    el('dt', {}, 'Study region'), el('dd', {}, m.region));
  const parts: Node[] = [el('h1', { id: 'card-title' }, m.name), facts];
  if (m.note) parts.push(el('p', { className: 'lede' }, m.note));
  if (m.neighbours.length) {
    const list = el('ul', { className: 'chips neighbours', ariaLabel: 'Neighbours' });
    for (const n of m.neighbours) {
      const b = el('button', { type: 'button', className: 'chip' }, n.name);
      b.addEventListener('click', () => onNeighbour(n.code));
      list.append(el('li', {}, b));
    }
    parts.push(el('h3', {}, 'Neighbours'), list);
  }
  body.replaceChildren(...parts);
}
