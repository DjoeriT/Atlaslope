# Map tour: back to the v3 journey (21 Oct 2026)

## Decided (owner, 21 Oct 2026)
- Round 1 of a clean-slate tour design (`Review/mock-tour-clean/`, four directions: still guide, B, scenes, film): "These are all bad."
  Direction B (`Review/mock-tour-wow/`) is dropped with it.
- He wants the original fly-over back, story mock v3 (`Review/mock-story-guide-v3/`, live page `mocks/story-guide-v3/index.html`):
  "it truly felt like a journey". His words for the build: bring back the v3 journey exactly (full-screen, 3D terrain, slope tint,
  climate and geology overlays, rivers and names, flies stop to stop), opened from a big photo button at the top of the guide, plus a
  photo in every stop card.
- What went wrong [V]: release 59 built v3 as a full-screen view; release 61 folded it into the guide as a 46%-wide side map without
  stop cards or photos; release 62 then flew the map on the reading line. B and round 1 all started from the folded version.

## Decided later the same evening (owner, 21 Oct 2026)
- v3 is a stepping stone to a better version: the whole guide lives inside the v3 layout. Map on by default (desktop and phone),
  remembered once closed. "Close the map" leaves the same content on the page without the map.
- So a **v4 mock** comes first (brief below); the restore build brief further down waits until v4 is approved and then builds v4.
- "Wait with building" (owner): no app code until he says so.

## Open
1. **v4 mock round**: done; the guide page redesign followed. The build brief now lives in `2026-10-22-guide-redesign-r2.md` (C3 plus the unfold); the restore brief below is replaced by it.
2. Stops with no photo of their own today (Rioja: intro, climate, barrel; Priorat: check): "a photo in every stop card" means new
   Commons photos with checked crops, or the section photo. Ask him with candidates, never invent.
3. Satellite colour jumps and tile reloads: #182, measured (`Review/sat-flicker/report.md`), fix waits for his word (brief below).
4. Agenda items 2, 4, 5 in `2026-10-21-agenda-after-62.md` stand (Learn finish, next country, later).

## Brief: v4 mock, the guide inside the journey (paste into a fresh session)
```
You are LeadBot for the map tour v4 mock (#148, #127). Mock only, no app code. Read docs/handoffs/2026-10-21-tour-v3-restore.md,
Review/mock-story-guide-v3/README.md (grep) and look at Review/mock-story-guide-v3/shots/*.png. The owner opened the live v3
page (mocks/story-guide-v3/index.html) and wants it as the base: keep every animation and layer exactly, extend it.
Build mocks/story-guide-v4/index.html (git-ignored, live tiles) from a copy of Review/mock-story-guide-v3/ into
Review/mock-story-guide-v4/ (build.py etc.; v3 stays untouched). Rioja first, Priorat if cheap.
1. The whole guide in the reading column: every section of content/guides/rioja.json in the guide's order (the place, the
   weather, the ground, the rules, how it tastes, in short, extras), guide text unchanged. Stops stay the guide's fly entries.
2. The map stage exactly as v3 (terrain x1.5, slope tint, climate and geology, rivers and names, locator, focus, 2.5-4 s
   flights, two legs, 2.2 s dwell). It only moves when a new stop starts. Sections with no stop hold a still, tilted view of the
   whole place. Phone: map pinned to the top 42%.
3. A photo card in the text for each stop (v3 part B style, checked crops are for the build; mark CSS crops [A]).
4. "Close the map" / "Show the map" in the black band. Closed: the text widens to the normal guide page width, same content,
   photo cards stay, fly links become plain links; the reader stays on the paragraph they were on. Reopen: jumps (no flight) to
   that paragraph's stop, flies again from the next stop. Map on by default; the closed choice is remembered (localStorage, try/catch).
5. Design check against Review/visual-style.md; fix findings. Desktop 1440 and phone 390 shots, map on and closed, to him with
   the file:/// path. Ask him to approve or list changes. Then update the restore brief below to build v4.
One helper (one-shot, fixed steps) for the page. Estimate [A]: 0.3-0.5M tokens, mostly new. Hand off around 150K.
```

## Brief: #182 satellite fix (paste into a fresh session, on his word)
```
You are LeadBot for #182 (satellite colour jumps and tile reloads). Read Review/sat-flicker/report.md (measured 21 Oct 2026):
Esri to PNOA switch at map zoom 8 on 2x screens (+40 red step), hillshade brightness step at zoom 7, 3-6x tile churn at
tileSize 128 with a 600 ms fade on every re-created tile, cancelled Esri downloads refetched; HTTP cache works.
Small slice in src/map/style.ts and src/map/imagery.ts: blend PNOA in over two zoom levels (raster-opacity by zoom) and/or a light
colour match; shorter raster fade; larger tile cache (maxTileCacheSize); relief fading in over zooms 7-9. Measure before and
after with Review/sat-flicker/measure.mjs (needs a build exposing window.__map, debug-only via src/debug.ts, kept out of dist/).
Never tune a test to pass. Before/after video and colour table to him, PR, merge on green CI, then ask about the release.
Estimate [A]: 0.3-0.6M, mostly re-reads.
```

## Brief: tour restore build (after v4 is approved; update to v4 first)
```
You are LeadBot for the map tour restore (#148, #127). Read docs/handoffs/2026-10-21-tour-v3-restore.md, then
Review/mock-story-guide-v3/README.md and LAYERS.md (grep), and look at Review/mock-story-guide-v3/shots/*.png: that is the
target, exactly. The live mock is mocks/story-guide-v3/index.html (local, git-ignored).
1. Restore the release 59 full-screen tour (git show release-59:src/story/*, its route and styles; git diff release-59 release-63
   -- src/story src/guide to see what 61-62 changed). Keep from 60-62 only what does not change the look: per-tour data limit, lazy
   loading, geology from zoom 10, English rock key, stop picked by its own link. Drop the folded-in guide map (layout A / B3 band).
2. Match v3: 3D terrain x1.5 (switch x1.3), slope tint over 30%, climate overlay in the climate chapter, IGME geology at soils,
   rivers and names, Spain locator, focus outline and fade, flights of 2.5-4 s, two legs for long hops, 2.2 s dwell, credit line.
3. Entry: a big button with a photo at the top of the guide opens it; "Back to the guide" returns to the same place.
4. A photo in every stop card (3:2, checked crop in src/home/photoCrops.json via Tools/guides/crop_sheet.mjs). Stops without a photo:
   show him candidates first.
5. Rioja and Priorat. npm run shots:tour each stop, desktop 1440 and phone 390, side by side with the v3 shots; send him the pairs
   before the PR. ReviewBot (screen and copy). Merge on green CI, then ask about the release.
One builder at a time, card per step. Estimate [A]: 0.6-1.2M helper tokens, mostly re-reads; hard stop at 1.5x.
```
