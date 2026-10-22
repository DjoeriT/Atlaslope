# France WSET L3: all guides and photos (owner goal, 22 Oct 2026, issue #149)

Owner goal, verbatim: "get all the guides up for the WSET level 3 list, basically so for the 96 appellations. If need be align
with the Portugal and Italy session (that will come after you) to get it done." Then: "The goal should include photos".
Decisions: #52-#58 (`docs/architecture-decisions.md`), plan `Review/countries/france-plan.md`, prep `Review/countries/france-prep/`.

## Scope
- 94 places, not 96: the WSET name table has 94 rows with an EU register number [V] (`data/countries/fr/wset-places.json`).
  The other 14 rows are districts or sub-names (five Champagne sub-zones, Alsace Grand Cru heading, Bourgogne DGCs, Mâcon-Villages,
  Beaujolais-Villages): text inside their parent's guide, not their own guides [A, to confirm with the owner].
- Batches (from the table): Burgundy 23, Loire 18, Bordeaux 17, Rhône 14, South 9, South-West 5, Beaujolais 5, Alsace 2, Champagne 1.

## Done
- PR #221 (`claude/france-wset-sources`, auto-merge on): place list, sources for all 94 in `Review/guides-pipeline/fr-<batch>/`
  (89 eAmbrosia single documents, 5 INAO cahiers), French markers in `extract.py`, outlines for 93 places (2.6 MB; Champagne
  missing: not in INAO's wine parcel file), photo pass `photo_candidates.py fr` (Chablis 9, Pauillac 17 candidates).
- `Tools/countries/fr_wset.py --content <ids>` adds `<id>-doc` sources and empty sheets for a batch (run for chablis, pauillac;
  uncommitted in the fr-sources worktree when this was written: commit it on the pilot branch).
- Builder (Opus) wiring France as third country (started 22 Oct): `build_places.py` FR_GROUPS (the 9 batches) and FR_SHIP
  (only shipped places enter the tree), Chablis zones, `countries.ts` france (code fr, imagery 'ign-fr' = IGN BD ORTHO over Esri),
  `COUNTRY_PAGES.france`, mask, outlines on the map, "INAO, for information" credit. Report `Review/guides-pipeline/fr-pilot-builder.md`
  on its branch.

## Next steps (in order)
1. Pilot PR: builder's branch + `--content chablis pauillac`; `headless.py --sheets fr-burgundy <run> chablis`, same for
   `fr-bordeaux pauillac` (budget 0.8M a place; hard stop 1.5x); photos from the contact sheets (square crops checked,
   `src/home/photoCrops.json`, `Tools/guides/crop_sheet.mjs`), `COUNTRY_PAGES.france.cardPhotos`; screenshots first;
   ReviewBot (new screen); auto-merge after its report. Then message the Italy session: tokens per guide (re-read/new) and lessons.
2. Per batch, one PR each, in this order (smallest risk first): Bordeaux, Burgundy, Loire, Rhône, South, South-West, Beaujolais,
   Alsace, Champagne. Per batch: extend `FR_SHIP` in `build_places.py`, `fr_wset.py --content <ids>`, `build_places.py`,
   `headless.py --sheets fr-<batch> <run> <ids...>` (script, never chat), `photo_candidates.py fr <ids>`, photo picks, PR.
3. Champagne outline: commune list from its single document (`Review/guides-pipeline/fr-champagne/champagne.extract.txt`,
   section 5) through IGN ADMIN EXPRESS communes.
4. Nesting beyond Chablis (Bordeaux > Médoc > Pauillac alsoWithin; Burgundy villages inside Bourgogne): set alsoWithin once both
   ends ship.

## Pilot photo picks (LeadBot, from the contact sheets, 22 Oct)
- Chablis: chablis-1, -2, -6, -4, -8 (slopes, vines, town in autumn). Not: -5 (shed), -7 (garden), -9 (sliver).
- Pauillac: pauillac-17 (Latour tower over vines), -16 (gravel soil), -15, -11 (Pichon), -2 (barrels). Not: -6 (a person), -5,
  -13/-14 (book pages), -1, -9. Candidates: `Review/sources/photo-candidates-fr.json` (keys = sheet labels).

## Pilot PR #228 (ReviewBot: ship, 0 blockers)
- Measured [V usage.py]: Chablis 0.80M (0.57 re-read, 0.22 new), Pauillac 0.70M (0.56, 0.13). Helpers: builders ~155K + 82K + 52K,
  photo pass 36K, rule books 83K, ReviewBot 52K.
- For the owner: footer copy still says "Spain and Portugal" (draft copy, his rewrite); the France intro and the tile lines are draft.
- Not fixed, pre-existing: on mobile guide pages the floating "Show map" button covers the section tabs (check Spain too); in dev,
  vite.config.ts country-page transform answers every /xx/... URL, so /fr/chablis/ and /pt/douro/ give 500 in `npm run dev` (build fine).
- By design: guide pages show at most 3 photos per place (`photosOf`), so "All 3 photos" though 5 ship.
- Raw data lost from the main folder (data/raw symlink, fixed by #223); Natural Earth re-fetched to the scratchpad for the mask only.

## Blocker for the batches: the 2 MB download check (Italy session, 22 Oct night)
- Main sits at 1,995,742 of 2,000,000 bytes gzipped [R, Italy session]; each new place adds ~3.6 KB (its page, its outline in
  added-boundaries, its atlas.js row). France's 92 places (~330 KB) cannot pass as the check stands. Owner decision asked by Italy:
  A) count only the real first load and lazy-load each country's outlines, or B) raise the limit. Nobody edits Tools/check.sh until
  he decides; France batch PRs wait, content keeps being written.
- After #229 merges: add France's raw files (INAO zip, att/, cdc/ with the 9 direct URLs) to the raw manifest.

## Numbers
- Estimate: 94 x 0.75M = ~70M guides [V rate Portugal, A France], about 90% re-read; photos ~0.1M a place [A]; pilot engineering
  ~5-10M [A]. Owner's goal is the go above 20M; region by region, report each batch's measured number.
- This session [A]: long (compacted once); helpers so far ~0.2M.
