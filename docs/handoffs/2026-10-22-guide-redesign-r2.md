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

## Open
1. Owner picks C1, C2 or C3 (or lists changes). Photos bigger than 528 px need larger source files (from the photos' own pages, in
   `data/SOURCES.md`); the app ships 800 px only.
2. Then rewrite the build brief in `2026-10-21-tour-v3-restore.md` for the chosen page plus the v4 map mode and the unfold.
3. Shots are heavy (r1 44 MB, r2 38 MB in git): before the PR, keep the sheets and key frames and drop the singles, or say why not.
4. Unchanged from earlier: stops without their own photo, satellite fix #182, the agenda items.
