# Country pages build (option A), 2026-10-22

Status: done, one open item for LeadBot (below). Branch worktree-agent-a0296bd0adc19d838.

## Steps
- Step 1 (f393836): Home country cards, template country/index.html (vite writes dist/es/ and dist/pt/ and drops dist/country/), Guides as the country index, SHOWN_COUNTRIES dropped, ten Portuguese crops moved into photoCrops.json, unit tests: home 28 + country-pages 10 pass (0.9 s).
- Step 2: build once (2.8 s, dist/es/index.html and dist/pt/index.html exist), shots at 1280 and 390 (Review/builds/country-pages-*.png), report.

- Step 3: owner follow-up. Band shows every tour open with chips, label and country; ?tours filter link per country; band on country pages. Unit 38 pass, build 2.1 s. tests/ui/home.spec.ts lines 104-120 (Show all button, fold, .gl .region filter) need rewriting.

## For the owner and LeadBot
- Portugal's tree has one study region (North) and two guides today, so the cards say "1 region, 2 guides" (the mock's 7 and 26 were a plan). Counts are read from the data and grow with it.
- 17 of the 27 parked Portuguese crops stay in Review/sources/photo-crops-pt.json: the unit test allows a crop entry only for a shown photo.
- tests/ui/home.spec.ts lines 114-123 (tour filter: `.gl .region`, "Show only guides with a map tour") now live on /es/ and /pt/, not /guides/: move that block to goto('../es/'). Not changed (structure, not text).
- docs/guides.md and src/cards/atlasCover.ts comment still mention the Spain-only gate (outside my files).
