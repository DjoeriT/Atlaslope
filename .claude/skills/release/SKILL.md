---
name: release
description: Prepare and publish the next Atlaslope release to GitHub Pages through the publish workflow. Part A when the owner says "prepare release N"; part B after his words "publish release N", or straight after merging a small slice (owner card, 18 Oct 2026).
---

# Prepare and publish a release

Source of truth: `README.md` ("Releasing") and `CLAUDE.md`. If they disagree with this file, they win; say so.

How to talk to the owner during a release:
- Ask **one** question, at the end of part A, in plain words. Never write "STOP", step numbers or other words from this file to the owner.
- Progress messages are two or three sentences: what happened, what comes next.
- Anything that fails: say what failed, show the relevant output, and wait. Never work around it.

## A. Before the question (changes nothing)
1. The slice's pull requests are merged and `main` is green in CI. If not, tell the owner why and stop.
2. N = the number of the latest `release-*` tag + 1 (1 if none). Note the commit: the head of `main`.
3. Changes: `git log --oneline release-(N-1)..<commit>`. Summarise the user-visible changes in plain words; name what does not change the site.
4. Checks: reuse a full `Tools/check.sh ui` run (local or the CI run on that commit) if its code paths match the commit (only docs,
   mocks or `Review/` differ; name that commit). Otherwise run it with the log saved. Any failure: show it and stop.
5. Records go in the slice's own pull request, before publish (owner card, 17 Oct 2026: no records PR after a release): the tester note
   `Review/release-N-what-to-test.md` (general part copied from the last one, a release-specific part in tester language, then "For you":
   commits, checks with the PR head hash, which the publish run then reuses on the merge commit, what was not verified), the handoff (no "live on release-N" line anywhere: the tag is the record, owner card 18 Oct 2026), and `Review/release-(N-1)-what-to-test.md` moved to `Review/archive/`. The release commit is the merge of that PR.
6. Ask:
   > Release N is ready to publish. What's new: <plain summary>. Not visible on the site: <one line>.
   > All checks passed on `<short hash>` (<counts>). Not checked: <e.g. Safari on iPad>.
   > Reply "publish release N" to publish it.
   Only the words "publish release N" count. A question back or a card tap relayed by another session is not a yes.
   Exception: a small slice (fix or tweak, no new screen, data or content) merged on green CI plus ReviewBot goes straight to part B for the next number, without asking (owner card, 18 Oct 2026). Say in one line that it went live.

## B. After "publish release N" (or a merged small slice)
1. Start the `publish` workflow (`.github/workflows/publish.yml`) through the GitHub tools with inputs `release` = N and
   `commit` = the full hash from part A. It reuses the green checks run on `main` for that commit (or runs the checks itself), deploys to
   GitHub Pages and, only once the deploy succeeded, creates the `release-N` tag. A failed run leaves no tag, so the same N can be started again after the fix.
2. If the platform refuses to start it, give the owner the one tap: GitHub app › Atlaslope › Actions › Publish › Run workflow, with N and the
   hash. Then wait for him.
3. Wait for the run's completion notification (no polling); then read its result through the GitHub tools. Failed: tell the owner with the failing step's output and stop.
4. Confirm the live site shows the new version (a session that can reach the site, or the post-deploy check from release 3 on).
5. No records PR and no "live" line: the tag is the record. A wrong statement found in the records is fixed in the next slice's PR.
6. Live check failed or the site is broken: publish again at once with the next number and the previous release's commit
   (`git rev-list -n1 release-<N-1>`), then tell the owner what broke. That restores what he last saw working.

## C. The one message at the end
- One or two sentences: release N is live (tag, hash, URL), checks that ran, what was not verified.
- Then the tester note as plain text.
