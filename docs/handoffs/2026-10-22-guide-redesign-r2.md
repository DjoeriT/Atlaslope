# Guide page redesign, rounds 1 and 2 (22 Oct 2026)

Follows `2026-10-21-guide-redesign.md`. Mock only, no app code. Branch `claude/guide-redesign-r1` (pushed, no PR yet).

## Done [V]
- Round 1: `Review/mock-guide-redesign-r1/`, page `mocks/guide-redesign-r1/index.html` (local, git-ignored). Options A subtle,
  B magazine, C photo-led, D bold; unfold from the photo button into the v4 map mode in C. ReviewBot 0 blocker, 4 major, 5 minor;
  fixed by LeadBot: D numbers and overflow, button stays in A/B/D, no repeated button photo in B-D, "Back to Rioja" on one line.
  Left: A shows "Viñedos AR" twice; photos soft full-bleed (800 px files).
- Owner on round 1: "Leaning towards C indeed. I also like A's calmness of the page. I love C's map tour." Then: "Two C variants AND
  one C+A blend. I don't like how the photos become so blurry under C, perhaps we need to make them smaller. Also it needs to be very
  clear that read with the map is a CTA / something to click on."
- Round 2: `Review/mock-guide-redesign-r2/`, page `mocks/guide-redesign-r2/index.html` (#solo=c1|c2|c3). C1 C refined, C2 C calmer,
  C3 C + A blend (recommended). One map-card button (photo + champagne bar, glyph, arrow square, hover/active), full unfold and
  fold-back in all three. Photos at most 528 px wide, natural/rendered ratio min 1.52 (`measure.mjs`). ReviewBot: 0 blockers, 4 should
  fix; fixed: C3 photo and chart edges aligned (side column 33rem), jump bar at the text edge, pressed state. Not fixed: C1 and C2 leave
  white space at 1440 (the cost of smaller photos; C3 is the answer to that); C3's left column still ends before the charts in some beats.
- Spend [V]: builder r1 261K, r2 118K; ReviewBot 35K + 34K; LeadBot about 220K, mostly re-reads.

## Decided (owner, 22 Oct 2026)
- "C3 it is. Next: the build brief for C3 plus the map unfold." The build brief below replaces the restore brief in
  `2026-10-21-tour-v3-restore.md`. "Wait with building" (21 Oct) still holds: the build starts on his word.

## Open
1. Owner answered (22 Oct 2026): "no map button where there is no tour, photos stay at most 528 px."
   Stops without their own photo: Rioja has none left in C3 [R, v4 README: hero, three zone photos and Haro stand in for the old
   intro, climate and barrel steps]. Priorat's weather and rules/wines beats have no photo [V, v4 build.py]. Commons shortlist
   (six, licences checked, credits in `Review/photo-candidates-priorat/shortlist.json`, sheet `shortlist.png`) sent to him; his
   pick goes into data/photos.json with a checked crop in the build.
   Picked (owner, 22 Oct 2026): weather = "Serra del Montsant - 14.jpg" (Angela Llop, CC BY-SA 2.0, https://commons.wikimedia.org/wiki/File:Serra_del_Montsant_-_14.jpg);
   rules and wines = "Bodegas, vinos del Priorat, Scala Dei, La Morera de Montsant.jpg" (Juan Emilio Prades Bel, CC BY 4.0, https://commons.wikimedia.org/wiki/File:Bodegas,_vinos_del_Priorat,_Scala_Dei,_La_Morera_de_Montsant.jpg). Slice 1 adds them
   (photos.json, public/photos 160/480/800, photoCrops.json, SOURCES.md).
2. Merge this branch as a records/mock PR (handoff, both mock folders) before the build starts.
3. Shots are heavy (r1 44 MB, r2 38 MB, already pushed, so they stay in history): next rounds commit only sheets and key frames.
4. Unchanged from earlier: satellite fix #182, the agenda items.

## Brief: guide page C3 and the map unfold, build (paste into a fresh session, on his word)
```
You are LeadBot for the guide page C3 build with the map unfold (#148, #127). Read docs/handoffs/2026-10-22-guide-redesign-r2.md,
Review/mock-guide-redesign-r2/README.md and review-design.md (grep), Review/mock-story-guide-v4/README.md (map mode), and look at
Review/mock-guide-redesign-r2/shots/sheet-c3.png, button-c3-*.png, unfold-c3-*.png. The target is option C3 of
mocks/guide-redesign-r2/index.html#solo=c3 (local, git-ignored), exactly. Answers to Open 1a-1c in the handoff first.
Two slices, one PR each, one builder card per step:
1. Guide page C3 for every place (src/pages/PlacePage.tsx and its parts, src/styles): A's two-column order with no boxes (prose
   left, photos and facts right, side column 33rem), C's hero with the map card button (photo + champagne bar, folded-map glyph,
   "Read with the map", "N minutes · N places to fly to", black arrow square; hover, focus, active), stop photos in the beats,
   How it tastes as the champagne band, jump bar at the text edge. Every section, fact, source and the credit line stay. Photos
   never shown wider than 528 px (unit test on the rendered ratio >= 1.45 at 1440, from measure.mjs). Checked crops for every shown
   photo (src/home/photoCrops.json, Tools/guides/crop_sheet.mjs). npm run shots at 1440, 834 and 390 next to the C3 mock shots.
2. Map unfold (src/story): the map card photo grows to full screen (FLIP), cross-fades into the v4 map mode (whole guide in the
   reading column, v3 stage: terrain x1.5, slope tint, climate and geology layers, rivers and names, locator, flights, 2.2 s
   dwell), flies to the first stop. "Close the map" folds back to the same paragraph (v4 matching; phone falls back to the
   chapter). Reduced motion: fade and jump. Start from release-59 src/story (git show release-59:src/story/...) and the v4 mock
   story.js; keep from 60-63 only the per-tour data limit, lazy loading, geology from zoom 10, English rock key, stop links.
   Rioja and Priorat first; npm run shots:tour each stop at 1440 and 390 next to the mock; send him the pairs before the PR.
ReviewBot (new screen and copy) on both PRs. Merge on green CI, then ask about the release.
Estimate [A]: slice 1 builder 300-500K, slice 2 0.6-1.2M (old restore estimate), ReviewBot 2 x 60K, LeadBot 150K each;
mostly re-reads. Pilot Rioja first; hard stop at 1.5x. Hand off around 250K.
```
