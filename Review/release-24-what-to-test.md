# Release 24: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad, and once on your phone. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
A taller top bar, Guides and About pages, and new home page copy (owner asks, 18 Oct 2026, 15:09Z).

1. **The bar.** It is taller, with a bigger logo and bold Atlas, Study, Guides and About on every page. The current page is underlined. On the home page there is no search; on the atlas the search field is still there and searches in place.
2. **Guides.** Tap Guides: a page lists the four written guides (Rioja and its three zones). Each opens that guide in the atlas.
3. **About.** Tap About: how to study with AtlaSlope, where the facts come from, and a line saying it is independent of WSET and the Wine Scholar Guild. "Who made it" says coming soon.
4. **Home.** The big headline is easier to read. Open the atlas is the biggest button on the page and comes back on a black band at the end. The numbers read "106 wine appellations, all of Spain", "10 study regions, in course order" and "Free, in beta, no account".
5. **Wide screen.** On a big monitor the headline stays on three lines and the map fills the right side.
6. **Phone.** On the home page all four bar items fit. On the atlas the bar shows the logo, search, Atlas and Study (Guides and About wait for a phone menu).

## For you
PR #85 (top bar and home cleanup). Checks: typecheck, unit tests and the home, bar and card UI tests locally, full CI on the PR, ReviewBot code review. Not verified: Safari, iPad, real phones. Release 23 (the speed slice) must be live first.
