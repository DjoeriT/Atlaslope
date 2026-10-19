# Meseta batch 2 (19 Oct 2026)

Route step 5 of "Run a region locally" (`docs/PROJECT.md`) for 8 places: Almansa, Campo de Calatrava, Casa del Blanco, El Vicario,
Finca Élez, Guijoso, La Jaraba, Pago Florentino. 20 of 25 Meseta guides are written.
Branch `claude/guides-meseta-2`, one PR.

## Done
- Guides [V, `check_guide.py`, 0 errors, all 8]. Warning left: Pago Florentino "15" (checked: extract line 116 "quince días antes").
- Sentence check (Opus), kept/fixed/cut: Almansa 13/8/5, Campo de Calatrava 37/32/0, Casa del Blanco 11/9/4, El Vicario 18/16/0,
  Finca Élez 16/12/1, Guijoso 20/8/1, La Jaraba 24/19/0, Pago Florentino 12/6/0. Campo de Calatrava is the longest guide (1000 words; largest pliego).
- Fact sheet edits by script: `Review/guides-pipeline/meseta/fact-sheet-fixes.md`. La Jaraba main grapes now Merlot and Tempranillo
  (Cencibel) (pliego section 7). All main grapes are objects; why lines 14-24 words [V].
- By hand: two chapter titles were three-item lists, cut to two (El Vicario "Shallow, limy ground", Finca Élez "Poor, stony ground").
  Body text still has grape and style lists of three, as in batch 1 (its review fixed titles only).
- Roster in `tests/unit/guides.test.ts` (104 guides). No UI fixture used these places; no new data files, so no new SOURCES.md rows.
- Tests [V]: `npm test` 306 passed. UI specs not run locally (no spec touches these places); CI runs them.

## Measured [V, `usage.py --budget 0.65 --places 8`, batch 2 helpers only]
| | re-read | new | total |
|---|---|---|---|
| 8 writers (Sonnet) | 1.61M | 0.34M | 1.95M |
| 8 checkers (Opus) | 2.05M | 0.47M | 2.52M |
| Batch 2, 8 places | 3.66M | 0.81M | 4.47M |
| Per place | 0.46M | 0.10M | 0.56M |

Under the 0.65M budget; no 1.5x stop. Batch 1 was 0.55M a place: the route holds. This session's own spend is not in the table.
Projection for the last 5 [A]: 5 x 0.56M = ~2.8M helpers, plus the batch 3 session.

## Open
- Unsure sheet edits not applied: Campo de Calatrava `soil.text` (pliego: clay loam is the subsoil), Finca Élez `why.text` (p6 does
  not make altitude the cause of acidity). From batch 1, still open: Uclés `grapes.main`, Campo de la Guardia `grapes.main`/`others`,
  Manchuela `styles.text`, Méntrida `famous.styles.1.text`.
- Local only, still: `npm run build` fails on the Mac (`./Doors` vs `doors.ts`, case-insensitive disk). Needs its own small fix.

## Open for batch 3
- Places left (5): Ribera del Guadiana, Ribera del Júcar, Río Negro, Valdepeñas, Vallegarcía. Valdepeñas and Vallegarcía are the "no guide"
  UI fixtures (`guide.spec.ts`, `facts.spec.ts`): after batch 3 no place lacks a guide, so those tests need a test-only fixture place.
- Home page copy [O, owner picked option A, 19 Oct], in the batch 3 PR (new copy: ReviewBot):
  - `index.html` stats row: merge the places and guides tiles into one: "106" / "wine places, each with its own guide".
  - Remove the "Free / to use, no account" tile.
  - Line ~93 "Deep guides to N places so far": drop "so far" once every place has a guide.
  - Meta and og descriptions ("Free, in your browser") and the donations line stay unless the owner says otherwise.
  - Check first [A]: docs say 109 guides vs 106 places; find why before any number goes on the page.

## Next slice after Meseta (own session, not batch 3)
- Guides page table of contents [O, 19 Oct]: the page gets long once all places have guides. New UI, so a mock round first (one page,
  options A-C, from the real page). Options proposed: A region jump row under the header (10 regions), recommended; B A-Z index of
  all places; C a filter box on the page. Owner picked A [O, 19 Oct].
  - Also [O]: each region row shows a cut-off number of places next to its map tile, then a link on to that region's page
    (`src/pages/RegionPage.tsx` exists). The mock shows the cut-off; its size (e.g. 4 vs 6 places) is for the owner to pick from it.
  - Also [O, 19 Oct]: the region tiles on the Guides page become home-hero style: an app screenshot of the region with the app's own
    place flags on it (like `public/home/hero.webp`), not a plain satellite crop (`public/guides/<region>.webp`, `region_tile.mjs`).
    All 10 tiles. One mock round covers all three (table of contents, cut-off, flagged tiles).
