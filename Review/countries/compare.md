# Next country: four reports side by side (21 Oct 2026)

Reports: `Review/portugal/report-first-principles.md`, `Review/countries/france.md`, `italy.md`, `germany.md` (AnalystBot-style
one-shot helpers, ~45-110K tokens each). Tags as in the reports; LeadBot did not re-check the sources.

| | Portugal | France | Italy | Germany |
|---|---|---|---|---|
| EU wine names (PDO/PGI) [V eAmbrosia] | 30 / 14 | 366 / 74 | 411 / 111 | 19 / 27 |
| Spain for scale | 106 / 43 | | | |
| Official area outlines | none; municipality lists | INAO, parcel level, open [V] | Piemonte only; else municipality lists | Rheinland-Pfalz single vineyards [R]; no national set |
| Imagery | DGT 30 cm, open [R] | IGN, open, no key [V] | Esri only | per state (Hessen open) [R] |
| Terrain | Copernicus 30 m | not reported | TINITALY 10 m [V] | state 1 m [R] |
| Geology licence | unclear | unclear (ask BRGM) | patchy, unclear | not reported |
| WSET L3 names | ~7 + Port | ~60 | ~40 | not counted |
| Wine Scholar course | none | French Wine Scholar | Italian Wine Scholar | yes [R, Portugal report] |
| Pilot pair | Douro + Vinho Verde | Chablis + Pauillac | Barolo + Chianti Classico | Mosel + Rheingau |
| Evidence | good | good | good | weak (search summaries) |

## One cost basis (LeadBot)
The reports used different bases (Germany ~3M a guide from whole-region runs; France left out the country setup).
Common basis: Ebro, measured ~1.0M a guide, mostly re-read; plus a one-time country-model slice (country field, per-country
data, course lists per country, imagery rule, country in URLs) of ~4-8M [A, no measured figure]. Only the first new country pays it in full.

| | Pilot (setup + 2 guides) | WSET L3 scope at ~1M a guide |
|---|---|---|
| Portugal | ~6-10M | ~8M |
| France | ~6-10M (+ nesting work) | ~60M |
| Italy | ~6-10M (+ regions level) | ~40M |
| Germany | ~6-10M (+ per-state sources) | ~13M (13 regions) |

All four reports, and LeadBot: Portugal first (smallest, good sources, tests the country model cheaply); then France (best
open data, biggest course list); Italy third; Germany after a licence check.
