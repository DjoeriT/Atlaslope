# Report: release 2, the atlas for real (#5)

Builder: BuilderBot. Branch `agent/builder/release-2-atlas`. Card: `Review/release-2-atlas.md`, plus LeadBot's mid-task scope change (keyed Esri close-in imagery).

## Steps (step, commit, tests, wall time)
- Step 1, logic (`f4c11c3`): `src/basemap.ts`, `neighbours.ts`, `regions.ts`, `search.ts`, `card.ts`, `.env.example`; 13 unit tests in `tests/unit/atlas.test.ts` pass (11.8 s wall; 10.1 s of it is the all-pairs neighbour symmetry test).
- Step 2, app (`fff9bce`): `index.html`, `src/main.ts`, `theme.ts`, `debug.ts`, `style.css`, `public/fonts/`, fixtures `tests/ui/fixtures/{three,empty}.geojson`, `tests/ui/atlas.spec.ts`; UI 7 passed (17.8 s).
- Step 3, mocks and ledger (`2920664`): mocks 01 and 02 deleted and unlinked; `data/SOURCES.md` app section; label and relief sources split; close-button test; UI 8 passed (20.5 s).
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
4. Mocks 00, 03, 03b and 04 linked to 01 (Explore tab); LeadBot repointed them at the app in `c5af876`.
5. A `VITE_` key ends up in the public JS bundle; the Esri key should be referrer-restricted.
6. Commit trailers use the attribution lines my environment requires, not the ones in the brief.
7. Not done: keyboard selection on the map itself (keyboard users go through the search box); the "Atlas" base and layer toggles (out of scope).

## Review round (fresh-eyes review, 16 Oct 2026)
- Finding 2 (`4c01437`): EOX stays on at every zoom, under Esri; unit test checks that EOX has no maxzoom.
- Finding 5 (`34f9d83`): the card paints first with "Finding neighbours…", and the neighbours are filled in on the next task. The UI tests wait for them.
- Finding 4 (`a9af91e`): on close, focus returns to the search box (if the card was opened from search) or to the views button. There is a new UI test for both.
- Finding 3 (`455d900`): `tests/ui/built.spec.ts` builds the site, serves it with `vite preview --base /Paraje/` and blocks every outside request. It checks one 200 for the real `dops-*.geojson`, `data-ready`, status "Spain", the 12 preset views, and that "rias" opens Rías Baixas. [V] It showed that MapLibre's `load` (and `idle`) can hang while tiles and glyphs are unreachable: the test failed 2 runs out of 3 in the full suite. Two changes fixed it. The DO layer now starts on `style.load`, with the data fetch begun at once. `data-ready` now means the DO source has loaded. The full suite then passed 3 runs out of 3, plus the final check.
- Nits 6, 7, 8, 9, 11 (`f4969df`): for 6 I dropped `aria-expanded` from the search input rather than adding `role="combobox"`, because the results are buttons, not listbox options. The other nits went in as the review suggests. `dist/` no longer contains the fixture loader or the test hook [R, grep].
- Finding 1 is already handled on main: deploy.yml passes `VITE_ESRI_API_KEY` since `4cd2340` (LeadBot). Nit 12 (duplicate label source) is accepted as is.
- Final `bash Tools/check.sh ui`: EXIT=0, 44 s wall. Unit 22 passed, build 3.71 s, "clean", UI "10 passed (24.1s)", "ALL CHECKS PASSED".

## Verdict
Done. All nine scope items and the Esri change are in, and `Tools/check.sh ui` exits 0. The things nobody could see from here are listed under [A].
