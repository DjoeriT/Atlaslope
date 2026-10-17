# Code review: claude/spaced-quiz-qybrxt (f005e67) against origin/main

Verdict: merge after fixes. 1 must-fix, 4 should-fix, 2 nits.
Ran: `npm ci`, `npx vitest run tests/unit` (268 pass), plus a throwaway fuzz test (deleted) over review rounds. Playwright not run. The diff does not touch src/quiz-ui/RoundPlayer.tsx or helpers.ts; I read them as they stand on the branch.

## Must-fix
1. src/quiz/round.ts:84-91 (arrangeOnce) and :100-114 (spread): a small last batch of new places has nothing to pad it, so its question lands right after (or within 3 of) its intro. Breaks "never on the screen right after its intro" and "at least 4 apart where the round allows".
   Failure case [ran]: `reviewRound(spain, <6 never-asked places>, [], now, {size:10, seed})`, all 30 seeds: `I I I I I Q Q Q Q Q ... I valdeorras Q valdeorras`. The batch of 5 is followed by a batch of 1 whose question comes straight after its intro (gap 1). Earlier questions could have been held back, so the round allows better.
   Other cases (all 30 seeds each): 7 new places gap 2; 8 gap 3; 11 gap 1 (size 20); 12 gap 2; 16 gap 1; 3 known + 17 new gap 2.
   Study is safe (INTAKE_PER_DAY = 5, one batch; 200 empty-log seeds, 0 bad). A Review of a set with 6 or more unseen places hits it.
   Fix: size batches evenly (6 -> 3+3, 11 -> 4+4+3), and when the tail still has fewer than 3 other screens, hold back earlier questions behind the last intros. Add a unit test for 6, 7, 8 and 11 unseen places across seeds.

## Should-fix
2. tests/unit/quiz-round.test.ts: new tests cover day one (5 new, seeds 0-19) and a 12-place both-memories case only. Nothing covers a review round with more than 5 new places (finding 1), a short tail batch, or `roundSeed`. The "one place still asks everything" test checks only the item set, not "farthest apart it can".
3. src/quiz/round.ts:150-153 afterAnswer: re-asks are appended with no spacing. A miss at index len-2 is re-asked 2 screens later; a miss followed by a later screen of that place can sit 2-3 apart. Decide: state in scope.md:144 that re-asks are exempt, or space them. The skip rule is adjacency only (`items.length - last < 2`). Traced with slip and undo [read]: `slip` -> `withoutReask` finds nothing when the re-ask was skipped; `unslip` re-runs `afterAnswer`; consistent. No test covers slip/undo on a skipped re-ask.
4. docs/scope.md:48 still says "known (right on the last two tries)"; line 157 replaces it, but the old line should be edited so the doc does not contradict itself. [read]
5. tests/ui/quiz-round.spec.ts keyboard-only test asserts `plan.slice(0,6)` kinds are `question, intro x5` from a seeded shuffle. A later change to the shuffle breaks it for no product reason; assert only what the spec guarantees. `plannedRound` (tests/ui/round-plan.ts) omits `localDay(...)` that the app passes; fine for these fixtures, silent mismatch if a fixture has intros dated today. [read, not run]

## Nit
6. src/strings.ts introNote ("It comes back as a question in a few screens") is untrue for a one- or two-place round, where the question follows at once. [read]
7. src/quiz/round.ts roundSeed: two rounds on one day with the same log length (first ended before any intro or answer) get the same order. Harmless.

## Checked, no problem
- Selection unchanged: due, new, rest, `queue.slice(0,size)`, `more = queue.length > size` equals the old rule. [read]
- Empty round: `arrange([], [])` returns `[]`, `more:false`. [read]
- Size 10 review rounds give 10 questions (existing test). [ran]
- Keep going: `asked` filters due, rest and fresh; seed uses the grown log length; `keepGoing` memo depends on `quiz.log`. [read]
- Determinism: one `seededRandom` stream across the 20 tries; same seed, same round (test passes). `?now=` is floored to the day, so UI tests are stable except across 00:00 UTC. [read]
- Intro runs: none longer than 5, none split, in 3,360 fuzzed review rounds. [ran]
- Level question removed in FACT_KINDS, truths and strings; unit test asserts it. [ran]
- Known/solid: `shadeFrom` uses `streakDays` (at least a day apart, reset on a miss); shade is derived by `replay`, so old logs need no migration. [read]
