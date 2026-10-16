# Release 4 digest: the reference (issue #12)

One page for every card in this release. Agents read this, the lines named here and their own card; never scope, decisions or the brief whole.

## What ships (brief, release 4 row; owner 12:43Z)
Fact sheets for every quizzed place (79: 70 core, 6 Vinos de Calidad, 3 Rioja zones), every row cited, grapes shown "local (main)".
Up to three open-licence photos per place, credited, each in `data/SOURCES.md`. A "Report a mistake" email link. Facts on the place card.
A build check that fails on a row without a source. Grapes join search.

**Done when:** the check is green; the owner has spot-checked two regions (Rioja, and the Canary Islands, written last) and signed them off.

## Decisions that apply (tags from the source)
- Fact sheet rows: main grapes, styles, altitude range, climate, main soil, one why line. Every row cites a public source (official pliegos), never Wine Scholar Guild material (scope) [O].
- Grape names shown "local (main)", e.g. «Tinta de Toro (Tempranillo)»; search finds both names (#37) [O].
- The fact question (release 5) asks only main grapes, styles, level and climate; altitude and soil stay on the sheet (scope) [O]. So grapes, styles and climate must be structured, not only prose.
- Report a mistake: a link on each fact sheet opens a prefilled email (place, row) to an address the owner chooses (scope) [O]. **Address pending (card); build with `strings.facts.reportAddress` set to `""`, and hide the link while it is empty.**
- Photos: up to three per place (landscape, vineyard, village), about 200; gaps allowed; open licence only (PD, CC0, CC BY, CC BY-SA), credited on screen and in `data/SOURCES.md`; Claude picks, the owner can swap; online only (#37, scope) [O]. One resized copy per photo in git, about 1200 px WebP, about 150 KB (#44) [A].
- Writing is all rights reserved (`NOTICE.md`, #45) [O]: sheets are our own English sentences, not translations pasted from the source. Short Spanish terms in quotes are fine.
- The 2 MB budget excludes satellite and photos (#38) [O]; fact data is in the bundle and counts.
- Main grapes where the source does not rank (owner card pending; building on the recommended option): the official document's ranking first ("principal", "preferente", or grapes the document singles out in its own text); otherwise the place's Spanish Wikipedia article, cited by title and revision; otherwise no main grape, allowed grapes only [A until he taps].

## Defaults for gaps (LeadBot, [A]; the owner can reopen)
- **Measured rows come from data, not writers.** `data/place-measures.json` (built by `Tools/data/measure_places.py`) gives altitude percentiles of the land inside each boundary and Köppen shares. The card shows them with their source; writers do not copy them. A written altitude row exists only where the official document states vineyard altitude.
- **Place card order** (reuses the approved guide mock's fact sheet: `Review/mock-atlas-v3/12-guide-rioja.html`, `.facts` with `.src` per row and `.why`; `app.css` lines 72-73, 85-87, 147, 202): why line as the lede; then the rows Level, Main grapes, Other grapes, Styles, Climate, Altitude, Soil, each with its source line; then photos (2-column grid, credit on each); then "Report a mistake"; then the existing Study region, Also within and Zones.
- Places with `quiz: "none"` keep the release 3 card (no sheet).
- Sources dated before 2018 show their date in the source line, so a reader can see the age.

## Files
- Sheets: `content/facts/<study-region-id>.json`, one file per study region, one writer per file. Schema and an example: `Review/release-4-fact-sheet-template.md`.
- Source registry: `content/sources.json` (built by LeadBot from the extract headers and the Wikipedia index): `{ "<sourceId>": { "title", "url", "date", "kind": "official" | "wikipedia" | "measured" } }`. Source ids: `<placeId>-doc`, `<placeId>-wiki`, `measures`, `koppen`, `mapa-list`.
- Extracts: `Review/sources/places/<id>.md` (official) and `Review/sources/wikipedia/<id>.md` (grapes only). Zones use `rioja.md`.
- Photos: candidates `Review/sources/photo-candidates.json`, contact sheets `Review/sources/contact-sheets/<region>.jpg`, picks `Review/sources/photo-picks.json`, shipped `public/photos/<placeId>-<n>.webp` with `data/photos.json` (credit, licence, page URL).

## Cards
| Card | Model | Files | Depends on |
|---|---|---|---|
| `release-4-card-1-facts-ui.md` Fact sheet types, loader and check; facts, measured rows and photos on the place card; report link; grapes in search | Sonnet | `src/facts/`, `src/cards/`, `src/tree/search.ts` (grape entries only), `src/strings.ts`, `tests/` | – |
| `release-4-card-2-write.md` (four runs: A Green Spain + Castilla y León; B Rioja + Navarra and Aragón + Cataluña; C Valencia and Murcia + Meseta + Balearic Islands; D Andalucía + Canary Islands) | Sonnet | `content/facts/<region>.json` for its regions only | template, sources.json |
| Photos: picks from contact sheets (LeadBot), resize and credits in GitHub Actions | – | `Review/sources/photo-picks.json`, `public/photos/`, `data/photos.json` | photo run |

PRs: one for the code (card 1 with the data scripts), one for the sheets, one for the photos. ReviewBot (Sonnet) reviews each once; for the sheets it checks a random sample of rows against the extracts.
