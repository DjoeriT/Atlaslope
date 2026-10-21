// Search on the plain pages (home, guides/, about/, map-tours/): the atlas's own matching (src/tree/search.ts) over a small index of
// names and ids, loaded on first focus. A pick goes to the atlas. Kept free of the DOM so a unit test can run it.
import { makeSearch, type Entry } from '../tree/search';
import type { Crumb } from '../tree/types';

/** The index a plain page loads: the atlas's search entries, names and ids only. Built by the `search-index` plugin in vite.config.ts. */
export type SearchIndex = Entry[];

export interface Hit { crumb: Crumb; href: string }

/** `atlas` is the path from this page to atlas/ ("atlas/" or "../atlas/"). Regions rank 0, places 1 (as in the tree); a region opens as #region=, anything else as #place=. */
export function plainSearch(index: SearchIndex, atlas: string): (query: string, limit?: number) => Hit[] {
  const find = makeSearch(index);
  const regions = new Set(index.filter((e) => e.rank === 0).map((e) => e.hit.id));
  const places = new Set(index.filter((e) => e.rank !== 0).map((e) => e.hit.id));
  return (query, limit = 8) => find(query, limit).map((crumb) => ({
    crumb,
    href: `${atlas}#${regions.has(crumb.id) && !places.has(crumb.id) ? 'region' : 'place'}=${crumb.id}`,
  }));
}
