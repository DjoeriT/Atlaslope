# Design check: built Guides page (ReviewBot, design mode)

Verdict: ship. Blocker 0, Should fix 0, Notes 4. Checked built page at 1320 and 390 wide [V screenshots, computed styles]; iPad width not shot [A].

## Design-check items from the mock (1-5, 7)
Fixed in the build [V]: type sizes (lede 16px, meta 14.4px, credits 12.48px, no 14.08/13.6); no kicker on photo-less tiles (0 `.kick` in tiles); jump row and "All <Region> guides" links 44px tall (0 links under 44px outside credit lines); photos keep ratio (`img` height auto, no cover/crop); ragged rows handled with `align-items:start`; single rule (page-head border 0, one rule per region). No horizontal scroll (scrollWidth = viewport at both sizes) [V].

## Hard rules [V]
Black band + champagne, white page, 6px corners, no pills, no icons, no text on photos, no dark mode: pass. One credit line per photo set under each region plus the satellite credit under each of 10 tiles: pass (2 credits per region).

## Notes
1. Region tile `.sat img` uses `object-fit:cover` with `flex:1; min-height:200px` (`src/home/guides.css`). Today every tile renders at its natural 1200x750 ratio, so nothing is cropped, but a taller row (long text) would crop it on desktop. Fix: `object-fit:contain` or `height:auto;flex:none`. Rule: photo/no-crop spirit. [V render, A latent]
2. Canary Islands tile is mostly sea; Fuerteventura is cut at the right edge, small islands are small. Still reads as the Canaries thanks to the labels. Fix: widen the fit box eastward in `Tools/guides/region_tile.mjs`. [V]
3. Phone: 6 full-width photo tiles per region make each region about 2000px and the page about 20000px; the jump row helps but there is no back-to-top. Fix: optional, 2 tiles per row of small ratio, or a "Back to regions" link per region (44px). [V]
4. Credit-line source links and the first-desktop-row photo heights differ (ragged rows remain by design, accepted in mock check). Credit links under 44px accepted as inline text. [V]

## Region tiles at page size
Green Spain, Cataluña and Canary Islands tiles read as their region (outline shape, labels legible at 597px wide). On phone (342px) labels shrink to about 7px and are only decorative; the heading and credit carry the name. [V; other 7 tiles not viewed individually, A]
