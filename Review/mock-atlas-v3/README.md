# Atlaslope mock-ups, round 3: the system round (16 Oct 2026)

Open `index.html` in Chrome and click through. Same stack as rounds 2.1 and 2.2 (MapLibre, bundled type and geography; 3D terrain and satellite stream from the internet). The quiz chain (setup, find it, choices, fact, results) is unchanged and lives in `../atlas-v2.2/`; these pages link into it.

## The place tree is the navigation (owner, 16 Oct 2026, after the first-principles check)
- `15-explore-spain.html` The Spain card: ten study regions in course order, each with its colour (the legend for the map) and known count. Explore opens here.
- `16-region-castilla.html` A region card: its places with their state, "continue here", the rest of Spain dimmed.
- Every card carries a clickable breadcrumb (Spain › Castilla y León › Toro). The region dropdown is gone; search finds regions too. The light/dark toggle lives under the Atlaslope wordmark with Home, Spain and About.

## Two small screens added before the builder brief
- `17-first-run.html` Shown once: what Atlaslope is, where to start (a study region or all of Spain, course order by default), and how to move, tilt and turn the map.
- `10b-home-nothing-due.html` The Today card when nothing is due: five new places from the next region, or just explore.

## The five screens the flow sketch marked new
- `10-home-today.html` Home is the Explore map with the Today card open: what is due, where to continue (with the five new places of the day), what to read next. Close the card and you are on the map. Satellite on by default with the atlas drawn over it; the map menu (bottom right, with zoom and 3D) switches it off.
- `11-layers-climate.html` The map menu, open, with the climate layer on. One menu for satellite, climate, relief and boundaries. Soil is not a layer: it lives in each place guide.
- `12-guide-rioja.html` The place guide, one template for every place: breadcrumb, an at-a-glance strip, where it sits, why it tastes as it does, fly-there buttons that move the 3D map, a fact sheet with a source line per row, zones, neighbours, sources, test me, next place in course order.
- `13-mastery.html` Progress: Spain shaded in four steps (new, learning, known, solid) per the rules decided on 16 Oct, a dashed ring on places due today, Rioja shaded by zone because the parent is known, counts per study region, tap a place to see where it stands, reset tucked away with a confirm and an undo.
- `14-explore-region.html` A place: Toro selected on satellite, breadcrumb, the place card with three cited facts and its state in words, read the guide or test me.

## What changed everywhere
- Satellite is the default, with the atlas (coast, rivers, towns, serif names, strong DO boundaries) drawn over it. One map menu bottom right, next to zoom and 3D, holds satellite, climate, 3D relief and boundaries.
- Three modes in the top bar: Explore, Quiz, Progress. The Atlaslope wordmark is home.
- Study regions and quiz pool as in 2.2 (ten regions, 68 core places).

## Still schematic or open
- The climate layer is by province, hand-classified (Atlantic, continental, Mediterranean), and says so on the map. A real layer (AEMET normals or Köppen-Geiger) comes with the build [A].
- Mastery states are a sample, not real progress. Counts are computed from the bundle: 68 core places, Castilla y León has 9 in it.
- Guide and card facts: grapes and zones cite the official pliegos; altitudes and climate lines are the author's and marked [A] until re-sampled from the IGN model and AEMET.
- Only Rioja has a guide; "Read the guide" on the Toro card opens Rioja's as the template.
- Canary Islands are outside the bundled geography (as in 2.2).

## Files
Generator: `/mnt/project-files/paraje/mocks/atlas-v3/src/gen3.py` (reads `dos.json`, dumped from `assets/data.js`). Runtime: `assets/app.js` and `assets/app.css`, round 2.2's with a round-3 section (satellite button, climate layer, mastery shading, fly-there, close card). When building restarts these move into the repo under `Tools/mocks/`.

## In the repo
Committed 16 Oct 2026 at the restart as the visual reference (approved mock; wordmark renamed to Atlaslope). `assets/data.js` (3.5 MB) and `assets/maplibre-gl.*` are not committed: to run a page, copy them from `/mnt/project-files/paraje/mocks/atlas-v3/assets/` (or `~/Developer/Paraje/mocks/atlas-v3/assets/` on the Mac) into `assets/`, then open the HTML in Chrome.
