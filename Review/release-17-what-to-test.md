# Release 17: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
A fix for the quiz highlight (#66, owner's Galicia screenshot, 17 Oct 2026).

1. **Highlight in one piece.** With 3D relief on (the default over the photo), play a quiz round in Galicia or anywhere close in.
   On "What is this?" the asked place is wine-coloured in one piece, with no straight cut edges.
2. **Nothing left behind.** On the next question the previous place goes back to its normal colour; no wine-coloured rectangles stay on neighbours.
3. **Explore too.** Tap a place in Explore, then another: only the last one is highlighted. Hovering a list row lights only that place.

## For you
PR for #66. Cause reproduced headless with a flat relief: after a highlight change the fill kept its old colour until the relief cache was cleared [V].
Not verified: the live site with real relief and photo tiles (the container cannot reach the tile hosts), Safari, iPad.
