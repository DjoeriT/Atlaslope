# France data prep (22 Oct 2026, issue #149)

## Done
- Data-only prep on `claude/france-prep`, while Portugal builds: summary `Review/countries/france-prep/README.md`.
- Outlines for Chablis (with its Premier and Grand Cru climats as zones, #55) and Pauillac from the INAO file; rule books found and
  downloaded to `data/raw/countries/fr/cdc/`; licences read; WSET L3 France name table; IGN imagery speed test; French extractor test.
- Helpers: two Sonnet one-shots (rule books and licences ~123K; name table ~85K) [V, task usage].

## Not touched (until Portugal's mainland and #205, #52)
`src/`, `content/curriculum.json`, `Tools/data/build_places.py`, `Tools/guides/*`, `Tools/check.sh` limits, `/fr/` pages, guide runs.

## Open
- Owner: send the BRGM email in `Review/countries/france-prep/licences.md` (#57).
- Owner: France scope is 108 WSET names, not ~60 (~80M at 0.75M a guide): keep the whole list, or trim (decision #53).
- Pilot slice: French markers in `extract.py`; IGN layer and BRGM layer in the app; `/fr/` pages; Chablis and Pauillac guide runs.
- WSET spec Issue 2 (May 2022) not on disk; the fetched file is Issue 1 (2016).

## Next session: France pilot (only after Portugal's mainland and #205)
Read this file, `Review/countries/france-plan.md`, `Review/countries/france-prep/README.md`, `docs/PROJECT.md` "Run a region locally".
