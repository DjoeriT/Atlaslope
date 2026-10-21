# Guide page redesign, with the map folding out of it (21 Oct 2026, late)

Follows `2026-10-21-tour-v3-restore.md`. This session built and reviewed the v4 mock; the owner then turned the direction.

## Done this session [V]
- v4 mock, Rioja: `Review/mock-story-guide-v4/` (build.py, README, shots, `review-design.md`), page `mocks/story-guide-v4/index.html`
  (local, git-ignored). The whole guide in the v3 journey, map on by default, Close the map / Show the map (remembered), and the closed view
  as the live guide page (captured from the built app) with a photo card for each stop beside the text.
- ReviewBot design review: 0 blockers, 3 major, 5 minor. Fixed: stop cards beside the text (single cards sideways, paired cards side by
  side), the climate chart on its own three-zone step. Left: the end-of-page indent on "Next in the course" and "Test me", the Haro
  station photo choice, and no "If you like this, try" or Sources with the map on.
- Handoff limit raised to about 250K (owner, 21 Oct 2026; CLAUDE.md, OWNER-RULES.md).
- Spend [V, session usage]: builder 160K + 244K (the second run was 2x its 120K card, past the 1.5x stop: measuring two full pages in
  helper turns; next time a script does that), ReviewBot 55K (card 50K), LeadBot about 175K, mostly re-reads.

## Decided (owner, 21 Oct 2026, late)
- "I just don't like the guide page anymore." What is wrong, in his picks: the white space, too many boxes, too plain: all of it.
- The guide opens on the guide page (map closed). This reopens and replaces "map on by default" from earlier the same evening.
- At the top, the big photo button (v3 part B, option C: black, champagne text, folded-map glyph; `Review/mock-story-guide-v3/shots/b-top-button.png`).
- Clicking it unfolds the page into the map journey: the button's photo grows to full screen and cross-fades into the 3D map, which
  then flies to the first stop. From there on the v4 map mode (whole guide in the column, Close the map back to the page at the same paragraph).
- v4's closed view (the live page plus cards) is therefore not the target; v4's map mode is.

## Open
1. **Guide page design round 1** (brief below), then the build brief in `2026-10-21-tour-v3-restore.md` is rewritten for the chosen page plus the v4 map.
2. Stops without a photo of their own, the satellite fix (#182) and the agenda items stand as listed in `2026-10-21-tour-v3-restore.md`.

## Brief: guide page design round 1, with the unfold (paste into a fresh session)
```
You are LeadBot for the guide page redesign and map unfold (#148, #127). Mock only, no app code. Read
docs/handoffs/2026-10-21-guide-redesign.md, Review/visual-style.md, Review/mock-story-guide-v4/README.md (grep), and look at
Review/mock-story-guide-v3/shots/b-top-button.png and 2-3 of Review/mock-story-guide-v4/shots/*.png.
The owner dislikes today's guide page: white space beside the text, too many boxes, too plain. Design round 1 = the whole range,
subtle to bold, designed, not CSS deletions. Richer = more real product and real photos, same calm. No drawn icons, illustrations or
diagrams. Positioning: a general, fun wine reference for anyone who loves wine; "Why it tastes the way it does" is the spine; only a
small "Test me" link into Study.
1. One page (Artifact or mocks/guide-redesign-r1/index.html for live tiles), Rioja, options A-D, recommendation marked. Each option:
   the whole guide page with the map closed, guide text unchanged (content/guides/rioja.json and the captured rest in
   Review/mock-story-guide-v4/guide-page-rioja.html), every section kept, sources kept, charts allowed but placed with care.
   Desktop 1440 and phone 390 for each.
2. The big photo button at the top of each option (v3 part B option C style). In the recommended option, a working unfold: the photo
   grows to full screen and cross-fades into the v4 map mode (reuse Review/mock-story-guide-v4/: build.py, story.js), which flies to
   the first stop; Close the map folds back to the page at the same paragraph.
3. UX/UI/visual check against Review/visual-style.md before he sees it (ReviewBot design mode, card 50K); fix findings, don't list them.
   Full-page shots by script (Playwright clip at scrollY steps), never helper turns measuring by hand.
Send him the link and 2-4 shots; ask him to pick or list changes.
One builder helper for the page, one ReviewBot. Estimate [A]: builder 250-400K (measured: v4 builder 160K + 244K), ReviewBot 50K,
LeadBot 150K; hard stop at 1.5x. Hand off around 250K.
```
