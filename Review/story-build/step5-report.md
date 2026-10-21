# Step 5 report: listing page and home count (BuilderBot)
Status: done. Branch agent/builder/story-listing (from claude/story-guide-mock 324eb68). Not pushed.

## Commits
- Step 5 (one commit, see `git log -1`): zonelabels layer, read-with-the-map/ page, home tile and footer link, build-time fill, unit tests. Tests: full `npx vitest run` 39 files, 368 passed (2 s); `npm run build` 2 s, dist/read-with-the-map/index.html has 2 rows, dist/index.html data-count="stories">2.

## Notes
- Zone names: layer `story-zonelabels` in src/story/layers.ts, switched on by the step layer "zonelabels" (climate and the three zone steps). Rioja Alavesa is a MultiPolygon, so its name shows twice (one per part).
- Square crops use data/story/photo-focus.json (checked by eye on rioja-2 and priorat-1: no faces, vines kept). photoCrops.json untouched (its test forbids entries for photos the Guides page does not show).
- Lede is the first sentence of the guide lede (Priorat's is long).
- Shots: Review/story-build/shots/step5-home-stats.png, step5-page.png, step5-page-phone.png, step5-rioja-climate-zonenames.png (no Esri key).
- Home tile row now 3 columns (home.css); phone keeps 2 columns.
