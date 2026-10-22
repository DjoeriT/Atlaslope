# AtlaSlope brand identity, round 1: shared brief

Owner answers (22 Oct 2026) [O]:
- AtlaSlope is a **digital field guide**: the atlas plus a guide for every wine place. The spine is "why does this wine taste the way it
  does", answered by the place: slope, reach of the sea, stone under the vines. Calm, precise, grounded. A field guide more than a wine list.
- Direction: **cartographic precision**. The identity is **fully open**: today's black band, champagne, Newsreader and Plex are NOT carried over.
- Colours: **vibrant, not boring**. Type: compare several suggestions. The name setting is explored per block (AtlaSlope, ATLASLOPE, Atla·Slope, atlaslope ...).
- Round 1 = **all nine blocks**: three map flavours (A Swiss topographic, B Survey/ordnance, C Nautical chart) x three imagery routes
  (1 Real data, 2 Photos first, 3 Type and data only). Every block shows the same **four surfaces**.

## The four surfaces (every block, same content so blocks compare)
1. **Logo and mark**: the wordmark large; the symbol; the app icon at 512, 64 and 16 px; the lockup in the site bar. On paper, on the
   brand's strongest colour, and over a photo or map.
   The symbol must be typographic (letters, a monogram, a numeral, a coordinate) or cut from the REAL data (a real contour ring, the real Rioja
   outline from the assets). Never a drawn picture, icon or invented shape.
2. **Home cover** (desktop frame ~1200 x 720): site bar; headline exactly "Know the land behind the glass."; one short line under it; a call
   to action "Open the atlas"; the visual of the route (map, photo or type).
3. **Field guide entry**: the Rioja Alta guide page, first screen. Measured facts you may use (from `data/place-measures.json`, `data/rioja-zones.geojson`):
   - Rioja Alta · zone of DOCa Rioja · 76 municipalities
   - Altitude: 450 m (10th percentile), 570 m median, 780 m (90th percentile)
   - Slope: median 3.1°
   - Climate (Köppen): Csb, 71% of the zone. Cfb, 27%.
   - The opener and "why it tastes the way it does" text: take sentences from `content/guides/rioja.json` (read it with python, print only the
     `lede` and the chapters' `title` and first `paras` item). Quote them; do not write new facts. No sea distance, rainfall or soil you cannot
     find there.
4. **Map view with a place card**: the atlas. Spain map with Rioja selected and a floating card (name, "DOCa", "3 zones", a button "Open guide"),
   or the Rioja map with Rioja Alta selected. Scale and legend in the flavour's language.

## Rules (owner, standing)
- NO drawn illustrations, icons, diagrams or fake geography. Every map is the real data via `assets/maps.js`. No invented coordinates or numbers:
  real Haro is 42.58°N 2.85°W; Rioja's frame spans about 42.0–42.8°N, 1.7–3.1°W.
- Photos: only `assets/photos/*.webp`, cropped with `object-fit: cover` and a chosen `object-position`; never cut a face, glass or bottle.
  No text on photos. One always-visible credit line per set: "Photos: Artist · licence · cropped and resized" (from `assets/photos/credits.json`).
- A visible map credit wherever a map shows (`Atlas.credit('rioja' | 'spain')`).
- Copy: one idea per line. No "X, Y and Z" lists. Users see "AtlaSlope" (spelling of the brand name in running text).
- Text contrast at least 4.5:1, including on vibrant colours. Small corners, no pill shapes.
- Light pages. A dark or vibrant band or panel is fine; no dark theme.
- Fonts: Google Fonts only, via `<link>` in the head.

## Technical contract (so the parts merge into ONE page)
- Write one standalone file `mocks/brand-identity-r1/parts/<a|b|c>.html`. Head: `<meta charset>`, Google Fonts `<link>`s, ONE `<style>`;
  scripts: `<script src="../assets/maps.js"></script>` plus ONE inline `<script>`.
- Body holds exactly one `<section class="dir dir-<x>" id="dir-<x>">`. Every CSS selector starts with `.dir-<x>`. Every id starts with `<x>-`.
  JS only touches elements inside the section. Asset paths are written `../assets/...` (the merge rewrites them).
- Section layout: a header (flavour name, the idea in one line, palette swatches with hex, the three type pairings named), then blocks
  `<x>1` Real data, `<x>2` Photos first, `<x>3` Type and data only, each with a heading, one line on what makes it different, and its four surfaces in order.
- Each block uses a **different type pairing and a different name setting**, so the nine blocks compare nine settings.
- Desktop width 1440. Surfaces sit in quiet frames on a neutral page so the identity colours are the identity, not the page.
- Map helper: read the header comment of `assets/maps.js` (first 25 lines). `Atlas.mount(el, 'rioja' | 'spain', opts)`. Never open the
  JSON or PNG assets themselves (3 MB). Frames: rioja 1800 x 1205 px (Haro at 403,185; Logroño 853,352; Alfaro 1638,778), spain 1600 x 1222
  (Rioja around x 760–900, y 150–260).

## Check before reporting
- Serve: `python3 -m http.server <port> -d /Users/djoeri/Developer/Atlaslope/mocks/brand-identity-r1 &` (port A 8741, B 8742, C 8743), then
  `cd /Users/djoeri/Developer/Atlaslope && node mocks/brand-identity-r1/shot.mjs http://localhost:<port>/parts/<x>.html /Users/djoeri/Developer/Atlaslope/mocks/brand-identity-r1/shots/<x>.png`.
  Look at the shot (crop it with `sips` into 3 pieces if it is tall) and fix what reads badly: empty maps, clipped text, low contrast, broken crops.
  Stop the server at the end.
