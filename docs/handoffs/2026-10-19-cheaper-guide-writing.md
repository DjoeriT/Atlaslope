# Handoff: cheaper guide writing, proved on Castilla y León (19 Oct 2026)

Thread "Cheaper guide writing". PR #110 (draft), release slot 38 after 37. Preview: https://claude.ai/artifact/QFu9rbSpwpCC4PryoPnVo8

## Done
- Pipeline in `Tools/guides/`: `extract.py` (pliego to guide sections, page-marked), `pages.py` (print cited pages), `check_guide.py`
  (machine check: cites, pages, numbers, beats, exam framing, source talk), `WRITER.md` (Sonnet brief), `CHECKER.md` (Opus brief).
- 16 current ITACyL pliegos fetched (`Review/sources/fetched/`, index `Review/guides-pipeline/castilla-y-leon/sources-index.md`,
  ids `<id>-pliego` in `content/sources.json`; Rueda keeps `rueda-doc`). Arribes and Cebreros repo copies were outdated.
- 16 guides in `content/guides/`, every sentence checked by Opus against its page (logs `Review/guides-check/<id>.md`): 473 kept,
  268 fixed, 6 cut. Thread sampled Toro, Ribera del Duero, Urueña by hand: no missed fact; Toro gained its whites and sweet wines.
- 16 fact sheets corrected to the pliegos (`Review/fact-sheets-cyl-pliego-fixes.md`). Unit tests 292/292 locally.

## Measured
- Helpers: write 39K tokens per guide (Sonnet), check 87K per guide (Opus), sources 105K, sheets 200K. Ledger:
  `Review/guides-pipeline/castilla-y-leon/cost-ledger.md`.
- Session cost $23.66 at the end of the checks, $1.48 per guide (Green Spain: $2.51+). Most of it was this thread re-reading its own
  context between 34 helper runs (40M cached tokens), not the helpers (2.1M).

## Decided (defaults, owner may overrule)
- Every sentence is checked (not a sample): Sonnet drafts needed fixes in 36% of sentences.
- Arlanza: rev 3.1 "consolidado en vigor", not the rev 3.4 proposal.
- Label: no terms the pliego leaves to "legislación vigente"; famous styles stay in the rules beat (owner rule via "New guide page shape").
- Vino de Pago estates have no boundary or centroid: their flights use points.
- Sheets: Urueña main grape stays Syrah (pliego ambiguous); Cigales main grapes are the five p19 singles out.

## Open
- Merge `main` after release 37's tag; resolve `tests/unit/guides.test.ts` (Green Spain changes the same line; keep both lists).
- `docs/guides.md` arrives with 37: add the pipeline to "Terroir: how it gets written and checked" and update "State" (owner rule:
  format and process docs change in the same PR).
- ReviewBot (new user-facing copy), then merge on green CI; then ask him to say "publish release 38".
- Bierzo flies only to itself (pliego names no sight beyond town lists); check warns, as designed.
- Process slip: five checker helpers sent the owner's email or name in a Nominatim User-Agent (7 requests) before the brief fixed it.
- Next regions: run the pipeline from a fixed script (Workflow) so no long thread sits between helper runs; needs his opt-in.
  Add to WRITER.md: the rules beat names the wine types (Toro's draft left out its whites).

## Where
Plan `Review/guide-pipeline-plan.md`; shots `/mnt/project-files/atlaslope/guides-pipeline/castilla-y-leon/shots/`; PDFs
`/mnt/project-files/atlaslope/guides-pipeline/castilla-y-leon/sources/pdf/`.
