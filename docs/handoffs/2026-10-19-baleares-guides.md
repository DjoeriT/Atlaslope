# Handoff: Baleares guides, one-shot pilot (19 Oct 2026)

Thread "Use a workflow for Baleares" (coordinator spawn 12:32Z), branch `claude/guides-baleares-pilot-g5lkz8`, release 45.
Preview: https://claude.ai/artifact/VyNXNh4yq64xybzNn4JK4z

## Done
- Sources: the current EU single documents with the 2025-26 normal amendments, from the Publications Office Cellar (SPARQL on the
  ELI, PDF manifestation `.0007.01/DOC_1`): Binissalem OJ C/2026/4121, Pla i Llevant OJ C/2026/1686. Source ids
  `binissalem-doc-2026`, `pla-i-llevant-doc-2026`. The CAIB Binissalem pliego is the 2014 order, older than these, so not used [V].
- New route `Tools/guides/oneshot.workflow.js` + `oneshot.py apply`: per guide one Sonnet writer and one Opus checker, each two
  steps (print the pack, return JSON). Helpers write no files and run no tests; the script writes guides, check logs and sure
  sheet edits, runs check_guide.py and checks flights against OSM. One check pass, no sheet helper, no re-check.
- Run wf_c74e437f-998: Binissalem KEEP 17 FIX 23 CUT 0, Pla i Llevant KEEP 19 FIX 15 CUT 4. 14 of 15 sheet edits applied by
  script; one unsure (Pla i Llevant "fortified" for vino de licor) left as is, correct by definition.
- Thread fixes after the run: one source-talk error ("at the source"), cut rulebook paras (planting density, alcohol and acidity
  minima, pressing yield), a 26-word sheet "why" line. Spot check of every number and the Embat/soil link against the pages [V].
- Satellite tile `public/guides/baleares.webp` (view 2.98,39.60,8.9 in `region_tile.mjs`). Faint mosaic seams in the sea.

## Tokens [V, usage.py]
Workflow 0.84M for 2 guides: write 0.29M re-read + 0.12M new, check 0.30M re-read + 0.13M new. 0.42M per guide against
Cataluña's 3.1M all-in, but over the 0.2M target and just over the 0.4M stop line.
Why over: the write pack is 40 KB, past the Bash output limit, so the writers saved and re-read it (3 tool steps, not 2), and each
helper wrote a large cache (34-82K) on its first step. Fix for the next region: pack.py writes the pack to a file the helper reads
with one Read (or trim the example and docs sections), then re-measure on a two-place pilot.

## Quality
One check pass held the facts (spot check found no wrong fact after it). The weak spot is copy: drafts read as a rulebook (numbers,
minima), which the positioning rules out. Cataluña's copy review caught the same. A copy-pass line in WRITER.md or a cheap copy
helper is the next lever.

## Open
- ReviewBot copy review on the PR; merge on green CI; owner says "publish release 45".
