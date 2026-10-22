# Card A2 report: full-screen map mode (slice 2, #148 #127)
Status: done (see differences).

## Steps
1. Commit "Map mode as the v3 full-screen stage": own band (AtlaSlope, Chapter n of 4, Close the map, Back to <place>), no site nav/search/hero/jump bar, 544 px column from beat 1, stop cards with "On the map", chip, terrain x1.5/x1.3, locator, slope key + credit, names markers redrawn when the names file lands. Tests: tsc clean, npm test 401 green (2.2 s), build 2 s.
2. Commit "tests, shots tool, report": story.spec.ts updated (opens on stop 1, band content, terrain toggle, chapter in band): 14 passed, 30 s. shots-tour follows data-fly, skips the cover step, accepts cached tiles.
- shots:tour rioja phone+desktop: all stops ok (188 s). priorat: all stops reach the map; stop 6 (licorella, geology WMS) never holds still within 30 s although imagery is on screen: flagged by the tool, not an imagery failure.

## Mock shot elements (unfold-c3-2.png), present / missing
Present: black band with wordmark; "Chapter 1 of 4"; Close the map; Back to Rioja; no site nav/search; narrow column 544 px at 1440 starting at beat 1 (no hero, mosaic, jump bar); stop card (photo, ON THE MAP, title, caption, measured line); chip top left; terrain height x1.5/x1.3 (works, credit follows); zoom; Spain locator bottom left (moves with the map); slope key + credit line at the bottom; map flown to the stop, tilted and close; phone: map pinned 42% under the band, no chapter text in band (as the phone mock).
Different / extra: beat heading keeps the "THE PLACE" kicker and the fly links row (reused PlacePage parts); source line shows the short "Pliego · pp. 15, 20" form, not the long one; credit says "Terrain x1.5", the mock "height x1.5"; band has no progress bar; the cover step (whole place from afar) is no longer reachable in the mode.
Missing: none of the mock's elements.

Shots: Review/map-unfold-build/shots/a2-*.png (card A's mode-*.png removed).
