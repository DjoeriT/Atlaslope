# Report: release 2, the atlas for real (#5)

Builder: BuilderBot. Branch `agent/builder/release-2-atlas`. Card: `Review/release-2-atlas.md`.

Status: in progress.

## Steps (step, commit, tests, wall time)
- Step 1, logic: basemap (EOX, terrain, optional Esri), neighbours, region views, search, card model; 13 unit tests in `tests/unit/atlas.test.ts` pass (11.8 s wall, of which 10.1 s is the all-pairs neighbour symmetry test). Commit 9753663.
- Step 2, app: full-screen map, DO layer with region colours, hover and labels, card with neighbours, search, preset views, legend, theme, fonts in `public/fonts/`; UI tests `tests/ui/atlas.spec.ts` (6) plus the existing smoke test: 7 passed (17.8 s wall). Fixed on the way: Enter in search moved focus to the card's close button and the same Enter pressed it; focus now goes to the card. Commit: see git log "Step 2".

## Verified / seen / assumed

## Left over

## Verdict
In progress.
