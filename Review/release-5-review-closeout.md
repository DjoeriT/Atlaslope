# Review PR #28 (dbd5390 vs 25a951e): docs closeout for release 5
Verdict: merge after fixes. 0 blockers, 1 should fix, 2 notes.

Checked (ran): tag release-5 peels to 25a951e (matches text); publish.yml line 50 enforces last+1, so 4.1 -> 6 and quiz -> 7 is correct. Only docs/PROJECT_CONTEXT.md and a pure rename of the what-to-test file.

- Should fix: section 6 says the owner's go covers releases 3 to 5 and "Releases 6 to 8 need a new go", but the quiz (formerly 5, inside the go) is now 7, and 4.1 is 6. Both now need a new go; say so explicitly (e.g. "the go covered 3 to 5, all done; releases 6 and 7 need a new go").
- Note: docs/handoffs/2026-10-16-release-4-reference.md:24 still points to Review/release-4-what-to-test.md (moved to Review/archive/). Handoffs are history; optionally add "(now in Review/archive/)".
- Note: run ids, 20:10Z tag time and "20:05Z" owner message not verifiable from the repo (read only); commit time of 25a951e is 20:07Z, consistent.

## Addendum: ci.yml docs-only skip (git diff 1042ef6 5dc64e2)
Verdict: merge after fixes. 0 blockers, 1 should fix, 2 notes.
- Checked (read; logic traced, workflow not run): required check still reports. The job always runs; only the setup-node, npm ci, Playwright and check.sh steps are skipped, so the job ends green. If the diff command fails, the step writes docs=false and everything runs. The check name is unchanged.
- PRs: `base.sha...head.sha` is a merge-base diff, so it covers only the PR's own changes. fetch-depth 0 makes the merge base available. OK.
- Pushes to main: `before...sha` covers the whole push, including multi-commit and merge pushes. A force push or a new branch gives an unreachable or all-zero `before`, so git diff fails and the full run happens. Fails safe. Empty file list also gives full run. Paths git quotes (odd characters) start with a quote and fail the docs pattern, so full run. Fails safe.
- Should fix: git's default rename detection makes `--name-only` list only the new path of a rename. Moving a code or data file into docs/ or Review/ (for example src/x.ts -> Review/archive/x.ts) reads as docs-only although it deletes code. Fix: `git diff --no-renames --name-only`.
- Note: files under Review/sources feed Tools/data/build_fact_sources.py. A change there that alters facts only reaches the app when the script is rerun, and its output lands in data/ (full run). The tests and check.sh do not read docs/ or Review/ (grep ran), so skipping is safe today. If a test starts reading them, revisit the pattern.
- Note: the PR check runs on the merge ref, so a docs-only PR is not tested against code changes already on main. The skip adds no new gap beyond that.
