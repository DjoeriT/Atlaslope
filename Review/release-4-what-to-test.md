# Release 4: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
Explore is now a reference: every quizzed place opens a fact sheet.

1. **A fact sheet.** Tap Rioja Alavesa (or search it). Under the name: a why line, then Level, Main grapes, Other grapes, Styles, Climate, Climate (Köppen, measured), Altitude and Soil, each with a small source line you can open.
2. **Photos.** Below the rows, up to three photos with a credit that opens the Wikimedia Commons page. Jerez and Manzanilla have none yet. A photo that fails to load simply disappears.
3. **Long grape lists.** Open a Canary place such as Abona: "and N more" opens the full list and "Show fewer" closes it, by tap or keyboard.
4. **Grapes in search.** Type "albillo": Cebreros appears with "main grape" as its detail. Type "listán": the Canary places where it is the main grape.
5. **Gaps you will see.** About 30 places show no main grape, because no source names one (planted area comes in release 4.1). Some "Other grapes" lists say "(some)" where the cited document is only an amendment.
6. **iPad, large text, dark mode.** The sheet should scroll inside the card without overlapping the map controls.

## For you
Commits: PR #23 (merge 23baed0) and PR #24 (Rioja zones). Checks: `Tools/check.sh ui` passed on d39aa9a (85 unit, 26 UI tests); CI green on both PRs; the publish workflow re-runs the checks. Fact sheets: ReviewBot sampled rows against the sources (`release-4-review-sheets.md`, `release-4-review-rioja-zones.md`); code review `release-4-review-code.md`. Signed off by you: Rioja and the Canary Islands. Not verified: photos on the live site, Safari, iPad, large text on a real device.
