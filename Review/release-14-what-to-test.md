# Release 14: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
Mobile check (#57, PR #59), best tried on a phone. The mastery map moves to 15 and ready for friends to 16.

1. **Explore tab.** Open a place, then tap Explore at the top. You land on Spain at once, with no blank flash or reload.
2. **Back to map.** Open a place, tap "Read the full page", then "Back to map". Now swipe back (or press Back): you go to where you
   were before the place, not into the page again.
3. **Search.** Type "rib" with a place card open. The list shows on top of the card, wide enough to read, and a tap opens the place.
   On an iPhone the screen does not zoom in when you tap the search field.
4. **Climate key on a phone.** It is a small "Climate" button with colour stripes under the top bar. Tap it to see the six climates;
   tap again to fold it.
5. **Map menu on a phone.** Tap the layers button: the whole menu shows, above the top bar, upright and sideways.
6. **Quiz on a phone.** Play a round: every new place and question starts at the top of the card; after a wrong answer you see
   the answer box first.

## For you
PR #59, published from 8526daf (publish run 39044219743). Checks: `Tools/check.sh ui` on 2823223 (the PR head; 8526daf has the same
tree), 258 unit and 95 UI tests; CI green; ReviewBot `Review/mobile-check-review.md`. Handoff `docs/handoffs/2026-10-17-mobile-check.md`.
Live map check run 39044664030: the first attempt loaded no OpenFreeMap name tile (photo, relief and PNOA fine); the one re-run passed.
Not verified: real Safari on iPhone, a real Android phone, satellite over the phone layouts.
