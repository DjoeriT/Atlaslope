# France pilot (country wiring): BuilderBot report

Verdict: partly done. Tree, outlines, zones, /fr/ config and page, credits are in. Left: France mask and IGN BD ORTHO imagery
(blocked: the main checkout's `data/raw` is gone, see Blocker), the two guides and two tile-copy entries (LeadBot), shots.

Branch `agent/builder/fr-country`, from `origin/claude/france-wset-sources` (677b1d9).

## Steps
(step, commit, tests, wall time)
- Report started: ccba793.
- Tree, outlines, zones, config, page, credits, tests: d323637. Unit 548/551 [V] (vitest 2.5 s); the 3 failures wait on content, below. Build once [V] (2.1 s): `dist/fr/` with chablis, pauillac and the zone pages.
- Shots: not run (no France guides, so /fr/ has no tiles yet; no IGN layer).

## What is in [V]
- `Tools/data/build_places.py`: FR_GROUPS (nine batches, ids `fr-<slug>`), FR_SHIP = chablis, pauillac; course `wset-fr` "WSET"; country
  `france` with levels country, region, place, zone, zone. A group joins the course with its first shipped place (an empty group would show
  as a region with no guides and fail the Home count): today Bordeaux and Burgundy.
- Chablis: chablis-premier-cru and chablis-grand-cru as zones of chablis, the 17 climats as zones under them (zone inside a zone works:
  tree depth, breadcrumb France / Burgundy / Chablis / Chablis Grand Cru / Les Clos, level name "zone"). Names [A]: "Chablis Premier Cru",
  "Chablis Grand Cru", climats from INAO's denomination minus the prefix; `official` keeps INAO's form.
- Pauillac: alsoWithin left out (Haut-Médoc, Médoc, Bordeaux are not shipped); the code adds them once they are.
- Outlines: `build_fr_areas.py --map` copies shipped places and zones from `areas.geojson` into `data/added-boundaries.geojson`
  (shared `put_added` in `build_pt_areas.py`); +46 KB. Zones go to the map's zones source (`addedZones`, `src/map/focus.ts`), not the place layer.
- `src/countries.ts` france (code fr, mainland bounds, paths true, imagery `esri` for now); `COUNTRY_PAGES.france` (intro, "Not yet for France.",
  no photos); the mosaic renders nothing without photos.
- Map credits: "France outlines: INAO, for information" (#58), next to Portugal's.
- `build_masks.py`: France entry (FRA, mainland and Corsica, neighbours ESP AND BEL LUX DEU CHE ITA MCO) and ATLASLOPE_RAW; not run.

## Open points
- Blocker [V]: `/Users/djoeri/Developer/Atlaslope/data/raw` is a symlink to itself (made 21:46). `main` tracks `data/raw` as a symlink
  (from commit 8bee600, Portugal batch 1, merged in #214): a checkout replaced the real folder. Natural Earth (and every other raw file)
  is gone from disk; only `.claude/worktrees/france-prep/data/raw` holds a real folder (the WSET PDF). Needs: drop the tracked link from git,
  re-pull raw data (networked, owner's word). Then run `build_masks.py`, add the `ign-fr` layer (`src/map/imagery.ts` generalised over PNOA)
  and set France's imagery.
- Failing until content lands (not loosened): `home.test.ts` x2 (every place needs a guide: chablis, pauillac) and `tiles.test.ts`
  (headline and lede for `fr-bordeaux`, `fr-burgundy` in `content/tiles.json`).
- Home and Guides show a France card "0 regions · 0 guides" until the guides land [V by code].
- `data/places.json`: Portugal centroids moved by 0.0001° on rebuild (inputs drifted before this slice) [V]; nothing else outside France changed.
- `data/SOURCES.md` not updated (IGN BD ORTHO row comes with the layer; the INAO row exists on the base branch [R]).
- Download-size check (`Tools/check.sh`) not run [A: +46 KB stays under the limit].
