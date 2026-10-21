# Read with the map: Rioja + Priorat build (#127, #148), 21 Oct 2026

Branch `claude/story-guide-mock` (mock rounds plus the build). Cards and their state: `Review/story-build/cards.md`; one report per
step in `Review/story-build/stepN-report.md`; shots in `Review/story-build/shots/`.

## Decided (owner, 21 Oct 2026)
- Plan approved with 1A, 2A, 3A, 4A: name "Read with the map" everywhere (button, listing page, home tile); IGME geology shipped with
  credit "Source: IGME, MAGNA 50" (free site, AccessConstraints only cover paid services); the listing page is its own page linked from
  the home page; listing page and home count go in this same PR.
- Owner ask during planning: a page that lists the story guides, linked from home, and a home count next to places and regions.

## Done [V]
- Step 1 data: `Tools/story/fetch_layers.py`, `data/story/` rivers and names (rivers-rioja 309 KB, 88 KB gzipped, kept whole), five
  Commons stop photos in the photo set, also in `Review/sources/photo-picks.json` so a photo rerun keeps them; `data/SOURCES.md` "Story data".
- Step 2 format: `content/stories/{rioja,priorat}.json`, `src/story/format.ts`, `load.ts` (`storyIds`, `storyCount`, `loadStory`),
  `tests/unit/story-format.test.ts`, `docs/guides.md` "Story files" and Format log. Three mock facts are tightened guide sentences, as in the approved mock.
- Step 3 view: `src/story/StoryView.tsx`, `storyMap.ts`, `camera.ts`, `view.ts`, `StoryButton.tsx`, route `#place=<id>&page&story`
  in `src/app/App.tsx`, `src/url.ts`. Full vitest 353 green, build OK. Shots `story-rioja-haro-{desktop,phone}.png`.
- Step 4 layers: rivers, names, Köppen at 36% with legend, IGME geology at soils steps, slope tint (precomputed
  `data/story/slope-*.png` by `Tools/story/slope_tint.py`, Rioja 1.2 MB), fact markers with keyboard, phone camera padding, five checked
  3:2 crops (sheet `Review/story-build/shots/crops-story.png`, checked by LeadBot), known-gaps allowance removed. Full vitest 361 green.

- Step 5: `read-with-the-map/` listing page (build-time fill, `src/home/storyList.ts`), home tile "2 guides to read with the map",
  footer link, Rioja zone names. Step 6: `tests/ui/story.spec.ts` (4 tests, fixtures). Step 7: ReviewBot design and Opus code review
  (`Review/story-build/review-*.md`); all 3 code blockers, 5 should-fix and 3 design items fixed (`fixes-report.md`); design blocker
  "no photo credit" refuted (one line at the story's end, approved design); Haro station photo kept (a stop photo approved in round 3,
  the "no trains" rule covers a place's first photo). Square crops for the listing page in `data/story/photo-focus-square.json`.
  Full vitest 372, story spec 4/4, build OK [V, builder runs]. Tester note `Review/release-59-what-to-test.md`.

## Open
- No Esri key on this Mac (`.env.local` has none): local shots show the plain base map. The owner must see the satellite version on a
  preview build (CI has the key) before merge.
- Not checked: real Safari, iPad, phone.
- Slope PNG for Rioja is 1.2 MB, loaded only in the story; check load time on the preview build.
- The Rioja zone-label block in `src/story/layers.ts` is Rioja-only; other guides with zones need it generalised.
- Next: the other 11 guides of the 13 (list in `docs/PROJECT.md`), a few per PR: each needs a story file and `Tools/story/` data runs.
- MapLibre's "i" credit stays (OSM credit on the plain base); the mock hid it.

## Next
Owner looks at the satellite preview, then merge on green CI; then ask "publish release 59".

## Cost [V, subagent usage; main thread from the session meter]
Step 1 57K, step 2 69K, step 3 158K (Opus, one resume), step 4 118K (one resume). Helpers 402K so far against 555K planned for steps 1-4. Step 5 72K, step 6 42K, reviews 36K + 72K, fixes 77K. Helpers about 777K in all against 885K planned. Main thread over 200K context (past the 150K hand-off point at the owner's choice to stay).
