# Quiz spacing and round fixes (17 Oct 2026)

Thread "Quiz round spacing", started from the owner's point that a Study round shows a new place and then immediately asks what it is.

## Done
- **Spacing** (`src/quiz/round.ts`): `fill` picks what a round asks exactly as before (due, then new places, then other memories);
  `arrange` orders it: a shuffled share of the reviews, then each batch of up to `INTRO_BATCH` (5) intros in a row, their first questions
  in another order mixed among the remaining reviews; `spread` keeps two screens about one place at least `MIN_DISTANCE` (4) apart,
  retrying another shuffle up to 20 times when the greedy order corners itself. Order is seeded by `roundSeed(now, log length)`.
- **Re-ask after a miss**: still at the end of the round, but not when that is the very next screen about the place (a miss on the last
  question waits for its next review, already due the next day after the box drop).
- **Known** (`src/quiz/memory.ts`): two rights in a row a day apart (the existing `streakDays`), so cramming in Review no longer turns a place known.
- **Level question** dropped from `FACT_KINDS`; intro copy now says the place comes back in a few screens; the button reads "Got it".
- Tests: unit (spacing over 200 seeds, shuffle, seed, re-ask, known, level); UI specs read the planned round from the engine
  (`tests/ui/round-plan.ts`) because the order is shuffled.

## Decided (owner cards, 17 Oct 2026)
"Space it out" (18:09Z), "All of them" (18:15Z), the known rule and the level question (cards posted 18:16Z, built on the recommended options while they wait). See `docs/scope.md`.

## Open
- Day one (five new places and nothing else to ask) has no room to shuffle: the questions come almost in the order the places were shown,
  four or five screens after each intro.
- Places already known in a browser under the old rule can drop back to learning on replay. Only the owner's progress is affected [A].
- Not checked: whether the climate question's class names match what the exams use.

## Where things are
PR from `claude/spaced-quiz-qybrxt`; tester note `Review/quiz-spacing-what-to-test.md`.

## Review
ReviewBot code review `Review/quiz-spacing-code-review.md`: the must-fix (a short last batch of new places in a Review round was asked
right after its intro) is fixed by holding the previous batch's last three questions back, with a test over 6 to 20 new places; scope
line 48 now points at the new known rule; `roundSeed` has a test. Kept as is: re-asks only skip the very next screen (stated in scope),
and the UI test pins the planned order on purpose so a change in the shuffle fails loudly.
