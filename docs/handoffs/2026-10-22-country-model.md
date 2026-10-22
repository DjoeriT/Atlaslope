# Country model: a second country in the app, real /pt/ pages (issue #149, 22 Oct 2026)

## Decided (owner, 22 Oct 2026)
- #48: Portugal places get real pages at `/pt/<place>/`; Spain keeps `atlas/#place=` and moves to `/es/<place>/` in its own slice with
  redirects. He first answered "/pt/douro", then, after being told Spain is on the hash today, chose real paths now over "hash now, paths later".
- #49 WSET only for Portugal; #50 DGT OrtoSat 30 cm with Esri fallback after a speed test; #51 Port and Madeira as own places (overlap rule).
- Taken on the report's recommendation [A]: zones from CAOP parish lists, Portuguese sources read and written in English, islands after the mainland.

## Done (PR on `claude/country-model`)
- `src/countries.ts`: per country its URL code, map bounds, close-in imagery and whether its pages have real paths. Portugal: Esri until
  OrtoSat passes a speed test.
- `src/paths.ts` + `vite.config.ts` plugin `place-paths`: the build writes `dist/pt/<place>/index.html` for every place in a path country
  (the atlas page with `<base href="../../atlas/">`); the dev server serves the same. The app reads the place from the path, writes
  `/pt/<id>/` when a Portugal page opens and `atlas/#...` for everything else (Spain, map cards, Study).
- Tree: `countryOf(place)`. Country card, map bounds, the "All of <country>" comparison row, the tile line and the measures are per country.
  The study badge names the region's course ("Wine Scholar · ..." for `sws`, "WSET · ..." for a course id starting `wset`).
- `Tools/data/build_masks.py` (was `build_spain_mask.py`): builds Spain's mask (unchanged, checked byte for byte) and Portugal's mainland
  mask `data/countries/pt/mask.json`; masks use the key `land`.
- Checked [V]: unit tests 528 pass, `Tools/check.sh quick` green; a build with a temporary Douro place wrote `dist/pt/douro/index.html`,
  which opened the Douro page with "WSET · North"; Show map went to `atlas/#place=douro` and back returned to `/pt/douro/`; Toro still shows
  "Wine Scholar". The temporary place was removed; `data/places.json` is unchanged in this PR.

## Not done (where it goes)
- No Portugal content: places.json has Spain only, so no `/pt/` page is built yet. The pilot adds Portugal's country, a course with an id
  starting `wset`, and the Douro and Vinho Verde places (`Tools/data/build_places.py`).
- Home country choice and the Guides page section for Portugal: pilot, with the owner's own copy. Search hits and Guides links to Portugal
  places should use the `/pt/` path then (`src/home/guideCount.ts` writes `atlas/#place=` today).
- Study is Spain's course only: the "All of Spain" chip and the quiz map frame stay Spanish until Portugal has a course.
- OrtoSat imagery and its speed test; Portugal in the tour locator inset (`src/story/view.ts` still draws Spain); per-country size limit
  in `Tools/check.sh` (only matters once Portugal data ships): pilot.
- Spain to `/es/<place>/` with redirects: its own slice (#48).
- The fonts and icons in the atlas page use root paths (`/fonts/...`): fine on atlaslope.com, broken under a subpath, as before.

## Numbers
Session spend [V, transcript]: 7.9M re-read + 0.16M new over 61 calls, ending at ~170K context. Estimate was 5.6M + 0.4M for the model
slice plus 1-2M for real paths: within 1.5x.

## Next session: Portugal pilot, Douro and Vinho Verde (fresh session, start here)
Read: this file; `docs/handoffs/2026-10-22-countries-data.md` "Next session" step 3; `Review/portugal/report-first-principles.md` section 5;
`docs/PROJECT.md` "Run a region locally". Estimate ~1.2M for both guides at the Meseta rate [V rate, A scope], plus the places data and
home copy; pilot one place first and measure.
