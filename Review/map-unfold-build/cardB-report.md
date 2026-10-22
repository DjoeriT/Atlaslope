# Card B report: unfold and fold-back (slice 2)
Status: done.

## Steps
1. Commit 6f07900: src/story/unfold.ts (growFrom FLIP 900 ms, cubic-bezier(.65,0,.2,1); fade 700 ms after the map's first idle, 2.5 s cap; crossFade), MapCard onClick grows the photo then opens the mode, GuideMap fires story-map-idle, PlacePage fades the page in on fold (450 ms) or on a reduced-motion open (250 ms), .grow CSS. Reduced motion: no .grow element, plain cross-fade, the mode opens on stop 1 (map jumps). Fold-back uses card A's data-b match. Tests: tsc clean, npm test 401 green (2.5 s), build 2 s, story.spec.ts 16 passed (36 s) incl. 2 new (unfold + fold within 2 px at 1440; reduced motion no .grow).
2. Stills Review/map-unfold-build/shots/b-unfold-{1440,390}-{0,1,2}.png, b-fold-{1440,390}[-0].png (Rioja, live imagery).

## Priorat stop 6
node Tools/shots-tour.mjs priorat --sizes desktop: 1 FLAGGED (stop 6 licorella, imagery did not load, 39 tiles, 50 s), 108 s. Same on a worktree of origin/main (38 s, same flag): predates slice 2, not ours; not fixed.

## Notes
- The map mode opens on stop 1 (no cover step), so the map is shown there already under the photo rather than flying; no animated fly after the cross-fade.
- With live tiles the first Rioja view needs well over 2.5 s here (headless software GL), so the photo can fade onto a still-blank map; same cap as the mock.
- Phone fold-back shows the existing floating Show map button.
