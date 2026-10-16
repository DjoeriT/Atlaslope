# Release 4, card 1: facts on the place card

    Goal:        A visitor opens any quizzed place and reads its fact sheet, with a source under every row, the measured altitude
                 and climate, up to three credited photos, and a link to report a mistake; searching a grape finds its places.
    Task:        Types, loader and check for the fact sheets; render them on the place card; grapes in search.
    Role/model:  BuilderBot (Sonnet)
    Budget:      150k; stop and report at ~70% or after two failed tries
    Branch:      agent/builder/r4-facts-ui (worktree, from claude/release-4-reference-lm0q2o)
    Context:     Review/release-4-digest.md ("Defaults for gaps", "Files"); Review/release-4-fact-sheet-template.md (the schema);
                 content/facts/castilla-y-leon.json (one real sheet, Cebreros); content/sources.json; data/place-measures.json
                 (read with jq); data/photos.json (empty for now); src/cards/Cards.tsx (PlaceCard); src/tree/search.ts and
                 src/tree/tree.ts (how entries are built); Review/mock-atlas-v3/12-guide-rioja.html (the fact sheet and photos
                 markup) and assets/app.css lines 72-73, 85-87, 147, 202
    May edit:    src/facts/ (new), src/cards/, src/tree/search.ts and the place-entry builder in src/tree/ (grape names only),
                 src/strings.ts, src/styles/, tests/unit/, tests/ui/, tests/fixtures/
    Must not:    write or change any sheet text in content/; change data/ or Tools/; add a dependency; show anything for
                 places with quiz "none" beyond what release 3 shows

    Steps
    1. src/facts/: types matching the template; a loader that imports every content/facts/*.json (import.meta.glob, eager),
       content/sources.json, data/place-measures.json and data/photos.json; and checkSheets(sheets, places, sources) returning a
       list of plain-English errors. Errors: unknown or not-quizzed place id; a place in the wrong region file; a duplicate id;
       a row with text (or grapes, or style kinds) and no cite; a cite whose source id is not in sources.json or whose page is
       not "p<digits>"; an unknown style kind; an empty why line or one over 25 words; a region file with a sheet for some of its
       quizzed places but not all (a region file is all or nothing). Unit tests: each error from a small fixture; the real
       content passes. This test is the build check: Tools/check.sh already runs Vitest.
    2. Place card, in this order under the breadcrumb and title: the why line as the lede (it replaces the official-name lede;
       keep the official name as a small line if it differs); the rows Level, Main grapes ("local (grape)"), Other grapes,
       Styles, Climate (the written text), Climate (Köppen, measured: plain names with shares, e.g. "Cold semi-arid 67%,
       hot-summer Mediterranean 33%"; put the code-to-name map in strings: BSh hot semi-arid, BSk cold semi-arid, BWh hot
       desert, BWk cold desert, Cfa humid subtropical, Cfb oceanic, Csa hot-summer Mediterranean, Csb warm-summer
       Mediterranean, Dfb/Dfc/Dsb/Dsc continental (warm or cold summer), ET alpine tundra), Altitude (written text if any, then
       measured "Most of the land between 650 and 780 m"), Soil. Each row has a source line (.src): source title, page,
       and the date when it is before 2018, linking to the source URL (new tab, rel noopener). Empty rows are hidden. Then the
       photos (2-column grid, lazy, alt text from photos.json, credit "Photo: <artist>, <licence>" linking to the Commons page;
       a photo that fails to load hides itself). Then "Report a mistake": a mailto link to strings.facts.reportAddress with
       subject "Atlaslope: mistake on <place name>" and a body naming the place id and asking which row; hidden while the
       address is "". Then the existing Study region, Also within and Zones. A quizzed place without a sheet shows the release 3
       card plus the measured rows.
    3. Search: a place also answers to its main grapes (local and grape names), ranked after every name match; a grape hit
       shows "main grape: <name>" as its small detail instead of the level. Playwright (uitest build, fixtures as release 3):
       Cebreros shows its why line, main grapes, a source line under each row and the Köppen row; search "albillo" lists
       Cebreros; the report link is absent while the address is empty; keyboard reaches every link on the card.

    Tests:       as in the steps; keep every release 3 test green
    Done when:   Tools/check.sh ui green at desktop and iPad width, light and dark; download still under the 2 MB check
    Report:      300 words in the final message; [V]/[R]/[A]; list anything in the template you could not express
    Stop and ask if: a gap the digest does not settle
