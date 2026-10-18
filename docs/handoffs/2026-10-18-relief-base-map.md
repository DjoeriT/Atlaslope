# Relief and base map (atlas overhaul slice 4), 18 Oct 2026

Owner points 6 (3D relief barely perceptible) and 7 (satellite off goes blurry close in). PR #88, branch `claude/relief-and-base-map-xczjqg`.
Big slice: publishes only on "publish release N".

## Done
- Relief height follows the zoom: 2.8x Spain-wide, 2.4 at z8, 2.1 at z10, 1.8 at z12, 1.5 from z14 (`RELIEF_STOPS` and
  `reliefExaggeration` in `src/map/layers.ts`; was 1.3 everywhere). Set live on zoom through `map.terrain.exaggeration`, which
  MapLibre 4.7 reads every frame, so no texture rebuild (`src/map/createMap.ts`).
- Hillshade 0.45 over the photo, 0.8 on the atlas (was 0.25 and 0.5), from its own DEM source `shade` at maxzoom 14 (`src/map/style.ts`).
- Satellite off: an OpenFreeMap road map under the places, roads by class and zoom, rail, rivers, lakes, woods, vineyards
  (landcover subclass `vineyard`), built-up areas, buildings from z14 (`src/map/osmBase.ts`, added after load like the names).
  Atlas place fills thin from z8 to z13 like over the photo; the selected place stays dark (0.45 at z13).
- `.gitignore`: `shots/` became `/shots/`; it had silently ignored `Review/mock-zoom-detail/shots/`, so map-preview runs failed at the commit step.

## Decided
- Default relief strength "medium" (above). The owner may ask for bolder.

## Open
- Not checked on Safari, iPad or real phones. Steep slopes at z13+ with tilt: watch for outlines dragged by the relief.
- map-preview with 16 views passes its 20-minute limit; run two to four views at a time. Satellite-off shots: build without the
  Esri key and shoot locally (the container reaches the tile hosts).
- Console on the runner: "Expected second argument to be of type array or string, but found null" also predates this slice
  (the names' `index-of` on a missing name, `src/map/mapNames.ts`) [A].

## Where
- Before and after (satellite off): `/mnt/project-files/atlaslope/relief-base-map/`.
- Relief over satellite: not shown. The map-preview run (07b92dd) gave empty map frames for both tilted views, before and after
  alike (software GL with 3D on, as on 17 Oct); check it on atlaslope.com after publishing.
