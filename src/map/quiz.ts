// The map in quiz mode: what the quiz asks of it, how a tap finds a place, and where a revealed answer is framed. Pure; createMap.ts applies it.
import type { Box, Collection } from './boundaries';
import { boundsOf } from './focus';

export interface QuizView {
  /** Place names are hidden (rivers and towns stay). */
  hideNames: boolean;
  /** Place ids kept bright; every other place is dimmed. Null: nothing dimmed. */
  dimExcept: string[] | null;
  /** The highlighted place id. */
  select: string | null;
  /** The answer, framed and named; with the learner's wrong pick, if any. */
  reveal: { answer: string; picked?: string } | null;
}

/** How far outside a boundary a tap still counts: half of a 44 px square. */
export const TAP_RADIUS_PX = 22;

export type Pt = [number, number];
/** A place's outline in screen pixels: polygons, each a list of rings. */
export interface Shape { id: string; polygons: Pt[][][] }

function inRing(p: Pt, ring: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function toSegment(p: Pt, a: Pt, b: Pt): number {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

/** Pixels from a point to a shape: 0 inside, else the distance to the nearest edge. */
export function distanceToShape(p: Pt, shape: Shape): number {
  let best = Infinity;
  for (const poly of shape.polygons) {
    if (poly[0] && inRing(p, poly[0]) && !poly.slice(1).some((hole) => inRing(p, hole))) return 0;
    for (const ring of poly) for (let i = 1; i < ring.length; i++) best = Math.min(best, toSegment(p, ring[i - 1], ring[i]));
  }
  return best;
}

/** The place a tap means: the nearest one within `radius` pixels of its boundary (inside counts as 0), or null. */
export function nearestPlace(p: Pt, shapes: Shape[], radius = TAP_RADIUS_PX): string | null {
  let bestId: string | null = null, best = Infinity;
  for (const s of shapes) {
    const d = distanceToShape(p, s);
    if (d <= radius && d < best) { best = d; bestId = s.id; }
  }
  return bestId;
}

/** The box that holds the answer and the wrong pick; null when neither has a boundary. */
export function revealBox(features: Collection['features'], reveal: NonNullable<QuizView['reveal']>): Box | null {
  const ids = new Set([reveal.answer, ...(reveal.picked ? [reveal.picked] : [])]);
  return boundsOf(features.filter((f) => ids.has(String(f.properties.id))));
}

/** Room for the card: to its right on a wide screen, above it under 900 px (as in the approved find-it mock). */
export function revealPadding(viewport: { width: number; height: number }, card: { right: number; top: number } | undefined) {
  if (viewport.width < 900) return { top: 90, left: 40, right: 90, bottom: card ? viewport.height - card.top + 70 : 70 };
  return { left: (card?.right ?? 0) + 40, top: 80, right: 80, bottom: 60 };
}
