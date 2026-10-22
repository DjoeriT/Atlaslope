# Portugal pilot: Douro and Vinho Verde (issue #149, 22 Oct 2026)

## Decided (owner, 22 Oct 2026)
- Pilot Douro first, then Vinho Verde in the same session while he was away ("double check and review everything and keep going").
- Home and Guides page: he asked for proposals instead of writing the copy himself first. Mock built (below); not yet picked.

## Done (PR on `claude/portugal-douro`)
- Outlines: `Tools/data/build_pt_areas.py` joins DGT CAOP 2025 parishes into each place from the lists in its spec
  (`data/countries/pt/areas-spec.json`), writes `data/countries/pt/areas.geojson` (Douro, its three subregions, Vinho Verde) and puts
  each place's line into `data/added-boundaries.geojson`. Douro 2,618 km² (the spec says 250,000 ha); 8 small unlisted parishes come in
  through 2013 unions (script lists them); single estates the spec names are not mapped. Vinho Verde 8,398 km², 896 parishes, none missing.
- Tree: `Tools/data/build_places.py` adds Portugal (country), course `wset-pt` "WSET" with one group `pt-north` "North", places
  `douro` and `vinho-verde` (kind DOC, quiz none with a note: Study is Spain only for now). The builder also keeps two hand edits that
  had drifted from it: the Meseta chapter name and Tharsys's EU file number.
- Sources: `douro-doc` (2013 EU technical file, Portuguese, eAmbrosia 19506), `vinho-verde-doc` (2024 amendment with the single
  document, OJ C/2024/3412, English, fetched through the Publications Office because EUR-Lex refuses scripts; no page numbers).
- Fact sheets `content/facts/pt-north.json` (one headless Sonnet run each, spot-checked against the source); tile lines for both places
  and the region (draft copy: "Granite by the sea, schist inland").
- Guides: `content/guides/douro.json` (keep 49, fix 23, cut 0) and `vinho-verde.json` (keep 27, fix 18, cut 1) on the local route
  (`headless.py`), check logs in `Review/guides-check/`. Both open at `/pt/<id>/` [V, dev server: "Portugal · North", "DOC · WSET"].
- Home count and Guides page stay Spain-only (`SHOWN_COUNTRIES` in `src/home/guideCount.ts`) until he picks a mock option.
- Mock: `mocks/portugal-home-guides.html` on his Mac (git-ignored, 5 MB, one page): before, options A-D for Home and Guides, phone
  and desktop, draft copy. Recommended C, a country row with a picture strip each. Two Douro photos from Commons (credits on the page).

## Not done (where it goes)
- He picks a Home/Guides option; then the build: country heading on Guides, `/pt/` links, home copy (his words).
- Photos for the two guides (none yet: the page shows the name in an empty frame).
- Measures for Portugal (altitude, slope, Köppen): Köppen needs the Beck et al. raster, not on this Mac; the climate map shows the
  two places grey. Tests that pin measures are scoped to Spain with that reason written in them.
- Douro subregions as zones on the map (outlines are built in `areas.geojson`); Port as its own place (#51); OrtoSat speed test (#50).
- The national caderno texts (IVDP, CVRVV) would give richer Terroir than the EU files.
- Rest of Portugal: ~12 places.

## Numbers
- Helpers [V, usage.py]: Douro writer + checker 0.75M, Vinho Verde 0.76M; fact sheets 0.53M and 0.39M (headless, transcript usage).
- This session [V, transcript]: 18.9M re-read + 0.24M new over 114 calls, ending near 226K context. Estimate was ~3-4M for Douro
  and ~1-1.5M for the mock, then Vinho Verde added: well past the 1.5x stop, not stopped at the time. Why: the pilot built new pieces
  (outline builder, tree, tests, sources) in ~110 calls at ~165K context each; the guides themselves were 1.5M. Lesson: count
  calls x context before a pilot with new tooling; hand off after the tooling, before the guides.
- Per further place, now that the tooling exists [A]: ~0.75M helpers + session; estimate the batch as calls x 140K.

## Next session (fresh, start here)
Read this file. Ask him for the Home/Guides option (mock above). Then either build that option, or run the next Portugal batch
(Dão, Bairrada, Alentejo, Lisboa from the WSET list) with the same scripts: spec lists -> `build_pt_areas.py` -> `build_places.py`
(`PT_PLACES`, `PT_GROUPS`) -> stub sheet -> `sources.py <region>` -> headless sheet run -> `headless.py`.
