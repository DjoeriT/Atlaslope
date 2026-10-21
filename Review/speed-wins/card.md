# Speed wins 1 and 3 (card report)

Status: done. Branch `claude/speed-wins`, not pushed.

## What changed
- `src/map/dataFile.ts` (new): `loadJson`, a module-level promise cache. `createMap.ts` (dops, added-boundaries, natural-earth-world, rioja-zones) and `story/layers.ts` (rioja-zones) use it. Failed loads are retried by the next caller.
- `src/map/style.ts`: DEM sources `terrain` and `shade` are `tileSize: 512` with `minzoom` 7 (`RELIEF_MIN_ZOOM`); the hillshade layer has `minzoom` 7. No terrain tile is asked for below map zoom 7.
- Tours: `createStoryMap` passes `reliefFrom = 6` (new optional last argument of `createMap`). Reason: the Rioja tour opens at zoom 6.7, and with 7 stop 1 lost its relief (Sierra de la Demanda ridges, Pyrenees foothills). With 6 the tours keep relief at every stop. Terrain x1.5 untouched.
- Tests: `tests/unit/dataFile.test.ts` (one fetch for two callers, retry after failure); `tests/ui/story.spec.ts` (Rioja guide with tour open: each of the four files requested once).

## Method
Own script (scratchpad, not committed), same idea as the analyst report: Playwright Chromium (swiftshader), cache disabled, CDP byte counts, desktop 1440x900 / 20 s, phone 390x844 / 50 s with 4x CPU, 200 KB/s, 150 ms RTT, 2 runs, medians of 2. Local static server of the production build (so JS and GeoJSON are not gzipped: absolute MB are higher than live; compare before with after), real tile hosts. Before = build of e02c532 (parent), after = this branch. Tour = `#place=rioja&page&story`, opened with "Open the map", no scrolling. The before run on desktop varied (terrain 99 and 65 tiles for the atlas) because the 20 s window ends before the queue empties; after has no terrain at all in the atlas, so it does not depend on this.

## Before / after (medians of 2)
| Page | Requests | MB | Terrain tiles | Terrain MB | Data requests | Data MB |
|---|---|---|---|---|---|---|
| Atlas Spain, desktop | 202 -> 121 | 12.9 -> 6.7 | 82 -> 0 | 6.19 -> 0 | 4 -> 4 | 2.47 -> 2.47 |
| Atlas Spain, phone | 73.5 -> 44 | 8.0 -> 5.5 | 29 -> 0 | 2.42 -> 0 | 4 -> 4 | 2.47 -> 2.47 |
| Rioja guide + tour, desktop | 340 -> 224 | 23.9 -> 12.4 | 140 -> 30 | 12.35 -> 3.32 | 9 -> 4 | 4.99 -> 2.47 |
| Rioja guide + tour, phone | 122.5 -> 68 | 14.2 -> 7.6 | 55 -> 6 | 4.57 -> 0.49 | 9 -> 4 | 4.99 -> 2.47 |

Data requests per URL, tour, before: dops 2, added-boundaries 2, natural-earth-world 2, rioja-zones 3. After: 1 each, all views.
Terrain tile zoom in the tour after: z7 14, z8 3, z9 13 (desktop); z7 6 (phone).

## Shots (`Review/speed-wins/shots/`, with Esri imagery, 25 s settle)
after-atlas-spain-1440/390, after-tour-stop1-1440/390, after-tour-stop7-1440/390. Relief shows at both tour stops (checked at 1440 against a before shot; no seams from 512 tiles seen). The atlas Spain view is flatter than before (no hillshade, no 3D height): that is option A, as decided.

## Steps
- Loader + unit test: commits `Shared loader...` (2 commits, files split over them). Unit tests 395 pass (npm test, 2 s).
- Relief from zoom 7, 512 DEM, tour from 6, UI test: commit `Relief from zoom 7...`. `story.spec.ts` 16 pass (37 s). `Tools/check.sh` ALL CHECKS PASSED (7 s, build 1.7 s).

## Not done / notes
- Shade used to be one zoom finer than the relief; both are now 512, so close-in slopes are a little softer. Not compared close-in at zoom 12+.
- Win 2 (JS size), 4 and later untouched.
