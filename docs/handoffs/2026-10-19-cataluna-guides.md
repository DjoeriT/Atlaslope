# Handoff: Cataluña guides, release 42 (19 Oct 2026)

Thread "Cataluña guides" (coordinator spawn 10:08Z), continued in a fresh thread at 11:01Z on branch `claude/project-thread-cz5q1g`
(built on `claude/guides-cataluna-ui9puj`). Release 43 (coordinator 11:28Z: PR #114 is 42): merge only once tag `release-42` exists,
merge `main` in (never rebase), then ask "publish release 43". Preview: https://claude.ai/artifact/GTuWHa1LnHDWkvfAsxA8Tb

## Done
- 12 pliegos, extracts, `content/sources.json` and `data/SOURCES.md` entries. Owner card 10:26Z: use the five nationally approved,
  EU-pending texts (Costers del Segre, Pla de Bages, Penedès, Catalunya, Montsant) [O].
- Tarragona, Conca de Barberà and Montsant INCAVI "control de canvis" PDFs had struck-through (deleted) rules in the text;
  rebuilt with `Tools/guides/unstrike.py`. `extract.py` STOP fix ported.
- Workflow wf_8702ea2e-dd9: 12 guides written (Sonnet) and sentence-checked (Opus), 89 of 93 fact sheet fixes applied
  (`Review/guides-pipeline/cataluna/fact-sheet-fixes.md`). Catalunya "ebro" flight is a point (ebro is not a place).
- Second Opus check of Priorat, Penedès, Cava: 22 misses fixed (`Review/guides-check/sample-cataluna.md`), patterns in CHECKER.md.
  Its two sheet notes are not applied yet: Penedès climate "wide" cites penedes-doc not the pliego; Cava soil "chalky" (calcárea = limy).
- Budget guard (owner asked 10:42Z): CLAUDE.md Pace, pilot of two places and output guard in `region.workflow.js`, `usage.py --budget`.
- Unit tests 294 pass locally [V].

## Tokens [V, usage.py]
Workflow 20.1M: write 5.57M re-read + 0.74M new, check 4.51M + 0.99M, fact sheets 7.96M + 0.32M. 1.7M per guide (Andalucía 2.6M).
Sample helper 0.2M (output-side count). Coordinator warned; owner told.

## Re-check of the other 9 (fresh thread, owner tapped "Re-check all 9")
- Run wf_b19ff338-e23 (recheck, full): all 9 guides re-checked with the new miss patterns, 11 to 22 sentence fixes each, mostly
  label terms the pliego defines; real errors fixed too (Rancio wine alcohol only "si es necesario"; calcárea is limy, not chalky).
- Fact sheet helpers for 7 places applied 15 notes and skipped 15. The run was stopped before Tarragona and Terra Alta (see tokens);
  their notes and the two sample notes (Penedès climate, Cava soil) were applied by hand from the checkers' notes, logged in
  `Review/guides-pipeline/cataluna/fact-sheet-fixes.md`. Alella Mistela line cut to the 15-word limit (facts test failed).
- Tokens [V, usage.py]: 8.5M against a 4-6M estimate. Checks 4.6M (3.9M re-read, 0.8M new), 0.5M per guide, as estimated.
  Fact sheets 3.9M for 7 places (3.6M re-read, 0.25M new), about 600K each for 3 or 4 edits; the estimate left them out.
  Fix in this PR: `pack.py sheet` packs only the cited pliego pages and the workflow tells the sheet helper two steps, no tests.
  Measure it at the next region's pilot.

## Next (second thread stopped here at ~85K context, 11:35Z)
1. CI on PR #115: ui (3/4) failed because Cava now has a label section; `tests/ui/place-page.spec.ts:88` expectation updated (content
   changed, not tuned). Watch the rerun.
2. Copy review `Review/reviews/2026-10-19-cataluna-guides-copy-review.md`: 6 should-fix (glosses, lists, hype, source talk, repeats,
   two unclear sentences). Fix in this PR: one Sonnet helper per guide with the guide, the review lines for it and its pliego pages
   packed in (few steps), facts unchanged; Opus spot check of the changed sentences only. Estimate from the review's size [A]:
   about 0.1-0.2M per guide, 1.5-2.5M total; pilot 2 guides first and measure.
3. Merge after tag `release-42` (PR #114), merge `main` in, ask "publish release 43".
4. Memory: atlaslope-guides.md Cataluña line (sheet step was 3.9M of 8.5M; pack.py sheet is the fix); MEMORY.md state.

## Open (as of the first thread; 1 and the sheet notes are done)
1. Owner card "Re-check the other 9 Cataluña guides" (recommended: all 9, 4-6M). On "all 9": run the workflow with
   `recheck: true, full: true` and the 9 places other than priorat, penedes, cava. Then apply the two sheet notes above.
2. Preview Artifact for him (one page, all 12 guides) through a one-shot helper, before the PR.
3. PR (ReviewBot runs: new user-facing copy), tester note, merge after release-41, ask "publish release 42".
4. Memory: atlaslope-guides.md gets the Cataluña line; MEMORY.md state line.
