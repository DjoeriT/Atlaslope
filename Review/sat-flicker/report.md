# Issue #182: satellite colour change and reloading edges (measure only, 21 Oct 2026)

Tags: [V] measured here, [A] assumed. Nothing under src/, tests/ or config was changed. Measured on a throwaway copy of the repo (outside the repo) built with one added line, `window.__map = map`, because the app exposes no map hook. Esri key from `.env.local`, never printed. Chromium, 1440x900, Rioja centre lon -2.6 lat 42.5, pitch 0, real network (Esri + IGN live).

Files: `measure.mjs` (colour + passes + video), `tilecmp.mjs` (direct tile colour + reload cache test), `results.json`, `tilecmp.json`, `z6..z12.jpg`, `pass2.webm` (third DPR2 run, 7.7 MB, contains pass 1 then pass 2). To rerun: build a copy with the hook, `vite preview` it on :4599, `node measure.mjs http://localhost:4599/`.

## 1. Colour per map zoom (DPR 2, mean RGB of central 400x400 CSS px, borders/zone overlays hidden)
Visible source: Esri only below map zoom 8; PNOA over Esri from map zoom 8 (tile zoom 10; with tileSize 128 the tile zoom is map zoom + 2). On DPR 1 (tileSize 256) the switch is at map zoom 9 [V: min IGN tile zoom 10 in both runs; Esri tile zooms 8-9 on DPR1, 9-10 on DPR2].

| map zoom | visible | relief on (R,G,B) | relief off (R,G,B) |
|---|---|---|---|
| 6 | Esri | 142, 122, 88 (this row was at zoom 5.63) | 92, 96, 72 |
| 7 | Esri | 107, 112, 82 | 93, 99, 65 |
| 8 | PNOA | 144, 145, 100 | 133, 137, 87 |
| 9 | PNOA | 154, 148, 98 | 147, 143, 89 |
| 10 | PNOA | 163, 153, 101 | 159, 150, 95 |
| 11 | PNOA | 163, 153, 106 | 162, 152, 102 |
| 12 | PNOA | 157, 150, 129 | 155, 149, 128 |

Relief adds about +14 (z7), +11 (z8), +7 (z9), +4 (z10), +1 (z11-12) to red. Mean RGB also moves with scene content (the centre shows different ground at each zoom), so single rows are not a clean colour match; the same-tile comparison below is.

Same tile, Esri vs PNOA, fetched directly (`tilecmp.json`):

| tile z | Esri RGB | PNOA RGB | Esri G/R, B/R | PNOA G/R, B/R |
|---|---|---|---|---|
| 9 | 93, 85, 42 | 124, 126, 84 | 0.91, 0.45 | 1.02, 0.67 |
| 10 | 118, 100, 54 | 137, 135, 91 | 0.85, 0.46 | 0.99, 0.67 |
| 11 | 141, 118, 74 | 152, 144, 101 | 0.84, 0.52 | 0.94, 0.67 |
| 12 | 121, 123, 93 | 158, 151, 105 | 1.02, 0.77 | 0.95, 0.67 |

Esri is warmer and more brown-yellow; PNOA is neutral and lighter. In the app, no-relief z7 (Esri) to z8 (PNOA) goes (93, 99, 65) to (133, 137, 87): about +40 red in one zoom step [V].
The app's Esri-only view cannot be isolated inside Spain at tile zoom 10 and up: `esri://` returns a blank tile where PNOA covers the whole tile (imagery.ts ~line 213), so my "esriOnly" variants in `results.json` show the land colour (232, 222, 190) and must be ignored.

## 2. Requests and cache, 6 -> 12 -> 6, twice (legs of 6 easeTo steps of 1.5 s; per leg, completed responses only)

| run | leg | Esri req (cache) | IGN req (cache) | MapLibre tile loads satellite / pnoa |
|---|---|---|---|---|
| DPR2 | load at z5.6 | 160 (4) | 0 | n/a |
| DPR2 | pass 1 up | 24 (0) | 124 (0) | 895 / 725 |
| DPR2 | pass 1 down | 3 (0) | 60 (0) | 828 / 666 |
| DPR2 | pass 2 up | 24 (14) | 35 (0) | 780 / 670 |
| DPR2 | pass 2 down | 3 (0) | 36 (0) | 663 / 640 |
| DPR1 | pass 1 up | 49 (0) | 70 (0) | 273 / 179 |
| DPR1 | pass 1 down | 11 (9) | 31 (0) | 204 / 152 |
| DPR1 | pass 2 up | 37 (25) | 28 (0) | 170 / 123 |
| DPR1 | pass 2 down | 11 (11) | 0 | 120 / 104 |

(The DPR2 video run repeated the DPR2 numbers within a few percent.)
- Zero requests in any leg re-downloaded a URL that had already completed (repeatNetwork = 0 in all runs) [V]. IGN repeats never reach the network because `pnoaTiles` in imagery.ts keeps each PNOA tile in memory (cap 500, oldest dropped first) [V code, V counts].
- The remaining network requests in pass 2 are tiles whose first request had not finished when the next zoom step cancelled it (steps are 1.5 s; Esri uses the cancel signal, PNOA does not) [V counts, A mechanism].
- Page reload with warm HTTP cache (DPR2, zoom 10): Esri 160/160 and IGN 104/104 served from cache [V]. So HTTP caching works; the headers are max-age 86400 (Esri) and 31536000 (PNOA) [V].
- MapLibre-side churn: DPR2 starts 660-900 tile loads per leg per source, DPR1 104-273. That is 3 to 6 times more at tileSize 128 [V]. Defaults found: maxTileCacheZoomLevels 5, no explicit maxTileCacheSize [V]; raster-fade-duration 600 [V].
- Each DPR2 leg is about 100 distinct PNOA/Esri downloads against 650-900 MapLibre tile loads, so most "reloads" are MapLibre re-creating tiles from the JS cache or from blank Esri tiles, not network fetches [V counts, A interpretation].

## 3. Ranked likely causes
1. [V] Esri to PNOA switch is a visible colour step. Same-tile means differ by 10-35 per channel, with Esri warmer (G/R 0.85 vs 0.97, B/R 0.46 vs 0.67). The switch happens at map zoom 8 on retina and 9 on non-retina. The 600 ms crossfade turns it into a slow shift, which matches "tiles change colour while zooming".
2. [V counts, A effect] Tile churn at tileSize 128: 3-6x more tile loads than 256 per zoom step, and every tile fades in over 600 ms (raster-fade-duration). Tiles re-created after MapLibre drops them start the fade again, so edges look like they reload even though bytes come from cache. [A: re-fade of re-created tiles; confirm by setting fade to 0 for a test.]
3. [V] The network is not the problem for completed tiles (0 refetches, reload fully cached). The real refetches are tiles cancelled mid-flight by quick zoom steps (Esri cancelled and not stored; PNOA kept). Esri first visit has only 16/160 from cache.
4. [V] Relief (hillshade, from zoom 7) adds up to +14 brightness at z7, shrinking to nothing by z11. It starts abruptly at its minzoom and shifts the picture at the same zooms as cause 1.
5. [A] PNOA memory cache is capped at 500 tiles with first-in-first-out eviction. A DPR2 session already holds about 250 unique PNOA tiles after two passes, so longer sessions would start refetching from disk cache. Not reached in this test.

## 4. Candidate fixes (none implemented)
- Colour match: lower the visible step by grading Esri toward PNOA (raster-hue-rotate, raster-saturation, raster-brightness-min/max on the `satellite` layer), or grade PNOA toward Esri. Needs a visual round with the owner.
- Move the switch point away from the zoom where users stay (PNOA from tile zoom 11 or 12, or Esri-only below map zoom 9 on both DPRs) so the step is not tied to screen density.
- Lengthen the cross-over: raise raster-fade-duration only on the PNOA layer, keep Esri at 0-150 ms, so new tiles do not repeatedly fade; or fade 0 for tiles already cached in `pnoaTiles`.
- Try raster tileSize 256 on DPR 2 (4x fewer tiles per view at a small sharpness cost) and compare churn.
- Raise MapLibre `maxTileCacheZoomLevels`/`maxTileCacheSize` (map options), and raise the `pnoaTiles` cap or make it size-based.
- Pass the abort signal only for Esri tiles that are not near the end, or let Esri downloads finish (as PNOA does) so cancelled tiles are cached.
- Fade the hillshade in over zooms 7-8 with a `hillshade-exaggeration` interpolation instead of a hard minzoom.

## 5. Not measured
- Real-human perception of the fade; only video (`pass2.webm`, 720x450) is provided.
- Esri-only colour inside Spain at tile zoom 10+ in the live app (the app returns blank there); used direct tile fetches instead.
- Different regions or time of day; one centre (Rioja) only.
- Leg boundaries blur: responses finishing after a leg ends count in the next leg.
