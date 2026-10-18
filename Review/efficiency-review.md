# ReviewBot: PR #64 (efficiency), read-only review

Verdict: merge after fixes. Blockers 0, should-fix 5, nits 5. All findings are from reading (not run); nothing was executed.

## Constraint 1 (publish reuse): holds
Reuse needs a completed, successful ci.yml run for the exact SHA (push, main) AND a step named "Tools/check.sh ui" with conclusion success. Docs-only runs give "skipped", cancelled gives "cancelled", no run or API error gives checks run. Under GitHub's `bash -e`:
- `read` on a here-string never fails.
- `gh api --jq` with zero runs prints "null null null", so the id "null" check breaks out of the loop correctly.
- An API error gives `run=""` and falls back to running the checks.
- The first step still validates `commit` (40-hex) before it is used in the URL.
- Tag/deploy order and validation are unchanged. The job-level `permissions` is fine (checkout needs contents:read).

## Blockers
None.

## Should fix
1. CLAUDE.md:35,40-43 dropped owner rules that are in none of AGENT_ROLES, README or the skill:
   - "Agents stay inside the project, scratchpad and /tmp; no paid or networked service without OK; fetching an open dataset named in SOURCES.md is fine, anything else is a question."
   - "One thread owns a release's numbering and tag at a time."
   - "Repo wins over memory when they disagree."
   - "Never add a map layer, photo or fact source without a SOURCES.md entry" (new text says only "every file under data/").
   - "Facts from official sources" survives only in README:62 (Notes).
   Restore these in AGENT_ROLES "Working detail", or one line in CLAUDE.md.
2. CLAUDE.md:24-25 "Small slices run lean ... Details: docs/AGENT_ROLES.md". AGENT_ROLES has no such section (grep "lean" finds nothing), so the pointer dangles. Add the detail to AGENT_ROLES.
3. release/SKILL.md:37 "Watch the run" and the hook conflict with the no-polling rule (CLAUDE.md:13, AGENT_ROLES:142). Say "wait for the completion notification".
4. release/SKILL.md:21-24 asks for the tester note's "checks with the hash" in the PR, but the release commit is the merge commit, which does not exist yet. Say the note names the PR head and that the hash is filled in at ask time. Also, after a squash merge the "release commit" is not the PR head.
5. ci.yml:18-19 comment is stale: "every publish (publish.yml re-runs the checks itself)". Publish now reuses the main run. Update it.

## Nits
- publish.yml:64-70: after the 16th wait it sleeps 30 s once more for nothing. A transient API error mid-wait stops the wait and falls back to running the checks (safe).
- ci.yml:7-9: two quick merges to main can cancel the pending middle run (concurrency keeps one pending). Publish then runs the checks, which is safe but not a reuse.
- publish.yml:72: the jobs API is not paginated. One job is fine.
- README:7-9 hard-codes "release 15" and "Next numbers 16, 17". That is the kind of stale statement the file warns about. Origin tags confirm 15 is the latest today.
- CLAUDE.md dropped "he sees the improved mock with a short note of what changed". Add it to AGENT_ROLES.

## Constraints 2 and 4
Constraint 2: skill, hook and README agree (no records PR, live line goes in the next PR). Constraint 4: all four parts are in CLAUDE.md:10-13 and AGENT_ROLES:138-144.
