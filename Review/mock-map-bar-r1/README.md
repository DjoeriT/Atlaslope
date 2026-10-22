# Map mode overlays, option B (mock, not merged)

Page: `/Users/djoeri/Developer/Atlaslope/mocks/map-bar-r1/index.html` (git-ignored; images in `img/`). Branch `agent/builder/map-bar`. Real app, real imagery, shot 22 Oct 2026.

## What B is (built for real, so the pictures are true)
- Top-left: only the stop-name chip. Zoom pair stays top-right.
- One key strip at the foot (`.story-legend`, moved by CSS): right of the locator, above the credit line, clear of the "i" (right 3.6rem). It wraps to two lines (rock key). The stop's dot framing (`storyMap.ts padding()`) now keeps clear of the strip instead of the top.
- Terrain height (x1.5 / x1.3) is a small panel (`.story-info`) opened by the "i": top-right beside the zoom on desktop, under the chip on a phone. Desktop already had the "i" (MapLibre's own); it now opens this panel too. MapLibre's own credit pop-up is hidden (the credit line says the same).
- "Back to this stop" (shows after a pan) moved from bottom-right (it sat on the "i" today) to the top, where terrain height was.
- Credit line unchanged. Phone: zoom buttons and "i" are 44 px (were 29).
- Code: `src/story/GuideMap.tsx` (1 line), `story.css`, `storyMap.ts` (padding), `layers.ts` (edge fix). Helpers: `Tools/shots-mapbar.mjs`, `Tools/overlap-mapbar.mjs`.

## Overlap measurements (bounding boxes: chip, keys, locator, zoom in/out, i, credit, recentre, panel)
- Today: keys overlap the terrain pill at climate and soils on both widths (4 of 6 stops), and the chip meets it on the phone at soils. Recentre sits on the "i".
- B: no pair intersects at 1440 and 390, at the Rioja valley, climate and soils stops, the Ribeira Sacra slope stop, and with the "i" open (soils re-measured after the last CSS change; the valley and climate "i open" shots come from the build one small CSS rule earlier).
- Tap targets under 44 px on the phone in B: only the 22 px fact pins (existing, not overlay controls). Desktop zoom buttons stay 29 px.

## Edge of the climate layer
The Köppen file is cut to a box; two zoom levels out it shows as a rectangle. Fix shown: the tint opacity is tied to the stop's zoom (full at the stop's framing, zero one level out), so the edge cannot show. Paint only, no data change. Alternatives: a feathered edge or a land clip need a new data cut (not done).

## [V] / [A]
- [V] Pictures, boxes and the edge fix: from the built app with Esri/PNOA imagery.
- [V] Rioja has no slope-only stop (only "soils" has the slope key, with the rock key); the slope-only picture is Ribeira Sacra "canyons".
- [A] The slope swatch in the credit line ("Slopes >30%") duplicates the strip's slope key at steep stops; kept ("credit line unchanged"), worth dropping.
- [A] On a phone with the credit closed the strip floats 3 rem above the bottom (room for the credit when open).
- [A] With the "i" open the MapLibre button turns dark on the dark map (low contrast); not fixed.
- [A] Fade: one zoom level out the tint is gone, so zooming out loses the climate tint; the rectangle never shows.

## Phone round 2 (22 Oct 2026, below 48rem only; desktop unchanged apart from item 4)
1. Key strip: one line, scrolls sideways, 22 px tall (about 1.4 rem). Climate uses the existing short names; rock and slope names shorten to the words before the first comma, "and" or bracket (Sands, Siltstones, Alluvium, Steeper than 30%). The full names are in the open panel. Strip and locator sit at the foot (0.75 rem up), right of the locator, left of the "i".
2. Terrain height is a row in the panel the "i" opens: panel = terrain row, full key names, credits. While open it hides the strip and the locator (it covers the foot of the map).
3. "i": champagne on black, champagne focus ring (phone).
4. The credit line drops "Slopes >30%" where the strip shows the slope key (steep stops); everywhere, so desktop soils lost it too. At other stops the swatch stays, as the only key.
Overlaps re-measured after the last change on every shot (phone and desktop, closed and open, Rioja three stops and Ribeira slope): none. Phone controls all at least 44 px (fact pins aside).
