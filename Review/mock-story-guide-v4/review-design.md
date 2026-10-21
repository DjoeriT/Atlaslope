# Design review, map tour v4 mock (ReviewBot, 21 Oct 2026)
Verdict: FIX FIRST. Blocker 0, major 3, minor 5.
Shots in /private/tmp/claude-501/-Users-djoeri-Developer-Atlaslope/683294ea-a8be-4ac5-bfe5-dafbccbfe614/scratchpad/review/ (closed-1440-NN, closed-390-NN, on-1440-NN, on-390-NN, live-1440-00). Console errors: none in any of the 4 runs [V]. Live page scroll shots failed (app scrolls inside a container; only live-1440-00 taken), so live comparison for the lower page rests on the README's box comparison and the code [A].

## Findings
Major
1. Owner point 2 is NOT solved with the map closed: the stop card sits in the right column and is taller than the text, leaving a blank block under the left text (about 300 px on the place beat, 350 px on ground, 400 px on rules) and, in the weather beat, a blank block under the right-hand climate chart. /private/tmp/claude-501/-Users-djoeri-Developer-Atlaslope/683294ea-a8be-4ac5-bfe5-dafbccbfe614/scratchpad/review/closed-1440-01.png, closed-1440-02.png, closed-1440-03.png, closed-1440-05.png [V]
2. Map on: the map is on Rioja Alavesa while the column shows the Rioja Oriental card and the Rioja-wide climate chart; chart sits under the wrong zone. /private/tmp/claude-501/-Users-djoeri-Developer-Atlaslope/683294ea-a8be-4ac5-bfe5-dafbccbfe614/scratchpad/review/on-1440-06.png [V]; README already lists it.
3. Map on, 1440: big empty white band at the end of each beat (below the last card or fact block, and under "Made for the barrel" text) in the 477 px column. /private/tmp/claude-501/-Users-djoeri-Developer-Atlaslope/683294ea-a8be-4ac5-bfe5-dafbccbfe614/scratchpad/review/on-1440-08.png, on-1440-05.png, on-1440-11.png [V]. Probably scroll spacer for the map: needs a decision, not a guess.
Minor
4. Closed view lacks the live "All 5 photos" button on the mosaic and the live "Show map / Map tour" pair; the band replaces the global nav (Atlas, Study, Guides, About, search): no way to leave the guide except "Back to Rioja". /private/tmp/claude-501/-Users-djoeri-Developer-Atlaslope/683294ea-a8be-4ac5-bfe5-dafbccbfe614/scratchpad/review/closed-1440-00.png vs live-1440-00.png [V]
5. Closed: "Next in the course" and "Test me" rows have a leftover indent where the live icon sits. /private/tmp/claude-501/-Users-djoeri-Developer-Atlaslope/683294ea-a8be-4ac5-bfe5-dafbccbfe614/scratchpad/review/closed-1440-07.png [V]
6. Closed, weather and ground: the left lede is serif at a different size from the live page lede? Not checked against live in detail [A]. /private/tmp/claude-501/-Users-djoeri-Developer-Atlaslope/683294ea-a8be-4ac5-bfe5-dafbccbfe614/scratchpad/review/closed-1440-01.png
7. 4 images report not complete at scan time in both map-on and closed 390 (lazy, offscreen) [A]; closed 1440 had 0.
8. Haro stop photo is a railway station; crop is clean, but it is the odd card out for a wine guide [A]. /private/tmp/claude-501/-Users-djoeri-Developer-Atlaslope/683294ea-a8be-4ac5-bfe5-dafbccbfe614/scratchpad/review/closed-1440-04.png

## Checks
- Look vs visual-style.md: black band, champagne band button, white page, 6px corners, no pills, no drawn icons (the live location pins are the app's own markup): OK [V]. Cards use a cream fill and a black left rule, not the live page's plain cards: same family, a visible difference.
- Photo cards crops: no cut faces, glasses or bottles in the 7 stop cards seen [V]. Crops are CSS 3:2, not checked crops (README) [R].
- Copy: "AtlaSlope" in the band [V]. One idea per line holds on the cards.
- Phone 390: closed view is a clean single column, cards under text, chart full width [V] /private/tmp/claude-501/-Users-djoeri-Developer-Atlaslope/683294ea-a8be-4ac5-bfe5-dafbccbfe614/scratchpad/review/closed-390-02.png, closed-390-05.png. Map on: pinned map 330 px high over the column; reading area is short but legible [V] /private/tmp/claude-501/-Users-djoeri-Developer-Atlaslope/683294ea-a8be-4ac5-bfe5-dafbccbfe614/scratchpad/review/on-390-03.png.

## Owner point 3: charts and graphics
Live page (PlacePage.tsx imports Charts.tsx: ClimateBar, AltitudeRange; no other chart component) [read]:
- Measured climate (Köppen bar, Rioja vs All of Spain): live yes; mock map on yes (zone 2, on Oriental card); closed yes, same look [V].
- Altitude range (median, 360 to 890 m vs Spain): map on yes (beat 3); closed yes, same [V].
- Famous styles, Main grapes buttons, Also allowed, Wine types list: map on yes, closed yes [V].
- How it tastes colour dots, In short table, Producers, If you like this photos: map on yes except If you like this and Sources (not in the story column; README); closed yes [V].
- Mosaic of 5 photos: closed shows it without the "All 5 photos" button; map on shows one cover photo only.
So no chart is lost. Gaps: the placement beside the wrong zone, and "If you like this" and Sources missing with the map on.
Newer guides: PlacePage.tsx renders extras (EXTRAS keys: label terms and guide.more paragraphs) and compare lines (compare.map in both charts, other places overlaid) that Rioja's sheet may lack; I did not verify which Rioja has [A].
