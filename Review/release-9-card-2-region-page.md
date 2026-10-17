# Release 9, card 2: the region page

    Goal:        A study region opens as a page with a cover photo and photo tiles for its places, like the approved mock.
    Task:        (1) New src/pages/RegionPage.tsx (mock 4-region.html): cover 16:11-ish full width with the region name, kicker and credit pill; the region's lede (strings.cards.regionLede); a grid of place tiles (photo about 1:1, place name, kind, one line from the sheet's `why` cut at a sentence end, never mid-sentence; a place with no photo gets the name tile on `--paper2`), "Photos:" credit line under the grid; "Show <region> on the map" and "Back to map". Cover photo: the first photo of the first place in the region's course order that has one (decided default). (2) Route: `#region=<id>&page`; RegionCard gains a "See the region" button (primary) to it. Use the `page` flag on Selection that card 1 adds; if it is not in your base, add it the same way (`page?: boolean`, parsed from `page` in the hash) and say so in the report. (3) Styles in new src/styles/region.css on the existing tokens.
    Role/model:  BuilderBot (Sonnet)
    Budget:      150k; stop and report at ~70% or after two failed tries
    Branch:      worktree from the commit named in the prompt
    Context:     Review/visual-style.md; Review/mock-travel-v1/4-region.html (grep CSS and body; never read it whole, images are inlined); src/cards/Cards.tsx (RegionCard), src/tree/, src/facts/index.ts (photosOf, sheetOf), src/url.ts, src/app/App.tsx
    May edit:    new src/pages/RegionPage.tsx, new src/styles/region.css, src/cards/Cards.tsx (RegionCard only), src/app/App.tsx (region page route only), src/url.ts (only the page flag if missing), src/strings.ts (new keys only), new tests/ui/region-page.spec.ts, new tests/unit/region-page.test.ts
    Must not:    touch PlaceCard, src/pages/PlacePage.tsx, src/styles/pages.css (card 1 owns them), src/quiz*, src/map/, data/, content/; add dependencies
    Tests:       UI (fixtures, no network): the region card's button opens the page; the cover and every tile show a photo or the name tile, no broken image; a tile opens its place; "Back to map" returns to the region card; credits line present. npm test, npx tsc --noEmit, Tools/check.sh ui green.
    Done when:   the page matches the mock at 1440x900 and 834x1194, light and dark, 125% text; tests pass
    Report:      200 words in the final message; [V]/[R]/[A]; tokens used
