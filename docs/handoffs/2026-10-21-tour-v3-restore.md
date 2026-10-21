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

## Open
1. **Tour v3 restore build** (brief below).
2. Stops with no photo of their own today (Rioja: intro, climate, barrel; Priorat: check): "a photo in every stop card" means new
   Commons photos with checked crops, or the section photo. Ask him with candidates, never invent.
3. Satellite colour jumps and tile reloads: #182, measured and fixed in the same session as this hand-off (see its PR).
4. Agenda items 2, 4, 5 in `2026-10-21-agenda-after-62.md` stand (Learn finish, next country, later).

## Brief: tour v3 restore (paste into a fresh session)
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
