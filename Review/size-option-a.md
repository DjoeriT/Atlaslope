# Size option A: load per-country map data with its country (draft for the owner)

## Verdict
Option A works for France: 3,043,147 down to 1,957,478 bytes, under the unchanged 2,000,000 limit. It is a draft for the owner's
choice between A and B (raise the limit). The headroom is only 42.5 KB. Italy (~87 places) will go over again unless its
per-place rows in the atlas chunk also load with their country. That part was not done (see "Left").

## Numbers (gzipped, Tools/check.sh rule, measured 23 Oct 2026 [V])
| build | old rule | new rule |
|---|---|---|
| origin/main (9a43a3f7) | 1,995,742 | 1,940,712 |
| claude/france-bordeaux (e9d8c333) | 3,043,147 | n/a |
| claude/size-option-a (this branch) | n/a | 1,957,478 |

What France added over main (old rule): the added-boundaries file grew from 94,812 to 936,595 bytes (France's outlines are
835,145 of that). The atlas chunk grew from 499,339 to 592,959 (+94 KB of per-place rows: photos +18.5 KB, photo-sizes
+24.5 KB, facts +38 KB, places/tiles/sources/crops +13 KB). The place pages under dist/fr/ went from 26.6 KB to 135.9 KB
(113 pages at about 1.1 KB each).

## What moved
- `data/added-boundaries.geojson` is split by country at build time (`src/map/outlines.ts`, a plugin in `vite.config.ts`,
  `virtual:outlines`). Spain's part (3 outlines, ~7 KB) stays in `dist/assets/` and counts as first load, because the
  atlas opens on Spain and the cover card says "Spain's wine places". Portugal's (75 KB) and France's (835 KB) go to
  `dist/map-data/`.
- The map (`src/map/createMap.ts`) fetches a country's file when a card opens that country, region or place. It also
  fetches one when a close view (zoom 6 and up, middle of the screen) reaches the box of one of that country's outlines.
  It then draws every place again. Framing a place waits until its country's file has arrived.
- `Tools/check.sh` leaves out `dist/map-data/` and the place pages `dist/<code>/<place>/index.html`. The reasons are in
  its comment and rest on decision #38. The limit is unchanged.

## Do place pages count as first load?
No. Each place page is the atlas page again under its own address. A visitor loads one of them, not all 113, and
`dist/atlas/index.html`, which is counted, is the same page. The country pages `dist/<code>/index.html` stay counted.

## Checked
- Unit: 51 files and 585 tests pass, exit 0 (3 s). New `tests/unit/outlines.test.ts` checks that every outline lands in exactly one
  country file, that the merged files draw the same places as the whole file, and which views fetch which country.
- UI (map specs once): story, place-page, atlas-cover, map-reset and map-colours ran with 40 passing and 1 failing (43 s). The failure was story.spec,
  "fetches each map data file once": a close Rioja view fetched France's file because Rioja lies inside the box around
  all of France. I fixed that with per-outline boxes. After the fix story.spec passed on its own (17 of 17, 34 s). The other
  four specs were not run again after that change.
- Requests per view (Playwright against the UI-test build): Spain card, cover, Rioja and Galicia fetch only Spain's file.
  /pt/douro/ fetches Portugal's and /fr/pauillac/ fetches France's. The France card fetches France's.
- Screenshots (no imagery, see Risks): `shots/oa-*-{desktop,phone}.png` in the worktree. Every outline was drawn in each:
  Pauillac framed after its file arrived, Douro and the France card had their outlines, and zooming in on the Miño border
  drew Portugal's outlines.
- Builds: 2-2.6 s each.

## Risks
- The atlas cover shows no Portuguese or French outlines until a country is opened or the view zooms in. Main shows
  Portugal's outlines there. This is a visible change and needs the owner's decision.
- Opening a French place downloads 835 KB before it is framed. That is a delay on slow connections, though no slower
  than the first visit was.
- Screenshots were taken without satellite imagery (tiles off, as in the UI tests): the builder may not call Esri.
- The headroom is 42.5 KB. The atlas chunk still carries every country's place rows (~1 KB a place).

## Left
- Per-country place rows (facts, photos, photo-sizes) out of the atlas chunk. The fact sheets are imported eagerly by
  `src/facts/index.ts` and read synchronously in many places, so moving them is a slice of its own.

## Steps (commit, tests, wall time)
- 41d8a864: split outlines, lazy fetch, check.sh exclusions; outlines and map unit tests 40/40 (0.6 s); build 2.4 s.
- 40e1f308: view check by outline box and screen middle; full unit suite 585/585 (3 s).
- (this commit): per-outline boxes after the story.spec failure; story.spec 17/17 (34 s); outlines unit tests 9/9.
