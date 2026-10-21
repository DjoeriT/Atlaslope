# Design check, story guide mock round 2 (21 Oct 2026)

Verdict: fix first (small fixes, no redesign). Blocker 0, should-fix 5, nit 4.
Ran: Chromium headless with software GL, 4.5 s wait per stop. Shots: shots/check-top, check-rioja-2, check-rioja-5, check-priorat-2, check-priorat-5, check-phone-2, check-full. Software GL may soften tiles a little; the blur in item 1 should be checked once in a real browser.

## Should fix
1. Sierra de Cantabria (Rioja stop 2): the view does not show "protect from the north". Camera looks along the range with a hazy horizon, the near half is blurred low-res tiles, and the range reads as a pink band, not a wall. Fix: look south from the north side (bearing about 180), pitch about 70, zoom in a step so the foreground tiles load, and place the pin on the crest.
2. Slope tint, Priorat slate hills and Siurana: pink-maroon covers about a third of the land, so it reads as a colour wash on the satellite image, not "light". Fix: cap opacity at about 15 to 18% (README says 27%), or fade it in only above 35%; keep Rioja as is.
3. Siurana river (Priorat stop 1): the sentence is about a river in a depression, but the river is barely visible (small dark line at the bottom, a lake at the right edge). Fix: centre on the river course, lower pitch to about 55, add the river as a thin champagne line.
4. Phone, Sierra de Cantabria: the credit line (3 lines) sits over the top of the stop card and cuts its heading. The ON THE MAP label and title are hidden under the map. Fix: put the credit under the map in 1 line (shorten to "Tint: slopes over 30% · height x1.5 · IGN, Esri, Mapzen") and add scroll-margin so the card starts below the sticky map.
5. Desktop, Rioja stop 2: about 250 px of empty white above the card, the left column feels empty while the map does the work. Fix: reduce the spacer between steps, or start each stop card higher.

## Nits
6. Option A to D: the four cards are distinct and plain, no pills, no icons. A and B are very close in weight; give A no card border so it reads as a link inside a paragraph.
7. Option D: the champagne bar under the band is cut off at the bottom of the card, and "Start" is a second outlined button that competes with the band. Fix: make the whole band the click target, drop "Start".
8. Map controls: the compass button icon in the top-right controls is a tiny arrow glyph, unclear. Fix: use the default MapLibre compass or hide it.
9. Terrain switch: the unselected x1.3 label is low contrast on black (grey on #111). Fix: use champagne at 70%.

## Checked and fine
- Rioja Alavesa stop: outline in champagne, label, strong view of the zone against the Sierra; the tint is light here and the land stays readable.
- No dark patches outside the black band and map chrome, no pills, no drawn illustrations. Credit line states tint and terrain height at all sizes. Black band, champagne, 6px corners as per house style.
- Priorat slate hills view shows steep slopes well (the tint is the only issue, see 2).
- Not checked: motion and reduced-motion, large text, iPad width, Priorat stops 3 and 4.
