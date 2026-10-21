# Read with the map, round 3 part A: the map (21 Oct 2026)

Round 2 plus the owner's map feedback. Guide text unchanged. Mock only, no app code.
Output: `mocks/story-guide-v3/index.html` (git-ignored, one page; tiles, WMS and map fonts load live). v2 is untouched.
Rebuild: `python3 -I Review/mock-story-guide-v3/build.py [out_file]` (about 13 s with the Terrarium cache). `?guide=priorat` opens Priorat. `shots/` holds desktop shots (1400x850) and one phone shot (390x844).

## Changed from v2
1. Every stop flies. `jumpTo` only on first load and with prefers-reduced-motion. Gaps over 3.5 zoom levels or 150 km fly in two legs (over at a mid zoom, then in). Otherwise one `flyTo` of 2.5 to 4 s. The scroll dwell between stops is 2.2 s.
2. Focus border: 3 px champagne over a 5.5 px black line at 60%. Land outside the focus is faded with black at 25% (black keeps the satellite hues; a white mask washes them out). The three zones fade the land outside Rioja.
3. Rivers (IGN INSPIRE, only "Río/Riu" names): thin blue-grey lines, width by zoom, minor ones from zoom 9. Main rivers (Ebro, Oja, Tirón, Najerilla, Iregua; Siurana, Montsant, Ebre) are stronger and carry name labels along the line. The Siurana stop is centred on the middle of the river line (v2 was beside it) and carries a "Riu de Siurana" tag, because the line label did not fit its bends.
4. Names (IGN Nomenclátor): towns (dot and label), ranges (capitals), peaks (from zoom 10). White text, dark halo, collision-avoided. Only names within about the visible half-width of the stop are switched on. Valleys dropped (weak class, see LAYERS.md). Stand-in face: Open Sans Semibold from demotiles.maplibre.org, not the house face (that needs its own glyph build).
5. Climate: Köppen-Geiger polygons (`data/koppen-spain.geojson`, clipped to Rioja plus 0.2 degrees) at 36%, in the climate chapter (three-zone view and the three zone cards). One-line legend. Colours and names are those of `src/map/climate.ts`; the D classes (no app colour) are one grey "Cold mountain" entry. Phone legend uses short names.
6. Geology: IGME MAGNA 50 WMS (layer 0, tileSize 512, minzoom 10) at 55%, only at Rioja "soils" and Priorat "slate hills". Credit shows only then.
7. Locator: 120 px inset (84 px on phone), bottom left, champagne outline of Spain from `data/spain-mask.json` (Canarias left out) on a black plate. Dot = camera centre, box = visible area.
8. Credit line: adds "Rivers, names: IGN/SCNE CC BY 4.0", "Geology: IGME MAGNA 50" and "Climate: Beck et al. 2023 CC BY" when those layers show. One line on phone ("Rivers, names IGN"). The page foot lists the full credits. The "Back to the story view" button moved to the bottom right.
Sierra de Cantabria stop moved 0.03 degrees west so its range label is on screen.

## Fact or design choice
- Fact: river and name geometry (IGN), Köppen classes (Beck 2023), geology (IGME), Spain outline, class colours (the app's own).
- Design choice: line widths, colours and opacities, the 25% black fade, the 36% and 55% opacities, fly durations and legs, name radius, which rivers count as "main", the Siurana view.
- Not fact: peaks carry no height (INSPIRE has none) and are spread out, not the highest.

## Sources and open points
- Rivers, names: IGN/CNIG, CC BY 4.0 scne.es [A: licence as given on the card]. Climate: CC BY 4.0, in `data/SOURCES.md`.
- Geology: IGME states no licence; its AccessConstraints forbid a paid value-added service without contacting IGME. Fine for this free mock, an owner question before shipping. The service shows blank tiles when coarser than about 70 m/px, hence minzoom 10. The grey areas in the IGME render are unchecked against its legend.
- Haro fly evidence (headless Chromium, scroll from the top): zoom 6.8 at 0.5 s, 10.7 at 2 s, 14.2 at rest, pitch 1, 28, 60. Same logged for every shot.
