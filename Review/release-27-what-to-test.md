# Release 27: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad, and once on your phone. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
One guide page (atlas overhaul slice 2, owner points 3, 4, 10, 12, 14).

1. **Map card photos.** Open Cebreros in the atlas. The card shows one big photo and two small ones, no arrows and no text on the photos. The credits are one small line under them. Tap any photo: the photos open full screen with arrows, "2 / 3" and the credit; the arrow keys step, Escape closes only the viewer.
2. **Guide header.** Open the Rioja guide. Under the title: a black "DOCa" badge (hover: the full name), "Wine Scholar · Rioja", "WSET Level 2 and 3", then "3 zones · 4-minute read". Toro shows WSET Level 3 only; Rioja Alta shows no WSET badge.
3. **Photos on the guide.** One big photo and two beside it, and "All 5 photos" opens the viewer.
4. **Terroir.** "Why Rioja tastes the way it does" reads in the same type as the rest of the guide: no small gold heading, no big first letter, the fly-there links are plain links.
5. **Comparisons.** In "The land" on Rioja, the climate and altitude charts show Rioja and "All of Spain" (Spain median 680 m). Rioja Alta also shows Rioja; Toro also shows its study region.

## For you
PR #92: `src/pages/` (PlacePage, Mosaic, Lightbox, Charts), `src/cards/Cover.tsx`, `data/place-measures.json` (Spain and study-region rows), `content/curriculum.json` (WSET names). Checks: typecheck, 269 unit tests, place, guide, region, cards and mobile UI tests locally, full CI, ReviewBot (1 P1, 4 P2, 5 P3, all fixed). Not verified: Safari, iPad, real phones.
