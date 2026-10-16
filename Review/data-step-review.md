# Review of PR #17 (data step), ReviewBot, 16 Oct 2026

**Verdict: merge after fixes.** Blockers 0, should fix 3, notes 7.
I could not run vitest (no npm registry). I re-checked the test claims against the data with python3 one-offs. The PR body was not available, so its counts are checked from the data only.

## Confirmed [V] (ran)
- places.json against the ministry list: 106 DOPs in the list and in the tree, with the same EU file numbers and the same kinds (70 DO, 2 DOCa, 7 VC, 27 VP). No duplicate EU files or ids. Plus 3 Rioja zones = 109 places.
- Quiz pool matches the SOURCES.md rule: core 69, vc 6 (Islas Canarias excluded), VP all none; Cava, Catalunya and Urbezo are none; zones are `zone`. Courses 1..106 have no gaps, group order and north-to-south order have 0 inversions.
- Boundaries: all 90 `mapa-2014` layerCodes exist in dops.geojson, 1:1. 14 `to-fetch` = 13 VP + Urbezo, none quizzed. The photo candidates cover exactly the 78 quizzed places and zones. There are 75 extracts for 75 quizzed places (69 + 6; Rioja zones share one).
- Cebreros 1660.93 km² against the pliego's 1663.16 (0.13%); municipality counts 16 and 35 match the lists and the matched report. The 2% test tolerance is not tuned to the result.
- Loop safety: the workflows use path filters, and commits pushed with GITHUB_TOKEN do not trigger workflows. Concurrency groups are per ref. Only `contents: write` is granted, and there are no secrets.
- Köppen legend (30 classes) matches Beck et al.; the codes in the file are plausible.

## Should fix
1. **photo_candidates workflow can lose all work on failure.** The script raises after 8 throttled retries (HTTP 429), or on any other HTTP error. The commit step then does not run, so the partial `photo-candidates.json` is discarded. Add `if: always()` to the commit step, or catch the error per place and continue. The workflow comment says Commons throttles hard, so this will happen.
2. **Wrong comment, and Ceuta/Melilla in the climate data.** `remote_build.sh` says "Ceuta and Melilla dropped by the boxes". The main box is lat 35.0 to 44.5, which includes both. koppen-spain.geojson holds Csa at -5.325, 35.875 (Ceuta) and BSh at -2.933, 35.267 (Melilla). They are Spanish territory, so keeping them is arguably right, but the comment and the SOURCES row ("Spain only") should say so. They are labelled box `main`. Decide that, then fix the comment or the data.
3. **Two extracts say "dated 0001".** campo-de-calatrava.md and cebreros.md come from the pliego path in `cut_extracts.py`, which has no date. Writers will see a bogus date. Use the pliego date or write "undated".

## Notes
- The SOURCES.md `places.json` row says 60 KB; the file is 44.6 KB (44,573 bytes).
- The header of `remote_build.sh` names data-fetch.yml; it should be data-build.yml. In `photo_candidates.py` the docstring has a stray parenthesis.
- Two Köppen features are GeometryCollection (the rest are Polygon or MultiPolygon). MapLibre copes, but a later consumer may not. Consider `-nlt MULTIPOLYGON` or extract the polygons.
- The test "ids never contain the parent" checks `startsWith(parent + '/')` and ids never contain a slash, so it cannot fail. Check `startsWith(parent + '-')` or drop the claim.
- Workflow commit steps interpolate `${{ github.ref_name }}` into the shell. A branch name can contain `$(...)` or backticks, so this is injectable in principle. It needs write access, which already allows editing the workflow, so the risk is low. Passing it through `env:` is cleaner. `remote_fetch.py` also joins list names onto the output directory with no `..` check (same push-access precondition).
- The history has about 12 bot merge commits from `git pull --no-rebase` and 8 MB of fetched EU text (about 400 files) under Review/sources/fetched. Squash-merge the PR. These files are outside `data/`, so the SOURCES.md rule does not apply; the manifest has the provenance.
- Photo candidates: campo-de-calatrava has 0 candidates; two other places have 2 and 5. Keyword matches can be false hits (the top Granada hit is "Puerta del Vino", Alhambra). The picks go to a human in release 4, so this is only worth a mention.
- Natural Earth mainland box also holds Morocco, France and Portugal land. That is intended for a base map.

## Not checked
- The PR body's figures (no network).
- The CI run results.
- vitest itself.
- Only 5 of the extracts were sampled, and only by reading.
