# Design review: map tour in the guide (built app vs approved mock)
Verdict: FIX FIRST. Blockers 1, should fix 4, notes 3. Looked at all 9 build shots, compared with mock b3, a1, p2, gd2, gp2. Not run live; no iPad-width or reduced-motion shots exist (not checked).

## Blocker
1. Mobile first-viewport/layout (phone-climate, tour on, stop 3). Body text and the Measured climate chart are cut at the right edge ("covers a quarter of the vineyard, on t", "Humi"); the section chip bar overlays the "Measured climate" heading. Checklist: no horizontal overflow, readable text at 390 wide. Fix: constrain the guide column to the viewport (min-width 0, no fixed-width children), and give the sticky chip bar an opaque background with the map strip above it; re-shoot at 390 and 320.

## Should fix
2. Phone top bar in tour mode (phone-climate): only Atlas and Study; Guides and About gone. Mock p2 and the plain phone pages show four items with Guides active. Fix: keep four items (as home-390-topbar does); compact the search to an icon if space is short.
3. Phone map legend (phone-climate): legend row clipped ("H...") and the zoom control sits on top of it. Fix: let the legend wrap or scroll with an edge fade, and move zoom clear of it (or hide zoom on phone).
4. Map tour card (b3-desktop): card is about 740 px wide, left-aligned, leaving a blank right half; mock b3 spans the full guide column. Fix: full width as in the mock.
5. Top bar active item on the guide with tour (b3, a-desktop-*): Atlas is underlined; the mock marks Guides. The guide lives under Guides, so the user loses their place. Fix: mark Guides on guide pages (also while the map is open).

## Notes
6. Guides page (guides-desktop-tours, phone-tours): matches gd2/gp2 in structure. Square crops, 6px corners, one credit line per set, no pills: OK. Credit line sits about 4 px under the longest card text on desktop; add 12-16 px space.
7. Chart colours: build uses the climate colours matching the map legend; mock p2 used a brown scale. Better for reading the map; keep and record as a change from the mock.
8. Desktop sticky chip bar shows text bleeding through behind it (b3, a-desktop-*) while scrolling; acceptable, an opaque band would be cleaner.

Checked OK: copy has no "X, Y and Z" lists in the new strings, "AtlaSlope" spelling, no icons beyond the pin and the map's attribution i, no dark mode, no drawn art. Esri imagery absence not counted.
