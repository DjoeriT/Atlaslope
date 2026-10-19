# Handoff: Andalucía guides and the fixed workflow (19 Oct 2026)

Thread "What's next" (fill the remaining Spain guides). Release slot 39 (coordinator). Preview https://claude.ai/artifact/MqhTKSafTXPJeePtVFbK3P

## Done
- `Tools/guides/region.workflow.js`: one fixed workflow per region (owner card "Workflow", 19 Oct 06:52Z). Writes, machine-checks and
  sentence-checks every place, then one Opus run applies the fact sheet disagreements. `recheck: true` reruns only the check.
- Andalucía: 8 current pliegos from the Junta (`Review/guides-pipeline/andalucia/sources-index.md`), 8 guides, two Opus checks each
  (first: 334 kept, 131 fixed, 2 cut; second, stricter brief: 484 kept, 86 fixed, 2 cut). 74 fact sheet fields corrected
  (`Review/guides-pipeline/andalucia/fact-sheet-fixes.md`).
- Hand sample: Lebrija by the thread, clean; Jerez and Granada by a fresh Opus helper, 11 misses
  (`Review/guides-pipeline/andalucia/sample-check.md`). Per plan step 6 the misses went into `CHECKER.md` (titles, missing wine
  types, "other law" terms defined elsewhere, sheet styles) and all 8 were checked again.
- Few-step helpers for the next region (owner 09:41Z "let's implement the way less steps"): `Tools/guides/pack.py` prints one
  ~10K-token pack per helper (brief, rules, guide, pliego pages, fact sheet, OSM points); the workflow prompts now read once, write
  once. Not yet measured. `Tools/guides/usage.py` reads tokens per helper from the workflow transcripts.
- CLAUDE.md Pace: 80K handoff, two working threads, batch work from a script (owner OK 09:41Z).

## Measured (tokens, from each helper's usage log; owner wants tokens, not dollars)
| Step | Re-read | New (input + output) |
|---|---|---|
| Sources, 8 pliegos (Sonnet) | 3.1M | 0.13M |
| Write, 8 (Sonnet) | 6.1M | 0.52M |
| Check 1, 8 (Opus) | 10.0M | 0.61M |
| Check 2, 8 (Opus) | 11.1M | 0.66M |
| Fact sheets, 2 runs (Opus) | 9.0M | 0.36M |
| Hand sample, 2 guides (Opus) | 2.0M | 0.28M |
| Thread | about 20M | about 0.5M |
About 95% is re-reading. Session cost_usd at the time of the PR is in the PR body.

## Decided (defaults)
- Málaga: the 2011 Junta text (still listed as current); Montilla-Moriles and Lebrija: the files the Junta lists, not stamped consolidated.
- styles.kinds left unchanged for unfortified generosos (no kind tag fits; text says fortified or not).
- Sierras de Málaga main grape emptied (pliego singles none out).

## Open
- Cataluña waits for the coordinator's go (owner at a weekly usage warning). Sources are fetched and parked in
  `/mnt/project-files/atlaslope/guides-pipeline/cataluna/` (README there: Empordà version, five texts with EU approval pending,
  port the extract.py STOP fix). Run it with the few-step workflow and report tokens before/after against the table above.
- Remaining after Cataluña: Ebro 11, Mediterranean 11, Baleares 2, Canarias 11, Meseta 25.
- Photos for Lebrija/Granada heroes not reviewed (out of scope); phone "Show map" button overlaps text (existing).
