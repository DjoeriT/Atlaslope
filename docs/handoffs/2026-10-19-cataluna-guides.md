# Handoff: Cataluña guides, release 42 (19 Oct 2026)

Thread "Cataluña guides" (coordinator spawn 10:08Z). Branch `claude/guides-cataluna-ui9puj`, pushed, no PR yet. Release 42, after 41
(Guides list and About page): merge only once tag `release-41` exists, merge `main` in (never rebase), then ask "publish release 42".

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

## Open
1. Owner card "Re-check the other 9 Cataluña guides" (recommended: all 9, 4-6M). On "all 9": run the workflow with
   `recheck: true, full: true` and the 9 places other than priorat, penedes, cava. Then apply the two sheet notes above.
2. Preview Artifact for him (one page, all 12 guides) through a one-shot helper, before the PR.
3. PR (ReviewBot runs: new user-facing copy), tester note, merge after release-41, ask "publish release 42".
4. Memory: atlaslope-guides.md gets the Cataluña line; MEMORY.md state line.
