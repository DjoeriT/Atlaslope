# Release 11: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
The QA round after release 10 (issues #48 and #50). The mastery map, planned as 11, becomes 12.

1. **Map colours.** On the Spain view, places are coloured by climate, with a legend under Explore / Quiz / Progress. Open the map menu
   (layers button, bottom right): "Colour places by" switches to Study region, and the legend changes to the ten regions. Turning place
   boundaries off hides the legend.
2. **Spain card.** A cover photo, "106 places in 10 study regions", and a row per region with a photo, its place count and most common
   main grapes. If something is due, "Start today's round · N due" opens the quiz (due counts are reviews, as on the Today card), and rows show "N due".
3. **Region card.** Cover, "Main grapes here", and a photo row per place with its zones indented under it (Rioja).
4. **Hover.** Pointing at a row lights its places up on the map without moving it (keyboard focus does too). On iPad the "Hover…" hint is hidden.
5. **Reset view.** Tilt or turn the map, then the button under zoom puts it back. The compass now says "Point north" and also shows after
   reloading a turned map.
6. **Large text on iPad.** With a bigger text size, the top bar switches to the compact layout instead of overlapping.
7. **Light and dark, iPad,** and the colours over satellite (only checkable on the live site).

## For you
PRs #49 and the one for #50 from `claude/qa-review-round-5g09tq`. Findings `Review/qa-round-1.md`, mock `Review/mock-cards-climate-v2/`,
design check `Review/qa-round-1-cards-design-check.md`.
Known gaps against the mock: none on purpose; counts are every place (106), where the mock showed quizzed places only (76).
Not verified: Safari, a real iPad, the climate colours over satellite (tiles blocked in the cloud container).
