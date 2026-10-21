// The story camera, pure: where each step looks, how the map flies there, and which step the reader is on. storyMap.ts applies it.
// Timings and thresholds are design choices from the approved mock (Review/mock-story-guide-v3/README.md, "Changed from v2" 1).
import type { FlyTarget, Guide } from '../facts';
import type { LngLat, StoryStep } from './format';

export interface Cam { center: LngLat; zoom: number; pitch: number; bearing: number }
export interface Leg extends Cam { duration: number; curve: number }

/** Where a step looks: a fixed view, or a place's bounds to fit (then shifted by `zoomShift`). */
export type Target =
  | ({ kind: 'view' } & Cam)
  | { kind: 'bounds'; place: string; pitch: number; bearing: number; zoomShift: number };

/** The guide stop a step sits by: a fly of its chapter, or the fly of one of its cards. */
export function stopOf(guide: Guide, step: StoryStep): FlyTarget | undefined {
  const ch = guide.chapters.find((c) => c.id === step.chapter);
  if (!ch) return undefined;
  if (step.fly !== undefined) return ch.fly?.[step.fly];
  if (step.card !== undefined) return ch.cards?.[step.card]?.fly;
  return undefined;
}

/** A step's camera: its own centre and zoom; else a place's bounds (its own, else the stop's); else the stop's point. */
export function targetOf(step: StoryStep, stop?: FlyTarget): Target | null {
  const c = step.camera;
  const pitch = c.pitch ?? 0, bearing = c.bearing ?? 0;
  const center = c.center ?? (c.place ? undefined : stop?.point);
  const zoom = c.zoom ?? stop?.zoom;
  if (center && zoom !== undefined) return { kind: 'view', center, zoom, pitch, bearing };
  const place = c.place ?? stop?.place;
  // Tilted bounds are pulled back a little so the far edge stays in view, unless the step says how much.
  if (place) return { kind: 'bounds', place, pitch, bearing, zoomShift: c.zoomShift ?? (pitch > 0 ? -0.3 : 0) };
  return null;
}

/** Rough ground distance in km between two points at Spain's latitudes, as the mock measures it. */
export const kmBetween = (a: LngLat, b: LngLat) => Math.hypot((a[0] - b[0]) * 80, (a[1] - b[1]) * 111);

/** Every stop flies. A gap of more than 3.5 zoom levels or 150 km flies in two legs: over to the target at a mid zoom, then in (or
 *  out) to the final frame. Otherwise one flight of 2.5 to 4 s. */
export function flyLegs(from: Cam, to: Cam): Leg[] {
  const dz = Math.abs(to.zoom - from.zoom);
  const km = kmBetween(from.center, to.center);
  if (dz > 3.5 || km > 150) {
    const mid = to.zoom > from.zoom ? Math.max(from.zoom, to.zoom - 3.2) : Math.min(from.zoom, to.zoom + 3.2);
    return [
      { center: to.center, zoom: mid, pitch: (to.pitch + from.pitch) / 2, bearing: to.bearing, duration: 2400, curve: 1.5 },
      { ...to, duration: 2600, curve: 1.3 },
    ];
  }
  return [{ ...to, duration: Math.round(Math.min(4000, 2500 + dz * 250 + km * 6)), curve: 1.4 }];
}

/** Each map move gets this long to land before the next starts, when the reader scrolls past several steps. */
export const DWELL_MS = 2200;

/** The reading line: a little below the top of the reading area (under the band on a laptop, under the map on a phone). */
export function readingLine(areaTop: number, viewHeight: number, narrow: boolean): number {
  return areaTop + (viewHeight - areaTop) * (narrow ? 0.3 : 0.45);
}

/** Links in one row of the page (two pills side by side, three zone cards in a grid) share a top. Spread them 12 px apart in reading
 *  order, so the reader scrolls through them one at a time instead of the last one taking the whole row. */
export function spreadRows(tops: readonly number[]): number[] {
  const out = [...tops];
  let base = NaN, rank = 0;
  tops.forEach((t, i) => {
    if (!Number.isFinite(t)) return;
    if (Math.abs(t - base) < 6) { rank++; out[i] = base + rank * 12; } else { base = t; rank = 0; }
  });
  return out;
}

/** The step on show: the one whose anchor is nearest above the reading line (the later step when two share a place); the first before any has passed. */
export function pickStep(tops: readonly number[], line: number): number {
  let best = 0, at = -Infinity;
  tops.forEach((t, i) => { if (t <= line && t >= at) { best = i; at = t; } });
  return best;
}
