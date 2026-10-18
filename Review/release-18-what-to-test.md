# Release 18: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
Explore leaves the quiz behind (#71; if the polish pack ships first, this note goes with release 19 and the polish pack note with 18; owner, 18 Oct 2026: "I was in Explore but it still prompted me on what I had open on the quiz").

1. **Back to the quiz only where it belongs.** In a round, tap "More about …" on a new place. Its card shows "Back to the quiz".
   Press Escape, search, or open another place or region: the button is gone, even if you come back to the same place. The Quiz tab still resumes the round.
2. **The Explore tab pauses the round.** Mid-round, tap Explore: Spain, no quiz on screen. Tap Quiz: the same question, where you left it.
3. **Browser Back pauses it too.** Mid-round, press the browser's Back until you are in Explore, then tap Quiz: the round is still there.
4. **Today's button resumes, never replaces.** With a round paused, close nothing and use the Today card's start button on the Explore home: the paused round comes back, not a new one.
5. **Today card once a day** (owner card "Once a day"). With progress, the Explore home opens on the Today card. Close it, or start the round from it:
   it stays away (Spain card instead) for the rest of the day, also after a reload. Tomorrow it is back.

## For you
PR for #71. Cause [V]: the "Back to the quiz" button showed whenever a round was kept in memory, whatever card was open; the Explore tab unmounted the quiz, dropping the round.
All 105 UI tests passed locally on the branch [V]. Not verified: Safari, iPad, phone.
