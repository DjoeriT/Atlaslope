# Task card: release 2, the atlas for real

16 Oct 2026. Owner: LeadBot (setup thread). Builder: BuilderBot on Opus (map, geometry and layout judgement). Issue: #5.
Plan: `Review/development-plan.md`, section "Release 2". Visual spec: mock round 2.1, pages `public/mocks/atlas-v2/01-explore-spain.html`
and `02-explore-rioja.html` with `assets/app.css` and `assets/app.js` (read them as the spec; do not copy `data.js`, the app has its own data).

## Goal
Opening the site shows the full-screen 3D map of Spain with satellite imagery under it, the corrected DO layer coloured by the ten study
regions, a card on tap with the DO's name, level, study region and neighbours, a search box, preset views, and light or dark chrome.
Everything the mock's Explore pages do, the app now does for real, from `data/dops.geojson` through `src/dops.ts`.

## Scope
1. **Map base.** MapLibre, full screen, pitch and rotate on, 3D terrain and hillshade from the Terrarium tiles the mock uses
   (`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`, `encoding: terrarium`, maxzoom 13).
   Satellite: EOX Sentinel-2 cloudless, WMTS as XYZ, template
   `https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg` (note y before x) [A: the host is blocked from the
   cloud container, so the template cannot be probed here; keep it in one constant in `src/basemap.ts` so a wrong path is a one-line fix].
   Attribution in the map: `Sentinel-2 cloudless by EOX IT Services GmbH (contains modified Copernicus Sentinel data 2020)` and
   `Terrain: Mapzen, AWS Open Data`. Esri World Imagery is **not** used (terms need an account; owner is deciding). Leave a clearly marked
   slot in `src/basemap.ts` for a second close-in imagery source, nothing more.
   An "Atlas" (non-satellite) base is not in this release; satellite always on. The map chrome (buttons) follows the mock.
2. **DO layer.** Load `data/dops.geojson` plus `data/dop-overrides.json` through `applyOverrides` (import the files with Vite, for example
   `?url` plus fetch, or a JSON import; one source of truth, no copies under `public/`). Fill colour per study region, outline, hover
   highlight, labels that give way (symbol layer with `text-allow-overlap: false`). Region colours: take the mock's palette from `app.css`.
3. **DO card** (tap or keyboard select): name, level (DOCa / DO / VC / VP spelled out once, e.g. "DOCa · Denominación de Origen Calificada"),
   study region (long name from `overrides.regions`), neighbours (DOs whose polygons touch or overlap this one), and the `note` when present.
   Neighbours: compute in `src/neighbours.ts` with a bounding-box prefilter then a real intersection test (a small dependency such as
   `@turf/boolean-intersects` is fine; add it to `package.json`). Tap a neighbour name to move to it. Close button; Escape closes.
4. **Search.** One text field (top left as in the mock) over all DO names, including the 16 polygon-less DOPs from `overrides.missing`,
   which show a card saying "No boundary in the atlas yet" with level and region. Selecting a result flies to the DO and opens its card.
5. **Preset views.** A menu: Spain, then each of the ten study regions in `overrides.regions` order, then Rioja (zoomed to DO23 with pitch).
   Region views are computed from the union bounding box of that region's polygons, not hand-typed.
6. **Chrome.** Light paper and dark, following the system with the half-circle override as in the mock, stored in `localStorage`
   under `paraje-theme`. Typefaces Newsreader and IBM Plex Sans: copy the woff2 files from `public/mocks/atlas-v2/assets/fonts/` to
   `public/fonts/` (SIL OFL, already in `data/SOURCES.md`; update that row's path). Tap targets 44 px, every control labelled for screen readers,
   keyboard reachable. Works at 1440, 1024 (iPad) and phone width (stacked card).
7. **Retire mocks 01 and 02.** Delete `public/mocks/atlas-v2/01-explore-spain.html` and `02-explore-rioja.html`, remove their links from
   `public/mocks/atlas-v2/index.html` and its README (one line there: "01 and 02 retired in release 2; the app has them"). Leave 00, 03, 03b, 04.
8. **Tests.** Unit (Vitest): neighbours are symmetric and Rioja's include Navarra and Álava's txakoli does not appear [check: it should not touch];
   every region view has a non-empty box; search finds "Rías Baixas" from "rias"; card model has exactly the fields above.
   UI (Playwright, fixture, no network): a small GeoJSON of three touching squares in `tests/ui/fixtures/` loaded by `?fixture=three`,
   with no raster sources in fixture mode; tests: tap a polygon opens the card with the right name and two neighbours; search picks one;
   dark toggle flips `data-theme`; the card never covers a selected polygon at 1024 wide. Keep the existing `?fixture=empty` test.
9. **Ledger.** `data/SOURCES.md`: add EOX Sentinel-2 cloudless (free for non-commercial use with credit, read 16 Oct 2026 at
   cloudless.eox.at/products/viewing [R]); move the Terrarium row from "Mock-only layers" to the app section; mark the Esri row "mocks 03 to 04 only".
   The fonts row gets the new path.

## Files you may edit
`src/**`, `tests/**`, `index.html`, `package.json`, `package-lock.json`, `vite.config.ts`, `playwright.config.ts`, `public/fonts/**`,
`public/mocks/atlas-v2/{index.html,README.md}` and the two deleted pages, `data/SOURCES.md` (rows named above only), and your report
`Review/release-2-atlas-report.md`. Nothing else. `data/*.geojson` and `data/dop-overrides.json` stay as they are.

## Constraints
- `Tools/check.sh ui` must pass; capture its exit code (`bash Tools/check.sh ui; echo EXIT=$?`), never pipe it through grep before reading it.
- No network calls from tests. Fixture mode (`?fixture=`) must also remove the raster and terrain sources. Debug flags stay in `src/debug.ts`.
- No secrets, no keys. No new data files without a `data/SOURCES.md` row.
- Do not touch the quiz. No Rioja zones in this release (they come back in release 6).
- Commit in steps on your branch with messages that start with the step, reference `#5`, and end with the two attribution lines LeadBot gave you.
  Do not push.
- Performance: first paint with the DO layer under three seconds on a laptop [A]; if `dops.geojson` (1.6 MB) is too slow, say so in the report
  rather than simplifying it silently.

## Done when
All nine scope items are in, `Tools/check.sh ui` exits 0 (quote the final lines in the report), and the report lists what is [V] verified by a test,
[R] seen once in the browser or build output, and [A] assumed (the EOX template, real tile rendering), plus anything left.

## Budget
60 turns on Opus. Stop at turn 40 or after two failed tries at one problem and write the hand-back.
