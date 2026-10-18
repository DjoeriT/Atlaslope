# Release 33: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
1. **Map names.** On the atlas, zoom to the Basque coast. The labels read "Bizkaiko Txakolina", "Getariako Txakolina" and "Arabako Txakolina", one name each. Open one: the card still shows both names.
2. **Atlas panel.** On Spain, no "Hover a region" line. Under the lede: "Sources: Getariako Txakolina, Lanzarote", both links. Region tiles say "9 places" in plain grey, not capitals.
3. **Study.** Open Study. No date line above the title. The Study door says "Up next: 5 places in Green Spain." and "Following the course order. Set a focus".
4. **Home.** The SPAIN badge has soft corners. No "HOW IT WORKS" or "FROM THE RIOJA GUIDE" above the headings. "Every fact from an official source" is in normal case.

## For you
One PR (#100) from `claude/small-premium-fixes-27gy5i`. Handoff `docs/handoffs/2026-10-18-small-premium-fixes.md`. Checks: CI on PR #100; ReviewBot `Review/pr-100-review.md`. Release 32 tester note moved to `Review/archive/`.
Not verified: Safari, iPad, real phones.
