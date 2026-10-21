# Read with the map, round 2 (21 Oct 2026)

Rioja and Priorat as a story: text left, sticky map right (phone: map sticks to the top 42%). Mock only, no app code.
Output: one local page, `mocks/story-guide-v2/index.html` (git-ignored). Open it in Chrome; map tiles load live.

## Changed from v1 (owner decisions, 21 Oct 2026)
1. Four entry buttons A-D at the top of the page (text link, outlined, solid black, full-width band with a live satellite thumbnail). Recommended: C.
2. Reader scrolls; no autoplay, no scroll-jacking (as v1).
3. Terrain height x1.5 by default, switch to x1.3 on the map; the always-visible map credit line states it.
4. Slope tint: wine #8C2340 at up to 27% opacity on land steeper than 30%, built in `build.py` (`tint.py`) from Mapzen Terrarium zoom 12 (cache `.cache/terrarium`). Legend: "Tint: slopes over 30%".
5. Map stops are only the guide's "fly" entries, plus overviews. Guide text is unchanged.
- Camera per stop; thin champagne outline instead of the dimming spotlight; low-sun hillshade; Rioja/Priorat switch in the black band.
- Dropped: dark theme, wine accent, pills, all drawn icons.

## Fact or design choice
- Fact: guide text and captions, outlines (MAPA DOCa and DO, IGN zones), elevation and slope, the stop coordinates in the guides.
- Design choice: every pitch, bearing and zoom (commented in `build.py`), tint colour and opacity, sun direction, the 1.5x and 1.3x heights.
- Approximate [A]: Haro and Alfaro label positions. Added overview views: Rioja three zones and Rioja overview (as v1), Priorat in Catalonia, Priorat overview looking north (air chapter) and Priorat flat (wines chapter).
- Photos: no entry in `data/photos.json` has a recorded location, so no pins. One credit line per photo: "Photos: Name · licence · cropped and resized".

## Rebuild
`python3 Review/mock-story-guide-v2/build.py [out_file]` (needs MapLibre in `node_modules`; the first run fetches about 315 Terrarium tiles, about 4 min, then 15 s).
Default output is the main checkout's `mocks/story-guide-v2/index.html`. `?guide=priorat` opens Priorat. `shots/` holds a few desktop and phone screenshots.
