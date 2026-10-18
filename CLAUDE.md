# Atlaslope: working rules

Start with `README.md` (current state, layout, commands). Detail behind these rules: `docs/AGENT_ROLES.md`, section "Working detail" (read
only that section). State and history: `docs/PROJECT_CONTEXT.md` (only the section you need). Atlaslope is a web app (static site, React, MapLibre).
Sources of truth, highest first: `docs/scope.md`, `docs/architecture-decisions.md`, `Review/builder-brief.md`, the approved mocks in
`Review/mock-*/`, then these rules. A gap goes to the owner; builders do not invent behaviour.

A **small slice** is a fix or tweak with no new screen, data or content. Everything else is a big slice.

## Pace (owner cards 17 and 18 Oct 2026: $143 a day, 60% of it threads re-reading history; a 12-finding fix took 63 minutes before its PR)
- The coordinator (project chat) starts a thread per ask and keeps memory; it never edits the repo. The thread doing a task is LeadBot for it.
- One slice per thread, then close; no follow-ups in a finished thread. Past about 150K of context, write the handoff and continue in a
  fresh thread, before building or merging, not after (a thread at 350K compacted just before a merge). Aim under 300K tokens of spend for a
  small slice; past that, say so and hand off.
- First answer within 5 minutes: a rough result or first look, refined after. No silent measuring.
- Never wait on your own tools. Test runs, CI logs, code searches, screenshots (`npm run shots`) and flake bisects go to a Sonnet helper that
  reports back in 10 to 20 lines, while the thread keeps working. Wait for CI through PR notifications, never a polling loop.
- Read with `grep -n` and line ranges, never whole files or logs. Batch independent tool calls.
- Design: round 1 shows the whole range, subtle to bold, so his feedback rounds refine instead of searching.
- A review thread fixes its small findings itself in one PR and asks him only about taste; no separate fix thread.
- Two slices that touch separate files may run as parallel threads; one writer per file. The first to go green merges first; the other
  merges `main` in and lets CI rerun.
- **Done** means: merged, ready-to-publish line sent (or published after his words) and live check green, handoff in `docs/handoffs/<date>-<topic>.md` (done, decided, open,
  where), memory updated, thread resolved. An open question keeps it open.
- Hosts: try directly first (the network was opened 18 Oct); only a refused host goes through a GitHub Actions run or a session on his Mac.

## Working agreements (owner; every session and agent)
- **Outward actions only on his say-so, each time:** publishing, deploying, paid or networked services, anything outsiders see.
  Standing exceptions inside work he said go to: push the thread's own `claude/...` branch, one PR per slice, merge on green CI, plus
  ReviewBot where it runs. ReviewBot runs only on PRs with a new screen, new or changed user-facing copy, or a licence or legal question;
  fixes, tweaks and docs merge on green CI alone (18 Oct 2026, owner asked "Do we need ReviewBot if we have CI?"; it stays where tests
  can't look: PR #92's tap-to-reveal credit hid the CC attribution with CI green). Then one line asks him to say "publish release N";
  only those words in the thread start the `publish` workflow, also for
  a rollback (18 Oct 2026: the cloud safety check refused a thread starting publish without his words; he chose to say the words over tapping or a permission rule). A refused push means stop and tell him; never push `main`.
  Never force-push, rewrite pushed history, push to someone else's branch, or move or delete a tag.
- **Decisions** as tap-to-pick cards, batched up front, one recommended. Posting a card never ends the work: reversible work starts on the
  recommended option in the same turn; outward or hard-to-undo work waits (18 Oct: a review thread sat 32 minutes on a card).
- **New UI**: a rough first look goes to him early. A big slice's mock then gets a UX, UI and visual check against `Review/visual-style.md`
  before the polished version, with the findings fixed, not listed; new screens and redesigns use a ReviewBot design run. A small slice:
  LeadBot's own check, plus ReviewBot alongside CI only if it changes user-facing copy.
- **Talking to him:** plain words, answer first, progress in two or three sentences. Something failed: say what, show the output, wait.
- **Tag claims** [V] verified, [O] owner said, [R] report or memory, [A] assumed. Re-run a number before relying on it.
- **Never print keys or secrets.** Keys live in repo secrets or `.env.local` (check with `grep -c`); a value he needs goes to him only
  through a session on his Mac, never in chat.
- **Git is the record**: decisions, scope, plans, cards, mocks, reviews, handoffs. `main` is the only long-lived branch; `release-N` tags
  mark what is live, so no "live on release-N" line is kept anywhere (it went stale twice). The repo wins over memory. Archive, never delete (`Review/archive/`).
- **Data has a paper trail**: every file under `data/`, and every layer, photo or fact source, is in `data/SOURCES.md`; facts from official sources. WSG and WSET course structure is fine; never their text, maps or images.
- Licence: code MIT; his writing all rights reserved (`NOTICE.md`); data keeps its own terms.
- **Releases carry their own records**: the slice PR holds the handoff and tester note; no records PR after it (17 Oct: 6 records PRs in one day).
  Push when the PR can stand on its own, not in bursts (CI cancels the older run); confirm the branch moved on GitHub before saying CI runs.
- Plans end with Context, Upside (measured), Risks, Effort. Never tune data or thresholds to make a test pass. A new rule names its incident.

## Backlog
GitHub Issues in `DjoeriT/Atlaslope`, one per piece of work, labels for kind, who acts next and priority (he sets priority). `#n` in commits.

## Agents
`builder`, `reviewer`, `analyst` types; his go on a plan covers the agents it names. Sonnet 5.5 by default, Opus for the tree model and
Study engine. Builders and reviewers run in their own worktree, never the thread's checkout; builders never push.
Budgets and spend log: `docs/AGENT_ROLES.md`, `Review/agent-spend-log.md`. Never open `data.js`, `maplibre-gl.js`, `data/*.geojson`, `*.tif`.

## Commands
`npm test` (Vitest), `npm run build`, `npm run shots` (standard screenshots into `shots/`), `Tools/check.sh` (`quick` without UI tests
and build, `ui` with Playwright UI tests). CI runs the checks and the UI tests in four parallel parts.
Locally run only the specs your change touches, once; never the full UI suite, CI runs that (18 Oct: "Site visual fixes" spent 25 of 63
minutes on local runs CI repeats). Don't rerun a passing check on unchanged code.
**Flaky tests**: a test that fails then passes on the same code gets an issue and is made deterministic in its own slice, never skipped or left
(17-18 Oct: 4 Study test flakes, each a 4.5-minute rerun, one a 15-minute hand bisect).
UI tests use fixtures, no network; debug flags live in `src/debug.ts` and `check.sh` keeps them out of `dist/`. Playwright stays pinned to the container's Chromium.
Releases: the `release` skill.
