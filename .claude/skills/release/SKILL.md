---
name: release
description: Publish the next Paraje release to GitHub Pages, end to end, asking the owner once before the publish. Run only when the owner types /release.
disable-model-invocation: true
---

# Publish the next release

Source of truth: `README.md` ("Releasing") and `CLAUDE.md`. If they disagree with this file, they win; say so.

How to talk to the owner during a release:
- Ask **one** question, at the end of part A, in plain words. Never write "STOP", step numbers or other words from this file to the owner.
- Progress messages are two or three sentences: what happened, what comes next.
- Anything that fails: say what failed, show the relevant output, and wait. Never work around it.

## A. Before the question (changes nothing)
1. `git status` is clean, on `main`, level with `origin/main`. If not, tell the owner why and stop.
2. N = the number of the latest `release-*` tag + 1 (1 if none).
3. Changes: `git log --oneline release-(N-1)..HEAD`. Summarise the user-visible changes in plain words; name what does not change the site.
4. Checks: reuse a full `Tools/check.sh ui` run from this session if it passed on a commit whose code paths match `HEAD` (only docs, mocks or
   `Review/` differ; name that commit). Otherwise tell the owner the checks are running (a few minutes), then run it with the log saved.
   Any failure: show it and stop.
5. Ask:
   > Release N is ready to publish. What's new: <plain summary>. Not visible on the site: <one line>.
   > All checks passed on `<short hash>` (<counts>). Not checked: <e.g. Safari on iPad>.
   > Reply "publish release N" to publish it.
   Only the words "publish release N" count. A question back is not a yes.

## B. After "publish release N"
1. Tester note: move `Review/release-(N-1)-what-to-test.md` to `Review/archive/`; write `Review/release-N-what-to-test.md`: a general part
   (copied unchanged), a release-specific part in tester language, then "For you" (commits, checks with the hash, what was not verified).
2. Commit `Release N: <one line>`; push `main`.
3. `git tag release-N <that commit>` and `git push origin release-N` (that one tag only). The deploy workflow publishes to GitHub Pages.
4. Watch the workflow (`gh run watch`); failed: tell the owner and stop. Open the live site once and confirm the new version is there.
5. Update `docs/PROJECT_CONTEXT.md` (the hook asks for it) and sweep it for anything this release made untrue. Commit on its own; push `main`.

## C. The one message at the end
- One or two sentences: release N is live (tag, hash, URL), checks that ran, what was not verified.
- Then the tester note as plain text.
