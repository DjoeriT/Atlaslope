# Code review: quiz highlight fix (aadbfb7, #66)

**Verdict: merge** (0 must-fix, 2 should-fix, 3 nit). Ran: `npx vitest run tests/unit/terrain-cache.test.ts` 2/2 pass; `npx tsc --noEmit` clean.

## Correctness against MapLibre 4.7.1 (read)
- `ui/map.ts:2005-2016`: the terrain data callback calls `sourceCache.freeRtt()` only on style 'data' or per-tile loads; `setFeatureState` (map.ts:2800) does not. The stated cause matches the source.
- `terrain_source_cache.ts:109-116`: `freeRtt()` with no arg sets `tile.rtt = []` for every tile. `render_to_texture.ts` re-renders tiles with empty rtt on the next frame. So free + `triggerRepaint` is the right lever. `map.terrain` and `sourceCache` are internals but present; code uses optional chaining so it no-ops if they move (handoff says so).
- Unwrapped calls: only `src/map/terrainCache.ts:13` calls `setFeatureState` now; no `removeFeatureState` anywhere in src/. All 19 `setState(` uses in createMap.ts and the former raw 'zones' call (diff, line ~371) go through the wrapper. [grep ran]
- Without terrain: `map.terrain` is null, so the microtask returns before touching anything (tested).

## Should-fix
1. `src/map/terrainCache.ts:17-22` after `map.remove()`: if a state change is queued and the map is removed in the same tick (`remove()` at createMap.ts:435, e.g. quiz or page unmount), the microtask still calls `triggerRepaint()`. In 4.7.1 `triggerRepaint` (map.ts:3281) checks only `this.style`, which `remove()` does not clear in the lines I read, so it could schedule `_render` on a removed map. Not reproduced [inferred]. Fix: track a `removed` flag (`map.on('remove')`) or skip when `!map.getCanvasContainer().isConnected` / `map.style` is gone.
2. Cost per change (`terrainCache.ts:21`): `freeRtt()` clears every tile, so each hover change or quiz step re-renders all visible terrain textures (fill + line). Hover is deduped (createMap.ts ~301), so it is one batch per entered place, not per mousemove; probably fine, but unmeasured. Say so in the handoff, or measure frame time on the Mac with real relief. The per-tile `freeRtt(tileID)` alternative would need the feature's tiles and is not worth it now.

## Nits
- `tests/unit/terrain-cache.test.ts`: tests a fake map only; it cannot catch MapLibre renaming `terrain.sourceCache.freeRtt`. A guard test against the real 4.7.1 object (e.g. `Terrain` prototype / sourceCache has `freeRtt`) would fire on upgrade, which the handoff asks to "recheck". Also no test that a non-terrain map still gets its `setFeatureState` call (covered only in the terrain case) or that terrain turned on later (map.terrain read lazily: it is, good).
- `terrainCache.ts:11`: `defer` default `queueMicrotask` is fine; type `WithTerrain` ok.
- Imports in createMap.ts:22 sit after `./tiles`, breaking alphabetical order (cosmetic).

## Records (read)
- Handoff and PROJECT_CONTEXT agree with the code (file names, #66, release 17 shifting mastery map/ready for friends to 18/19). The `Review/release-16-what-to-test.md` move to archive matches the context edit. 
- Handoff claim "reproduced headless, pixels stayed blue until freeRtt" is not reproducible from the diff (no script committed): I did not re-run it [not verified]. The context line tags it `[V headless]`; acceptable but the repro script is not in the repo.
- Tester note step 3 ("Hovering a list row lights only that place") is covered by the same code path (hover uses `setState`); fine. Note it says "3D relief on (the default over the photo)"; I did not verify that default.
- Not checked: live relief and tiles, Safari, iPad (the note says so).
