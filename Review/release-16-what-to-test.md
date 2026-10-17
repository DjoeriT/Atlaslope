# Release 16: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
The UX sweep (owner, 17 Oct 2026: "Full set" motion, "Drag, 3 stops" phone sheet, "Skip it" for the one-place Rioja region).

1. **Motion.** Move between Spain, a region and a place: the card glides and the map flies once it has landed. Open a place page:
   it rises over the map with the cover photo carried along; "Back to map" slides it down. With "Reduce motion" on, nothing moves.
2. **Rioja once.** Search "Rioja" or tap it on the Spain card: you land on the Rioja place directly; the trail reads Spain › Rioja.
3. **One page bar.** Place page and region page have the same top bar (logo, search, Back to map); no legend over the region photo.
4. **Escape.** On a Mac, Escape closes a page, then steps up one level per press.
5. **End round.** In a quiz round, End round asks first ("Keep going" is the main button); ending early says the round stopped, not "All done".
6. **Phone.** On a phone the card is a sheet: drag the handle (or tap it) between a small peek, half and full. One row of controls at the top, no zoom buttons (pinch).
7. **Gone on purpose.** The Progress tab is hidden until the mastery map ships.

## For you
PR #63. Checks: unit 259 pass; CI `Tools/check.sh ui` on the merged head. ReviewBot design check `Review/ux-sweep-1-design-check.md`, code review `Review/ux-sweep-1-code-review.md` (3 should-fix, all fixed).
Not verified: Safari, a real iPad or phone, motion over the satellite photo.
