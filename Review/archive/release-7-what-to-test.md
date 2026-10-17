# Release 7: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
The quiz (planned as release 5). Quiz in the top bar now works; Progress (the mastery map) is still to come.

1. **First round.** Press Quiz. With no progress yet, Study says "Learn 5 new places". Each new place is shown first (name, why line, one fact), then asked: "What is this?" with four names. A right answer moves on by itself after about a second; "Stay here" stops it.
2. **A miss.** Pick a wrong name, or on a find-it question tap the wrong place and Confirm. The map zooms to the right place and your pick, both named, with the why line. "That was a slip" (only after a wrong pick) counts it as right; Undo takes that back. The missed place comes back at the end of the round.
3. **Coming back to it.** On a miss, "Open <place>'s card" shows the place card; "Back to the quiz" returns to the same question.
4. **Next days.** Places you got right come back after 1, 3, 7, 14 and 30 days. From the second time a place is asked, it is find it (tap the place on a flat map with names hidden); the fact question (main grape, a famous style, level or climate) once you know where a place is.
5. **Focus.** Quiz › "Set a focus": tick a region or add single places. Today's new places then come from there first. Clear has an Undo.
6. **Practise any mix.** Tick whole regions or single places, 10 or 20 questions. A miss here counts; a right answer on a place that isn't due doesn't move it up.
7. **Home.** Once you have progress, the opening screen shows today's card: how many are due and today's new places.
8. **Your progress file.** Atlaslope menu › "Save or load progress": save a copy, then load it back; Undo restores what you had. On iPad, add Atlaslope to the Home Screen before you start (Safari can clear a site's storage after a week away).
9. **New logo and tab title.** The browser tab shows the vineyard-slope icon and the place first ("Rioja · Atlaslope"); home reads "Atlaslope · The wine atlas that quizzes you".

## For you
Commits: one PR from `claude/release-7-quiz-zwvn6k`. Checks: the PR's CI run; the publish workflow re-runs them. Approved mocks:
`Review/mock-quiz-v4/` (your card, 17 Oct 05:44Z). Engine rules: `Review/release-7-digest.md`. ReviewBot: `Review/release-7-review.md`.
Not in this release: the mastery map (Progress), mixed-up pairs and the Study include list (after v1, your card). Not verified: Safari,
iPad, large text on a real device, satellite imagery under the quiz (blocked in the cloud container).
