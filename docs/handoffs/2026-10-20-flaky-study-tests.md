# Handoff: flaky Study UI tests, double tap on "Got it" (20 Oct 2026)

## Done (#83)
- App race confirmed [V]: "Got it" moves on inside a view transition with the step number of the render it was tapped on. A second
  tap before the move has landed (double tap, busy phone) lands on the step being left: it moved on once but recorded the intro twice.
  Reproduced with two same-frame clicks on unfixed code (1 in 5 runs: `txakoli-bizkaia` at :02.273 and :02.274).
- Fix: `next()` in `src/quiz-ui/RoundPlayer.tsx` leaves a step once (`leaving` ref); "Got it" passes its record as `next(seen)`, so it
  runs only for the tap that moves on. New UI test `quiz-round.spec.ts` "a double tap on Got it ...".
- `quiz-round.spec.ts` keyboard test: each "Got it" now waits for its intro (the PR #81 pattern it had missed), and Tab waits until the
  question has focus (fits the old "Expected /^B/ received ''").
- `quiz-doors.spec.ts:193`: not changed. Its steps already wait on each screen; cause of the old 30 s timeouts not found [A: CI load].

## Measured [V]
- Before the fix: 0 failures in 130 runs at normal load and 0 in 130 with all 10 cores busy (`yes` burners): load alone does not
  reproduce on the Mac, so the stress numbers do not prove the fix; the same-frame double tap does.
- After: 0 failures in 140 + 140 runs (both specs, repeat-each=10, 4 workers; normal and all cores busy). Vitest 314/314.

## What to test (tester note)
- Study round: double tap "Got it" fast on an intro. It shows the next place, not the one after; progress counts it once.

## Open
- If `quiz-doors.spec.ts:193` fails on CI again, read its trace before changing it; reopen #83 or file a new issue.

## Next (owner order, 20 Oct 2026)
#126 "If you like this, try" cards (photos may be cropped: check the crops), then #127 + #148 as one big slice: find why the Rioja
flyby is gone, mock for Rioja, then a shortlist of other guides.
