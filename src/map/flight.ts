// How long the camera takes between two views (owner point 8, 18 Oct 2026). A fixed 700 ms made a hop between neighbours rush and a
// flight across Spain lurch; the time now grows with how far the view travels, in zoom levels and in screens, within calm bounds.
export interface Cam { lng: number; lat: number; zoom: number }

const mercator = (c: Cam) => {
  const s = Math.sin((Math.max(-85, Math.min(85, c.lat)) * Math.PI) / 180);
  return { x: (c.lng + 180) / 360, y: 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI) };
};

/** Milliseconds for a camera move; `scale` stretches it for the motion strength (1 is the shipped default). */
export function flightMs(from: Cam, to: Cam, scale = 1): number {
  const a = mercator(from), b = mercator(to);
  const world = 512 * 2 ** Math.min(from.zoom, to.zoom); // the world's width in pixels at the wider of the two zooms
  const screens = (Math.hypot(b.x - a.x, b.y - a.y) * world) / 1000;
  const span = Math.abs(to.zoom - from.zoom) + Math.log2(1 + screens);
  return Math.round(Math.min(2000, Math.max(800, 800 + 260 * span)) * scale);
}

/** A camera ease that starts and lands softly; a camera that starts at full speed reads as a jolt. */
export const cameraEase = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
