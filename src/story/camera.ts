// The story camera, pure: where each step looks, how the map flies there, and which step the reader is on. storyMap.ts applies it.
// Timings and thresholds are design choices from the approved mock (Review/mock-story-guide-v3/README.md, "Changed from v2" 1).
import type { FlyTarget, Guide } from '../facts';
import type { LngLat, StoryStep } from './format';

export interface Cam { center: LngLat; zoom: number; pitch: number; bearing: number }
export interface Leg extends Cam { duration: number; curve: number }

/** Where a step looks: a fixed view, or a place's bounds to fit (then shifted by `zoomShift`). */
export type Target =
  | ({ kind: 'view'; fit?: string } & Cam)
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
  const place = c.place ?? stop?.place;
  // A fixed view of a place keeps its place to fit: a smaller or tilted map backs off until the whole place is in (fitView).
  if (center && zoom !== undefined) return { kind: 'view', center, zoom, pitch, bearing, ...(place ? { fit: place } : {}) };
  // Tilted bounds are pulled back a little so the far edge stays in view, unless the step says how much.
  if (place) return { kind: 'bounds', place, pitch, bearing, zoomShift: c.zoomShift ?? (pitch > 0 ? -0.3 : 0) };
  return null;
}

/** Rough ground distance in km between two points at Spain's latitudes, as the mock measures it. */
export const kmBetween = (a: LngLat, b: LngLat) => Math.hypot((a[0] - b[0]) * 80, (a[1] - b[1]) * 111);

/** Every stop flies. A gap of more than 3.5 zoom levels or 150 km flies in two legs: over to the target at a mid zoom, then in (or
 *  out) to the final frame, 1.5 s each. Otherwise one flight of 1.5 to 2.5 s (owner 22 Oct 2026: shorter, the map was late). */
export function flyLegs(from: Cam, to: Cam): Leg[] {
  const dz = Math.abs(to.zoom - from.zoom);
  const km = kmBetween(from.center, to.center);
  if (dz > 3.5 || km > 150) {
    const mid = to.zoom > from.zoom ? Math.max(from.zoom, to.zoom - 3.2) : Math.min(from.zoom, to.zoom + 3.2);
    return [
      { center: to.center, zoom: mid, pitch: (to.pitch + from.pitch) / 2, bearing: to.bearing, duration: 1500, curve: 1.5 },
      { ...to, duration: 1500, curve: 1.3 },
    ];
  }
  return [{ ...to, duration: Math.round(Math.min(2500, 1500 + dz * 150 + km * 4)), curve: 1.4 }];
}

/** Each map move gets this long to land before the next starts, when the reader scrolls past several steps. */
export const DWELL_MS = 1200;

/** The map shape the fixed views were tuned for: the desktop column (46% of 1440 wide, window height less the bar). Design choice. */
const REF = { w: 640, h: 760 };

/** How far a fixed view backs off on a smaller map (the phone strip, a narrow column) so it still shows the same ground: 0 on the
 * desktop shape, about -0.8 on a 390 x 300 strip. It backs off by 0.6 of the shortfall, so close views keep their detail. */
export function stripZoomShift(width: number, height: number): number {
  const ratio = Math.max(REF.w / Math.max(width, 1), REF.h / Math.max(height, 1));
  return ratio <= 1 ? 0 : -0.6 * Math.log2(ratio);
}

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

/** Where a ground point lands on a map of `w` x `h` px looking at `cam`, as MapLibre draws it (vertical field of view 36.87 degrees);
 *  null when it is behind the camera or past the horizon. Mercator, 512 px tiles. */
export function projectPoint(cam: Cam, at: LngLat, w: number, h: number): [number, number] | null {
  const world = 512 * 2 ** cam.zoom, rad = Math.PI / 180;
  const mx = (p: LngLat) => ((p[0] + 180) / 360) * world;
  const my = (p: LngLat) => (0.5 - Math.log(Math.tan(Math.PI / 4 + (p[1] * rad) / 2)) / (2 * Math.PI)) * world;
  const ox = mx(at) - mx(cam.center), oy = my(at) - my(cam.center);
  const b = cam.bearing * rad, pt = cam.pitch * rad;
  const rx = ox * Math.cos(b) + oy * Math.sin(b), ry = -ox * Math.sin(b) + oy * Math.cos(b);
  const dist = 1.5 * h; // camera to centre: half the height over tan(half the field of view)
  const depth = dist - ry * Math.sin(pt);
  if (depth <= dist * 0.05) return null;
  return [w / 2 + (rx * dist) / depth, h / 2 + (ry * Math.cos(pt) * dist) / depth];
}

export interface Pad { top: number; bottom: number; left: number; right: number }

/** Is every point inside the map's rectangle less the padding? */
export function pointsFit(cam: Cam, points: readonly LngLat[], w: number, h: number, pad: Pad): boolean {
  return points.every((p) => {
    const s = projectPoint(cam, p, w, h);
    return !!s && s[0] >= pad.left && s[0] <= w - pad.right && s[1] >= pad.top && s[1] <= h - pad.bottom;
  });
}

/** A fixed view that must show a whole place (its outline points): unchanged when the place fits (the desktop column), else centred
 *  on the place and backed off in 0.1 steps, down to 3 levels, until it does. Pitch and bearing count, so a tilted strip backs off
 *  further than a flat one. */
export function fitView(cam: Cam, points: readonly LngLat[], w: number, h: number, pad: Pad): Cam {
  if (pointsFit(cam, points, w, h, pad)) return cam;
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  const centre: LngLat = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
  for (let d = 0; d <= 3; d += 0.1) {
    const c = { ...cam, center: centre, zoom: cam.zoom - d };
    if (pointsFit(c, points, w, h, pad)) return c;
  }
  return { ...cam, center: centre, zoom: cam.zoom - 3 };
}

/** Each step holds at least `min` px of scroll: an anchor lower than the one before it by less than that is moved down to `min` below it.
 *  Order is kept. Rows of links that share a place on the page (a narrow screen stacks two pills 40 px apart) then no longer flick past. */
export function holdSteps(tops: readonly number[], min: number): number[] {
  const out = [...tops];
  let prev = -Infinity;
  out.forEach((t, i) => {
    if (!Number.isFinite(t)) return;
    out[i] = Math.max(t, prev + min);
    prev = out[i];
  });
  return out;
}
