# ReviewBot: PR #187 (ecdd105, C3 place page)

Verdict: MERGE (after green CI). Blocker 0, should fix 1, note 4. I did not run tests or the build; CI is the check. I read the diff and 4 of the 7 compare PNGs.

## Should fix
1. src/pages/PlacePage.tsx:~193-197 [V read]: on a guide with a tour (Rioja, Priorat) with the tour closed, the Mosaic is gone. The card shows only the cover photo, so the guide's other hero photos and the "All N photos" viewer are no longer reachable until the tour opens (`#place=rioja&page&story`). The mock shows the card here, so this looks intended, but no section, fact or credit is lost only if the owner accepts losing the viewer. Confirm once with the owner, or say it in the tester note.

## Notes
1. src/pages/PlacePage.tsx:118 [V read]: stale comment still says back to "Open the map"; the code now focuses `.mapcard`.
2. src/story/story.css:9 vs src/styles/guide-c3.css:22 [A]: `.pg.tour .pg-mosaic{height:min(22rem,34vw)}` (3 classes) beats `.pg-hero .pg-mosaic{height:auto;aspect-ratio:3/2}` (2 classes), so the tour-open mosaic keeps the old fixed height. Check the open-tour screenshot; remove the old rule if unwanted.
3. 528 px cap [A]: card (.mapcard max-width 33rem) and Mosaic (33rem) are capped in CSS. A single stop photo (`.pg-fig img` width:100% of the side column, slot 33) has no explicit max-width; it was 528 px at 1440 in app-priorat-1440-rules.png, but at wider screens it depends on the column width. Add `max-width:33rem` to `.pg-figs`.
4. Credit line sits at the end of the page (`pg-credits-end`), not under the photos [V read]. This meets the "one visible line per set" rule; flagging only because the stop photos are far from it.

## Checked and fine
- Card accessibility [V read] (MapCard.tsx, guide-c3.css:31-48): one `<a>` (Link, tests use `a.mapcard`), name from its text "Read with the map / N minutes · N places to fly to", image alt="", glyph and arrow aria-hidden. Focus ring: 3px `--focus` outline, offset 3, plus bar inversion on focus-visible. Reduced motion handled. Focus returns to the card on Hide map.
- Priorat photos [V read] (data/photos.json): weather = Angela Llop, CC BY-SA 2.0, licence and Commons page links; rules = Juan Emilio Prades Bel, CC BY 4.0, both linked. Credit.tsx adds "cropped and resized" for /^CC BY\b/, which matches both. Both appear in the "Photos:" line through `pics`/`oneEach` (authors differ, so both survive). No tooltips: Pic.tsx has no title. Checked focus entries exist in src/pages/pageCrops.json (rules 50% 20%, weather 50% 45%) with a file hash. SOURCES.md row names both, with authors, licences and URLs.
- Lost content [V read]: all strings removed (jumpToTour, kickerMap, bandTitle, bandSub, openMap) and TourBand/TourStill have zero remaining references (git grep). Sections, zone cards, alike, producers, sources, and Sources tags are all still drawn; alike moved before extras and the jump bar order was changed to match. Copy: only the two card strings are new, plus `measuredBy` ("Measured by AtlaSlope · Terrain: Mapzen"), which is a third new string not named on the card. Say so to the owner.
- UI specs [V read]: story.spec and place-page.spec updated (a.mapcard, `.pg-hero .pg-credits`, `&story` for Rioja's frames). facts.spec and the other `.pg-mosaic` specs use places without a tour (cebreros, yecla, ribera). No leftover selector for the removed band. Not run.
- Screenshots [V]: app-rioja-1440-hero matches mock C3 (card, champagne bar, 6px corners, no pill). The breadcrumb "SPAIN" replaces the mock's "TERROIR · 4-MINUTE READ" kicker; fine.
- Dead code [V read]: none found; Mosaic's slot sizes now use sizesFor.

Not checked: the 390 px and Ribera screenshots, iPad width, large text, tsc, lint, full test run.
