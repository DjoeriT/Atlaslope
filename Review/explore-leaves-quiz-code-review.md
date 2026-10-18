# Code review: db0c0d4..b1dfc0b (explore leaves quiz)

Verdict: **merge after fixes** (0 blockers, 2 should fix, 3 notes). Method: read only, nothing run (no test run; Tools/check.sh not executed).

## Should fix

1. **`backTo` is never cleared by `go()` or `onPop`, so "Back to the quiz" can reappear on a card opened from Explore.** (src/app/App.tsx: `setBackTo` is set at openPlaceFromQuiz, cleared only in openExplore and the Explore-tab branch; `go` at ~L45 and `onPop` at ~L100 leave it.)
   Path: Quiz -> "More about X" (backTo=X) -> Escape to region (button gone, as the test checks) -> search for X or tap X on the map (`go`) -> X's card shows "Back to the quiz" though it was opened from Explore. Same via browser Back/Forward landing on X's earlier entry after visiting elsewhere. Fix: clear backTo in `go` (inside the same withMotion that does setQuiz(null)); better, store `fromQuiz` in `history.state` in openPlaceFromQuiz and derive the button from it so Back/Forward stay right. Add a test: escape, then reopen X from search, expect no button.

2. **Stale map pick replayed when the hidden quiz resumes.** (QuizScreen `pick={hidden ? null : pick}` + RoundPlayer.tsx ~L103 effect on `[pick]`.) `mapPick` in App is never cleared. Hidden turns pick to null, shown turns it back to the old object, so the effect fires again; if the round moved on while hidden (right-answer auto-advance timer, RoundPlayer ~L98, keeps running when hidden) and the new question is find-it, the old tap becomes `tentative`. Narrow, but it is a leak between Explore and Quiz. Fix: clear mapPick when the quiz hides (or in openExplore/go), or pass pick only while visible and compare against a "seen" ref that survives hide.

## Notes

3. Auto-advance timer and focus/scroll effects in RoundPlayer run while hidden: a right answer given just before Explore advances in memory (harmless, resume shows next question; cannot be seen by user). Escape is not affected: `quizRef.current` is null in Explore, and the dialog guard now ignores an End-round alertdialog inside a `[hidden]` ancestor (`:not([hidden] *)`; fine in current Chromium/Safari). Note the `[role="dialog"]:not([hidden])` half is unchanged and would still match a dialog inside a hidden ancestor; today only FirstRun uses it, so no bug now.
4. autoStart effect: logic is sound under StrictMode (ref persists, reset when autoStart goes false; second dev run returns on started.current). Behaviour change to know: SpainCard `onReview` also sets autoStart, so with a round in play it now resumes that round instead of starting a due review; if the round is `ended`/idle it still starts fresh. Intended per card for Today; confirm for the Review button.
5. Tests: quiz-leave test 2 does `page.locator('h1.intro-h').textContent()` right after "Got it"; if the second item is a question and not an intro, the locator never resolves and it times out (the `not.toHaveText` passes vacuously on a missing element). Not verified which item follows; assert on an intro-only sequence or wait for `h1.intro-h` first. `.card:visible` edits in quiz-map.spec are right now that the hidden quiz keeps a `.card` in the DOM. keepQuiz is a ref written in render (idempotent, StrictMode-safe) and never resets, so the quiz stays mounted for the session once opened; fine, but means any future quiz-side effect runs in Explore.

## Checked, no problem
- Hidden quiz does not drive the map: `quizView = quiz ? mapView : null`; `onPick` branches on `quizRef.current`.
- Browser Back from quiz: onPop sets quiz null, QuizScreen stays mounted hidden; Quiz tab / Forward resumes via lastQuiz.
- openPlaceFromQuiz pushes history and sets sel; the button is gated on `place.id === backTo` and not pageOpen.
