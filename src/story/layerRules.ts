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

/** The rock types the soils stop names, with the MAGNA 50 colour each has on the map (sampled from the service's own render at the
 * units the guide describes, 21 Oct 2026; data/SOURCES.md "Story data"). The service's legend lists numbered colours and no names. */
export const ROCK_KEY: Record<string, Array<{ id: string; color: string }>> = {
  rioja: [{ id: 'clayLimestone', color: '#FFFF80' }, { id: 'ferrousClay', color: '#FFD9D9' }, { id: 'alluvial', color: '#B2D9D9' }],
  priorat: [{ id: 'slate', color: '#B2B2B2' }],
  'ribeira-sacra': [{ id: 'slate', color: '#80804D' }, { id: 'granite', color: '#FF4D80' }, { id: 'granite2', color: '#FF80FF' }],
  'ribera-del-duero': [{ id: 'ochreClay', color: '#FFFF80' }, { id: 'terraces', color: '#D9D9B2' }, { id: 'limestone', color: '#FFFFB2' }],
  alicante: [{ id: 'limestone', color: '#FF804D' }, { id: 'limeMarl', color: '#FFD9B2' }, { id: 'dolomite', color: '#B2FFFF' }],
  'costers-del-segre': [{ id: 'montsec', color: '#B2FF00' }, { id: 'limestone', color: '#FFEDB2' }, { id: 'sandClay', color: '#D9D9D9' }],
};

/** The key items for a story's rock colours: the guide's own word and the colour. */
export function rockKey(storyId: string): Array<{ label: string; color: string }> {
  const names = (strings.story.legend.rocks as Record<string, Record<string, string>>)[storyId] ?? {};
  return (ROCK_KEY[storyId] ?? []).map((r) => ({ label: names[r.id] ?? r.id, color: r.color }));
}

/** The slope tint's own colour (Tools/story/slope_tint.py, #8C2340) for its one-line key. */
export const SLOPE_KEY_COLOR = '#8C2340';

/** The MAGNA 50 service draws nothing at map zoom 9 and below (blank tiles, checked 21 Oct 2026): its layer starts here, and so does a geology stop's view. */
export const GEOLOGY_MINZOOM = 10;
