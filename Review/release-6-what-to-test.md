# Release 6: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
The tasting and producers release (planned as "release 4.1"). Fact sheets gain three rows; nothing else changes.

1. **How it tastes.** Open Rioja. Below Styles, "How it tastes" shows one line per colour (Reds, Whites, Rosés), with a source line you can open. Jerez has no such row: its official document names the types but does not describe them.
2. **Famous styles.** On Rioja: Crianza, Reserva and Gran Reserva, each with how long it ages. Try Jerez (Fino, Amontillado...) and Ribeiro (Tostado).
3. **Famous producers.** At the end of the rows, on seven places only: Ribera del Duero, Penedès, Bierzo, Rioja, Rueda, Alella and Lebrija. The source line opens the Wikipedia article. Every other place shows no producer row, because no article singles one out.
4. **iPad, large text, dark mode.** The longer sheet should still scroll inside the card without overlapping the map controls.

## For you
Commits: one PR from `claude/release-4-1-w86f4s` (issue #27). Checks: see the PR's CI run; the publish workflow re-runs them.
Sources: tastes and styles from the EU single documents and pliegos; producers from English Wikipedia (your card, 20:11Z) and, for
Lebrija, Spanish Wikipedia. ReviewBot report: `Review/release-4.1-review.md`. Not in this release: main grapes from planted area (the
ministry's DOP report has hectares per DO but no grapes [V]; issue #29). Not verified: Safari, iPad, large text on a real device.
