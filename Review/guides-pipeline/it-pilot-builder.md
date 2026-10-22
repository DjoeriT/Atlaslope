# Italy pilot (country wiring): BuilderBot report

Verdict: done for the wiring. Left for LeadBot: the two guides, the two tile-copy entries, photos, shots.

Branch `agent/builder/it-country`, from `origin/main` (42e7b8a).

## Steps
(step, commit, tests, wall time)
- Report started: a2c4f24.
- Tree, outlines, mask, config, page, credits, tests: 3347b29. Unit 579/582 [V] (vitest 1.9 s); the 3 failures wait on content, below. Build once [V] (1.7 s): `dist/it/` with barolo, chianti-classico and the country page.
- Shots: not run (no Italy guides, so /it/ has no real tiles yet).

## What is in [V]
- `Tools/data/build_places.py`: IT_GROUPS (nine WSET regions, ids `it-<slug>`), IT_SHIP = barolo, chianti-classico; course `wset-it` "WSET";
  country `italy` with levels country, region, place, zone. A group joins with its first shipped place: today Piemonte and Tuscany.
  Barolo and Chianti Classico: kind "DOCG", names and EU file numbers from `register.json` (PDO-IT-A1389, PDO-IT-A1235). No zones.
  Rebuild of `data/places.json`: +68 lines, Italy only (no drift elsewhere).
- Outlines: `build_it_areas.py --map` copies the shipped places from `data/countries/it/areas.geojson` into `data/added-boundaries.geojson`
  through the shared `put_added`, which now writes `approximate` too where a feature has it (and leaves out a missing `municipalities`).
  Barolo (Regione Piemonte) has no flag; Chianti Classico (ISTAT, 8 municipalities) has `approximate: true`.
  The raw store is `$ATLASLOPE_RAW` (default `~/Developer/Atlaslope-raw`), replacing the git-worktree lookup of `data/raw`.
- `src/countries.ts` italy (code it, bounds [[6.6, 36.6], [18.6, 47.1]] = mainland, Sicily, Sardinia, imagery `esri` (#66), paths true);
  `COUNTRY_PAGES.italy` (intro draft "From the Alps to Sicily.", "Not yet for Italy.", no photos).
- Map credits: "Italy outlines: Regione Piemonte (CC BY 4.0); elsewhere approximate, from ISTAT municipal limits", after France's.
- `build_masks.py`: Italy entry (ITA, mainland, Sicily, Sardinia; neighbours FRA incl. Corsica, CHE, AUT, SVN, SMR, VAT). Run with the
  raw store's Natural Earth: `data/countries/it/mask.json` (54 KB, 27 land polygons); Spain, Portugal and France masks unchanged. Not read
  by the app yet (Esri alone).
- `data/SOURCES.md`: `countries/it/mask.json` on the Natural Earth row; the `added-boundaries.geojson` row now names France's and Italy's
  shipped outlines (France's was missing since #228).
- Tests: tree (counts 160, Italy describe), places, climate, facts-measures, data-layers (Italy outlines and flag), map (imagery, credit
  lines), paths (Italy bounds against its mask), country-pages (four countries, Italy describe with stand-in guides).

## Open points
- Failing until content lands (not loosened): `home.test.ts` x2 (every place needs a guide: barolo, chianti-classico, 136 vs 138) and
  `tiles.test.ts` (headline and lede for `it-piemonte`, `it-tuscany` in `content/tiles.json`).
- `guides.test.ts` list not extended: barolo and chianti-classico go in with their guides.
- Home and Guides show an Italy card "0 regions · 0 guides" and no photos until the guides land [A, as France was].
- Download-size check (`Tools/check.sh`) not run [A: +about 60 KB of outlines stays under the limit].
