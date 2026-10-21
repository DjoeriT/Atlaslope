# Faster loop: report

Done. Verdict: done.

- Item 1 shots:tour (Tools/shots-tour.mjs): rioja phone run 76 s (build 2 s), 10/10 stops ok. Sheet: shots/tour-rioja-phone.png (git-ignored, in the builder worktree).
- Item 2 CI: scope step counts .claude/ as docs-only; scope, check, ui, gate untouched. Dry run of the grep: docs + .claude + CLAUDE.md -> no non-docs line (grep rc 1) -> docs=true; docs + src/story/steps.ts -> prints the src file (rc 0) -> docs=false.
- Item 3 builder.md: maxTurns 120, checkpoint 80 of 120, Done-when line.
- Item 4 README Commands paragraph; AGENT_ROLES task card Done-when line with incident; turn-cap table 60 -> 120 for builders.
- Tools/check.sh quick: ALL CHECKS PASSED (3.7 s).

## Fix after coordinator review
- Cause: a builder worktree has no .env.local (git-ignored), so no Esri key, so the build had no imagery layer; the first sheet showed relief only. Not referrer, GL or minzoom.
- shots-tour.mjs now copies .env.local from the main checkout (never read or printed) and counts successful ign.es / Esri World_Imagery responses per stop; zero = FLAG.
- Rerun rioja phone: 101 s, 10/10 stops ok with 6-71 imagery tiles each; sheet shows satellite on all stops (Haro stop is PNOA photo).
