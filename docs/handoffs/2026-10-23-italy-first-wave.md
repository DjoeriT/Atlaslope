# Italy first wave: 87 guides with photos (issue #149, 22-23 Oct 2026)

## Asked
- Goal: build the Italy guides after the France session; first the 30 WSET places, then (owner, by goal change) every DOCG ("the 96 DOCGs").
  Photos are part of the guides. "Keep going tonight, I'm going to sleep."

## Done
- PR #231 (Italy pilot): Barolo and Chianti Classico at /it/, Italy wired as the fourth country, ReviewBot fixes and report.
  Not merged: `check` fails the 2 MB download check (see Open).
- Branch `claude/italy-batches` (stacked on #231): all 87 first-wave guides (MASAF rulebooks via `headless.py --sheets`), outlines
  on the map, tile lines, 147 more photos for 54 places (53 places have photos, 34 have none), tests at the first-wave numbers.
- Tools:
  - `Tools/countries/it_wset.py`: sources and empty sheets. It trims rulebook extracts: article 3 after 60 lines, any other article
    after 150, annexes after 40. Page markers are kept.
  - `Tools/countries/it_batch.py <group> <run>`: one batch per group, budget 1.0M a guide.
  - `data/countries/it/places.json`: the 87 places with their class and group.
  - `photo_candidates.py it`.
  - `IT_SHIP` follows the written guides.
- PR #233 (merged): Italy raw files in `Tools/data/raw-manifest.json`.

## Numbers [V, usage.py per run dir]
| Batch | Guides | Tokens |
|---|---|---|
| Pilot | 2 | 1.94M |
| Piemonte | 19 | 17.57M |
| Chianti | 1 | 1.72M |
| Tuscany | 10 | 8.80M |
| Veneto | 13 | 12.17M |
| Alto Adige | 1 | 2.09M |
| North-East | 7 | 6.06M |
| Franciacorta | 1 | 1.28M |
| Lombardia | 4 | 3.32M |
| Emilia-Romagna | 2 | 1.88M |
| Centre | 14 | 14.43M |
| South | 10 | 9.96M |
| Islands | 3 | 3.01M |
| **Total** | **87** | **84.2M** |

- About 0.97M a guide, about 84% re-read.
- Helpers (outlines, photos, tiles, fact lines, reviews) used about 1M.
- Three guard stops, each reported and fixed in the pipeline:
  - Chianti: a 146 KB extract. Fix: trim article 3 and annexes.
  - Alto Adige: article 6 tasting notes. Fix: cap any article at 150 lines.
  - Franciacorta: 1.28M against Portugal's 0.8M budget. Fix: Italy's measured 1.0M budget.

## Open (owner)
- **Size, A or B:**
  - Main is at 1,995,742 of 2,000,000 bytes.
  - Option A is France's draft PR #235: outlines load per country, and place pages leave the count. It gives France's 94 places
    1,957,478.
  - Italy's 87 places still add about 1 KB each to atlas.js. With A, the next step is per-country place rows.
  - Nothing merges until he picks A or B.
- **Count:** 87, not 96. MASAF's rulebooks give 78 DOCGs [V], and 21 sit inside the 30 WSET places.
- **Photos:** 34 places have no usable Commons photo. Another licensed source needs a licence check first.
- **Copy for the owner:** the /it/ intro and the tile lines are drafts; the footer still says "Spain and Portugal".
- **Approximate outlines:** Frascati (Rome taken whole), Colli Bolognesi Pignoletto x2.1, Conero x1.6, Asolo Prosecco x0.41.
- **Not done:** Köppen for Italy (the raster is not on this Mac); the Italy guides are not in Learn.
