# Portugal batch 1: 26 more guides, country pages (issue #149, 22 Oct 2026)

## Decided (owner, 22 Oct 2026)
- Scope "Option B": every mainland DOC plus Lisboa (a Vinho Regional that WSET names). Then "let's add Madeira and Madeirense".
  Rule now used per country (also sent to the France session): every wine PDO in the EU register; no PGIs except one WSET Level 3 names;
  zones only where the spec lists them. Left out in Portugal: the three Azores DOCs (Biscoitos, Pico, Graciosa) and 13 Vinho Regional names.
- Equal standing with Spain, ready for about 12 countries: mock `mocks/countries-structure.html` (Artifact), option A picked: country cards
  on Home, country pages `/es/` and `/pt/`, Guides becomes the country index. Map tours stay whole on Guides, with their labels (his ask).
- Fact sheet limits stay (25-word why line etc.; he asked if they could be lifted: kept, lines shortened instead).
- Photos for the 24 new places go in a second PR (his "Let's do that": PR now, photos after).

## Done (PR on `claude/guides-pt-1`)
- Outlines for 26 places: six one-shot helpers read each spec's area section into `Review/sources/pt-areas/<id>.json`;
  `Tools/data/pt_batch.py` merges them into `data/countries/pt/areas-spec.json`, copies the specs to `Review/sources/fetched/`, adds sources and
  empty sheets; `build_pt_areas.py` (new `--check` and whole-island `file` entries). Parishes a spec takes only in part are taken whole
  (`notMapped` says so); Alentejo's sub-regions are partly drawn by roads and streams, approximated by whole municipalities; Porto shares
  Douro's area; Madeira and Madeirense are the two islands from DGT CAOP RAM 2025 (781.7 km2).
- Tree: 8 Portuguese groups (North, Centre, Lisboa, Tejo, Setúbal Peninsula, Alentejo, Algarve, Madeira), 28 places; Lisboa kind `VR`.
- Sheets and guides: `headless.py --sheets` (new: a Sonnet run fills an empty sheet from `pack.py facts`), then the writer and the Opus checker.
  All 26 checked; the checker's unsure sheet edits reviewed and applied (each closer to the spec's words); 19 lines over the sheet limits
  shortened (the facts brief now states the limits).
- Country pages (builder, option A), map tours on Guides and country pages, tile lines (draft), test pins, `data/SOURCES.md` rows.
- Unit 545/545 [V]; build once [V]; UI tests not run locally (CI runs them; `tests/ui/home.spec.ts` moved the tour filter block to `/es/`).

## Not done (where it goes)
- Photos for the 24 new places: Commons search running (`photo_candidates.py pt`, 22 of 25 when the PR opened; Madeira not yet searched;
  Porto takes Douro's). Next PR: contact sheets, picks, `photo_ship`, crops. Thin on Commons: Távora-Varosa, Lafões, Beira Interior.
- Azores DOCs (needs CAOP RAA); France scope reply from the France session (owner asked).
- Home copy and all new tile/country copy are draft: owner rewrites.

## Numbers
- Guides [V, usage.py]: 26 places 19.6M (0.75M a place; Madeira pair 0.84M each). Helpers: outlines 6 x ~35K, mocks 75K + 98K,
  country pages ~150K, tests 45K, shortening 27K, Madeira outline 81K [V, agent usage].
- Session [A]: ~120 calls x ~110K context, about 13M re-read + 0.3M new.
