# Release 1: what to test

## General (every release)
Open https://djoerit.github.io/Paraje/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
The site is live for the first time. Two things to look at:

1. **The app shell** at the root address. A base map of Spain and the word "Spain" in the corner once it has loaded. No layers, panel or quiz yet: those come with their own releases.
2. **The atlas mock-ups** at https://djoerit.github.io/Paraje/mocks/atlas-v2/. Open `index.html` there and click through the seven pages. Check that satellite imagery and 3D relief load (they stream from the internet; they did not work in the earlier hosted preview). Try the Layers button, the light and dark toggle, the 3D button, and the quiz pages. Nothing in the mocks saves anything; scores and photos are placeholders.

## For you
- Commits: 3328e9c (mocks, PR #2) on top of 771b25c and c10c296 (data overrides, issue #1 step one) and the setup commits.
- Checks: `Tools/check.sh ui` passed on 3328e9c: typecheck, 9 unit tests, data ledger, build, debug-flag grep, 1 Playwright UI test.
- Not verified: Safari on iPad, phone width of the mocks (stacked layout, lightly tested), satellite imagery from the Pages host (cannot be reached from the build machine).
