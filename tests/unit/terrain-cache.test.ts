import { describe, expect, it, vi } from 'vitest';
import type maplibregl from 'maplibre-gl';
import { stateSetter } from '../../src/map/terrainCache';

function fakeMap(terrain: boolean) {
  const freeRtt = vi.fn();
  const map = { setFeatureState: vi.fn(), triggerRepaint: vi.fn(), terrain: terrain ? { sourceCache: { freeRtt } } : null };
  return { map, freeRtt };
}

describe('feature state with 3D relief', () => {
  it('clears the relief texture cache once per batch of state changes', () => {
    const { map, freeRtt } = fakeMap(true);
    const queued: Array<() => void> = [];
    const set = stateSetter(map as unknown as maplibregl.Map, (f) => queued.push(f));
    set('dos', 'a', { sel: false });
    set('dos', 'b', { sel: true });
    expect(map.setFeatureState).toHaveBeenCalledTimes(2);
    expect(map.setFeatureState).toHaveBeenLastCalledWith({ source: 'dos', id: 'b' }, { sel: true });
    expect(queued).toHaveLength(1);
    queued.shift()!();
    expect(freeRtt).toHaveBeenCalledTimes(1);
    expect(map.triggerRepaint).toHaveBeenCalledTimes(1);
    set('dos', 'c', { sel: true });
    expect(queued).toHaveLength(1);
  });

  it('leaves the map alone without relief', () => {
    const { map } = fakeMap(false);
    const queued: Array<() => void> = [];
    stateSetter(map as unknown as maplibregl.Map, (f) => queued.push(f))('dos', 'a', { sel: true });
    queued.shift()!();
    expect(map.triggerRepaint).not.toHaveBeenCalled();
  });
});
