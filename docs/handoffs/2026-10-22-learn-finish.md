# Learn finish: Study becomes Learn, start card, course filter (#147, 22 Oct 2026)

## Done
- Branch `claude/study-course`: main merged in (three conflicts: home and Guides footer, tree counts). Taken from main, with Learn wording.
- Owner (22 Oct 2026): "Study region" stays. "The wine study atlas for WSET and Wine Scholar students" stays. Recorded in the glossary and `docs/PROJECT.md`.
- The app writes `#learn`. `#study` and `#quiz` still open Learn (`src/url.ts`). The top bar links `#learn`. The country pages say "Learn" and "Open Learn".
- Square crops: Learn's place photos are in the crop check (`learnPhotoKeys`, `tests/unit/home.test.ts`, `Tools/guides/crop_sheet.mjs`). All 75 already had checked crops from main (the Guides and country pages), so none were new.
- UI specs rewritten for the new card: intro on a first visit, "Up next" when returning, "Learning for", "Begin with five places".
- The Cava jump bar now has "If you like this, try" because Cava is in Learn.
- Glossary: Learn and Course. CLAUDE.md vocabulary updated. Indent tidied in `Doors.tsx`.

## Open
- Release: done. Learn went out in release 70 (23 Oct 2026); the live home links `#learn` [V]. Leftover "Study" lines in CLAUDE.md fixed in #246.
- ReviewBot notes not done (`Review/learn-start/review.md`): "just before you would forget it" may promise too much; on a phone the sticky
  Begin button covers the intro's third paragraph until you scroll. The intro's miss line was changed from the approved mock to what the code does.
- Risk kept from the builder report: an older open tab reads a new course id as All of Spain, and its next save writes that back.
- Learn step 2 (WSET 2 why cards, pilot Rioja and Jerez): `docs/handoffs/2026-10-21-agenda-after-62.md` item 5.
