# Report: release 2, the atlas for real (#5)

Builder: BuilderBot. Branch `agent/builder/release-2-atlas`. Card: `Review/release-2-atlas.md`, plus LeadBot's mid-task scope change (keyed Esri close-in imagery).

## Steps (step, commit, tests, wall time)
- Step 1, logic (`9753663`): `src/basemap.ts`, `neighbours.ts`, `regions.ts`, `search.ts`, `card.ts`, `.env.example`; 13 unit tests in `tests/unit/atlas.test.ts` pass (11.8 s wall; 10.1 s of it is the all-pairs neighbour symmetry test).
- Step 2, app (`f080e2a`): `index.html`, `src/main.ts`, `theme.ts`, `debug.ts`, `style.css`, `public/fonts/`, fixtures `tests/ui/fixtures/{three,empty}.geojson`, `tests/ui/atlas.spec.ts`; UI 7 passed (17.8 s).
- Step 3, mocks and ledger (`5ecacf7`): mocks 01 and 02 deleted and unlinked; `data/SOURCES.md` app section; label and relief sources split; close-button test; UI 8 passed (20.5 s).
- Final `bash Tools/check.sh ui`: EXIT=0, 39 s wall. Last lines: "Tests 22 passed (22)", "every data file has a source entry", "built in 3.81s", "clean", "8 passed (19.0s)", "ALL CHECKS PASSED".

## Verified / seen / assumed
- [V] by unit tests: neighbours symmetric; Rioja's include Navarra, not the Álava txakoli (it does not touch on real data); ten region views plus Spain and Rioja 3D, all non-empty boxes; "rias" finds Rías Baixas; polygon-less DOPs found; card model has exactly name, level, region, neighbours, note; fixture style has no remote sources; Esri left out without a key, added from zoom 9 (EOX to 10) with one.
- [V] by UI tests (fixture, network aborted): tap opens card with name and two neighbours; neighbour chip moves; Escape and Close close; search picks; theme flips `data-theme`, stays after a reload; at 1024 wide no corner of the selected square is under the card; preset view closes the card. Old `?fixture=empty` test kept and passing.
- [R] seen once on real data (dev server, software WebGL, tiles and glyphs blocked): first DO paint about 2.0 s; Rioja card shows neighbours Cava and Navarra; Cebreros card says "No boundary in the atlas yet"; at 390 px the card stacks at the bottom; the attribution shows MAPA, Terrain and EOX credits. dist: fonts resolve relative, no fixture or test hook strings.
- [A] the EOX template, real satellite, terrain and label rendering, the Esri cross-fade, first paint on a real laptop, phone and large-text layouts, dark-mode contrast on imagery: none could be seen here.

## Decisions and surprises (for LeadBot)
1. Glyphs: the card's symbol labels need a glyph server. I used OpenFreeMap's font endpoint (the project's existing tile provider) and added a ledger row. Found that a failed glyph fetch blanked the whole DO layer; labels now have their own source. Without glyphs (fixture mode) there are no labels.
2. Palette: `app.css` has no region colours; the mock's 7-colour legend is in the HTML. I used those 7 and added 3 in the same range (`src/regions.ts`).
3. Search stays visible on phones (the mock hid it); the card has no kicker so the region is not said twice.
4. Mocks 00, 03, 03b and 04 still link to 01 (Explore tab); those files are outside my edit list.
5. A `VITE_` key ends up in the public JS bundle; the Esri key should be referrer-restricted.
6. Commit trailers use the attribution lines my environment requires, not the ones in the brief.
7. Not done: keyboard selection on the map itself (keyboard users go through the search box); the "Atlas" base and layer toggles (out of scope).

## Verdict
Done. All nine scope items and the Esri change are in, and `Tools/check.sh ui` exits 0. The things nobody could see from here are listed under [A].
