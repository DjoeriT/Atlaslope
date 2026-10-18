# Release 25: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad, and once on your phone. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
Photo credits follow the photo licences (owner card "Fix photos, keep rights", 18 Oct 2026).

1. **Place card.** Open Alella in the atlas. The small tag on the photo reads "Enric, CC BY-SA 4.0, resized". Tapping the name opens the photo's Commons page; tapping the licence opens the Creative Commons licence.
2. **Guide page.** Open the Rioja guide. The line under the photos lists each photo the same way, with ", resized" after CC BY and CC BY-SA licences.
3. **Region page.** Open a study region's page. The tag on the cover and the credits line under the tiles use the same format. A CC0 or public-domain photo has no "resized".

## For you
PR #90 (docs and hygiene sweep, part 2): `src/cards/Credit.tsx`, NOTICE.md, docs records of the 18 Oct cards. Checks: typecheck, 266 unit tests, the place, region and facts UI tests locally, full CI on the PR, ReviewBot code review (ready, three notes fixed). Not verified: Safari, iPad, real phones.
