# Italy climate colours (23 Oct 2026, #149)

Branch `claude/italy-climate`, built on France's climate branch (#244, which holds Portugal's #241). The PR opens once both have merged.

## Done
- `Tools/data/koppen_country.sh italy`: Köppen polygons for the box 6.5 36.5 18.6 47.1 from the cached Beck et al. raster (raw, not committed).
- `measure_places.py`: Italy's 87 places, 9 `regions.it-*` and a Köppen-only `country.italy`, like France. No Spanish, Portuguese or
  French value moved (checked key by key).
- The elevation data took 231 more Terrarium tiles, fetched for Italy's places and regions only (scratch script), so France's held-back rows did not change.
- Map: a seventh climate group, Cold (Dfb, Dfc, ET, `#9CC7DA`), owner 23 Oct 2026. Alto Adige, Trentino and the two Valtellinas
  were grey before.
- Owner, 23 Oct 2026: 87 places covering the 78 official DOCGs is the Italy target; "96" is dropped.

## Checked
- Unit 597/597, `map-colours.spec.ts` 3/3, `Tools/check.sh quick` green.
- In the browser (production build): `/it/barolo/` climate chart with Piemonte and All of Italy rows. The map shows Italy in colour and the Alps in Cold.

## Open
- Valtellina's outline takes in whole mountainsides (18% alpine tundra). That reflects the outline, not the vineyards; left as is.
- Dsb and Dsc (also cold) are not in the Cold group, because the owner named Dfb, Dfc and ET. No place has either as its top class today.
- Name check: "Cold" and "Cold semi-arid" share their first word, against the 18 Oct "differ in their first word" rule. The owner chose "Cold".
- Local runs: a worktree needs `.cache/terrarium` filled from the main folder and the agent worktrees. Run `measure_places.py` with
  `/Users/djoeri/Developer/Atlaslope/.venv/bin/python3` (Pillow, Shapely).

## For testers
- Atlas, climate colours: Italy's places are coloured, and the Alps show the new pale-blue "Cold".
- Any Italian guide: the weather section has a climate chart and the altitude section a range, each with its region and All of Italy.
