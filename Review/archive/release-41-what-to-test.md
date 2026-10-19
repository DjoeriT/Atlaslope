# Release 41: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
1. **The Guides page lists every guide.** It shows 37 guides, from Green Spain to Andalucía, with Rioja's three zones right under Rioja. The line above says "Terroir written for 37 of 109 places, across 4 regions so far".
2. **Each guide link works.** Tapping a name opens that place's guide in the atlas.
3. **The home page count matches.** The home page says 37 places have a guide.
4. **The About page.** The headline reads "A wine atlas for anyone who loves wine." Study is the third step under How to use it, marked "if you like".

## For you
PR from `claude/guides-page-auto-1p6t8o`. The Guides list and count are filled in at build time from `content/guides/`, so a release that adds guides updates the page with no extra step. Handoff `docs/handoffs/2026-10-19-guides-page-auto.md`. ReviewBot `Review/pr-113-review.md` (two should-fix findings fixed).
Not verified: Safari, iPad, real phones.
