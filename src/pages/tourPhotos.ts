import { photosOf } from '../facts';
import { loadStory, storyIds } from '../story/load';
import type { Tree } from '../tree';

const keyOf = (src: string): string => src.replace(/^.*\/|\.webp$/g, '');

/** The photos a guide page with a map tour draws in a fixed frame through `Pic` (map card and stops 3:2, zone cards 4:3): the keys that
 * need a checked focus in src/pages/pageCrops.json (docs/guides.md "Photo crops"). */
export function tourPageKeys(tree: Tree, ids = storyIds()): string[] {
  const keys = new Set<string>();
  for (const id of ids) {
    const story = loadStory(id);
    if (!story) continue;
    keys.add(story.cover.photo);
    for (const s of story.steps) if (s.photo) keys.add(s.photo);
    for (const z of tree.children(id, 'place')) {
      const first = photosOf(z.id)[0];
      if (first) keys.add(keyOf(first.src));
    }
  }
  return [...keys].sort();
}
