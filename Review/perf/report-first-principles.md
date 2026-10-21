# Speed, first principles (issue #152) - AnalystBot, 21 Oct 2026

Live atlaslope.com, cold cache, 2 runs per cell, **medians of 2** (n=2 is thin: treat differences under ~15% as noise). Raw: `Review/perf/runs.json`. Script was a throwaway in the scratchpad (`perf.mjs`, not committed). Only atlaslope.com and its tile hosts were loaded (Esri, IGN, AWS terrain, OpenFreeMap).
Tags: [V] measured here, [R] read in repo/report, [A] assumed.

**Method limits [A].** Headless Chromium draws WebGL in software (swiftshader), so every CPU number (long tasks, "settled") is far worse than a real phone. Network numbers (bytes, requests, order) are trustworthy. Windows were capped: desktop 20 s, phone 50 s; the atlas never stopped loading tiles inside them (`CAP`). "Map first render" = the map canvas appears in the DOM; "first imagery" = first Esri/PNOA tile finished. I did not measure a repaint, nor "first input works" with a real tap: the page answered a probe within 1-5 ms except guide pages (300-370 ms desktop, 301 phone) [V].

## 1. Where the time goes

Desktop unthrottled (ms from navigation start):

| Page | FCP | Canvas | 1st imagery | Requests (20 s) | MB (20 s) | Terrain MB | Imagery MB | Data MB | Photos MB |
|---|---|---|---|---|---|---|---|---|---|
| Home | 138 | - | - | 17 | 1.02 | - | - | - | 0.81 |
| Atlas, Spain | 438 | 446 | 777 | 219 | 10.95 | 7.62 | 1.09 | 0.80 | 0.61 |
| Place zoom (rioja-alta) | 354 | 357 | 612 | 257 | 15.05 | 11.69 | 1.59 | 0.80 | 0.06 |
| Rioja guide | 266 | 271 | 569 | 263 | 12.57 | 7.89 | 1.72 | 1.60 | 0.44 |
| Rioja guide + tour | 288 | 291 | 561 | 290 | 13.22 | 8.19 | 2.05 | 1.62 | 0.44 |
| Study round | 364 | 310 | 666 | 201 | 13.65 | 10.51 | 1.49 | 0.80 | - |

Phone profile (390 px, 4x CPU, 1.6 Mbps = 200 KB/s, 150 ms RTT), 50 s window:

| Page | FCP | Canvas | 1st imagery | Requests | MB | Terrain MB | Imagery MB | Data MB | JS KB |
|---|---|---|---|---|---|---|---|---|---|
| Home | 582 | - | - | 12 | 0.69 | - | - | - | 3 |
| Atlas, Spain | 4,598 | 4,643 | 6,361 | 108 | 5.61 | 2.42 | 0.61 | 0.80 | 619 |
| Place zoom | 4,652 | 4,698 | 5,782 | 154 | 7.60 | 4.39 | 1.10 | 0.80 | 619 |
| Rioja guide | 4,622 | 4,662 | 5,828 | 192 | 7.74 | 4.13 | 1.52 | 0.83 | 624 |
| Rioja guide + tour | 4,618 | 4,658 | 5,795 | 172 | 7.75 | 3.41 | 1.45 | 1.62 | 631 |
| Study round | 4,512 | 4,551 | 5,409 | 122 | 5.82 | 3.15 | 1.02 | 0.80 | 619 |

What this says [V]:
- **Home is fast** (FCP 0.14 s desktop, 0.58 s phone, 1 MB / 12-17 requests, 3 KB JS). Not the problem.
- **Every atlas-route page (atlas, guide, tour, Study) is the same first load**: one 2.16 MB raw / 618 KB gzipped JS file (`atlas-*.js`), then 0.8 MB of GeoJSON, then tiles. On the phone the first paint waits for that JS: 4.5-4.7 s FCP, ~3.1 s of it is the 618 KB at 200 KB/s. Home paints in 0.58 s with no JS cost.
- **Tiles then take the rest of the link.** First imagery lands 1.2-1.7 s after FCP on the phone (5.4-6.4 s), but the link is shared with terrain, data and photos for the next 45 s.
- **Bytes by type (desktop, atlas Spain): terrain 70%** (7.6 of 10.95 MB), imagery 10%, JS 6%, data 7%, photos 6%. On place zoom terrain is 78%. Terrain tiles average 77-87 KB each (Terrarium PNG), 99-121 of them; imagery tiles are ~13 KB each (83-148 of them). So **terrain is the bytes problem, imagery is the request-count problem**.
- **Spain view asks for tile zoom 7**: 68 Esri tiles and ~68 terrain tiles at z7 on a 1440x900 window [V] (tilted 3D view fetches more). On the phone the 50 s window only fetched 29-56 terrain tiles, i.e. the link, not the tile list, was the limit: 108-192 requests, 5.6-7.7 MB in 50 s, and a long tail was still queued (`notDone` 9-18 on guide pages).
- **Double fetches [V]**: on guide and tour pages `dops.geojson` (501 KB gz), `natural-earth-world` (277 KB gz), `added-boundaries` and `rioja-zones` are each requested twice (data 1.6 MB instead of 0.8 MB); also OpenFreeMap TileJSON and 5 vector tiles, and one Plex glyph file, twice. The 2nd copy of dops alone is 0.5 MB = 2.5 s on the phone link. (Cause is likely the guide page and the map each loading the file; `src/map/createMap.ts:168` loads four collections, guide code loads its own [A].)
- **Rioja guide page adds a main-thread cost**: probe latency 300-370 ms vs 1-5 ms on the plain atlas [V, but swiftshader inflates, A].
- No service worker is live (`/sw.js` 404, no `serviceWorker` in `src/`) although decision #36 says one caches shell, data, fonts [V]. GitHub Pages sends `cache-control: max-age=600` on everything including hashed assets, gzip only (no brotli) [V]. The AWS terrain tiles carry no cache-control at all (ETag and 2017 Last-Modified only) so browsers cache them heuristically [V].
- Repo check: local `dist` is 2,082,014 bytes gzipped by the `Tools/check.sh` rule (limit 2,000,000) [V, glyph names with spaces were skipped by the rule's word-splitting, so the true figure is a little higher]. If `dist` here is current, the limit is already passed; CI would then be red, so check whether this local `dist` is stale before relying on it [A].

## 2. Biggest wins, ranked by gain per effort

| # | Win | Measured basis | Expected gain | Effort |
|---|---|---|---|---|
| 1 | **Fewer, smaller terrain tiles.** Hillshade and 3D relief only from a zoom where they show (say >= 7); declare the DEM source `tileSize: 512` so MapLibre asks one zoom coarser (about 4x fewer tiles); keep `shade` one zoom finer only close in. Defer terrain until first imagery (fix card already does). | Terrain = 7.6-11.7 MB (70-78%) desktop, 2.4-4.4 MB of the first 50 s on the phone; 99-121 tiles at ~80 KB | Atlas Spain view: about -5 to -6 MB desktop, about -2 MB phone (-10 s of link time) [A, estimate from tile counts: 99 -> ~25 tiles] | S |
| 2 | **Paint before the JS.** Give atlas, guide pages a static shell in the HTML (black band, champagne, title, "loading the map" line from `index.html` of home) and `modulepreload`; split MapLibre/app so the shell and data start in parallel. | Phone FCP 4.5-4.7 s on atlas pages vs 0.58 s home; the 618 KB JS is ~3.1 s of it | Phone FCP 4.6 s -> ~0.7 s (a real paint; map still ~5-6 s unless 3 and 4 land) [A] | S-M |
| 3 | **Stop the double fetch and slim the GeoJSON.** One shared loader (module-level promise) for dops/world/added/zones; round coordinates to 5 decimals and simplify `natural-earth-world` (788 KB raw land mask) and `dops` (1.6 MB raw). | Guide pages move 1.6 MB data vs 0.8 on the atlas; dops 501 KB gz and world 277 KB gz come before tiles | Guide page: -0.8 MB at once (-4 s phone); both files another -40 to -60% if simplified [A, not tested] | S (dedupe), M (simplify; a data rule, so the paper trail in `data/SOURCES.md` stays) |
| 4 | **Lower the first-view tile count.** Esri/PNOA `tileSize: 512` below zoom ~8 (about 4x fewer requests at overview); cap the first view's tile list; `preconnect` to ibasemaps-api.arcgis.com, s3.amazonaws.com, tiles.openfreemap.org, www.ign.es (fix card). | 83-148 imagery requests at ~13 KB; phone is RTT-bound (150 ms, 6 connections per host). Imagery bytes are small (1-2 MB), so this is about requests and first paint, not megabytes. | About -50 to -100 requests; preconnect saves ~3 round trips per host (0.3-0.5 s phone) [A] | S |
| 5 | **Photos**: `hero.webp` is 332 KB (home, even on phone: 475 KB photos of 0.69 MB total); atlas Spain view loads 14-25 place thumbnails (0.6-0.9 MB) at once. Ship a phone-size hero (about 100 KB), `loading=lazy`, fetch the card photos only when a card opens. | Home phone: photos 69% of bytes. Atlas phone: 0.94 MB of photos competing with tiles. | -0.2 MB home phone; -0.6 to -0.9 MB atlas phone [V sizes, A gain] | S |
| 6 | **Service worker** for the app's own files (JS, CSS, fonts, GeoJSON, glyphs): the decision #36 already asks for it. Not for Esri/IGN tiles (their terms: not checked here). | `max-age=600` on GitHub Pages cannot be changed; the hashed 618 KB JS + 0.8 MB data + fonts = ~1.7 MB re-downloaded after 10 minutes [V] | Repeat visit: -1.7 MB and about -8.5 s phone. No gain on a first visit. | M (and #36 says it exists: it does not) |
| 7 | **Own Spain terrain** (later): a small Spain-only DEM as PMTiles/tiles on the site (cut to z<=11, 8-bit, or a lossy WebP DEM), instead of the 87 KB AWS PNGs. | Terrarium PNG ~87 KB per 256 px tile | Possibly -50 to -70% of terrain bytes [A, not tested]; but adds hosted data (size limit, SOURCES) | L |
| 8 | A CDN in front (Cloudflare etc.): brotli (-15 to -20% JS [A]), long `immutable` caching for hashed files. | GitHub Pages: gzip only, 10 min cache [V] | Moderate; outward, paid or networked: owner's word | M |

Order of work by value for effort: 1, 3 (dedupe part), 5, 4, 2, 6; then 7 and 8 if #149 makes the numbers worse.

## 3. What `Tools/check.sh` should guard next

Today: 2 MB gzipped for the whole site (imagery files excluded) and 150 KB per tour. Both are size sums of the build, so they cannot see request counts, duplicate loads, tile bytes, or what the first view costs. Proposed, in order:
1. **First-view request budget (Playwright, stubbed network, deterministic).** In the existing UI-test build, route the tile hosts to tiny stubs and count requests in the first 5 s of `atlas/` Spain view: terrain tiles <= 30, imagery tiles <= 40 (now 99 and 83) [V basis]. This guards the biggest regression (tile count) without real network.
2. **No duplicate fetch**: the same URL requested twice on the atlas and the Rioja guide fails the test (now: 4 GeoJSON files, TileJSON, 5 vector tiles).
3. **First-load JS per entry** (gzipped, entry + static imports): atlas <= 650 KB now (618), target 450 KB after win 2. Plus **data fetched at open** <= 800 KB (now 801).
4. **Per-page speed budget, as a number on a fixed profile**: "bytes before first imagery" and "FCP on the phone profile, from a fixed local server with the throttle" (CDP throttle works offline against `dist`). Local numbers vary with CPU, so set it loose (e.g. FCP <= 2.5 s at 1.6 Mbps) and fail only on big jumps.
5. **Photo cap**: each shipped home photo <= 150 KB, hero <= 120 KB on phone.
6. The 2 MB rule: confirm whether CI's `dist` is under 2 MB; if it sits at 2.0 already (see section 1), raising it is a decision, not a fix. Do not tune to pass.
New rule needs its incident: issue #152 plus review F6 (60 s no pins, 292 tile requests).

## 4. How #149 (more countries) and #151 (code setup) change the picture

- **#149 [A from these numbers].** Data scales with countries: `dops.geojson` alone is 1.6 MB raw for Spain; ten countries bundled would end the 2 MB rule and raise the 801 KB open-time data to several MB. So: per-country data chunks loaded on first use (like the tours, with a per-country limit in `check.sh`), and a lightweight world/country index for the Spain-wide view. Terrain and imagery cost does not grow with countries (it grows with the area on screen), so wins 1 and 4 hold for France and Portugal; PNOA is Spain-only, so other countries use Esri only (the 128 px/512 px tile rule and a country-specific orthophoto equivalent are per-country work). A world overview at zoom 3-4 must not fetch terrain.
- **#151 [R, issue text only].** The speed problems here are not caused by having no backend: the biggest are third-party tile bytes and a render-blocking 618 KB JS file, and both are fixable in the static setup. A backend or edge layer would help three things: brotli and long caching (win 8), a vector/PMTiles host for own terrain (win 7), and per-country data that is queried instead of shipped. Accounts and progress (#147) would not change page weight, only add calls after load.

## 5. Open questions for the owner

1. **Hillshade and 3D at overview zoom?** Win 1 removes relief when Spain fills the screen (the map looks flatter until you zoom in).
   - A (recommended): relief from zoom ~7, flat satellite and borders below it.
   - B: keep relief everywhere, only halve the tile count with 512 DEM tiles (softer shading, -4 to -5 MB desktop).
   - C: leave as is.
2. **Is a faster first paint worth a simpler loading page?** Win 2 shows the band and title at once, map follows.
   - A (recommended): static shell with a quiet "loading the map" line.
   - B: skeleton of the real layout (more work, same gain).
3. **Service worker, as decision #36 said?** It does not exist now.
   - A (recommended): build it for the app's own files only, after wins 1-5.
   - B: drop #36 and write that down.
   - C: wait for a CDN (win 8).
4. **CDN in front of GitHub Pages?** Needs your word (outward, may cost).
   - A (recommended): not now; revisit after #149 shows data size.
   - B: try Cloudflare free plan in front of atlaslope.com.
5. **Speed budget in CI**: item 4 of section 3 can be loose and local.
   - A (recommended): add the request budget, no-duplicate and JS-size tests; add the throttled FCP test later.
   - B: all of them now.
6. **Phone test on a real device**: the CPU numbers here are software-rendered and cannot decide anything.
   - A (recommended): you open `atlas/` on your phone on mobile data once after win 1+2 and tell me the seconds to first map.
