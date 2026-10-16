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
| 2026-10-16 | BuilderBot, Sonnet | Release 3 card 3, the map (`release-3-card-3-map.md`) | 150k | 95,701 tokens, 47 tool uses, 9 min | Done; check ui green, 1.01 MB gz; satellite and terrain not run (no key, no tile network here) |
| 2026-10-16 | BuilderBot, Sonnet | Release 3 card 4, cards and URLs (`release-3-card-4-cards.md`) | 150k | 103,377 tokens, 42 tool uses, 9 min | Done; 13 UI tests; also edited src/map/ (framing, zones) as LeadBot allowed |
| 2026-10-16 | ReviewBot, Opus | Release 3, code review (`release-3-review.md`) | one report | 75,003 tokens, 20 tool uses, 5 min | Merge after fixes: 0 blockers, 4 should-fix (focus across cards, Escape focus, boundary load failure, 44 px links), all fixed by LeadBot |
| 2026-10-16 | BuilderBot, Sonnet | Release 4 card 1, facts on the place card (`release-4-card-1-facts-ui.md`) | 150k | 82,702 tokens, 38 tool uses, 7 min | Done; check ui green, 84 unit and 24 UI tests, 1.04 MB gz; photo shape set by the builder |
| 2026-10-16 | BuilderBot, Sonnet | Release 4 card 2 batch D, Andalucía and Canary Islands sheets | 100k | 110,031 tokens, 48 tool uses, 7 min | Done; 18 sheets; main grapes 3 official, 6 Wikipedia, 9 empty; 10% over budget |
| 2026-10-16 | BuilderBot, Sonnet | Release 4 card 2 batch B, Rioja, Navarra and Aragón, Cataluña sheets (one redo for the main-grape rule) | 100k | 136,350 tokens, 59 tool uses, 9 min (first pass 126,516) | Done; 20 sheets; 36% over budget, mostly the redo |
| 2026-10-16 | BuilderBot, Sonnet | Release 4 card 2 batch A, Green Spain and Castilla y León sheets | 100k | 142,966 tokens, 56 tool uses, 10 min | Done; 22 sheets; 43% over budget; worked in the shared checkout instead of its worktree (LeadBot fast-forwarded the release branch) |
| 2026-10-16 | BuilderBot, Sonnet | Release 4 card 2 batch C, Valencia and Murcia, Meseta, Balearic Islands sheets | 100k | 137,859 tokens, 75 tool uses, 11 min | Done after hitting the 60-turn limit once; 19 sheets; 38% over budget |
| 2026-10-16 | ReviewBot, Sonnet | Release 4 fact sheets, source review (`release-4-review-sheets.md`) | 80k | 90,040 tokens, 44 tool uses, 6 min | Fix first: 0 blockers, 9 should-fix; partial (hit the turn limit); main-grape fixes and partial-list labels applied by LeadBot |
| 2026-10-16 | ReviewBot, Sonnet | Release 4 code review (`release-4-review-code.md`) | 90k | 44,763 tokens, 9 tool uses, 1 min | Merge after fixes: 0 blockers, 3 should-fix (2 fixed, 1 kept as inline-link exception), 6 nits |
| 2026-10-16 | Scout, Sonnet | Release 4 follow-up: planted-area and Rioja pliego sources | 80k | 68,864 tokens, 12 tool uses, 1 min | No source confirmed from the container; six URLs queued for the Actions fetch |
