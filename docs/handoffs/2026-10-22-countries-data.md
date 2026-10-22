# Countries data layer: Portugal, France, Italy (issue #149, 22 Oct 2026)

## Done
- Owner chose option B (22 Oct 2026): data layer for Portugal, France and Italy now; then the country-model slice; then the Douro and
  Vinho Verde pilot guides. This PR is step 1 only.
- `Tools/countries/pull.py`: one script, no tokens. Steps `register`, `docs`, `outlines`; one status line per step; failures listed, not retried.
- Committed: `data/countries/<pt|fr|it>/register.json` (EU register wine entries, facts only) and `manifest.json` (every raw file: url,
  bytes, sha256, date). Raw files in `data/raw/countries/` (git-ignored); rebuild with `python3 Tools/countries/pull.py`.
- Sources and licences in `data/SOURCES.md` (main table row and "Raw downloads"). Licences checked 22 Oct 2026 [V]: eAmbrosia CC BY 4.0
  (Commission notice, as for Spain); INAO Licence Ouverte; DGT CAOP CC BY 4.0 (Centro de Dados page; OGC API copy same [A]); ISTAT CC BY 4.0;
  Regione Piemonte CC BY 4.0.
- Results of the full run: see "Numbers" below.

## Numbers
Pull of 22 Oct 2026 [V], 0 failures, about 30 min, no tokens: Portugal 44 names, 40 documents; France 442 names, 421 documents;
Italy 522 names, 514 documents; raw 556 MB. Coverage (have, missing, extra effort per country): `Review/countries/coverage.md`.
Session spend to this PR [V, transcript]: 10.1M re-read + 0.3M new, against an estimate of 3-6M: over the 1.5x stop. Why: ~70 calls at
~140K context each (this session's base context is larger than the ~100K the rules assume). Fix in `docs/PROJECT.md` "Cost lessons".

## Not done (where it goes)
- National specifications (cahier des charges, disciplinare, caderno de especificações): only the EU single documents are pulled. The
  pilot fetches Douro and Vinho Verde's own texts (IVDP, CVRVV); France and Italy wait for their own pilots.
- Older names carry a 2011-2012 "technical file" as their sheet; later amendments sit in `publications` (Official Journal items). A guide
  must read the newest amendment too, as Spain's pipeline does (`Tools/guides/sources.py`, Cellar SPARQL).
- Area outlines: France has INAO parcels (official). Portugal and most of Italy have none: build them from the parish or municipality
  lists in each spec, as for Rioja zones. Piemonte has official DOC/DOCG areas. Nothing is simplified or shown in the app yet.
- Islands (Madeira, Açores) not fetched; terrain (Copernicus GLO-30, TINITALY), imagery (DGT OrtoSat, IGN France), climate and geology not
  fetched; geology licences unclear in all three (country reports).

## Next session: country-model slice, then the Portugal pilot (fresh session, start here)
Read: this file; `Review/portugal/report-first-principles.md` sections 4 and 5 (app changes and pilot plan); `docs/architecture-decisions.md`
#6, #41, #42; `docs/PROJECT.md` "Run a region locally".
1. Decisions to ask the owner in one batch first (recommended first; from the Portugal report, section 6):
   - URL: `/pt/douro` with a country choice on home (recommended) or one flat list with a country filter.
   - Course filter for Portugal: WSET only (recommended; Wine Scholar Guild has no Portugal course).
   - Imagery: DGT OrtoSat 30 cm with Esri fallback after a speed test (recommended), or Esri only.
   - Port and Madeira as their own places with the overlap rule (#42) (recommended).
   - Home and Guides page copy for a second country: the owner rewrites it himself.
2. Country-model slice (no new content): country on every place, data paths per country (`data/es/...` or keep Spain flat and add
   `data/countries/pt/`), course lists keyed by country, Portugal mask and bounds, per-country imagery and terrain config, per-country
   size limit in `Tools/check.sh`. Estimate 4-8M tokens [A, no measured figure; report's breakdown 4.0M re-read + 0.4M new].
3. Pilot guides, Douro and Vinho Verde, on the local route: pack, headless writer, machine check, per-sentence Opus check. Estimate
   ~1.2M for both at the Meseta rate of 0.6M a guide [V], plus ~20 percent for Portuguese sources [A]. Measure with
   `python3 Tools/guides/usage.py --budget`; hard stop at 1.5x.
4. Total for B after this PR: ~6-10M [A]. Under 20M, covered by the owner's go on B.

## Open questions
- Full France (445 names) and Italy (532 names) guide runs: ~270M and ~320M at 0.6M a guide [V rate, A scope]; the WSET L3 list alone is
  ~60 and ~40 places. Each needs the owner's word.
