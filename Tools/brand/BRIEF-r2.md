# AtlaSlope brand identity, round 2: shared brief

## What the owner said about round 1 (22 Oct 2026) [O]
- A1 and the Swiss style "feel too much like a Democratic Party website": primary blue + signal red, heavy black grotesk, flat white panels.
- The rest "feels too modern to match against the world of wine": mono type, flat app-tile colour, hard tech grids.
- Wanted: **a clean, colourful look blended with the deep traditions of wine and its land.**

## The recipe for every concept
- **Colour:** vivid, but from earth and wine. Pigments, rock, soil, wine. Think ochre, terracotta, oxblood, olive, lapis, chalk. Never primary
  blue + red. Never a political or civic look.
- **Type:** a classical serif with character for names and headings, the kind on old labels and atlases (Google Fonts). A quiet humanist or
  old-style companion for reading. No monospace anywhere. No heavy black grotesk.
- **Craft:** fine rules, double rules, small caps, letterspaced capitals, cartouche-like lettering, real contours used like engraving
  lines. The craft comes from typography and real data, never drawn pictures.
- **Clean:** generous space, one idea per line, calm. Traditional but not fusty: no parchment textures, no fake aging, no script fonts.

## The four screens (every concept, same content)
1. **Logo and mark:** the wordmark large; the symbol; the app icon at 512, 64 and 16 px (16 px must stay legible, so use a typographic
   fallback if the main mark blurs); the lockup in the site bar. Show them on paper, on the brand's strongest colour, and on a map.
2. **Home cover** (~1200 x 720): a site bar, the headline exactly "Know the land behind the glass.", one short line, the call to action "Open the atlas",
   and the concept's visual.
3. **Field guide entry:** the Rioja Alta guide page, first screen. Facts you may use:
   - Rioja Alta · zone of DOCa Rioja · 76 municipalities
   - Altitude: 450 m (10th percentile), 570 m median, 780 m (90th percentile)
   - Slope: median 3.1°
   - Köppen Csb, 71% of the zone; Cfb, 27%
   - Geology (IGME units, approximate match to the guide's words): "Arenas, areniscas calcáreas y arcillas ocres, facies de Haro" #FFFF80
     (the clay-limestone), "Limolitas y arcillas rojas" #FFD9D9 (ferrous clay), "Aluviales y llanura de inundación" #B2D9D9 (alluvial).
   - The text: quote `lede` and chapter titles and first paragraphs from `content/guides/rioja.json` (print just those with python). No new facts.
4. **Map view with a place card:** Rioja selected on the Spain map, or Rioja Alta on the Rioja map. A floating card shows the name, "DOCa",
   "3 zones" and an "Open guide" button. Include a scale and a legend in the concept's language. Scales are exact: Rioja frame 71.72 m per frame px, Spain frame 725 m
   per frame px (divide by the view's zoom).

Each concept uses **real data and photos together**: maps where the concept needs them, photos where they carry warmth.

## Standing rules
- NO drawn illustrations, icons, diagrams or fake geography. Every map comes from `assets/maps.js`. Coordinates must be real: Haro 42.58°N 2.85°W.
- Photos: only `assets/photos/*.webp`, using `object-fit: cover` with a chosen `object-position`. Never cut a face, glass or bottle. No text on photos.
  One always-visible credit line per set: "Photos: Artist · licence · cropped and resized" (from `assets/photos/credits.json`).
- A visible map credit wherever a map shows: `Atlas.credit(...)`, plus "Geology: IGME, MAGNA 50" when geology shows.
- Copy: one idea per line, no "X, Y and Z" lists, "AtlaSlope" in running text. Text contrast at least 4.5:1. Small corners, no pills. Light pages.

## Technical contract (the parts merge into ONE page)
- Write one standalone file, `parts/<x>.html` (x = d, e, f or g). In the head: `<meta charset>`, Google Fonts `<link>`s, and ONE `<style>`.
  Scripts: `<script src="../assets/maps.js"></script>` plus ONE inline `<script>`.
- The body holds exactly one `<section class="dir dir-<x>" id="dir-<x>">`. Every CSS selector starts with `.dir-<x>`, and every id starts with `<x>-`.
  JS touches only elements inside the section. Asset paths are written `../assets/...`.
- Section order: a header (concept name, the idea in two lines, palette swatches with hex and where each colour comes from, the type pairing named),
  then the four screens in order. Desktop width 1440. Each screen sits in a quiet frame on a neutral page.
- Map helper: read the first 30 lines of `assets/maps.js`. Never open the JSON or PNG assets. Frames: rioja is 1800 x 1205 (Haro 403,185;
  Logroño 853,352; Alfaro 1638,778; the zones fill the upper half), spain is 1600 x 1222 (Rioja around x 760–900, y 150–260).
  Options: relief, tint, geology (rioja only), contours, zones, land, neighbours, dops, rioja, pins, grid.

## Check before reporting
- `python3 -m http.server <port> -d /Users/djoeri/Developer/Atlaslope/mocks/brand-identity-r2 &` (D 8751, E 8752, F 8753, G 8754), then
  `cd /Users/djoeri/Developer/Atlaslope && node mocks/brand-identity-r2/shot.mjs http://localhost:<port>/parts/<x>.html /Users/djoeri/Developer/Atlaslope/mocks/brand-identity-r2/shots/<x>.png`.
  Crop it with `sips` if it is tall, then look at it. Fix what reads badly. Then ask yourself honestly: does any screen look like a political or tech site? If so, fix it.
  Stop the server at the end.
