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

## Next session: France pilot (owner's go, 22 Oct 2026: "start the France pilot (Chablis, Pauillac, ~6-10M) in a fresh session")
- Start only when Portugal batch 1 (#214) is merged: it finishes Portugal's mainland (#52) and adds the country template the
  `/fr/` pages build on. Check with `gh pr view 214 --json state`.
- Read this file, `Review/countries/france-plan.md`, `Review/countries/france-prep/README.md`, `docs/PROJECT.md` "Run a region locally",
  and #214's handoff for the country template.
- Scope: Chablis (17 climats as zones, #55) and Pauillac (1855 list as text, #56); `/fr/` pages; IGN BD ORTHO with Esri fallback;
  "for information" in the credits (#58); French markers in `Tools/guides/extract.py` (start "I. - Nom de l'appellation", stop "CHAPITRE II").
- Geology waits for BRGM's answer (owner): ship the pilot without the BRGM layer unless he says it came in (#57).
- Budget ~6-10M (engineering ~4-8M [A], guides 2 x 0.75M [V rate]); hard stop at 15M and report with the re-read/new split.
- New screen and copy: rough screenshots to the owner first, ReviewBot before merge, auto-merge only after its report.
- Burgundy (28 names, ~21M) is not part of this go.
