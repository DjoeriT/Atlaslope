import tilesFile from '../../content/tiles.json';
import type { Cite } from './types';

/** A line on an Atlas card with the sources it restates (content/tiles.json). */
export interface TileLine { title?: string; lede?: string; from?: string[]; cite: Cite[] }

interface TilesFile {
  spain: TileLine;
  regions: Record<string, TileLine>;
  places: Record<string, TileLine>;
}

const tiles = tilesFile as unknown as TilesFile;

/** A country's line sits at the top level of the file under its id ("spain"). */
export const countryLine = (id: string): TileLine | undefined => (tiles as unknown as Record<string, TileLine | undefined>)[id];
export const regionLine = (id: string): TileLine | undefined => tiles.regions[id];
export const placeLine = (id: string): TileLine | undefined => tiles.places[id];
export const tilesContent = tiles;
