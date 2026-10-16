# Review PR #28 (dbd5390 vs 25a951e): docs closeout for release 5
Verdict: merge after fixes. 0 blockers, 1 should fix, 2 notes.

Checked (ran): tag release-5 peels to 25a951e (matches text); publish.yml line 50 enforces last+1, so 4.1 -> 6 and quiz -> 7 is correct. Only docs/PROJECT_CONTEXT.md and a pure rename of the what-to-test file.

- Should fix: section 6 says the owner's go covers releases 3 to 5 and "Releases 6 to 8 need a new go", but the quiz (formerly 5, inside the go) is now 7, and 4.1 is 6. Both now need a new go; say so explicitly (e.g. "the go covered 3 to 5, all done; releases 6 and 7 need a new go").
- Note: docs/handoffs/2026-10-16-release-4-reference.md:24 still points to Review/release-4-what-to-test.md (moved to Review/archive/). Handoffs are history; optionally add "(now in Review/archive/)".
- Note: run ids, 20:10Z tag time and "20:05Z" owner message not verifiable from the repo (read only); commit time of 25a951e is 20:07Z, consistent.
