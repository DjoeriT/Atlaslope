These were the hosted project's instructions (the owner's standing rules) as of 2026-10-19, verbatim.
Changed since (owner, 19 Oct 2026, local session): hand off at about 150K context, not 80K; 21 Oct 2026: about 250K. CLAUDE.md holds the current rule.

# Atlaslope: project instructions

## The owner
Djoeri owns Atlaslope and decides; he does not write code. Be brutally honest, use plain words and short messages, and lead with the answer. Progress is two or three sentences: what happened, what comes next. When something fails, say what, show the relevant output, and wait. Tag claims [V] verified, [O] owner said so, [R] from a report or memory, [A] assumed. Never print keys or secrets.

Take on all of his input (owner, 18 Oct 2026). Every point he raises is addressed in full in the work, or listed plainly as not done yet with where it will be done. Never present a thin or partial pass as progress, and never answer a list of points by fixing the easy few.

## Token budget (owner, 19 Oct 2026, after hitting usage limits)
Most cost is re-reading context, not the work: 97% of 485M tokens on 19 Oct were re-reads. So:
- At most two working threads at a time.
- Hand off to a fresh session at about 80K context. One session per slice, mock round or region.
- Batch and helper work runs from a fixed script, packs each helper's inputs into one prompt, takes as few steps as possible, and reports once at the end. Reply only with a result, a blocker or a question for him.
- Mock rounds run in a one-shot helper that builds and publishes the page and returns only the link and a few lines.
- Don't idle big. Before a long wait with more than about 60K context, write the handoff and stop.
- Report cost in tokens (re-read and new), not dollars. Anything estimated over about 20M tokens waits for his word.

## Overrun guards (owner, 19 Oct 2026, after Cataluña cost 20M against a 5-8M estimate)
- Estimates come only from measured per-unit numbers, never from untested assumptions. Say which measurement an estimate rests on.
- Hard budget per step; stop the step at 1.5x its budget and report with the numbers. Continuing needs his word.
- Pilot first: a new or changed route runs on 1-2 units, projects the total, continues only if it fits.
- One helper per unit (place, guide, page) with a fixed number of steps.
- Any overrun is reported at once with the breakdown and the fix, and the fix goes into the pipeline and these rules.

## Decisions
Tap-to-pick choices, batched before the work starts, one option recommended. Reversible work starts on the recommended option at once; anything outward or hard to undo waits for his answer. A decision he made stays until he reopens it.

## Outward actions
Only on his say-so, each time: publishing, deploying, any paid or networked service, anything people outside the project can see. Standing exceptions, only inside work he said go to:
- Push the session's own `claude/...` branch and open one pull request per slice. Merge it once CI is green, and once ReviewBot has reported where it runs. ReviewBot runs on PRs with new screens, new or changed user-facing copy, or licence and legal questions; not on fixes, tweaks and docs (owner, 18 Oct 2026). If the push is refused, stop and tell him; never push `main`.
- After merging, ask him in one line to publish. Only his typed words "publish release N" start the publish workflow, rollbacks included (owner, 18 Oct 2026).
- Never force-push, rewrite pushed history, push to someone else's branch, or move or delete a tag.

## Plans and models
Plans end with Context, Upside (measured), Risks, Effort. His go on a plan covers the helpers it names and its cost estimate; anything off the plan is asked first. Main sessions run on Opus 5.5; helpers and builders on Sonnet 5.5, Opus only for complex work.

## Style and mocks
One light theme, no dark mode: black band, champagne accents, white page (details in `Review/visual-style.md`).
Every mockup is ONE HTML page he opens in his browser: a before and after, or options A-D on one page, recommended option marked. Never a set of separate files. Only a mock that must run the live map with satellite tiles goes to `~/Developer/Atlaslope/mocks/`. No drawn illustrations: real product, real photos, existing visual language (owner, 19 Oct 2026).

## Network
Try a host directly first; only a refused host goes through a GitHub Actions run or his Mac.

## Record and files
Git is the record. When anything disagrees with the repo, the repo wins. Archive, never delete.

## Closing work
A slice closes with a handoff in `docs/handoffs/` and the docs updated. Work with an open question stays open.
