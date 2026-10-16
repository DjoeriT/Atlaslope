# Paraje: way of working, repo rules vs how this Project runs

Final draft, 16 Oct 2026. All five owner decisions taken (cards, 10:18 to 10:19Z); Part 2 matches them. Lands in the restart commit when the owner says go. Nothing pushed. Sources read: repo `main` at 5fe2ba0 (`CLAUDE.md`, `docs/AGENT_ROLES.md`, `docs/PROJECT_CONTEXT.md`, `.claude/`, `Review/`, `README.md` "Releasing", `deploy.yml`), the three handoffs, the builder brief, scope and architecture decisions, project memory.
Tags: [V] checked in those files, [R] from memory or a handoff, [A] my inference.

## The root cause, in one line
The repo rules were written for Vintro: one long-lived terminal session (LeadBot) on your Mac that spawns subagents, pushes branches and tags, and uses `/clear`. This Project is many short cloud threads plus a coordinator, with shared memory and files, that cannot push tags or reach Spanish government and tile hosts. Most clashes come from "LeadBot" meaning a session that no longer exists.

## Part 1. The clashes

Winner: **Repo** = keep the repo rule, **Project** = the Project's way wins and the rule is rewritten, **Merge** = a new rule that keeps the intent of both. "Yours" = a decision card for you.

| # | Clash | Repo says | What actually happens | Winner, recommendation |
|---|---|---|---|---|
| 1 | Who is LeadBot | LeadBot is "the main thread" that plans, writes cards, merges, keeps the record [V] | There is no main thread. The coordinator dispatches and keeps memory; each thread does the work and closes [R] | **Merge.** The thread doing a task is LeadBot for that task. The coordinator is the dispatcher and memory keeper, never LeadBot, never edits the repo |
| 2 | Where the record lives | "Git is the record": decisions, plans, mocks committed [V] | Scope, 32 architecture decisions, builder brief, handoffs and round 3 mocks live only in project files and memory; `PROJECT_CONTEXT.md` still describes the void plan and old `src/` [V] | **Decided: Git** (owner, card, 16 Oct 10:18Z), with project files as the workshop |
| 3 | How code lands | Builder branch, merge "only after asking the owner"; never push other branches [V] | Cloud branch pushes were refused at release 2, so it landed by a merge to `main` on a card [V, PROJECT_CONTEXT §5]. This thread was handed a `claude/...` branch by the platform [V] | **Decided: pull requests** (owner, card, 16 Oct 10:19Z). One PR per slice on a `claude/...` branch, merged by the thread after green CI and ReviewBot's report. The release 2 refusal was the safety check lacking your explicit word; this rule is that word [R] |
| 4 | Releasing | After "publish release N", LeadBot tags and pushes `release-N`; the release skill does it [V] | No session can push a tag: cloud proxy and the Mac session both refused. You ran `git tag` in Terminal [V] | **Decided: publish workflow** (owner, card, 16 Oct 10:19Z). It tags and deploys; Claude starts it after "publish release N", or you tap Run on the GitHub app if Claude can't |
| 5 | Closing threads | No concept; `/clear` at break points [V] | You close threads and ask each to hand off [R] | **Decided: Claude closes** (owner, card, 16 Oct 10:19Z). The thread writes its handoff, updates memory and resolves when work is delivered; open questions keep it open; you can reopen |
| 6 | Spawning | "Spawn only when the owner asks; say cost first" [V] | The coordinator starts a thread on every ask; the brief plans 14 to 17 builder cards [V] | **Decided: plan covers it** (owner, card, 16 Oct 10:19Z). Threads are not agents. His go on a plan covers the subagents it names and its cost estimate; off-plan is asked |
| 7 | Decisions | "Multiple-choice rounds, batched before work starts" [V] | Decision cards; the Project default is to keep working on the recommended option while the card waits [V] | **Merge.** Batch cards up front. Reversible work continues on the recommended option; anything outward or hard to undo waits for your tap |
| 8 | Mock location | `Review/mock-<topic>/` [V]; PROJECT_CONTEXT says `public/mocks/` with a symlink [V] | Mocks live in `/mnt/project-files/paraje/mocks/` and `~/Developer/Paraje/mocks/` [R] | **Merge.** Drafts in project files while you review; once approved they are committed to `Review/mock-<topic>/`. Map mocks also go to your Mac to open in Chrome |
| 9 | Work that needs your Mac | Not covered; "data pass on the owner's Mac" is a one-off decision [V] | Boundary fetch, tile checks, tag pushes, `pbcopy` all need the Mac [R] | **Project.** New rule: anything needing Spanish government hosts, tile hosts, your keychain or clipboard runs in a session on your Mac, started from the thread that needs it |
| 10 | Retro every two weeks | "LeadBot proposes" [V] | No LeadBot lives two weeks | **Project.** The coordinator runs it on a fortnightly routine and posts the table to you |
| 11 | Rules must name the incident | In force [V] | Decision 31 (prove imagery on your Mac) still waits on your yes [R] | **Repo.** Not part of this cleanup; card stays where it is |
| 12 | Backlog | GitHub Issues, LeadBot moves them [V] | Threads have not touched issues since #8 [A] | **Repo**, with owner of the duty = the thread doing the work. The coordinator only reads issues to answer "what's open" |
| 13 | Commit when asked | "Commit when asked" [V] | The platform says implement, commit, push | **Merge.** A thread commits only inside work you said go to. Building is paused, so today: no commits |
| 14 | Model choice | Sonnet for mechanical, Opus for judgement [V] | You pick the model per thread (Fable then Opus 5.5) [R] | **Merge.** Your word picks the thread's model; the Sonnet/Opus rule stays for subagents |
| 15 | Progress messages | Two or three sentences [V] | Status checklist plus replies only at results | **Merge, no conflict.** Checklist carries progress; replies stay two or three sentences |

Vintro leftovers. No decision needed, I just fix them in the rewrite:

| # | Leftover | Fix |
|---|---|---|
| 16 | LeadBot tags `build-N` after "an upload"; QA verdict "ready to upload"; "TestFlight feedback and crashes" in AnalystBot [V] | Web words: `release-N`, "ready to publish", feedback from friends you pass on |
| 17 | Design review "in line with Apple's guidelines" [V] | "in line with good web and iPad practice (WCAG 2.2 AA)" |
| 18 | ReviewBot works under `/private/tmp` (a macOS path) [V] | The session scratchpad or `/tmp` |
| 19 | Release skill: `gh run watch`, tag push, a hook that fires on the tag push, `disable-model-invocation` so only a typed `/release` starts it [V] | Watch the run through GitHub tools; the hook fires on the publish workflow start; you say "prepare release N" in a thread to run part A |

## Part 2. Proposed rewrite (matches the owner's five picks)

### CLAUDE.md, replace "Working agreements" bullets 1 and 5 and the "Agents" section; add "How the Project runs"

```markdown
## How the Project runs (owner, <date>)
- **Coordinator**: the session in the project chat. Starts a thread per ask, keeps project memory, answers "what's open",
  runs the fortnightly rules retro on a routine. Never edits the repo.
- **Thread**: one piece of work. The thread doing a task is **LeadBot** for that task: it plans, writes cards, spawns the
  agents its plan names, keeps the record, and closes. One thread owns a release's numbering and tag at a time.
- **Closing**: when the work is delivered, the thread writes its handoff (`docs/handoffs/<date>-<topic>.md`: done, decided,
  open, where things are), updates memory, and resolves itself. The owner can reopen it. A thread with an open question stays open.
- **The owner's Mac**: anything that needs Spanish government hosts, tile hosts, the keychain or the clipboard runs in a session
  on his Mac, started by the thread that needs it. Cloud threads cannot reach those hosts.

## Working agreements
- **Outward actions only on the owner's say-so, each time:** publishing the site, deploying anything, any paid or networked
  service, anything people outside the project can see. Standing exceptions: inside work the owner said go to, push the thread's own `claude/...` branch, open one pull
  request per slice, and merge it once CI is green and ReviewBot has reported; after the owner says "publish release N", start the `publish` workflow for that commit and number (it creates the
  `release-N` tag and deploys). Never force-push `main`, rewrite pushed history on `main`, push to anyone else's branch, or move or delete a tag.
- **Decisions** go to the owner as tap-to-pick cards, batched before the work. Reversible work continues on the recommended
  option while a card waits; anything outward or hard to undo waits for his answer.
- **Record**: Git is the record. Decisions, scope, plans, cards, approved mocks, reviews and handoffs are committed. Project files
  are the workshop for drafts; project memory is an index that points into the repo. When the two disagree, the repo wins and
  memory is corrected.

## Agents
- Threads are not agents. Subagents (`builder`, `reviewer`, `analyst`) are spawned by a thread: the owner's "go" on a plan covers
  the agents that plan names and its cost estimate; anything outside the plan is a question first. Measured cost goes in
  `Review/agent-spend-log.md` and the thread's status.
- Models: the owner picks each thread's model; for subagents, Sonnet for mechanical work and Opus where judgement or tricky logic is encoded.
- (rest unchanged: worktrees, read-only reviewers, one writer per file, fresh-eyes briefs, reports are input not approval)
- Drop: "Suggest `/clear` at natural break points" (threads close instead).
```

Mocks bullet: "Mocks are HTML pages drafted in project files and committed to `Review/mock-<topic>/` once the owner approves. Map mocks also go to his Mac to open in Chrome, since previews block satellite tiles."

### docs/AGENT_ROLES.md

- Table row **LeadBot (main thread)** becomes **LeadBot (the thread doing the task)**; "merges after asking the owner; pushes `main`; tags `build-N` after an upload" becomes "opens a pull request per slice and merges it after green CI and ReviewBot's report, inside work the owner said go to; starts the `publish` workflow after 'publish release N'".
- Add a row: **Coordinator** | owner's model pick | project memory, routines | the repo, outward actions.
- LeadBot section, "merges a builder branch only after asking the owner" becomes "merges a slice's pull request only when CI and `Tools/check.sh ui` are green and ReviewBot has reported. The owner's 'go' on the plan is the OK; anything off-plan is asked". Builders still work in local worktrees; the thread pushes, builders never do.
- ReviewBot: `/private/tmp` becomes the session scratchpad or `/tmp`; QA verdict "ready to publish / not ready"; design mode "good web and iPad practice (WCAG 2.2 AA)" instead of Apple's guidelines.
- AnalystBot: inputs are "feedback from friends the owner passes on" and any usage counts; drop TestFlight.

### Release flow (`.claude/skills/release/SKILL.md`, `README.md` "Releasing", `deploy.yml`)

- New workflow `.github/workflows/publish.yml`, `workflow_dispatch` with inputs `release` (N) and `commit`: checks `Tools/check.sh ui`, creates tag `release-N` on that commit with the workflow's token, then runs the existing deploy job. `deploy.yml` stays for a tag pushed by hand.
- Skill part A unchanged, started when the owner says "prepare release N" (drop `disable-model-invocation`). Part B step 3: start `publish` through the GitHub tools; if the platform refuses, give the owner the one tap (Actions › Publish › Run workflow, works on the GitHub phone app) and wait. Step 4: watch the run through the GitHub tools instead of `gh run watch`.
- Hook `context-after-release.sh` matches the publish workflow start instead of a `git push ... release-N`.
- [A] untested: whether a cloud thread may start a workflow. The phone tap is the fallback either way, and it replaces Terminal.

### docs/PROJECT_CONTEXT.md

Rewritten at the restart commit (builder brief, step 0): scope and the 32 architecture decisions move into the decisions log, `src/` sections describe the new build, §5 records the new release route. Handoffs move to `docs/handoffs/`.

## Context, Upside, Risks, Effort
- **Context**: the rules predate the Project. The friction you hit at releases 1 and 2 and in the last three threads (tag push, branch push, thread closing, record drift) is clashes 4, 3, 5 and 2.
- **Upside**: named cases. Release 3 needs no Terminal from you (today: one Terminal step per release, releases 1 and 2). A new thread finds scope and decisions in the repo instead of project files (today: `PROJECT_CONTEXT.md` still names the void plan as next, §10 [V]). You stop closing threads by hand (today: all three handoffs were requested by you [R]).
- **Risks**: if the branch push is still refused at the restart commit, the thread stops and tells you, and does not fall back to `main` on its own. the publish workflow gives a bot the power to tag, so it must refuse without the inputs and log who started it. "Go on a plan covers its agents" spends up to the brief's 3 to 5 M tokens without a per-agent ask; the spend log and status checklist are the brake. Self-closing threads could close too early; the open-question rule guards it.
- **Effort**: one docs commit plus one small workflow, about 60k to 100k tokens [A], done in the restart commit once you say go.
