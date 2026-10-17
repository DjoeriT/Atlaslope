# Atlaslope: working rules

Start with `README.md` (current state, layout, commands). Detail behind these rules: `docs/AGENT_ROLES.md`. State and history:
`docs/PROJECT_CONTEXT.md` (read only the section you need). Atlaslope is a web app (static site, React, MapLibre), not an iOS app.
Sources of truth, highest first: `docs/scope.md`, `docs/architecture-decisions.md`, `Review/builder-brief.md`, the approved mocks in
`Review/mock-*/`, then these rules. A gap goes to the owner; builders do not invent behaviour.

## How the project runs
- The coordinator (project chat) starts a thread per ask and keeps memory; it never edits the repo. The thread doing a task is LeadBot for it.
- **Short threads** (owner card, 17 Oct 2026, after measuring that 60% of a day's $143 was threads re-reading their own history):
  one slice per thread, then close; no follow-ups in a finished thread. Past about 150K of context, write the handoff and continue in a
  fresh thread. Test runs, CI logs, code searches and screenshot checks go to a Sonnet helper that reports back in 10 to 20 lines.
  Wait for CI through PR notifications, never a polling loop. Read with `grep -n` and line ranges, never whole files or logs.
- Closing: handoff in `docs/handoffs/<date>-<topic>.md` (done, decided, open, where), memory updated, thread resolved. An open question keeps it open.
- Hosts a cloud thread cannot reach (Spanish government hosts, tile hosts) go through a GitHub Actions run, else a session on his Mac.

## Working agreements (owner; every session and agent)
- **Outward actions only on his say-so, each time:** publishing, deploying, paid or networked services, anything outsiders see.
  Standing exceptions inside work he said go to: push the thread's own `claude/...` branch, one PR per slice, merge on green CI plus
  ReviewBot. A refused push means stop and tell him; never push `main`. Only the words "publish release N" start the `publish` workflow.
  Never force-push, rewrite pushed history, push to someone else's branch, or move or delete a tag.
- **Decisions** as tap-to-pick cards, batched up front, one recommended. Reversible work continues on the recommended option; outward or hard-to-undo work waits.
- **New UI is mocked first** and gets a UX, UI and visual check against `Review/visual-style.md` before he sees it, with the findings
  fixed, not listed. Small slices (a fix or tweak, no new screen, data or content) run lean: LeadBot's own check, a rough first look early,
  ReviewBot alongside CI, targeted tests locally. New screens and redesigns use a ReviewBot design run. Details: `docs/AGENT_ROLES.md`.
- **Talking to him:** plain words, answer first, progress in two or three sentences. Something failed: say what, show the output, wait.
- **Tag claims** [V] verified, [O] owner said, [R] report or memory, [A] assumed. Re-run a number before relying on it.
- **Never print keys or secrets.** Keys live in repo secrets or `.env.local` (check with `grep -c`); values for him go to `pbcopy`.
- **Git is the record**: decisions, scope, plans, cards, mocks, reviews, handoffs. `main` is the only long-lived branch; `release-N` tags mark what is live. Archive, never delete (`Review/archive/`).
- **Data has a paper trail**: every file under `data/` is in `data/SOURCES.md`. WSG and WSET course structure is fine; never their text, maps or images.
- Licence: code MIT; his writing all rights reserved (`NOTICE.md`); data keeps its own terms.
- **Releases are cheap and carry their own records**: the slice PR holds the handoff, context update and tester note before publish;
  no records PR after it (owner card, 17 Oct 2026: 6 records PRs in one day). The "live on release-N" line rides the next slice's PR.
  Push once; confirm the branch moved on GitHub before saying CI runs.
- Plans end with Context, Upside (measured), Risks, Effort. Never tune data or thresholds to make a test pass. A new rule names its incident.

## Backlog
GitHub Issues in `DjoeriT/Atlaslope`, one per piece of work, labels for kind, who acts next and priority (he sets priority). `#n` in commits.

## Agents
`builder`, `reviewer`, `analyst` types; his go on a plan covers the agents it names. Sonnet 5.5 by default, Opus for the tree model and
quiz engine. Builders and reviewers run in their own worktree, never the thread's checkout; builders never push. One writer per file.
Budgets and spend log: `docs/AGENT_ROLES.md`, `Review/agent-spend-log.md`. Never open `data.js`, `maplibre-gl.js`, `data/*.geojson`, `*.tif`.

## Commands
`npm test` (Vitest), `npm run build`, `Tools/check.sh` (`quick` without UI tests and build, `ui` with Playwright UI tests).
Locally run the specs your change touches; CI runs the full suite (about 4.5 minutes). Don't rerun a passing check on unchanged code.
UI tests use fixtures, no network; debug flags live in `src/debug.ts` and `check.sh` keeps them out of `dist/`. Playwright stays pinned to the container's Chromium.
Releases: the `release` skill.
