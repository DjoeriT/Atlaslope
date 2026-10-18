# Handoff: shipping speed (18 Oct 2026)

## Done
- Measured today's threads [V, session events, GitHub runs]. "Site visual fixes": 63 min before its PR, of which 8.5 building, about 25 local UI runs CI repeats, 15 a hand bisect of a flaky Study test, 15 ad hoc screenshot scripts. After every merge, main's CI held publish about 6 min. A review card sat 32 min with no work started. Plan: `/mnt/project-files/atlaslope/plans/2026-10-18-shipping-speed-plan.md`.
- CI (`ci.yml`): scope job, a checks job (`Tools/check.sh` without UI) and the UI tests in 4 parallel parts. Green in 2.6 min on this PR (was 4.2 median).
- Publish (`publish.yml`): reuses the PR's green run when the merge commit has exactly the PR head's files (true for the last 6 merges), so it no longer waits for main's run; falls back to main's run, then to running the checks.
- 4 Playwright workers measured: 3m51-57s vs 4m27s with one flaky failure, fully-parallel 6 failures. Kept the default 2.
- `npm run shots` (`Tools/shots.mjs`): 15 standard screenshots in about 38 s.
- Flaky Study tests: each "Got it" now waits for its intro and each answer for its question number (a real race). Still flaky under heavy load (11 of 130 at repeat-each=10 with 4 workers): issue #83, its own slice.
- CLAUDE.md rewritten from the review (`/mnt/project-files/atlaslope/plans/2026-10-18-claude-md-review.md`): one Pace section, definition of done, flaky-test rule, parallel threads, token aim, no hand-kept live line. README, AGENT_ROLES and the release skill agree; release rollback added; Playwright pinned exactly.

## Decided (owner cards, 14:47-14:57Z)
No local full UI suite; start on the recommended option while a card waits; all four pipeline items; small slices publish themselves on green CI plus ReviewBot; parallel threads, full-range design round 1, hard 150K handoff, fix-in-review; all 13 CLAUDE.md fixes in this PR; new project settings (draft `/mnt/project-files/atlaslope/plans/2026-10-18-project-instructions-draft.md`, applied by the coordinator).

## Open
- Re-measure minutes and cost per slice after a few slices under the new rules.
- The coordinator's wider docs audit (privacy, CSP, licensing, glossary, Dependabot) goes to the owner separately: `/mnt/project-files/atlaslope/reviews/2026-10-18-docs-gap-audit.md`.

## Correction after release 23 (15:34Z)
Self-publish did not survive contact: the cloud safety check refuses a thread starting `publish` without his words, and refuses a thread adding its own permission rule. He chose to say "publish release N" in the thread (no tap, no rule). Docs reverted to that, rollback included. Release 23 (6eeabb2) published in 61 s by reusing main's run.
