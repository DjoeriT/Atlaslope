---
name: new-country
description: Add a wine country to Atlaslope, from report and plan through prep, pilot and waves to full parity with Spain. Use when the owner says "plan <country>", "next country", "prep <country>", "pilot <country>", "run <country> wave", or asks what a country is missing.
---

# Add a country

Distilled from the Portugal, France, Italy and Germany runs (22-23 Oct 2026, issue #149). Sources of truth win over this file:
`docs/scope.md`, `docs/architecture-decisions.md`, `CLAUDE.md`, `docs/PROJECT.md` ("Run a region locally"). Say so when they disagree.
Order and candidates: `Review/countries/priority.md`. Past plans to copy from: `Review/countries/{france,italy,germany,austria,greece}-plan.md`,
Portugal's in `docs/handoffs/2026-10-22-country-model.md` and `-portugal-pilot.md`.

Every phase is its own session and its own PR on a `claude/<cc>-<phase>` branch, in its own worktree. Hand off between phases.
Each phase starts only on the owner's word. Give a token estimate first (rates below), split re-read and new.

## 0. Report (one Sonnet one-shot helper, ~45-110K)
Like `Review/countries/compare.md`: EU register counts (PDO/PGI, `Tools/countries/pull.py --step register`), WSET L3 names
(spec PDF in the raw store, `countries/fr/wset-l3-spec.pdf`), official outlines, imagery, terrain, geology and their licences,
a pilot pair. Tag every claim [V]/[R]/[A]. Germany's report was search summaries only: say "evidence weak" when it is.

## 1. Plan (LeadBot, ~0.2-0.3M, mostly re-read)
`Review/countries/<country>-plan.md` with Context, Phases, Decisions, Upside, Risks, Effort. Decisions go in
`docs/architecture-decisions.md` under the next free number (`grep -n '^- \*\*#' docs/architecture-decisions.md | tail -1`).
Batch them up front, options A/B/C, A recommended. The recurring set:
1. Timing: prep now (data only, beside another country's build); pilot after the running pilot.
2. Scope. Default since Portugal batch 1 (owner, 22 Oct 2026): every wine PDO in the EU register, no PGIs except WSET L3 names,
   zones only where the spec lists them. Big countries go WSET L3 first (France #53, Italy #70), then the rest by region.
3. Pilot pair: two places that test both outline routes or the hardest structure (Barolo official + Chianti municipalities; Mosel + Rheingau across two states).
4. Outlines: official layer where one exists; else the spec's municipality or parish list plus the national limits, "approximate" in the credits (#58, #62).
5. Sub-zones (climats, MGA, Einzellagen, subregions): zones inside the place where an outline exists, else named in the text (#55, #63, #74).
6. Umbrella and cross-border names: named in their region's text, no place of their own; cross-region home parent = most area, "also within" (#42).
7. Private rankings (1855, VDP): text only, no map, no copied lists.
8. Map layers: Esri imagery unless a national one passes a speed test; best open terrain for slope; geology off until its licence is confirmed
   (LeadBot drafts the licence email, the owner sends it: BRGM #57, ISPRA #66).
9. Climate: Köppen as everywhere (`Tools/data/koppen_country.sh`); a national grid only as its own decision.

## 2. Prep slice (data only, ~0.3-0.5M, two Sonnet one-shot helpers at ~0.1M each)
No `src/`, `content/` or guide runs. Results in `Review/countries/<country>-prep/README.md` plus detail files.
- Register and specs: `Tools/countries/pull.py` (extend its `--country` choices). EUR-Lex refuses scripts: Publications Office Cellar.
  A host that refuses scripts (Hessen, BKG) gets a browser try, then the owner.
- Licences read on each dataset's own page, the stricter one taken when two pages disagree (RLP: dl-de/by-2-0 over CC0).
- WSET L3 table: `Tools/countries/<cc>_wset.py` (copy `de_wset.py` / `it_wset.py`): names, matched to EU file numbers.
- Pilot outlines: `Tools/data/build_<cc>_areas.py` + `data/countries/<cc>/areas-spec.json` (copy the nearest of pt/fr/it/de).
  Measure the size of each route (the Mosel table in `germany-prep/README.md`) before choosing.
- Raw files go to `~/Developer/Atlaslope-raw/countries/<cc>/` (`Tools/rawdir.py`) and into `Tools/data/raw-manifest.json` (#229); no symlinks in the repo.
- Language test: run one spec through `Tools/guides/extract.py`. French and Italian needed their own start and stop markers and
  per-article caps (Italy: article 3 after 60 lines, others after 150, annexes after 40). Without them a 146 KB extract blew a run.

## 3. Pilot (one session; guides ~1.9M, engineering ~5-8M; hard stop 1.5x)
Lesson from Portugal (18.9M against 3-4M): count calls x ~140K context before starting, hand off after tooling and before guides.
Touch list (the Germany pilot, PR #245, is the template):
- `src/countries.ts` (code, bounds, imagery, `paths: true`), `src/home/countryPages.ts` (intro draft, card photos, photo blocks, study note),
  `src/map/createMap.ts` (credit line), `Tools/data/build_places.py` (country, `wset-<cc>` course, groups, places), `Tools/data/build_masks.py` (mask).
- `data/countries/<cc>/areas.geojson` (+ zones files), `data/added-boundaries.geojson`, `data/SOURCES.md`, `content/sources.json`.
- First load limit 2.1 MB (#38, `Tools/check.sh`): new outlines and zones load on demand (boundary "<cc>-areas"), never in the first load.
- Guides on the local route: `Tools/guides/headless.py --sheets` fills `content/facts/<cc>-<group>.json`, then writer and Opus checker;
  copy `Tools/countries/it_batch.py` as `<cc>_batch.py`. Spot-check 5 facts per sheet against the spec.
- Photos: Commons first (`Tools/data/photo_candidates.py <cc>`), Openverse for thin places (`Tools/data/openverse_candidates.py`;
  Flickr needs a User-Agent without "Bot"), owner picks, `Tools/data/photo_ship.py` (add `<CC>_SHIP`), square crops checked against
  the original (`Tools/guides/crop_sheet.mjs`, `src/home/photoCrops.json`), one credit line per set.
- Measures and climate colours: `Tools/data/koppen_country.sh <country>`, then `Tools/data/measure_places.py` (altitude, slope, Köppen)
  for places, regions and the country (#241 Portugal, #244 France). Prove the other countries' values unchanged, key by key.
- Shared records take lines, not edits (owner, 23 Oct 2026, PR #249): `data/SOURCES.md` gets one row per country for shared layers
  ("Köppen for <Country> (raw ...)", "`place-measures.json`: <Country> rows", `countries/<cc>/mask.json`); `docs/PROJECT.md` "Current state"
  one bullet per slice; the handoff index and spend log merge by union.
- Tile lines for places, groups and the country (`content/tiles.json`): drafts, the owner rewrites.
- Tests that pin counts (`tests/unit/{places,tree,guides,country-pages,map,data-layers,facts-measures}.test.ts`).
- Gates: rough screenshots to the owner first; ReviewBot (new screen and copy); auto-merge only after its report; release only on "publish release N".

## 4. Waves (one region per session, each on the owner's word)
Budget per guide from the last measured batch (`Tools/guides/usage.py` on the run dir), with the batch script's guard stopping at 1.5x.
Log tokens per batch in the handoff table (Italy's first-wave table is the format). Photos ride with each wave, not after it.

## 5. Parity with Spain (every PR from the pilot on, and before calling a country done)
Run `python3 Tools/countries/parity.py <country>`: one table, Spain as the yardstick, a "gaps" line per country. Every gap is either
fixed in the slice or listed in the handoff with where it will be done. It covers the data; the screens are checked below.
What Spain has and a new country must match (or carry a written reason):
- **Home**: the country card with its mosaic and counts line; the numbers equal `parity.py`'s places and guides
  (`tests/unit/home.test.ts`, `tests/ui/home.spec.ts`). The Atlas cover (`COVER_COUNTRIES` in `src/cards/atlasCover.ts`) lists it.
- **Country page** `/<cc>/`: intro, photo blocks (Spain has one, Germany none yet), map tours row, study note (`tests/unit/country-pages.test.ts`).
- **Guides page**: the country section, each place with a square photo and a satellite view (test since release 44), course labels.
- **Place page** `/<cc>/<id>/`: crumb line, guide with Terroir, fact sheet with altitude, slope and climate rows, photo strip and credit line,
  "All of <country>" comparison row (`tests/ui/place-page.spec.ts`, `tests/ui/facts.spec.ts`).
- **Atlas**: outline drawn and clickable, zones, map bounds, close-in imagery, climate colouring (`tests/ui/map-colours.spec.ts`,
  `tests/unit/climate.test.ts`), map flags (Spain 11 sets), map tours and fly stops under the #148 rule, search hits that open `/<cc>/`,
  mobile layout (`tests/ui/mobile.spec.ts`).
- **Learn/Study**: Spain only today; a country joins when its course is built (a written note in `quizNote` until then).
Screens: `npm run shots` in a Sonnet helper for home, country, guides and two place pages, phone and desktop, into
`Review/countries/<country>-pilot/shots/`. The helper reports in 10-20 lines.

## Measured rates (re-run before relying on them)
| What | Tokens | Source |
|---|---|---|
| Guide, Portugal | 0.75M | [V] batch 1, 26 places |
| Guide, Italy | 0.97M, 84% re-read | [V] first wave, 87 places |
| Guide, Germany pilot | 0.73-0.90M | [V] PR #245 |
| Country model slice (once) | 7.9M re-read + 0.16M new | [V] country-model handoff |
| Pilot with new tooling | 18.9M re-read (Portugal) | [V], now ~5-8M with the template |
| Prep helper | 0.09-0.12M each | [V] France, Italy, Germany prep |
