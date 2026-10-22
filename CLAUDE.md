# Atlaslope: working rules

Start with `docs/PROJECT.md` (what this is, state, decisions, costs, open questions, how to run a region and a release), then `README.md`
(layout, commands). Roles: the session doing the work is **LeadBot**; its helpers are BuilderBot, ReviewBot and AnalystBot (agent types
`builder`, `reviewer`, `analyst`). `docs/AGENT_ROLES.md` holds the detail: read only the section you need ("LeadBot" when starting a slice,
"Task card" and "Token budget" before spawning, "Working detail" for the reasons behind these rules). History: `docs/handoffs/README.md`
(index) and `docs/PROJECT_CONTEXT.md` (only the section you need). Atlaslope is a static web app (React, MapLibre) for Spain's wine places.
Sources of truth, highest first: `docs/scope.md`, `docs/architecture-decisions.md`, `Review/builder-brief.md`, approved mocks in `Review/mock-*/`,
then these rules. A gap goes to the owner; do not invent behaviour. Repo wins over any memory or chat. The owner's standing rules, verbatim from the hosted project: `docs/OWNER-RULES.md`.

**Where you run.** This file holds what applies everywhere. A local session on the owner's Mac also loads `CLAUDE.local.md` (git-ignored,
one line importing `docs/env-local.md`). Without it you are a cloud thread or the hosted coordinator: follow `docs/env-cloud.md`.

A **small slice** is a fix or tweak with no new screen, data or content. Everything else is a big slice.

## Owner and style of work
- The owner (Djoeri) decides and does not code. Brutal honesty, plain words, answer first, progress in 2-3 sentences. Something failed: say
  what, show the output, wait. He writes English or Dutch: answer in his language. He rewrites personal copy himself (About letter).
- Impatient: a rough first look within 5 minutes, refined after. Show previews before a PR. Verify his "Done" claims. He often sees a stale
  cached build: tell him to hard-reload (Cmd+Shift+R).
- Full uptake: every point he raises is done in full or listed plainly as not done, with where it will be done. Apply an approved principle everywhere.
- Decisions as short option lists, one recommended, batched up front. A decision he made stays until he reopens it. Reversible work starts on the recommended option at once; outward or
  hard-to-undo work waits. Do not start big token work on an unanswered recommendation.
- Vague UI asks ("map navigation looks whacky"): screenshot the candidates and ask in one line first (a guess cost a revert, 19 Oct).
- Tag claims [V] verified, [O] owner said, [R] report or memory, [A] assumed. Re-run a number before relying on it.
- Answer his questions in a normal message, never in the text just before a decision box: he does not see it (19 Oct, the CI question
  went unanswered three times).

## Token budget (owner 19 Oct 2026, after a 5h limit and weekly warning; audit: 485M tokens in 10 sessions, 97% re-reads)
- Keep sessions short: one slice, mock round or region per session; hand off (write `docs/handoffs/<date>-<topic>.md`) around 250K context (owner 21 Oct 2026, raised from 150K; 19 Oct from 80K),
  before building or merging, not after. Aim under 300K spend for a small slice. Subagents are one-shot from a fixed script with packed inputs
  and reply only with result, blocker or question (10-20 lines).
- Proactive: before big work give a one-line token estimate and flag cheaper routes first. Above ~20M estimated tokens, wait for his word.
- Always split every estimate and result into re-read vs new tokens (re-reads ~1/10 price on the API; plan weighting unknown [A]).
- Overrun guards: estimates only from measured per-unit numbers (calls x ~100K context + work; count every step, a fresh session is not cheap).
  Pilot 1-2 units first; one helper per unit with a fixed step count, no agent loops over many items; hard stop at 1.5x budget and report at
  once with the breakdown, and put the fix into the pipeline and these rules (`Tools/guides/usage.py --budget`, output guard in `region.workflow.js`). Measured numbers: `docs/PROJECT.md`.
- One main thread (owner 19 Oct 2026, after a chain of side sessions woke each other for full re-reads): no side sessions, and no
  helper starts sessions of its own. Helpers are one-shot subagents. Mock rounds run in a one-shot helper that builds the page and returns only the link and a few lines.
- Report cost in tokens (re-read and new), not dollars, and say which measurement an estimate rests on.
- Few, big tool calls. Read with `grep -n` and line ranges, never whole files or logs. Batch independent calls. Never wait on your own tools:
  tests, CI logs, searches, screenshots (`npm run shots`) and flake bisects go to a Sonnet subagent that reports in 10-20 lines.
- Batch small asks into the main thread unless he says urgent. Past ~60K before a long wait, write the handoff first.
- Loops are scripts, not chat (19 Oct, Mediterranean prep agent: 14.5M over 107 calls): fetching and per-unit runs happen in a script that
  writes results to files; the session reads a short summary. Quiet commands (`git pull -q`, no full logs): a plain pull put 244 KB in context.
- Say when the session passes ~250K and what is left, so the owner can move the rest to a fresh session.

## Working agreements
- **Outward actions only on his say-so:** publishing, deploying, paid or networked services, anything outsiders see. Standing exceptions: push
  your own `claude/...` branch, one PR per slice, merge on green CI (and after ReviewBot has reported, where it runs). Never push `main`, force-push, rebase pushed history, push to someone
  else's branch, or move or delete a tag. A refused push means stop and tell him.
- **Auto-merge and Auto-fix on every slice PR** (owner, 22 Oct 2026, after he pressed "check and merge" six times for #209 and #210):
  right after opening your own `claude/...` PR, turn on GitHub auto-merge (merge commit, never squash or rebase) and the app's Auto-fix,
  so green CI merges it and a failure, conflict or comment wakes you; no "check CI" buttons. Where ReviewBot runs, turn auto-merge on
  only after it has reported. A run that hangs (no failure) is reported to him; a second hang on the same step gets an issue.
- **Release route:** after merge, ask in one line. Only his typed words "publish release N" start the `publish` workflow, also for a
  rollback. N is the next whole number only; hold other merges until it is tagged. Skill: `.claude/skills/release/SKILL.md`.
- **One worktree per session** (22 Oct 2026: two sessions shared the main checkout; the country-model session committed onto the
  map-bar branch, and a push carried its commit into the wrong PR): every session, the main one too, works in its own git worktree
  from its first step; nobody commits in the main folder, which stays on `main` for reading and previews. A local hook refuses it.
- **Git:** PR per slice on a `claude/` branch; merge `main` in, never rebase. The slice PR holds the handoff and tester note (no records
  PR after it). Push when the PR can stand alone, not in bursts. A handoff is pushed before the session ends (19 Oct: the Guides
  mock handoff sat on an unpushed local branch). Archive, never delete (`Review/archive/`). `release-N` tags mark what is live; keep no "live on release-N" line anywhere. Backlog = GitHub Issues
  (`DjoeriT/Atlaslope`, `#n` in commits; he sets priority).
- **ReviewBot scope:** only PRs with a new screen, new or changed user-facing copy, or a licence/legal question. Fixes, tweaks and docs merge
  on green CI alone (it stays where tests cannot look, e.g. a hidden CC credit).
- **New UI:** rough first look early; a big slice's mock gets a UX/UI/visual check against `Review/visual-style.md` before polish, findings
  fixed not listed. Design round 1 shows the whole range, subtle to bold, and must be designed, not CSS deletions.
- **Mockups are ONE HTML page** (before/after or options A-D, recommendation marked), shared as an Artifact/link, never separate files. A
  live-satellite map mock goes to his Mac (`~/Developer/Atlaslope/mocks/`, git-ignored) as that one page with its file:/// path.
- **Mock language:** NO drawn illustrations, icons, diagrams or fake geography. Richer = more real product and photos, same calm. Prefer
  visuals over lines of text.
- **Photos hard rule:** Guides page cards are square crops (owner 19 Oct 2026, release 54: mixed shapes "not great UX"); each crop
  sets its own focus and is checked against the original: never cut a face, glass or bottle, trim only bystanders. Elsewhere photos may be
  cropped to their frames too (owner 20 Oct 2026, own-ratio rule dropped), with the same care. Credits: no text on photos, no tooltips,
  one always-visible "Photos: Name · licence · cropped and resized" line per set. A unit test fails while a shown photo has no checked crop (`src/home/photoCrops.json`, `Tools/guides/crop_sheet.mjs`).
- **Style:** NO dark mode; black band + champagne (#E9D8B4 family), white page, 6px corners, no pills. Copy: one idea per line, no
  "X, Y and Z" lists. Users see "AtlaSlope"; code and URLs "atlaslope".
- **Vocabulary:** "Learn" not "Study" or "Quiz" (code folder `src/quiz` stays; "Study region" stays). The guide = the whole place page; "Terroir" = one section; never "Terroir
  guide". Keep "Green Spain". Home headline stays "Know the land behind the glass." See `docs/glossary.md`.
- **Positioning (in every guide brief):** guides are a general, fun wine reference for anyone who loves wine, not exam-centric. "Why it
  tastes the way it does" is the spine; only a small "Test me" link leads into Study.
- **Data has a paper trail:** every file under `data/` and every layer, photo or fact source is in `data/SOURCES.md`; facts from official
  sources. WSG and WSET course structure is fine, never their text, maps or images. Licence: code MIT; his writing all rights reserved
  (`NOTICE.md`); data keeps its own terms.
- **Never print keys or secrets** and never put his email or personal details in the repo, lookups or User-Agents. Keys live in repo
  secrets or `.env.local` (check with `grep -c`).
- **Guide format:** any change (sections, order, fields, source rules, checks) updates `docs/guides.md` and its Format log in the same PR.
- Plans end with Context, Upside (measured), Risks, Effort. Never tune data or thresholds to make a test pass. A new rule names its incident.
- **Done** means: merged, ready-to-publish line sent (or published after his words), live check green, handoff written, open questions listed.

## Models and agents
Opus 5.5 for the main session and for the tree model and Study engine; Sonnet 5.5 for helpers, builders, checkers. Agent types `builder`,
`reviewer`, `analyst` (`.claude/agents`); his go on a plan covers the helpers and cost it names; anything off the plan is asked first. Builders and reviewers use their own worktree and
never push. Budgets and spend log: `docs/AGENT_ROLES.md`, `Review/agent-spend-log.md`. Never open `data.js`, `maplibre-gl.js`,
`data/*.geojson`, `*.tif`.

## Commands
`npm test` (Vitest), `npm run build`, `npm run shots`, `Tools/check.sh` (`quick` skips UI tests and build; `ui` adds Playwright). CI runs the
UI tests in four parts: locally run only the specs your change touches, once; don't rerun a passing check on unchanged code.
**Flaky tests** get an issue and are made deterministic in their own slice, never skipped. UI tests use fixtures, no network; debug flags are
in `src/debug.ts` (kept out of `dist/`). Hosts: try directly first; what to do when one refuses depends on where you run (env files).
Regions: `Tools/guides/` (see `docs/PROJECT.md`).
