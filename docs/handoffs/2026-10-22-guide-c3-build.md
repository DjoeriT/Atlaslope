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

## Slice 2: the map unfold, PR #189 [V]
- "Read with the map" grows the photo to full screen, then the v3 full-screen map mode (own band, narrow column, stop cards, terrain
  toggle, locator, slope key). Close the map returns to the same paragraph. Owner fixes: heading B (number in the kicker), lede on top of
  the map column. ReviewBot: 0 blockers; double-click guard and overlay cleanup fixed. Flaky 9-stop test: #190, test.slow() with numbers.
- Release 64 published from 5320413 (tag release-64), live check green in headless Chromium at 1440 and 390. The tester note slipped
  out of #189 and ships in #191.

## Map tours: rule A and 13 new tours, PR #191
- Rule A (owner, in docs/PROJECT.md "Map tours", for every country): at least 4 fly stops in the guide's own text, and steep, 500 m
  altitude spread, two climates, or big (top tier or top 8 by area). 14 guides plus Ribera del Duero as the owner's pick.
- Built by 2 pilot builders and 4 parallel builders (owner allowed parallel for data-only work, 22 Oct 2026); LeadBot union-merged the
  shared lists. Measured: pilots 97K and 117K; batches 171K, 135K, 185K, 141K (about 57K a guide).
- Owner fixes: phone band says "Back"; the map answers sooner: a stop comes up at the paragraph or zone card that names it, flights
  1.5-2.5 s, 1.2 s wait (Rioja: 250-550 px sooner).
- Raimat (Costers del Segre): the pliego says "en el extremo oriental"; the map shows west. Marker keeps the guide's sentence.
- ReviewBot: 0 blockers; duplicate crop key fixed. Notes: 28 of 39 new crops keep the centre focus (builders say checked by eye);
  Cangas rock key repeats "Sandstones and slates" (two colours, one unit); some stops without a photo (Commons had none usable).
- Issues: #188 Priorat stop 6 never settles in shots-tour; #190 flaky 9-stop test (made slow, not fixed at the root).

## Open
1. Release 65 for the tours: only on the owner's words "publish release 65".
2. Batch 2's builder worktree (agent-a13c0db72cb2d9b09) was locked by a running process; remove it with its .env.local copy.
3. Raimat note in the guide (owner's call); Cangas rock key labels; shots-tour "imagery did not load" false flags.
