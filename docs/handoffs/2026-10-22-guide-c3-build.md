# Guide page C3 build and the map unfold (22 Oct 2026)

Follows `2026-10-22-guide-redesign-r2.md` (its build brief). Main thread, kept going past 250K on the owner's word ("keep going in
this thread no matter what", 22 Oct 2026).

## Slice 1: the C3 guide page, PR #187 [V]
- Every place page is option C3: hero with the "Read with the map" card (`src/pages/MapCard.tsx`), prose left and a 33rem side column
  with stop photos and facts, no boxes, How it tastes as the champagne band, jump bar at the text edge (`src/styles/guide-c3.css`).
- No map card where there is no tour: "Fly to" stays and the hero shows one 3:2 photo with "All N photos".
- Photos at most 528 px: `node Tools/check-guide-photos.mjs` (rioja, priorat, ribera-del-duero; min ratio 1.52, limit 1.45).
- Checked crops for every framed page photo: `src/pages/pageCrops.json`, `node Tools/guides/crop_sheet.mjs --page`,
  `tests/unit/page-crops.test.ts`; `data/story/photo-focus.json` folded in. Scala Dei crop raised to 50% 20% by LeadBot (roofline).
- Priorat weather (Serra del Montsant, Angela Llop, CC BY-SA 2.0) and rules (Cellers de Scala Dei, Juan Emilio Prades Bel, CC BY 4.0)
  photos as `priorat-weather-1` and `priorat-rules-1`; a stop with no fly link shows its photo without a caption.
- Not as in the mock: no "Terroir · 4-minute read" kicker (new copy); the app's Show map bar stays above the hero. New string
  "Measured by AtlaSlope · Terrain: Mapzen" under measured lines in captions (ReviewBot note; tell the owner).
- On tour places the hero shows only the card photo; the other hero photos and "All N photos" are gone from the closed page (as the mock).
- ReviewBot: merge on green, 0 blockers, 1 should fix (above, owner to know), 4 notes (2 fixed, tour-open mosaic height left for slice 2).
- CI first failed on 4 UI tests, all intended C3 changes; tests updated (commit 9f8f224). Auto-merge set on the owner's "merge when green".
- Spend [V, agent usage]: builders 181K + 104K + 33K, ReviewBot 56K; LeadBot about 170K at this point, mostly re-reads.

## Decided (owner, 22 Oct 2026)
- Unfold first (slice 2, Rioja and Priorat), then more map tours.
- Next tours: pilot 2, one big and one steep: Ribera del Duero and Ribeira Sacra [A: check both are in the 13 by the rule in
  `docs/PROJECT.md` "Map tours"]. Then 3-4 guides per PR if under about 100K a guide. Brief: `2026-10-21-map-tours.md` "Next".

## Slice 2: the map unfold (branch `claude/map-unfold`)
- Card A (full-screen v4 map mode from release-59 src/story, whole guide in the reading column, Close the map to the same paragraph).
- Card B (FLIP grow from the card, cross-fade, fold-back, reduced motion). Card C (Priorat, shots next to the mock, ReviewBot).

## Open
1. Release after #187: ask the owner ("publish release N" only on his words).
