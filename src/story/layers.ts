// The story's own map layers: rivers, names, climate, geology, the slope tint and the fact markers (build card 4, not yet built).
// storyMap.ts calls `setup` once the map has loaded and `show` on every step; `show` returns what is on the map now, for the credit line.
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { Story, StoryStep } from './format';
import type { Credited } from './view';

export interface StoryLayers {
  setup(map: MapLibreMap, story: Story): void;
  show(map: MapLibreMap, step: StoryStep): Credited[];
  remove(): void;
}

export function storyLayers(): StoryLayers {
  return {
    setup() {},
    show: () => [],
    remove() {},
  };
}
