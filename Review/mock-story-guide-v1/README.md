# Story guide mock, round 1 (18 Oct 2026)

The Rioja terroir guide as a story: the text scrolls on the left, the map on the right follows whichever part you are reading.
Owner card 06:18Z 2026-10-18 ("Both, polish first"): polish pack first (release 18), then this mock. Mock only, no build.

Open `index.html` in Chrome (the in-app preview blocks map tiles). `?theme=dark` forces dark mode; the moon button switches too.

Owner card 07:20Z 2026-10-18: the story opens from a "Read with the map" button in the place page's Terroir section,
which keeps its plain text (the story is added, nothing is taken away).

## What it shows
- Normal scrolling, no scroll-jacking. The step crossing the middle of the reading area sets the map view; the map flies there
  (jumps instead under reduced motion). Each step gets at least about two thirds of a screen of scrolling and each map move gets 1.6 s to land
  before the next starts (owner, 07:36Z: short sections jumped too quickly). The active step gets a wine (gold in dark) bar on its left edge.
- Every "fly" target already in `content/guides/rioja.json` becomes a map stop: the guide text and captions are unchanged.
  Map moves added by the mock: the intro view (Rioja in northern Spain), the three-zone overview for chapter 2, the Rioja overview
  for chapter 4, and the camera tilt on the Sierra de Cantabria, the Alavesa terraces and Haro (pitch and bearing are design choices, not facts).
- Spotlight: everything outside the place in focus is dimmed. Haro and Alfaro labels use approximate town coordinates [A].
- The map can still be dragged; then "Back to the story view" appears (the one map control besides zoom). Scroll-wheel and keyboard
  map control are off so the wheel and arrow keys always scroll the text. A skip link jumps past the map.
- iPad portrait and phone: the map sticks to the top 42% of the screen (34% on short screens) and the text scrolls under it.
- One way out ("Back to Rioja"), one main action at the end ("Test me on Rioja's zones", the existing test-me address).

## Mock-only
Imagery: PNOA (IGN) from zoom 8 over Esri World Imagery's public tile URL (the app uses a keyed Esri URL). Terrain: AWS Terrarium.
The build would reuse the app's map (`src/map/`) instead.

## Rebuild
`python3 Review/mock-story-guide-v1/build.py [out_dir]` (needs `npm ci` for MapLibre). Inputs: `content/guides/rioja.json`,
`content/sources.json`, `data/photos.json`, `public/photos/800/`, `data/dops.geojson` (DO23), `data/rioja-zones.geojson`, `public/fonts/`.
`story.css` and `story.js` hold the page's style and behaviour.
