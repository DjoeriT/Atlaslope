// What the atlas cover card counts and shows. Pure: no React, no map. Every number comes from the tree (and the tour files), never typed here.
import { countryConfig, type Bounds } from '../countries';
import type { Tree } from '../tree';

/** The cover's hero photo (a key in data/photos.json); its crop is checked in src/home/photoCrops.json (CLAUDE.md, Photos hard rule). */
export const COVER_PHOTO = 'rioja-1';
/** The tour the lead panel opens: the guide's map tour, tilted stops included. */
export const TOUR_PLACE = 'priorat';
/** The photo of a country's tile; a country without one shows its name alone. */
export const COUNTRY_PHOTO: Record<string, string> = { spain: 'priorat-1' };

export interface CoverCountry {
  id: string;
  name: string;
  places: number;
  regions: number;
}

/** The countries that have places in the tree, with their counts. Zones are not places here (106 for Spain, not 109). */
// The cover shows Spain only until the owner picks how Portugal appears, as Home and the Guides page do (SHOWN_COUNTRIES in
// src/home/guideCount.ts, which reads files and so cannot be imported here; Portugal pilot, 22 Oct 2026). Change both together.
export const COVER_COUNTRIES = ['spain'];

export function liveCountries(tree: Tree): CoverCountry[] {
  return tree.countries
    .filter((c) => COVER_COUNTRIES.includes(c.id))
    .map((c) => {
      const regions = tree.regionsOf(c.id);
      const places = regions.reduce((n, r) => n + tree.placesInRegion(r.id).length, 0);
      return { id: c.id, name: c.name, places, regions: regions.length };
    })
    .filter((c) => c.places > 0);
}

/** The closing line's numbers: wine places and study regions across the live countries, and the guides that have a map tour. */
export function coverCounts(tree: Tree, tours: number): { places: number; regions: number; tours: number } {
  const live = liveCountries(tree);
  return { places: live.reduce((n, c) => n + c.places, 0), regions: live.reduce((n, c) => n + c.regions, 0), tours };
}

/** The box around every live country's own map bounds: where the map behind the cover looks. */
export function liveBounds(tree: Tree): Bounds {
  const boxes = liveCountries(tree).map((c) => countryConfig(c.id).bounds);
  const all = boxes.length ? boxes : [countryConfig(undefined).bounds];
  return [
    [Math.min(...all.map((b) => b[0][0])), Math.min(...all.map((b) => b[0][1]))],
    [Math.max(...all.map((b) => b[1][0])), Math.max(...all.map((b) => b[1][1]))],
  ];
}
