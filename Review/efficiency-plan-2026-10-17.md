# Efficiency plan: fewer tokens, faster threads (17 Oct 2026)

Thread "Faster, leaner threads". Status: proposal, nothing changed yet. Tags: [V] measured here, [R] from a report or memory, [A] assumed or estimated.

## The short version
The cost is not the agents and not the cold starts. It is the threads re-reading their own long history on every step.
Each step a thread takes (one tool call) sends its whole conversation again. A thread that has grown to 300K tokens pays for 300K tokens on every small `ls`.
So the plan is mostly about keeping each thread's conversation short, and secondly about cutting the duplicate machine time in the release pipeline.

## What was measured (today, 17 Oct, 11 sessions: 10 threads plus the coordinator)

| Thread | Cost | Re-read (cached) tokens | Written tokens | Context at the end |
|---|---|---|---|---|
| Sharper map when zoomed in (releases 13 and 15) | $23.95 | 72.4 M | 231 K | 314 K |
| Release 7: the quiz (overnight) | $21.67 | 54.3 M | 366 K | 175 K (after one compaction) |
| QA and review round (release 11) | $19.81 | 61.0 M | 167 K | 265 K |
| Release 8 and 9 | $18.35 | 63.8 M | 238 K | 111 K (after one compaction) |
| Mobile checks (release 14) | $13.40 | 40.6 M | 80 K | 345 K |
| UX and UI review (still running) | $12.44 | 35.0 M | 117 K | 134 K |
| Release 10: place guides | $11.11 | 35.0 M | 121 K | 323 K |
| Polish: icons and photos (release 12) | $8.84 | 27.6 M | 67 K | 297 K |
| Social share preview | $7.13 | 21.7 M | 54 K | 261 K |
| Coordinator | $4.46 | 11.8 M | 22 K | 250 K |
| AtlaSlope spelling (one small PR) | $1.87 | 4.2 M | 8 K | 162 K |
| **Total** | **$143** | **428 M** | **1.47 M** | |

[V] from the session records (get_session usage), 17 Oct 17:10Z.

Where the $143 goes, at list prices (Opus 5.5: $0.20 per M re-read, $5 per M first write, $20 per M output) [V, sums to the measured total within 1%]:
- **Re-reading the conversation: about $86 (60%).**
- Writing new context into the cache: about $29 (20%).
- What the threads actually write: about $29 (20%).

Agents (BuilderBot, ReviewBot) today: 29 runs, 1.9 M tokens in total [V, `Review/agent-spend-log.md`]. That is under 1% of the tokens the threads re-read, and a few dollars [A]. Cutting agents saves little; the 45 K design-check agent the lean rule drops is about 0.01% of today's volume.

Machine time per release [V, GitHub Actions, today]:
- Pull request checks: 3.3 to 6.0 minutes (full run), 10 seconds for docs-only.
- The same checks again on `main` after the merge: 3.4 to 5.2 minutes.
- Publish: 3.5 to 6.0 minutes, of which the check job re-runs the full suite a third time.
- Separate records PR after each release: 6 today (#35, #52, #54, #58, #60, #62), each with a ReviewBot run (17 to 28 K tokens) and a merge.
- Five pushes in 4 minutes on one branch (share preview, 09:50 to 09:54Z) each started and cancelled a CI run.

Cold start [V, timed in this container]: `npm ci` 6 s, unit tests 6 s, production build 8 s, one UI spec 19 s including its own build. The test browser is already preinstalled. **So preinstalling saves about 10 seconds per thread; it is not worth a change.**

Duplicate repo [V]: the project has both `djoerit/paraje` and `djoerit/atlaslope`. They are the same repository (GitHub forwards the old name; both are at 469670a), so every thread clones it twice and loads `CLAUDE.md` twice.

Fixed reading on every step [V, file sizes]: `CLAUDE.md` 10.9 KB (loaded twice), `MEMORY.md` 14.1 KB, project instructions about 4 KB. Together about 10 K tokens, re-read on every step of every thread. The README is out of date ("today only src/dops.ts"), so threads explore the code to orient themselves.

## Where the time goes [A, from thread lengths and PR timings]
PRs go from open to merged in 2 to 13 minutes, so the hours are spent before the PR: building, local test runs, previews, waiting for your answer, then publish, live check and the records PR afterwards.
After the code is done, a release still waits about 15 to 20 minutes on machines: PR checks, publish (which repeats the checks), live map check, records PR.

## The plan, biggest saving first

### 1. Keep each thread's conversation short (biggest lever: about 30 to 40% of thread cost) [A]
- **One slice per thread, then close.** The two most expensive threads each carried two releases. Don't send follow-up fixes to a finished thread; this goes against the coordinator's earlier "send follow-ups to open threads" idea, which would make threads longer and cost more. Exception: a tiny follow-up while the thread is still under about 100 K.
- **Hand off at about 150 K.** When a thread passes that, it writes a short handoff and a fresh thread carries on from it. A fresh thread starts at roughly 40 to 60 K [A].
- **Noisy work goes to a cheap helper that reports back in a few lines.** Full test runs, reading CI logs, searching the code, checking screenshots: a Sonnet 5.5 helper does it in its own space and returns a 10 to 20 line summary. The thread never sees the raw output.
- **No waiting loops.** Threads wait for CI through PR notifications, not by checking every minute; each check is a full re-read.
- **Read narrowly.** `grep -n` and line ranges, never whole files or whole logs; screenshots only for layout, dark mode and large text (already a rule, often skipped).

Upside: if the average conversation size halves, re-reading costs halve: about $40 a day at today's pace [A]. Re-measure after one day on the same table.

### 2. Cut the release pipeline's repeated work (speed: about 5 to 10 minutes per release, plus one PR cycle)
- **Publish skips the checks when `main` already passed on that exact commit.** Today the full suite runs three times on the same code (PR, main, publish). Saves 3 to 4 minutes per publish [V, run times above].
- **No separate records PR after a release.** The tester note, handoff and context update go into the slice's own PR before publish (the lean rule already does this for small slices; extend it to all). The "live on tag release-N" line goes into the next slice's PR. Saves 6 PR cycles and 6 ReviewBot runs a day at today's pace [V, count].
- **Docs-only PRs skip ReviewBot** unless they change rules. Today's records reviews found one stale line each.
- **Push once.** Finish locally, then push (already a rule; the share-preview thread broke it five times in 4 minutes).

### 3. Trim what every step re-reads (small in money, about 10 K tokens per step) [V sizes, A saving]
- **Remove `djoerit/paraje` from the project's repositories** (Project settings, Resources). Same repo, cloned and loaded twice.
- **`CLAUDE.md` from 10.9 KB to about 4 KB**: keep the working agreements, move the history and incident detail to `docs/AGENT_ROLES.md` and the skills, where threads read them only when needed.
- **`MEMORY.md` from 14 KB to about 4 KB**: current state only; history already lives in the repo handoffs. The coordinator does this.
- **README becomes the "start here" page**: current release number, what lives where today, commands. Replaces the stale layout section.

Upside: about 7 K fewer tokens per step. At about 1,500 to 2,000 steps a day [A] that is roughly 10 to 14 M re-read tokens, about $2 to $3 a day. Worth doing because it is a one-off and also makes threads orient faster, not because of the money.

### 4. Tests: run each suite once per change
- Locally, run only the specs the change touches; CI runs the full suite (lean rule; extend to big releases too: one full local run before the single push, not two).
- Measured full UI suite in this container: 95 tests, 4 min 28 s [V, 17 Oct 17:20Z]. Playwright sets no worker count, so it uses 2 of the container's 4 cores. Trying 4 workers is a one-line change; if the map tests stay stable, it could bring the run to about 2.5 to 3 minutes [A, to measure before adopting].

### 5. Thread model (your call, card)
Sonnet 5.5 re-reads at the same price as Opus 5.5 ($0.20 per M) [V, current price list]; it is cheaper only on writing ($10 vs $20 per M output). Since 60% of the bill is re-reading, moving small-slice threads to Sonnet saves about 20% of their cost [V arithmetic on today's totals], with some risk on quality. Fixing conversation length (item 1) saves more with no quality risk. Recommendation: keep Opus for threads now, re-measure after item 1, then decide.

### Dropped from the earlier proposals
- **Preinstall at container start**: measured 6 s for `npm ci`, browser already there. Not worth it.
- **"Start here" as a separate file**: folded into the README rewrite, so there is one file, not two.

## Context
Today ran 10 releases (6 to 15) through 11 sessions for $143 [V]. You asked for less token burn, more speed and more efficiency. The lean rule for small slices (owner card 17:05Z, PR #63) is already in place and is kept; this plan builds on it.

## Upside (measured baseline, targets to re-measure on the same table)
- Thread cost: baseline $143 for 10 releases, about $14 per release [V]. Target: under $9 per release after items 1 to 3 [A].
- Re-read tokens: baseline 428 M per day [V]; target under 250 M at the same release count [A].
- Release machine time after the code is done: baseline about 15 to 20 minutes plus a records PR [A from run times]; target about 10 minutes, no records PR.
- Named cases to compare: "Sharper map" ($23.95, two releases in one thread) and "Polish" ($8.84, one release) [V].

## Risks
- Shorter threads hand off more often; a bad handoff loses context. Mitigation: the handoff file already exists per thread; the 150 K rule only adds when.
- Skipping the publish checks relies on the `main` run for the same commit; if someone publishes a commit whose `main` run failed or was cancelled, publish must fall back to running them. The workflow checks that, it does not assume it.
- Records in the slice PR means the "live" line lands one PR later; the tag itself is the record of what is live.
- Helpers summarising test output can hide a detail the thread needed; they return the failing test's name and the first error lines in full.

## Effort
- One small PR (publish workflow check-skip, CLAUDE.md and AGENT_ROLES trim, README start-here, the thread rules): about 0.3 to 0.5 M tokens of thread work, one ReviewBot run (about 30 K) [A].
- Memory trim: the coordinator, about 0.1 M [A].
- Removing `paraje` from the project: one setting, yours.
- Re-measure after a day: about 20 K tokens.
