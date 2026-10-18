# Release 22: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad, and once on your phone. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
The fixes from the visual review of the live site (`/mnt/project-files/atlaslope/reviews/2026-10-18-site-visual-review.md`), plus smaller photo credits.

1. **One bar.** Open the Rioja guide from the atlas: the logo stays exactly where it was, Atlas is underlined, and there is no "Back to map". Atlas takes you back to Rioja on the map. Same on a region page.
2. **Short sources.** On the Rioja guide each fact ends in a short tag such as "Pliego, p. 15". Tap one: the document opens. At the end, Sources lists each document once in full.
3. **Photo credits.** On a card cover and a region cover, the credit is a small tag in the bottom-right corner ("Basotxerri, CC BY-SA 4.0"). It should still be readable on a bright sky.
4. **The map.** Open Rioja on the atlas: Rioja is black with a champagne edge and its three zones are thin champagne lines, no wine red. The map credits start folded into a small "i" at the bottom right; the map buttons sit above it.
5. **First visit.** In a private window, open atlaslope.com/atlas/: the map shows at once with a small note on moving it at the top. It goes when you touch the map or its cross.
6. **Study.** The Study screen has flat sections with lines, not boxes in a box. On a new place, "Got it" is full width.
7. **Home.** The second and third screens under "What you get" are readable at a glance. The hero shows Rioja in black and champagne. The sources strip and footer line up with the rest.
8. **Rioja's photos.** Rioja leads with autumn vines (no road or car), and the Spain card leads with a Jerez vineyard.

## For you
This PR (site visual fixes). Checks: typecheck, unit tests and the full UI suite locally, full CI on the PR. Not verified: Safari, iPad, real phones, town names giving way to wine names on the satellite map (cloud screenshots only), and the link preview in apps (they cache the old card for a while).
