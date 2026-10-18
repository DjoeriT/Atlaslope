# Release 28: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad, and once on your phone. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
3D relief and the map with satellite off (atlas overhaul slice 4, owner points 6 and 7).

1. **Relief Spain-wide.** Open the atlas and tilt the map (right-drag, or two fingers up). The Pyrenees, the Cantabrian range and the Sierra Nevada stand up clearly, not as faint bumps.
2. **Relief in Rioja.** Zoom to Rioja and tilt. The Sierra de Cantabria and the Sierra de la Demanda rise on both sides; the Ebro valley reads as a valley. Over satellite and on the plain map.
3. **Close in, no walls.** Zoom to Haro and tilt. Slopes stay believable and the place outlines are not dragged up steep sides.
4. **Satellite off.** Map menu › switch off "Satellite imagery", then zoom to Haro. Roads, the Ebro and the Tirón, the town's streets, woods and the vineyards (light champagne patches) show instead of a flat colour. Zoom in further: buildings appear. Satellite back on: the road map goes away.
5. **Selection.** With satellite off, open a place card: the selected place stays clearly dark over the roads.

## For you
PR #88: `src/map/layers.ts` (relief by zoom, hillshade, atlas fills), `src/map/createMap.ts`, `src/map/style.ts` (own hillshade source), new `src/map/osmBase.ts`, `data/SOURCES.md`, `.gitignore` (`/shots/`), `Tools/preview/map_shots.mjs`. Checks: typecheck, map unit tests locally, full CI on the PR head, ReviewBot (2 should-fix fixed, 3 nits left). Before and after with satellite off: `/mnt/project-files/atlaslope/relief-base-map/`. Not verified: relief over satellite (the cloud renderer gives blank 3D frames), Safari, iPad, real phones.
