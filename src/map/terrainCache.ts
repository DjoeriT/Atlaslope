// With 3D relief on, MapLibre 4.7 draws the flat layers (place fills and outlines) into cached textures on the terrain and
// redraws a texture only when a tile under it loads or the style changes, never when feature state changes. So a quiz
// highlight showed only on the squares that happened to reload while the map flew, cut off at tile edges, and the last
// question's highlight stayed on the rest (owner's Galicia screenshot, 17 Oct 2026). Freeing the cache after a state change fixes it.
import type maplibregl from 'maplibre-gl';

type WithTerrain = { terrain?: { sourceCache?: { freeRtt?: () => void } } | null };

/** Feature state setter that also clears the relief's texture cache, once per batch of changes. */
export function stateSetter(map: maplibregl.Map, defer: (f: () => void) => void = queueMicrotask) {
  let pending = false;
  return (source: string, id: string, state: Record<string, boolean>) => {
    map.setFeatureState({ source, id }, state);
    if (pending) return;
    pending = true;
    defer(() => {
      pending = false;
      const terrain = (map as unknown as WithTerrain).terrain;
      if (!terrain) return;
      terrain.sourceCache?.freeRtt?.();
      map.triggerRepaint();
    });
  };
}
