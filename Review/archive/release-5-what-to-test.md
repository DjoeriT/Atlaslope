# Release 5: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
The map now sits on a world map. Nothing else changes.

1. **Zoom out.** From the opening view, zoom out until you see Europe and North Africa. The sea is one even colour everywhere: no rectangles, no lighter band between the Canary Islands and the mainland, no straight line across France.
2. **Plain atlas.** Turn satellite off in the map menu (bottom right). France, Portugal, Morocco and the rest of the world are drawn as land with country borders, not empty grey.
3. **Spain and the Canaries.** Coastlines and wine places look as before. The Canary Islands sit in their real place, south-west of the mainland.

## For you
Commits: PR #26 (world background map) and PR #25 (release 4 close-out, docs and CI only). Checks: `Tools/check.sh ui` passed on 9df2b21 (89 unit, 26 UI tests); CI green on PR #26; the publish workflow re-runs the checks. Code review: `Review/world-map-review.md` (merge, 0 blockers). Screenshots from a local build with the public Esri imagery: `/mnt/project-files/atlaslope/world-map/`. Not verified: the live site with the keyed imagery, Safari, iPad, the far side of the world (±180° longitude).
