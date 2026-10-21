# Keeping guides current (issue #157): first principles

Date 21 Oct 2026. One-shot analyst report. Nothing in the repo changed except this file. Tags: [V] verified today, [R] from a repo document, [A] assumed.

## Short answer
The EU register (eAmbrosia) already publishes one JSON list of all 4,021 EU geographical indications. Each entry has a `modificationDate`, an `amendmentsInProgressFlag` and a list of Official Journal publications [V]. One request (7 MB, or 0.5 MB if we keep only Spanish wine) tells us which of our places changed. A free scheduled script can do that weekly and open one GitHub issue. Tokens are only spent on the places that moved.

## 1. What can change, and how often

What changes:
- Pliego amendments. Standard amendments (yields, grapes, bottling rules, wording) and "union" amendments (boundary, name, main grapes).
- A new appellation, a name change, or a removal.
- Boundaries. Pagos and DOs redraw them, and our boundary files come from MAPA/IGN [R: `data/SOURCES.md`].
- Permitted grapes and yields. These sit in the pliego, so they follow its amendments.
- Measured sources: Köppen is a 1991-2020 dataset (Beck 2023) and Terrarium is elevation. Both move rarely, so a check every few years is enough [A].
- Photos and licences: a licence can change or a link can die. Different problem, covered under "not covered" below.

How often, from the register today [V, `/eambrosia-api/api/v1/geographical-indications`]:
- Of the 152 Spanish wine GIs, 85 have at least one Official Journal publication since 2021. 62 had a register change in 2025 or 2026. 11 have an amendment in progress now.
- Official Journal publications for Spanish wine GIs per year: 2019: 24, 2020: 21, 2021: 23, 2022: 28, 2023: 27, 2024: 22, 2025: 39, 2026 so far: 24. That is roughly 25-40 a year across Spain. These count both the application notice and the approval, so the number of real amendments is about half [A].
- Our 98 EU-registered places are all in the register [V].

Sample of 10 (Official Journal items listed in the register, by year):
| Place | Register changed | OJ items | Amendment in progress | Newest source we cite |
|---|---|---|---|---|
| Rioja | 29 Jan 2026 | 2020 x2, 2021, 2022, 2023, 2024, 2026 | yes | pliego dated 7 Jun 2023 |
| Cava | 1 Apr 2026 | 2019, 2021, 2024 x2, 2026 | no | pliego 9 Jan 2026 (has AM14) |
| Ribera del Duero | 31 Jul 2023 | 2020, 2023 | no | pliego 31 Jul 2023 (current) |
| Rueda | 12 Jun 2025 | 2020, 2024, 2025 | no | EU document 29 Oct 2019 |
| Priorat | 25 Aug 2026 | 2019, 2020, 2022 | no | EU document 2014 |
| Jerez | 26 Aug 2026 | 2023, 2025 x2, 2026 | no | pliego 21 May 2026 |
| Navarra | 9 Sep 2026 | 2020, 2022, 2025 | yes | pliego 21 May 2026 |
| Toro | 3 Jan 2025 | 2020, 2021, 2023, 2024 x2, 2025 | no | pliego 11 Dec 2024 (current) |
| Jumilla | 11 Jun 2025 | 2021, 2022 x2, 2023, 2025 x2 | no | EU doc2 11 Jun 2025 (current) |
| La Mancha | 16 Oct 2026 | 2021, 2022, 2023 x2, 2025, 2026 | yes | EU document 2014 |

Reading: a big DO is amended about once a year. A small one every 3-5 years. Some, like Cangas (2018) and Abona (2018), have not moved for years [V].

Our guides against the register [V]: for 78 of our 98 EU-registered places the register's `modificationDate` is later than the newest source date we cite (26 June 2014 for many). Caution: `modificationDate` also changes for a contact address or a producer-group edit, so 78 is an upper bound, not 78 stale guides. In the register 62 of our cited official sources are dated 2014 (the EU single document at registration) [V, `content/sources.json`]. These are the likeliest to differ from the current rules. Rioja is a concrete case: our pliego copy is June 2023, and the register lists a 2024 and a 2026 publication after it [V]. I did not read those texts, so I do not know what changed in them.

Known cases already in the repo [R, `docs/PROJECT.md` lines 105-108]: Getaria/Cangas pliego versions, the Navarra pliego text with no date stamp, and the Ribeira Sacra yield conflict. Those are the version and conflict problems this plan should make visible, not hide.

## 2. How we would notice

What the sources offer [V unless noted]:
| Source | Dates / versions | Usable by script |
|---|---|---|
| eAmbrosia list API | `modificationDate`, OJ publication list, `amendmentsInProgressFlag`, `status`, `removedFlag` | Yes. One GET, JSON, no key. The `fileNumber` filter is ignored, so you get all 4,021 entries and filter locally |
| eAmbrosia attachments | `/attachments/<id>` returns the PDF | Yes (HTTP 202 but the PDF arrives). Hash it |
| Cellar SPARQL | OJ notices by CELEX | Yes, already used in `sources.py`. Notice titles are generic and don't name the place, so use eAmbrosia for "what changed" and Cellar for text |
| BOE open data | Daily summary `/datosabiertos/api/boe/sumario/YYYYMMDD` returns XML (186 KB a day) | Possible, but noisy. Only needed for national orders. Not recommended as a trigger |
| MAPA pliego list | I did not find a stable list URL. A guessed MAPA URL returned 404; PROJECT.md says mapa.gob.es refuses the cloud and loads on the Mac [R] | Not tested. Treat as a manual source |
| Regional bulletins, Consejo Regulador sites | Each different, many undated PDFs (Cangas "undated", Navarra unstamped [R]) | No. Only through the register's publication list |
| RSS | Not found for the register [A: not exhaustively searched] | - |

Options, cheapest first:
- A. Manual yearly check. Owner or LeadBot reads the register web page for each place. Cost: a session, around 100 places by hand. Misses changes for up to a year. Not recommended.
- B. Scheduled script (recommended). Weekly GitHub Action (or local `launchd`) fetches the list, keeps the Spanish wine entries, compares to a committed snapshot `data/register-snapshot.json` (fileNumber, modificationDate, number of OJ items, amendment flag, status). If a place we cover changed, it opens or updates one GitHub issue "Source changes: <date>" with a table. Cost: 0 tokens, about 0.5 MB a week, no keys. The snapshot is a data file and needs a line in `data/SOURCES.md` (existing rule).
- C. B plus text diff. For each changed place, the script downloads the new document or pliego, runs `extract.py`, and diffs the extract against the one the guide was written from. Only the diff goes into the issue. Needs the old extract stored (today they sit in git-ignored `Review/`) [R].
- D. Full re-write on any change. Simple, but expensive and wasteful, because most changes (a contact address, a wording fix) don't touch a guide sentence.

Fit with the repo rules: a GitHub Action that only reads a public API and opens an issue is "networked", but it is not published to outsiders. Under `CLAUDE.md` it still needs the owner's go before it is added. Also, `data/SOURCES.md` allows fetching only sources listed there, so eAmbrosia's list endpoint gets one new line.

Weak spots of B [A]:
- The register date moves on non-content edits, so some issues will be false alarms. The OJ item count rising is the stronger signal, and the diff in C settles it.
- Places not in the register: Vinos de Pago with only a regional pliego, and non-EU or future countries. Those need a per-source URL hash (HEAD request, `Last-Modified`, or content hash). Many Spanish sites don't send a reliable `Last-Modified` [A].
- National registers differ per country (#149). The pattern (snapshot, compare, issue) carries over. The adapter changes per country.

## 3. Cost of a re-check per guide (tokens)

Measured numbers in `docs/PROJECT.md` [R]:
- Writing a guide on the local route: 0.55-0.62M per place measured (Meseta); writers alone about 0.4M per guide; pack about 25K. Ebro all-in about 1.0M per guide, Cataluña about 3.1M [V, per owner measurements].
- A second Opus check finds about 7 misses per guide; it stays in the pipeline.
- Re-check of a region on 19 Oct: 8.5M against 4-6M estimated, because a step was left out [R]. So a whole-region re-check was already seen to overrun.
- The sources step is by script and costs no tokens (`sources.py`).

My split per guide (from these, with the 100K-context rule "calls x ~100K + work") [A, not measured; pilot 2 places before relying on it]:
| Case | What happens | Re-read | New |
|---|---|---|---|
| No guide-relevant change (most register edits) | Script diffs the extract; nothing relevant; log it | 0 | 0 |
| Small change (a yield, a grape, a date) | Fix the affected cites and sentences, rerun `check_guide.py`, one Opus sentence check | about 0.2-0.3M | about 0.05M |
| Real rewrite (boundary, new grape rules, new sub-zones) | Same as the writer route | about 0.55M | about 0.05M |

Per year if Spain's pace holds: about 25-40 OJ items, so roughly 15-20 amendments, of which perhaps a third change guide text [A]. About 6 guides a year, so around 2M tokens a year (mostly re-reads), plus the one-off catch-up below. The weekly script is free.

One-off catch-up: the 62 sources dated 2014, plus places like Rioja behind by two amendments. A diff-only pass over the 98 places costs 0 tokens if scripted. The tokens go only to the places whose diff touches a cited sentence. I cannot estimate that count without the diff run. The pilot gives it.

Page-number cites: every sentence cites `source:pN` [R, `docs/guides.md`]. A new pliego version shifts pages, so a version bump means re-pointing cites even when the content is the same. Storing the extract used lets a script re-map cites by matching text. That would be a separate small tool [A].

## 4. What to show users

- Yes: a line "Checked against the official sources on <date>" on each guide, next to the existing Sources list. It's honest, cheap and says when the last check happened, not that nothing changed.
- Better: per source, show the document's own date, which `content/sources.json` already has (`date`). The Sources list can read "Pliego, 7 Jun 2023". Users then see the age of each source. No new data is needed.
- Do not claim "up to date". Say "checked on" and the pliego version, because the register can lag the source and our check is weekly.
- When the script finds a change not yet reflected, show nothing extra to users. Fix first, then move the date. A "newer version published, guide being updated" banner would need the live site to know, so it conflicts with the static build [A].
- A per-guide `checkedOn` field belongs in the guide format, so `docs/guides.md` and its Format log must change in the same PR (existing rule).

## 5. Recommendation and pilot

Recommendation: option B now, option C as the second step, and show the "checked on" date once the first sweep is done.

Why: it is the cheapest route that is complete for EU-registered places. The register gives a change signal and a link to the text. Tokens go only to guides whose cited passages changed. It also scales to other countries, since every EU country sits in the same register.

Pilot (about 1 small slice, under 300K tokens spend including the session [A]):
1. `Tools/guides/watch_register.py`: fetch list, keep ES wine, write `data/register-snapshot.json` (about 150 entries, 100-300 KB), compare, print a table. Run locally once; no Action yet.
2. Run it on the 98 places. List how many are changed and which. Feed the result to the owner.
3. Take 3 places for the diff step (C): Rioja (two amendments after our copy), La Mancha (our source is the 2014 EU document, amendment in progress) and Priorat (2014 document, register changed Aug 2026). Fetch the new text, diff against the extract, and report how many cited sentences are affected. That measures the per-guide re-check cost with real numbers.
4. Only then decide on the weekly Action and the `checkedOn` field.

Not covered: photo credits and licence changes, link rot of pliego URLs, boundaries from MAPA/IGN (check on the IGN side by a yearly manual look, since the layer is a downloaded file [A]), and Köppen (check once when a new Beck release appears). Say so in the issue so they aren't forgotten.

## 6. Open questions for the owner

1. How fast should we notice a change?
   - a) Weekly script, issue on change (recommended; free)
   - b) Monthly
   - c) Yearly by hand
2. Who acts on an alert?
   - a) Alert only; I decide per place whether to refresh (recommended)
   - b) Alert plus an auto-fix pull request for small changes (later, after the pilot)
3. Show users a date?
   - a) "Checked on <date>" per guide plus each source's own date (recommended)
   - b) Source dates only, no check date
   - c) Nothing
4. Catch-up of the 2014-dated sources (62 of them)?
   - a) Run the diff pilot first, then decide (recommended)
   - b) Refresh all 62 now (cost unknown until diffed)
5. Add a scheduled GitHub Action?
   - a) Local script only for now (recommended)
   - b) Action once the pilot works (needs your go; it is an outside service)
6. Places outside the EU register (Vinos de Pago with only a regional pliego, other countries)?
   - a) Manual list with a yearly look, same snapshot file (recommended)
   - b) Per-URL hash script

## Method and limits
- Fetched only: one eAmbrosia list GET (7 MB), one attachment (Jerez PDF), the eAmbrosia OpenAPI file, one BOE daily summary, one guessed MAPA URL (404), three Cellar-style queries. All hosts are already in `data/SOURCES.md` or are the official registers.
- Not done: I did not read any amended text, so how much each amendment changed is unknown. I did not check regional bulletins. MAPA publishes pliegos, but I found no stable list address.
- Analysis files are in the scratchpad, not the repo.
