# Agent spend log

One row per agent run. "Actual" comes from session usage, not the agent's own estimate.

| Date | Agent and model | Task (card) | Budget | Actual | Notes |
|---|---|---|---|---|---|
| 2026-10-16 | BuilderBot, Opus | Release 2 atlas (`release-2-atlas.md`), build | 60 turns | 91,920 tokens, 48 tool uses, 13 min | Done; one scope change mid-task (keyed Esri) |
| 2026-10-16 | ReviewBot, Opus | Release 2 atlas, code review (`release-2-atlas-review.md`) | one report | 53,586 tokens, 20 tool uses, 3 min | Ship after fixes: 5 should-fix, 7 nits; finding 1 already handled on main |
| 2026-10-16 | BuilderBot, Opus (resumed) | Release 2 atlas, review fixes | same run | 117,492 tokens, 22 tool uses, 10 min | Done; built-site UI test added, check green |
| 2026-10-16 | ReviewBot, Sonnet | Restart commit, code review (`restart-review.md`) | 60k | 29,821 tokens, 10 tool uses, 1 min | Merge after fixes: 3 should-fix (main-only publish, tag after deploy, stale refs), all fixed |
| 2026-10-16 | ReviewBot, Sonnet | Data step, code review (`data-step-review.md`) | 60k | 52,389 tokens, 22 tool uses, 3 min | Merge after fixes: 0 blockers, 3 should-fix (photo run, Ceuta and Melilla, pliego dates), all fixed |
