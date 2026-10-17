// Hover on a card's list (a region row, a place row, a zone row) lights those places up on the map (owner card, 17 Oct 2026:
// "highlight only", the map never moves on hover). A tiny channel, so the cards need not thread a callback down to the map.
type Listener = (ids: readonly string[] | null) => void;
const listeners = new Set<Listener>();

/** Lights up these place or zone ids on the map; null clears it. */
export function hoverPlaces(ids: readonly string[] | null): void {
  listeners.forEach((l) => l(ids));
}

export function onHoverPlaces(listener: Listener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Props for a list row: mouse and keyboard focus both light its places up. */
export function hoverProps(ids: () => readonly string[]) {
  const on = () => hoverPlaces(ids());
  const off = () => hoverPlaces(null);
  return { onMouseEnter: on, onMouseLeave: off, onFocus: on, onBlur: off };
}
