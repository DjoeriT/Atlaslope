# Read with the map: Rioja + Priorat build, part 1 (#127, #148), 21 Oct 2026

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

## Open
- No Esri key on this Mac (`.env.local` has none): local shots show the plain base map. The owner must see the satellite version on a
  preview build (CI has the key) before merge.
- Not checked: real Safari, iPad, phone.
- `zonelabels` (three Rioja zone names on the climate map) not drawn yet: added to card 5.
- Slope PNG for Rioja is 1.2 MB, loaded only in the story; check load time on the preview build.
- Shots not opened by anyone yet: `story-priorat-siurana.png`.
- MapLibre's "i" credit stays (OSM credit on the plain base); the mock hid it.

## Next (fresh session)
Steps 5 (listing page + home count), 6 (tests + one Playwright spec), 7 (ReviewBot design + Opus diff), then PR, preview for the owner,
merge on green CI and ReviewBot. Cards in `Review/story-build/cards.md`.

## Cost [V, subagent usage; main thread from the session meter]
Step 1 57K, step 2 69K, step 3 158K (Opus, one resume), step 4 118K (one resume). Helpers 402K so far against 555K planned for steps 1-4. Main thread about 150K context at hand-off.
