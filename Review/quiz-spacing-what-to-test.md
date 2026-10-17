# Quiz spacing: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
Quiz rounds (owner cards, 17 Oct 2026: "Space it out", then "All of them").

1. **New places in a batch.** Start a Study round with new places: up to five are shown in a row ("Got it" moves to the next one),
   and each is asked a few screens later, never straight after its own intro.
2. **Shuffled rounds.** Places you learned together come back in a different order each round, mixed with the new ones.
3. **No repeats back to back.** Miss a question in the middle of a round: it comes back at the end, not on the next screen.
   Miss the very last one: the round ends and it comes back in your next review.
4. **Known takes two days.** In Practise any mix, answering one place right twice in a row does not turn it known; a right answer the next day does.
5. **No level question.** Fact questions ask the main grape, a famous style or the main climate, never "its level".

## For you
Checks: unit tests and the quiz UI specs pass locally; CI runs the full suite. Not verified: Safari, a real iPad or phone.
