import { readdirSync, readFileSync } from 'node:fs';
import { loadTree } from '../tree';
import type { SearchIndex } from './plainSearch';

const json = <T>(file: string): T => JSON.parse(readFileSync(file, 'utf8')) as T;

interface Sheets { sheets: Array<{ id: string; grapes: { main: Array<{ local: string; grape?: string }> } }> }

/** The plain pages' search index (build time): the atlas's own search entries from data/places.json and the main grapes of the fact sheets, so a match is the same as in the atlas.
 *  Names, grapes and ids only, no places data. Same grape names as grapeNames() in src/facts (not imported: that file needs Vite's glob). */
export function searchIndex(placesFile = 'data/places.json', factsDir = 'content/facts'): SearchIndex {
  const grapes: Record<string, string[]> = {};
  for (const f of readdirSync(factsDir).filter((f) => f.endsWith('.json'))) {
    for (const s of json<Sheets>(`${factsDir}/${f}`).sheets) {
      const names = s.grapes.main.flatMap((g) => (g.grape ? [g.local, g.grape] : [g.local]));
      if (names.length) grapes[s.id] = names;
    }
  }
  return loadTree(json(placesFile), grapes).searchEntries;
}
