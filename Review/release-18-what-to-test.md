# Release 18: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
Explore leaves the quiz behind (#71, owner, 18 Oct 2026: "I was in Explore but it still prompted me on what I had open on the quiz").

1. **Back to the quiz only where it belongs.** In a round, tap "More about …" on a new place. Its card shows "Back to the quiz".
   Press Escape or open another place or region: the button is gone. Go back to the first card with the browser's Back: it shows again.
2. **The Explore tab pauses the round.** Mid-round, tap Explore: Spain, no quiz on screen. Tap Quiz: the same question, where you left it.
3. **Browser Back pauses it too.** Mid-round, press the browser's Back until you are in Explore, then tap Quiz: the round is still there.
4. **Today's button resumes, never replaces.** With a round paused, close nothing and use the Today card's start button on the Explore home: the paused round comes back, not a new one.

## For you
PR for #71. Cause [V]: the "Back to the quiz" button showed whenever a round was kept in memory, whatever card was open; the Explore tab unmounted the quiz, dropping the round.
All 105 UI tests passed locally on the branch [V]. Not verified: Safari, iPad, phone.
Open: the Today card on the Explore home (approved mock 10) also points at the quiz; question to the owner in the thread.
