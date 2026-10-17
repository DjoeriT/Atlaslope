# Sharper map close in (17 Oct 2026)

**Done (#55).** The owner found the map blurry close in (13:04Z) and picked "Full fix" on the plan card (13:08Z). Built:
- **2x screens get the next zoom of imagery.** Raster sources declare 128 px tiles when `devicePixelRatio` ≥ 1.5, so one photo
  pixel is one screen pixel (`src/map/imagery.ts`, `rasterTileSize`).
- **Spain shows IGN's PNOA orthophoto** (25 cm, CC BY 4.0) from tile zoom 10, over Esri. PNOA serves blurry filler outside
  Spain, so each tile is cut in the browser to Spain plus a 2 km strip of sea, minus Portugal, France, Andorra, Morocco and
  Gibraltar (`data/spain-mask.json`, built by `Tools/data/build_spain_mask.py` from Natural Earth). Esri skips tiles PNOA covers
  whole, unless PNOA's own tile fails; if PNOA fails three times with nothing loaded, Esri reloads everywhere.
- **Place names from OpenStreetMap** (OpenFreeMap vector tiles): cities, towns, villages, rivers, lakes, main peaks and motorway
  numbers, set in Plex Sans and Newsreader from our own glyph files (`public/glyphs/`, `Tools/glyphs/build_glyphs.mjs`). All
  smaller than the wine places' labels; hidden with them when a quiz hides names. Added after the map's `load`, so a slow or
  blocked name server never stops the wine places drawing (`src/map/mapNames.ts`).
- Over the photo, place fills thin out from zoom 10 to 13 and outlines firm up, so vineyards show through.
- Tiles fade in over 600 ms instead of 300, so finer tiles read as sharpening rather than squares popping in (owner asked why squares load).
- Real-tile screenshots: `.github/workflows/map-preview.yml` builds the branch with the Esri key and commits shots to
  `Review/mock-zoom-detail/shots/` (the container cannot reach the tile hosts). The live map check now also looks close in over Haro
  and fails if no PNOA or OpenFreeMap tile loads.

**Decided.** Owner: "Full fix" (card 13:08Z); mock `Review/mock-zoom-detail/` approved 14:32Z ("Looks good").
Defaults taken, reversible: bilingual names show their first form only ("Labastida", not "Labastida / Bastida"); peaks only the
highest ranks, heights from zoom 14; road numbers only for motorways and trunk roads from zoom 13.

**Open.** Finer relief (IGN 5 m elevation for the wine regions) was in the plan as a later step; not built. OpenFreeMap is a free
community service with no uptime promise; if it goes down the map simply has no town names. IGN now and then drops a request
without a CORS header; one retry covers most. Not verified: Safari, a real iPad, PNOA load on a slow connection.

**Where.** Plan `/mnt/project-files/atlaslope/zoom-detail/2026-10-17-zoom-detail-plan.md`. Design check
`/mnt/project-files/atlaslope/reviews/2026-10-17-zoom-detail-design-check.md`; code review `Review/zoom-detail-review.md`.
Tester note `Review/zoom-detail-what-to-test.md`. Sources: `data/SOURCES.md` (spain-mask, PNOA, OpenFreeMap, map lettering).
