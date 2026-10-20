# Release 57: what to test (Study double tap)

A quick double tap on "Got it" in Study now moves on once.
The intro is counted once, not twice.

Hard-reload first (Cmd+Shift+R).

1. Open Study and start a round.
2. On an intro card, tap "Got it" twice, fast. You land on the next step, not two steps on.
3. Finish the round. The count of intros seen matches what you saw.
4. With a keyboard: Tab to "Got it", press Enter. Focus moves to the next step.

## For you
- Commits: PR 164 (merge `542508e`, head `34241bf`): `RoundPlayer.tsx` leaves a step once; `quiz-round.spec.ts`
  waits for each intro and focus (#83).
- Checks: PR 164's CI on head `34241bf` (scope, check, UI 1-4 of 4), all green; 280 local stress runs of the spec, 0 failures.
- Not visible on the site: docs and hook changes from PRs 162 and 163.
- Not verified: Safari, iPad, real phones.
