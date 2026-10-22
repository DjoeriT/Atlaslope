// What the story shows around the camera, pure: the fade outside the focus, the locator inset, the credit line and the measure lines.
import maskData from '../../data/spain-mask.json';
import type { Measures } from '../facts';
import { strings } from '../strings';
import type { LngLat, MeasureKind, StoryLayer } from './format';

const t = strings.story;

type Ring = LngLat[];
type Polygon = Ring[];
interface Geometry { type: string; coordinates: unknown }

/** The outer rings of a Polygon or MultiPolygon. */
export function outerRings(g: Geometry): Ring[] {
  if (g.type === 'Polygon') return [(g.coordinates as Polygon)[0]];
  if (g.type === 'MultiPolygon') return (g.coordinates as Polygon[]).map((p) => p[0]);
  return [];
}

/** The land outside some shapes: the world with their outlines as holes. The story fades it with black at 25%. */
export function outside(geoms: readonly Geometry[]): { type: 'Polygon'; coordinates: Ring[] } {
  const world: Ring = [[-180, -85], [180, -85], [180, 85], [-180, 85], [-180, -85]];
  return { type: 'Polygon', coordinates: [world, ...geoms.flatMap(outerRings)] };
}

/** The three Rioja zones are drawn for focus "zones"; the land outside Rioja itself is faded then. */
export const ZONES = ['rioja-alta', 'rioja-alavesa', 'rioja-oriental'] as const;
export const outlined = (focus: string): string[] => (focus === 'zones' ? [...ZONES] : [focus]);
export const faded = (focus: string): string => (focus === 'zones' ? 'rioja' : focus);

// Locator inset: the peninsula and the Balearics from data/spain-mask.json (Canarias left out), x scaled by cos 40 degrees, 100 units wide.
const COSK = Math.cos((40 * Math.PI) / 180);
const RINGS = (maskData as unknown as { land: Polygon[] }).land.map((p) => p[0]).filter((r) => Math.min(...r.map((q) => q[1])) > 35.5);
const all = RINGS.flat();
const X0 = Math.min(...all.map((q) => q[0])) * COSK, X1 = Math.max(...all.map((q) => q[0])) * COSK;
const Y0 = -Math.max(...all.map((q) => q[1])), Y1 = -Math.min(...all.map((q) => q[1]));
const S = 100 / (X1 - X0);

export const locator = {
  width: 100,
  height: Math.round((Y1 - Y0) * S * 10) / 10,
  /** A point in the inset's units. */
  at: ([lng, lat]: LngLat): [number, number] => [(lng * COSK - X0) * S, (-lat - Y0) * S],
  path: RINGS.map((r) => 'M' + r.map(([lng, lat]) => `${((lng * COSK - X0) * S).toFixed(1)} ${((-lat - Y0) * S).toFixed(1)}`).join('L') + 'Z').join(''),
};

/** The visible box in the inset's units, at least 2 units each way so a close view still shows. */
export function locatorBox(west: number, south: number, east: number, north: number) {
  const [x0, y0] = locator.at([west, north]);
  const [x1, y1] = locator.at([east, south]);
  return { x: Math.min(x0, x1), y: Math.min(y0, y1), w: Math.max(2, Math.abs(x1 - x0)), h: Math.max(2, Math.abs(y1 - y0)) };
}

/** Layers a credit line can name. The story layers come from the story file; rivers and names are always on where they exist (card 4). */
export type Credited = StoryLayer | 'rivers';

/** The credit line's parts, long and short (phone), for what the map shows now. Terrain height is always stated. */
export function creditParts(shown: readonly Credited[], imagery: boolean, exaggeration = 1.5): Array<{ long: string; short: string }> {
  const c = t.credit;
  const k = exaggeration.toFixed(1);
  const parts = [{ long: c.terrain(k), short: c.terrain(k) }];
  if (imagery) parts.push({ long: c.imagery, short: c.imageryShort });
  parts.push({ long: c.dem, short: c.demShort });
  if (shown.includes('rivers')) parts.push({ long: c.rivers, short: c.riversShort });
  if (shown.includes('geology')) parts.push({ long: c.geology, short: c.geologyShort });
  if (shown.includes('koppen')) parts.push({ long: c.koppen, short: c.koppenShort });
  return parts;
}

// The slope measure (#148) is in the file but not yet in the shared Measures type.
export type Measured = Measures & { slope?: { steepShare: number } };

/** A measured line (data/place-measures.json); prefixed with the place's name when the stop frames something wider than it. */
export function measureText(m: Measured, kind: MeasureKind, inName?: string): string {
  const a = m.altitude;
  const text = kind === 'median' ? t.measures.median(a.median)
    : kind === 'top' ? t.measures.top(a.median, a.p90)
      : kind === 'low' ? t.measures.low(a.p10)
        : t.measures.steep(Math.round((m.slope?.steepShare ?? 0) * 100));
  return inName ? t.measureIn(inName, text) : text;
}
