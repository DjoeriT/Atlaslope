# Release 12: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
The polish slice (PR #53). The mastery map moves to 13 and ready for friends to 14.

1. **Tab icon.** The browser tab shows the vineyard slope with four rows: wine on a light tab bar, gold on a dark one. Browsers cache
   icons hard; if you still see the old one, close the tab and open the site in a new one.
2. **Home Screen icon.** On iPad or iPhone, Safari › Share › Add to Home Screen: the icon is the full five-row logo in wine. If you
   added the site before, remove the old icon first.
3. **Photos.** Jerez and Ribera del Guadiana now show three photos on their place page; Manzanilla shows one (flor in a cask).
   Txakoli de Álava still shows its name on a cover, with no photo.

## For you
PR #53 from `claude/project-thread-agx533`, published from 51c5240. Checks: `Tools/check.sh ui` on 89aa7e5 (same tree as 51c5240), 253
unit and 86 UI tests; CI green; ReviewBot `Review/polish-review.md`. Handoff `docs/handoffs/2026-10-17-polish-icons-photos.md`.
Live map check passed after the deploy (run 39034531037). Not verified: Safari, a real iPad or Android Home Screen, the icons on a real tab bar.
