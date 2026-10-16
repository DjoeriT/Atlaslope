# Hand-off from "way of working clashes" (resolved by Claude, 16 Oct 2026 10:20Z)

Nothing pushed to the repo. Building is still paused until the owner says **go**.

## Deliverable
/mnt/project-files/paraje/way-of-working.md: 19 clashes between the Vintro-era repo rules and how the Project runs, each with a winner, plus the rewrite of CLAUDE.md, docs/AGENT_ROLES.md, the release skill, README "Releasing" and a new publish workflow.

## Owner decisions (cards, 16 Oct 10:18 to 10:19Z)
1. **Git is the record.** Scope, architecture decisions, builder brief and handoffs move into the repo at the restart commit; project files are drafts, memory points into the repo.
2. **Pull requests.** One PR per slice on a `claude/...` branch; the thread merges after green CI and ReviewBot's report. If the branch push is refused, stop and tell him; no fallback to main.
3. **Publish workflow.** A workflow_dispatch workflow tags `release-N` and deploys; Claude starts it after "publish release N", fallback is his one tap on the GitHub app. Untested whether a thread may start it [A].
4. **Claude closes threads.** Handoff, memory update, resolve; open questions keep a thread open.
5. **His go on a plan covers the agents it names** and its cost estimate; off-plan is asked; measured cost logged.

## For the builder thread
Apply Part 2 of way-of-working.md in the restart commit (builder brief step 0), together with moving scope, decisions and handoffs into the repo. Still separate and open: decision 31 (prove imagery on his Mac before every release), the ArcGIS key.
