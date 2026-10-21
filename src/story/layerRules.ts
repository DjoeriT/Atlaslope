// The story layers' choices, pure: which names show at a stop, and what the climate legend lists. layers.ts puts them on the map.
import { CLIMATE_GROUPS, type ClimateGroup } from '../map/climate';
import { measuresOf } from '../facts';
import { strings } from '../strings';
import type { LngLat } from './format';
import { outlined } from './view';

export interface NamePoint { name: string; at: LngLat }

/** Names within about the visible half-width of the stop's view (design choice: the nearer the view is to the ground, the fewer names).
 * A name that a step marker already shows is left out. `width` is the map's width in pixels; a tilted view sees further. */
export function nearNames(points: readonly NamePoint[], view: { center: LngLat; zoom: number; pitch: number }, width: number, skip: readonly string[] = []): string[] {
  const [lng, lat] = view.center;
  const cos = Math.cos((lat * Math.PI) / 180);
  const kmPerPx = (78.27 * cos) / 2 ** view.zoom; // a 512 px world at zoom 0 is 78.27 km per px at the equator
  const radius = kmPerPx * Math.max(width * 0.5, 420) * (view.pitch > 40 ? 1.7 : 1.15);
  return points
    .filter((p) => !skip.includes(p.name) && Math.hypot((p.at[0] - lng) * 111.3 * cos, (p.at[1] - lat) * 111.2) <= radius)
    .map((p) => p.name);
}

export interface LegendClass { id: string; label: string; short: string; color: string }

/** The climate classes under the step's outline, by share of land (data/place-measures.json), named and coloured as the app's climate view. */
export function legendClasses(focus: string): LegendClass[] {
  const share = new Map<string, number>();
  for (const id of outlined(focus)) {
    for (const k of measuresOf(id)?.koppen ?? []) {
      const g = CLIMATE_GROUPS.find((c: ClimateGroup) => c.codes.includes(k.code));
      if (g) share.set(g.id, (share.get(g.id) ?? 0) + k.share);
    }
  }
  const short = strings.story.legend.short as Record<string, string>;
  return CLIMATE_GROUPS.filter((g) => share.has(g.id))
    .sort((a, b) => (share.get(b.id) ?? 0) - (share.get(a.id) ?? 0))
    .map((g) => ({ id: g.id, label: g.label, short: short[g.id] ?? g.label, color: g.color }));
}
