# ReviewBot: PR #100 (claude/small-premium-fixes-27gy5i), code review plus copy check

Verdict: Merge (after one optional comment fix). Blockers 0, should fix 0, notes 3.
Ran: `npx vitest run tests/unit/quiz-ui-doors.test.ts` (9 pass). Read: the full src/tests/index.html diff. UI suite not run (CI).

## Claims
1. Map labels show first name only: confirmed (read). `mapName` splits on " / " in labels.ts:22; used at labels.ts:33 and createMap.ts:383. Card and guide untouched.
2. Atlas panel: confirmed (read). Hover hints gone from Spain and Region cards; `.hoverhint` CSS and strings removed, no stragglers (grep). Source line is
   "Source:" / "Sources:" plus links to each place card, comma separated; link text unchanged (`firstName`). The block is hidden when `from` is empty. The fallback lede has no hint. Tile count
   `small` is now .9rem, 400, ink3, no uppercase or letter-spacing (app.css:208). The same rule also styles zone level lines, which is consistent.
3. Study: confirmed (read). Kicker and unused `dayName` import path gone (`dayName` still used by the next-due note). `sharedRegion` handles 0 places (null),
   mixed regions (null), 1 region (name), and a missing region (null, falls back to "new"); unit test covers all three. Singular "1 place" handled in `upNext`.
   Focus: "Following the course order." plain, "Set a focus" link kept. With focus on: "Focus: A, B." (bold removed). UI spec strings updated to match.
4. SPAIN badge radius .3rem: confirmed (read), home.css:53.
5. Home: both kickers removed from index.html; sources label now .9rem, 500, sentence case (home.css:85). Confirmed (read). Source text is already sentence case.
6. No regression found in tests: confirmed (read, inferred for UI specs; CI runs them). No UI test asserted "Hover a" or "FROM THE OFFICIAL".

## Findings (all notes)
1. src/home/home.css:51 comment still says the badge is "a pill by his ask, the one exception to no pills". Now false and contradicts visual-style.md. Proposed fix: reword to "the badge is a small-radius tag".
2. Copy: "Up next from your focus: 3 places in Green Spain." (Doors.tsx upNext, strings.ts ~250) is a long line but one idea; fine. When focus places span regions it reads "3 new places", which loses "from your focus" no more, so OK. Note only.
3. Accessibility: the "Source:" / "Sources:" line is real text with real links, the visible tag still reads in order for screen readers. The home hero badge stays uppercase at .7rem with 0.14em spacing; visual-style allows uppercase only for kickers (it is a tag, owner-approved). Note: confirm with owner that the badge keeps its uppercase.

## Dead code
None found for removed strings (hoverRegion, hoverPlace, ledeFrom, ledeAnd, kicker, newPlain, readyNew, newFromFocus, focusLine). `listOf` still used for focus names.

Verdict: Merge.
