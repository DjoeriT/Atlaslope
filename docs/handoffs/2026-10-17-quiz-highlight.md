# Quiz highlight cut off (17 Oct 2026)

**Done.** Owner report: mid-quiz in Galicia the highlighted place was cut off at straight edges and neighbours kept the wine colour (#66).
Cause [V]: MapLibre 4.7.1 with 3D relief renders fill and line layers into cached textures per terrain tile and frees a texture only on a
tile load or a style change, not on `setFeatureState`. Squares that reloaded during the fly showed the new state; the rest kept the old one.
Reproduced in a headless page (flat terrarium DEM by custom protocol, two squares, select one then the other): pixels stayed blue until
`map.terrain.sourceCache.freeRtt()`, then turned red as expected.
Fix: `src/map/terrainCache.ts` `stateSetter(map)`: every feature state change in `createMap.ts` goes through it, and it frees the terrain
texture cache once per batch (microtask) and repaints. Unit test `tests/unit/terrain-cache.test.ts`.

**Decided.** Takes release 17; the mastery map and ready for friends move to 18 and 19 (#15, #16).

**Open.** Uses MapLibre internals (`map.terrain.sourceCache.freeRtt`); it no-ops if they move. Recheck on a MapLibre upgrade.
Not checked against real relief and photo tiles (blocked hosts); the owner's look on the live site after publishing is the check.
