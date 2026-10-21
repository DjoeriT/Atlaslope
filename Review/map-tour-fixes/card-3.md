# Card 3 report (BuilderBot, Sonnet)

Branch `claude/map-tour-fixes`. Shots with PNOA/Esri imagery loaded: `Review/map-tour-fixes/shots-3/` (Rioja stops 1 and 7 and Priorat geology stop at 375; Rioja stops 1 and 7 and Priorat geology at 1440).

| Defect | Fix |
|---|---|
| 1 Valley view | `fitView` in `src/story/camera.ts`: a fixed view of a stop's place keeps the place (`fit`), and backs off (centred on the place, 0.1 zoom steps, at most 3) until the place outline is inside the padded map, with pitch and bearing counted (own perspective projection). Only the Rioja valley stop has both a fixed view and a stop place. Shot: Haro and Alfaro both in view at 375 and 1440. |
| 2 Geology invisible | Cause: the MAGNA WMS returns blank tiles at zoom 9 and below (checked), and the layer had minzoom 10. A geology stop's camera is now never below `GEOLOGY_MINZOOM` (10). Colours visible in `rioja-soils-375.png`. |
| 3 Key text | English renderings of IGME's unit names in `src/strings.ts` (e.g. "Sands, calcareous sandstones and ochre clays (Haro facies)", "Siltstones and red clays", "Alluvial deposits and floodplain", "Hornfelsed slates"). Title and credit unchanged. Key wraps at 375 (no scroll line). Wording of the four renderings is mine: owner may want to check. |
| 4 Scroll hold | `holdSteps` (120 px, `HOLD_PX` in GuideMap): an anchor less than 120 px below the one before is moved down; order kept. |
| 5 Show map button | `.pg.tour .showmap{display:none}` in story.css. |

Tests: unit `story-fit.test.ts` (new), others adjusted; story.spec 3 new at 375 (hold, geology tiles requested plus key wraps, no Show map). The scrolling test now places k-th link in a row 120 px apart (was 12). story.spec 15 passed, ~44 s (one wording assertion fixed and rerun alone, 6 s). `Tools/check.sh` full: ALL CHECKS PASSED, 7.5 s (2 MB: 1,944,827 B; tours 53,318 and 16,452 B). Build 1.6 s.

Not done / caveats: all-stops sweep at 375 and 1440 was taken (scratch, not kept) and viewed for Rioja barrel, alavesa, Priorat montsant: unchanged by this card; Rioja stop 2 and Priorat stops 3 and 4 were not shot (my script's anchor ranks missed them); the spec covers stop 2. Priorat slate colour (grey) is hard to see at 375 under the dark fade. Geology stops at 375 now sit at zoom 10 minimum, so a whole place may not fit there.
