# Release 17: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
Two slices: the quiz highlight fix (#66, owner's Galicia screenshot, 17 Oct 2026) and quiz spacing (#68, owner cards "Space it out", then "All of them").

### Quiz highlight
1. **Highlight in one piece.** With 3D relief on (the default over the photo), play a quiz round in Galicia or anywhere close in.
   On "What is this?" the asked place is wine-coloured in one piece, with no straight cut edges.
2. **Nothing left behind.** On the next question the previous place goes back to its normal colour; no wine-coloured rectangles stay on neighbours.
3. **Explore too.** Tap a place in Explore, then another: only the last one is highlighted. Hovering a list row lights only that place.

### Quiz spacing
4. **New places in a batch.** Start a Study round with new places: up to five are shown in a row ("Got it" moves to the next one),
   and each is asked a few screens later, never straight after its own intro.
5. **Shuffled rounds.** Places you learned together come back in a different order each round, mixed with the new ones.
6. **No repeats back to back.** Miss a question in the middle of a round: it comes back at the end, not on the next screen.
   Miss the very last one: the round ends and it comes back in your next review.
7. **Known takes two days.** In Practise any mix, answering one place right twice in a row does not turn it known; a right answer the next day does.
8. **No level question.** Fact questions ask the main grape, a famous style or the main climate, never "its level".

## For you
Highlight: PR #67. Cause reproduced headless with a flat relief: after a highlight change the fill kept its old colour until the relief cache was cleared [V].
Spacing: PR #69 (unit tests and quiz UI specs passed locally; CI full suite) [R].
Not verified: the live site with real relief and photo tiles (the container cannot reach the tile hosts), Safari, iPad.
