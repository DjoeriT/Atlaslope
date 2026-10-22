# France data prep (22 Oct 2026, issue #149)

Data only, while Portugal builds (plan `Review/countries/france-plan.md`, decisions #52-#58). Nothing here feeds the app yet.

| Piece | Result | File |
|---|---|---|
| Outlines | Chablis (52.8 km2, 17 communes), Pauillac (16.4 km2, 4 communes), and 19 Chablis zones: Premier Cru (9.3 km2) with 10 named climats, Grand Cru (1.07 km2) with its 7 climats; 21 features, 88 KB [V] | `data/countries/fr/areas.geojson`, `areas-spec.json`, `Tools/data/build_fr_areas.py` |
| Rule books | Chablis, Chablis Grand Cru, Petit Chablis, Pauillac cahiers des charges, with page ranges; Médoc, Haut-Médoc, Bordeaux as links | `rulebooks.md` |
| Licences | INAO parcels: Licence Ouverte; INAO texts: etalab-2.0; IGN BD ORTHO: Licence Ouverte, no tile limit; BRGM geology: unclear, email drafted | `licences.md` |
| WSET L3 names | 108 names, 96 matched in the EU register; batches Burgundy 28, Loire 18, Bordeaux 17, Rhône 14, South 10, South-West 6, Beaujolais 6, Champagne 6, Alsace 3 | `wset-l3-names.md` |
| IGN imagery speed | 9 tiles each at zoom 13, 15, 17, 19 over Chablis and Pauillac: median 130-204 ms, worst 858 ms, all 200 [V]; passes [A: no criterion was set for Portugal either] | `ign-speed.json` |
| French text test | `Tools/guides/extract.py` finds no section 1 in French (headings are "I. - Nom de l'appellation"), so it keeps every page, Chapter II (controls) too [V] | below |

## Findings for the pilot
- Only 10 Premier Cru climats have their own INAO outline; the other Premier Cru names fall under the plain "Chablis premier cru" area [V, INAO file]. The guide names them from the cahier (p.1-2).
- `extract.py` needs French markers: start at "I. - Nom de l'appellation", stop at "CHAPITRE II". A pilot change, not done here (shared tool).
- WSET spec on disk is Issue 2 (2022), the current one [V]: its cover still prints "Issue No. 1, August 2016", the copyright page and footers say Issue 2. Checked byte for byte against the qualification page's only spec link (`wset-l3-issue2.md`): no names added, removed or moved.
- Scope: the WSET list holds 108 names, not about 60. At 0.75M a guide [V rate] that is ~80M, not ~45M [A scope]; 6 Burgundy and Beaujolais names and the 5 Champagne sub-zones are not AOCs.
- BRGM licence open: owner sends the drafted email (`licences.md`) before the pilot ships (#57).
- In a worktree, run the builder with `ATLASLOPE_RAW=<main checkout>/data/raw` (raw files live in the main folder).
