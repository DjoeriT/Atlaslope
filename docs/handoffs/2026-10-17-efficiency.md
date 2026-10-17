# Handoff: faster, leaner threads (17 Oct 2026)

**Done.** Measured one day of work (11 sessions, $143, 428 M cached re-read tokens, agents 1.9 M) and wrote the plan
(`Review/efficiency-plan-2026-10-17.md`). This PR applies the owner's picks:
- `CLAUDE.md` cut from 10.9 KB to 5 KB; detail moved to `docs/AGENT_ROLES.md` ("Working detail", "Thread budget").
- Short-thread rule: one slice per thread, handoff at about 150K, noisy work to a Sonnet helper, no polling.
- `publish.yml` reuses the green `ci.yml` run on `main` for the same commit (its "Tools/check.sh ui" step must have passed), waiting up
  to 8 minutes for a run in progress; otherwise it runs the checks. `ci.yml` names that step so publish can find it.
- Records live in the slice PR; no records PR after publish (release skill, release hook, README).
- README has a "Start here" section with the current state and an up-to-date layout.

**Decided** (owner cards, 17:29-17:30Z): short threads (Adopt), publish and records (Both), trim (Trim), threads stay on Opus (Opus for now).

**Open.**
- Remove `djoerit/paraje` from the project's repositories (owner, Project settings): same repo, cloned and loaded twice.
- `MEMORY.md` trim to about 4 KB: the coordinator.
- Playwright at 4 workers instead of 2: measured, not worth it (264 s vs 268 s, and one test failed at 4 workers).
- Re-measure cost per release after a day of short threads, on the plan's table; then decide Sonnet for small slices again.
- First publish after this merge is the first real test of the reuse step; check its log says "Reusing checks run".

**Where.** Plan: `Review/efficiency-plan-2026-10-17.md` (draft copy in project files `atlaslope/plans/`). Measurements: thread "Faster, leaner threads".
