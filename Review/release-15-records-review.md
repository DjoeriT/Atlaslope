# Release 15 records review (claude/project-thread-xkhjw7 vs origin/main)
Verdict: merge after fixes (0 blockers, 1 should-fix, 3 nits). Read only; the workflow was not run by me (run 39048612822 not re-checked).

## Workflow (.github/workflows/live-map-check.yml:69-71)
- Race: yes, the response can arrive before the waiter exists. Names are added after the map's 'load', and the waiter is registered only after goto('load') resolves, so a fast name tile can be missed. Effect: waitForResponse waits its full 45 s, times out, the .catch logs "no name tile after 45 s" and the script goes on. The pass/fail result is not affected, because the page.on('response') listener (line 53) is registered earlier and counts every name tile into seen.names. Cost is only up to 45 s of extra time (job limit is 10 min). Correct, but the comment could say the waiter is a wait aid and the listener is the judge. Nit.
- Not weakened: lines 79-84 are unchanged (all four kinds must be > 0, failures still logged). The new wait has a catch and no new pass condition. networkidle and the 2 s pause remain.
- Nit (line 47/83): seen.names is cumulative over both views, so a name tile from the first (Spain-wide) view would satisfy the close-in check. Pre-existing; the first view showed 0 in the failed runs. Consider a separate counter for the close-in view.

## Records
- Should-fix: docs/handoffs/2026-10-17-zoom-detail.md:37-39 says the check "failed on 0 name tiles in releases 14 and 15". PROJECT_CONTEXT.md:46-48 says the release 14 check passed on its second attempt. Reword to "saw 0 name tiles on a first try in release 14 (passed on retry) and failed twice in release 15".
- Nit: docs/PROJECT_CONTEXT.md:45-48: "Live: release 15 ... Release 14, ... at https://atlaslope.com/ over HTTPS; djoerit.github.io redirects there". The "live at" address now trails the release 14 clause. Move it to follow release 15.
- Nit: Review/release-15-what-to-test.md:16-18 puts run IDs and PR/commit details in a tester-facing note; fine for the project, but "For you" is long. Optional.
- Consistent: numbering 16/17 for mastery map and ready for friends agrees across PROJECT_CONTEXT.md:97 and the tester note line 7. Older "move to 15 and 16" lines (:94) are history. f451d41, run 39047992444, 39048373912, 39048612822, 9 name tiles agree in all three files. Release 14 tester note moved to Review/archive with no remaining references (git grep). Not verified: PR #61 number, "16:03Z" owner time (no source in the diff).
