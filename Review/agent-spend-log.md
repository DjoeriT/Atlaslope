# Agent spend log

One row per agent run. "Actual" comes from session usage, not the agent's own estimate.

| Date | Agent and model | Task (card) | Budget | Actual | Notes |
|---|---|---|---|---|---|
| 2026-10-16 | BuilderBot, Opus | Release 2 atlas (`release-2-atlas.md`), build | 60 turns | 91,920 tokens, 48 tool uses, 13 min | Done; one scope change mid-task (keyed Esri) |
| 2026-10-16 | ReviewBot, Opus | Release 2 atlas, code review (`release-2-atlas-review.md`) | one report | 53,586 tokens, 20 tool uses, 3 min | Ship after fixes: 5 should-fix, 7 nits; finding 1 already handled on main |
| 2026-10-16 | BuilderBot, Opus (resumed) | Release 2 atlas, review fixes | same run | 117,492 tokens, 22 tool uses, 10 min | Done; built-site UI test added, check green |
| 2026-10-16 | ReviewBot, Sonnet | Restart commit, code review (`restart-review.md`) | 60k | 29,821 tokens, 10 tool uses, 1 min | Merge after fixes: 3 should-fix (main-only publish, tag after deploy, stale refs), all fixed |
| 2026-10-16 | ReviewBot, Sonnet | Data step, code review (`data-step-review.md`) | 60k | 52,389 tokens, 22 tool uses, 3 min | Merge after fixes: 0 blockers, 3 should-fix (photo run, Ceuta and Melilla, pliego dates), all fixed |
| 2026-10-16 | ReviewBot, Sonnet | Urbezo outline and quiz, code review (`urbezo-review.md`) | 60k | 28,096 tokens, 12 tool uses, 2 min | Merge: 0 blockers, 0 should-fix, 4 notes |
| 2026-10-16 | BuilderBot, Opus | Release 3 card 1, tree model (`release-3-card-1-tree.md`) | 250k | 46,098 tokens, 22 tool uses, 4 min | Done; 17 tree tests; optional `kind` for the shared id `rioja` |
| 2026-10-16 | BuilderBot, Sonnet | Release 3 card 2, app shell (`release-3-card-2-shell.md`) | 150k | 67,155 tokens, 45 tool uses, 6 min | Done; check ui green; also edited playwright.config.ts (uitest build mode) |
