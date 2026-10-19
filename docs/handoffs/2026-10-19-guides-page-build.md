# Guides page build, slice B (19 Oct 2026)

## Done
- Owner OK of mock v2 [O, "Start the Guides page build", 19 Oct]; tile pilot (Rioja, Andalucía) approved [O, "Yes"].
- Page (`src/home/guideCount.ts`, `src/home/guides.css`): jump row of region links, first 6 guides per region then
  "All <Region> guides" to `../atlas/#region=<id>&page` (only when >6), photos keep their ratio, no kicker on photo-less tiles,
  design-check type sizes, one rule under the head, 44 px links. Satellite tile img no longer stretched or cropped (height:auto).
- Tiles: `Tools/guides/region_tile.mjs` rewritten (old one in `Review/archive/region_tile.old.mjs`): fits each frame to the region's
  own places (8% air; a place over 8x the median extent, e.g. Cava, does not set the frame), opens the app's region view for the
  dimming, draws own place and zone names, drops collisions. All 10 `public/guides/*.webp` retaken. `data/SOURCES.md` line updated.
- Tests: unit home + guides 22/22 [V], UI `home.spec.ts` 6/6 [R, builder], build green [V].
- Design check: `Review/guides-build-design-check.md`, verdict ship, 4 lows; low 1 fixed (tile img), the rest below.

## Open (not done in this slice)
- Canarias tile is mostly sea and cuts Fuerteventura at the right edge (ReviewBot low 2): widen the fit for island regions.
- Rioja tile: the app's own dark region fill hides most of the satellite inside Rioja (from the app's region view, not the script).
- Green Spain tile: Castilla y León outlines still fairly strong lower right; empty sea at the top.
- Phone: each region is ~2000 px of stacked cards; an optional "back to regions" link (ReviewBot low 3). Owner's call.
- Not checked: iPad width, large text, reduced motion.

## Cost
- Helpers: page builder ~36K, tile pilot ~69K, all tiles ~38K, screenshots ~70K, ReviewBot ~31K [V, measured].
  LeadBot ~0.2M, mostly re-reads [A].
