# Map tour inside the guide: mock round 1 (21 Oct 2026)

Owner decisions built in: the tour is folded into the guide page (layout A); the button is prominent; "Map tours" leaves the top bar; Guides cards of guides with a tour get a plain line and a filter link.

Output (git-ignored): `/Users/djoeri/Developer/Atlaslope/mocks/tour-in-guide/index.html`, one page, every frame live. Tiles load live: IGN PNOA (no key), Esri below zoom 8, IGME geology, Mapzen terrain.

Rebuild: `npm run build`; `npx vite preview --port 4789`; `node Review/mock-tour-in-guide/extract.mjs`; `python3 Review/mock-tour-in-guide/build.py`; `node Review/mock-tour-in-guide/shoot.mjs` (shots in `shots/`, about 2 to 5 minutes, needs the network for tiles).

## Fact (from the repo)
- Guide text, charts, panels, photo mosaic, jump bar, sources: the real Rioja guide page taken from the built app (`real/guide.html`, `extract.mjs`), with the app's own CSS.
- 9 stops and their cameras: `content/stories/rioja.json` (the "9 places to fly to" count is real).
- Outlines: `data/dops.geojson` (DO23), `data/rioja-zones.geojson`; climate colours: `data/koppen-spain.geojson` with the colours of `src/map/climate.ts`; geology: IGME MAGNA 50 WMS.
- Guides page cards and the top bar markup: `dist/guides/index.html`. "Map tours" is removed from the bar.
- Tour guides today: Rioja and Priorat (stories folder).

## Design choices (proposals, not in the app)
- Button variants B1 to B4, their copy ("Map tour · 9 places to fly to", "Open the map", "Fly the valley"), the drift (bearing +-16 degrees over about 55 s) and the pulse. Reduced motion stops both.
- Layout A: map column 46% of the width, sticky, with a caption bar (Stop n of 9, stop name, "Hide map"); the guide's two-column beats collapse to one column while the map is open.
- Which stop belongs to which section: lede = intro view, The place = valley, The weather = whole region with Koeppen colours, The ground = Rioja Alavesa with geology, The rules = Haro. Zone cards and "On the map" links fly to their stop.
- Phone: 240 px map strip (about 28% of an 844 px screen) under the top bar, guide scrolls below; legend becomes one scrolling line.
- The old "Show map" button at the top of the guide is hidden in these frames (the tour replaces it); the real app would need a decision.
- Guides page: plain "Map tour" line (bold, ink) under the reading time; link "Guides with a map tour (2)" above the list; filtered view hides other cards, regions without a tour card, the showcase and the jump bar.

## Not shown
- Rivers, place names and slope tint on the map (the earlier mock had them from local folders).
- Per-stop photo and fact flags; the Study handoff at the end of the tour.
- A phone top bar tuned for 390 px: the search box is squeezed as in the shared markup.
- The Rioja guide reveal-on-scroll fade: text further down can look grey in a frame; that is the real page's own effect.
