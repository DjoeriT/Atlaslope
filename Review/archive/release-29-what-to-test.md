# Release 29: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad, and once on your phone. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
Evocative copy and photo tiles (atlas overhaul slice 3, owner points 1, 5, 15, 16), and no more doubled names at the top of cards.

1. **Spain card.** Open the atlas. Under "Spain" there is a two-sentence lede, then a line "From the official documents of …" with linked place names. Regions are two-column photo tiles. Each tile has a small label, the name and a short italic headline. There is no "SPAIN" line above the title.
2. **Region card.** Open Green Spain. The trail above the title reads "Spain" only. The lede is two sentences. The 9 places are photo tiles, with the first one full width. Arabako Txakolina shows a champagne letter tile, because it has no photo.
3. **Place card.** Open Toro. The trail reads "Spain › Castilla y León" and the line under the title says "DO", with the region not repeated.
4. **Photo credits.** Below each set of tiles, one small line reads "Photos: …". There is no text on the photos.
5. **Card width.** On a 1440 screen the card is a little wider than before (about 418px), and the map still has most of the screen.
6. **Hover.** Hover a tile: the photo zooms gently and the region or place lights up on the map.

## For you
PR #93: `content/tiles.json` (all copy, with cites), `src/facts/tiles.ts`, `src/cards/Cards.tsx`, `src/cards/CardShell.tsx`, `src/pages/PlacePage.tsx` and `RegionPage.tsx` (trail), `src/styles/app.css`. Two independent source checks: `/mnt/project-files/atlaslope/reviews/2026-10-18-tile-copy-source-check*.md`. Not verified: Safari, iPad, real phones.
