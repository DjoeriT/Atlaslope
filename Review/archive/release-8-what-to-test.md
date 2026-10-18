# Release 8: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
New colours and type on every screen (issue #36). Nothing moves and nothing new to learn; the photo-led pages come in release 9 (#37).

1. **Light mode.** White card and white top bar, wine buttons and selected tab, grey text. No cream paper and no brown left anywhere.
2. **Dark mode.** Atlaslope menu › theme. Near-black card, gold buttons and selected tab, gold matches the dark logo.
3. **Place card.** Open Rioja. Bigger serif title, section headings ruled with a thin line, rounder card with a soft shadow.
4. **Quiz.** Quiz › Study and Review doors, a round, the round end: same wine (light) or gold (dark), chips and doors with the new borders.
5. **Selected place on the map.** The selected place now fills in the new wine colour.

## For you
Commits: one PR from `claude/release-8-new-look-4kufin`. Tokens: `src/styles/app.css` (`:root`), quiz styles in `src/styles/quiz.css`.
Yardstick `Review/visual-style.md`; plan `Review/release-8-9-plan.md`; ReviewBot `Review/release-8-review.md`.
Not in this release: the cover photo card, full place page and region page (release 9). Not verified: Safari, iPad and large text on a
real device, satellite imagery under the new chrome (blocked in the cloud container).
