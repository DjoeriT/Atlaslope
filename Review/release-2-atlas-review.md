# Release 2 atlas: code review (ReviewBot, fresh eyes)

16 Oct 2026. Branch `agent/builder/release-2-atlas` (tip `c5af876`), copy at /tmp/claude-0/review-r2/src, diff /tmp/claude-0/review-r2/diff.patch.

**Verdict: ship after fixes.** 0 blockers, 5 should fix, 7 nits. The nine scope items are in. Unit tests, build and UI tests pass when re-run here.

## Findings

| # | Severity | File:line | What and why | Fix |
|---|---|---|---|---|
| 1 | should fix | `.github/workflows/deploy.yml` (no `VITE_ESRI_API_KEY`); `src/main.ts:26` | The mid-task Esri change has no effect on the published site. The deploy build has no key, so `esriKey` compiles to `void 0` (see `dist/assets/index-*.js`) and the site is EOX-only at every zoom. The report's [A] "Esri cross-fade" can never be seen live as things stand. | LeadBot asks the owner: either wire a referrer-restricted key as a repo secret in deploy.yml, or state in the release notes that release 2 is EOX-only. |
| 2 | should fix | `src/basemap.ts:39,47-49` | With a key, the EOX layer stops at zoom 10 and Esri is the only imagery above it. If Esri returns 401/403 (bad, expired or referrer-blocked key, or over quota), everything from zoom 10 up is the black `#0b1016` background. | Drop the `maxzoom` on the `eox` layer so EOX stays underneath (Esri covers it at full opacity anyway). |
| 3 | should fix | `playwright.config.ts:6-7` (unchanged since setup) vs CLAUDE.md Testing | The UI tests run on the Vite dev server, but CLAUDE.md says "against the built site". Two things are therefore untested: the production paths that break first at `/Paraje/` (the `?url` geojson resolved through `import.meta.url`, the `../fonts/` CSS urls, `base: './'`), and the real-data load (`applyOverrides` on the 1.6 MB file). I checked the paths by grepping `dist/` (they are relative); no test covers them. | Add one smoke test against `vite preview --base /Paraje/` that serves `dist/` and waits for `data-ready` with the real layer and the network blocked. The fixture can stay dev-only. |
| 4 | should fix | `src/main.ts:102-106,116,178-182` | Focus is lost on close. Close and Escape hide the card while focus is inside it, so focus drops to `<body>`. Escape on the views menu does not return focus to `#views-btn`. For keyboard users the only way to reach a DO is the search box (map keyboard selection is not done, report item 7), so this matters. | Remember the opener (search input, views button) and focus it in `closeCard()` and `toggleViews(false)`. |
| 5 | should fix | `src/main.ts:95`, `src/neighbours.ts:16-20` | Neighbours are computed synchronously inside `openCard`, before the card paints. The all-pairs symmetry test takes 10.5 s for 90 codes, so about 115 ms per code in Node on this box [R]. On a phone that is likely several hundred ms of frozen tap [A]. | Render the card first with neighbours "…", then fill them in from `requestIdleCallback`/`setTimeout(0)`. Or precompute all pairs after first idle. |
| 6 | nit | `index.html:17` | `aria-expanded` and `aria-controls` sit on an `input type=search` with no `role="combobox"`. `aria-expanded` is not valid on a searchbox, so screen readers ignore it. | Add `role="combobox"` and `aria-autocomplete="list"`; give `#search-results` `role="listbox"`, or drop `aria-expanded`. |
| 7 | nit | `src/main.ts:228` | `String(e.features?.[0]?.properties.code)` turns into `"undefined"` and sets feature state on a non-existent id. | Return early if there is no feature. |
| 8 | nit | `index.html:10` | `role="application"` on the map container is a wrapper: the MapLibre canvas inside it takes focus, and the label promises "Click a DO", which a keyboard user cannot do. | Drop the role, or reword the label to point to the search box. |
| 9 | nit | `data/SOURCES.md` (Esri mock row) | It says "the app uses the keyed endpoint below", but the keyed row is in the app section above it. | Change "below" to "above". |
| 10 | nit | `Review/release-2-atlas-report.md` Steps, item 4 | The step hashes `9753663`, `f080e2a` and `5ecacf7` are not on the branch (it has `f4c11c3`, `fff9bce`, `2920664`, `129aa65`). Item 4 says the quiz mocks still link to 01, but `c5af876` (a later commit) changed them to `../../`. | Update the report's hashes and item 4. |
| 11 | nit | `src/debug.ts:21` | `dist/` still contains the string "fixtures are dev-only" and a stub `loadFixture`. It is harmless and passes the `check.sh` grep (which looks for `fixture=`), but the code is not fully stripped as the comment claims. | Guard the call site with `import.meta.env.DEV` so Rollup drops it, or accept and reword the comment. |
| 12 | nit | `src/main.ts:57-61` | The label source duplicates the 1.6 MB GeoJSON in the worker (a second `geojson` source) to protect the fills from glyph failure. It works, but doubles parse time and memory on phones. | Keep it for now; later use one source with a `filter` layer, or a point-on-surface label layer. |

## Scope check (card items 1-9)
1. Map base: terrain and hillshade from Terrarium (maxzoom 13, terrarium encoding), EOX template in one constant, attributions as specified, slot comment present. In; Esri added by LeadBot's change (see 1, 2). [R] read.
2. DO layer: `?url` plus fetch through `applyOverrides`, no copy under `public/`; fill by region, outline, hover, labels with `text-allow-overlap:false`. [R] read and grep of `dist/`.
3. Card: name, level spelled out, long region name, neighbours (bbox prefilter, then `@turf/boolean-intersects`), note, chip moves, Close, Escape. Keyboard selection on the map is not done (disclosed); the search box is the keyboard path. [V] unit and UI tests.
4. Search: folds accents and case, includes the 16 polygon-less DOPs with the "No boundary in the atlas yet" card. [V] unit.
5. Preset views: Spain, the ten regions in `overrides.regions` order, then Rioja DO23 at pitch 60, boxes computed. [V] unit.
6. Chrome: `paraje-theme` in localStorage; fonts in `public/fonts/` resolve as `../fonts/` in dist; 44 px (2.75rem) on icon buttons, chips, results and menu items; `:focus-visible` outline. Phone (≤820 px): the card becomes a bottom sheet at 52 % height, the zoom stack moves to `bottom:54%`, the legend is hidden. At ≤1100 px the card is 22rem wide and the legend sits at 27rem. [R] CSS read only, nothing rendered.
7. Mocks 01 and 02 deleted; index and README updated; the quiz mocks' Explore link was changed to `../../` in `c5af876`, outside the card's edit list (LeadBot's commit, not the builder's). [R].
8. Tests: all named tests are present. Gaps: no phone-width test, no built-site test (finding 3), and the symmetry test alone would pass if every neighbour list were empty (the Rioja test guards against that). [R].
9. Ledger: EOX, Esri (keyed), Terrarium moved, glyphs added, fonts path updated, Esri mock row marked. [R].

## What I verified
- [V] `npm test`: exit 0, 22 passed (3 files), 10.99 s; `neighbours > are symmetric` alone took 10.49 s.
- [V] `npm run build`: exit 0, built in 3.87 s. JS 837 kB (229 kB gzip), `dops-*.geojson` 1,604 kB, with a chunk-size warning.
- [V] `npx playwright test` (dev server, fixtures, network aborted): exit 0, 8 passed in 19.8 s.
- [R] `dist/`: the CSS font urls are `../fonts/…`; the geojson loads through `new URL("dops-….geojson", import.meta.url)`; no `fixture=`, `__paraje` or `tests/ui` strings; `esriKey:void 0` (no key in the build); no `token=`.
- [R] `data/dops.geojson`: 90 features, 90 unique codes, so `promoteId: 'code'` and `findIndex` are safe.
- [R] Deploy workflow: no reference to `VITE_ESRI_API_KEY`.
- [A] The EOX template, CORS on EOX, Terrarium and OpenFreeMap, the "Noto Sans Regular" fontstack existing on OpenFreeMap, real imagery, dark-mode contrast on imagery, and phone and iPad rendering: none can be reached from this container. A cheap check for the owner: open the dev site on a laptop and load one EOX tile URL and `https://tiles.openfreemap.org/fonts/Noto%20Sans%20Regular/0-255.pbf` in the browser.
- Not checked: large-text layout, a rendered visual comparison with the retired mock, and Firefox/Safari (the Playwright config is Chromium only).
