# ReviewBot: Germany wave 1 (#149), branch claude/germany-wave1

Verdict: merge after fixes. Blockers 0, should-fix 4, nits 4. Read-only review; ran greps against `Review/sources/fetched/spec-<id>.txt`; no Commons pages opened (no licence looked doubtful).

## Blockers
None.

## Should fix
1. `data/SOURCES.md:122` contradicts itself on Rheinhessen. It says the `gu` layer has "no Ahr, Rheinhessen or Rheingau" and that Ahr and Rheinhessen are "not in `gu`", then that the LWK page says the layer "also holds g.U. Rheinhessen since 28 Nov 2025". Both cannot stand. Fix: re-check the layer; either drop the "also holds" sentence or say plainly that the Rheinhessen outline is from `weinlagen_recht` by choice, and correct the 492-feature note if it changed.
2. Hessen ALKIS claim (`SOURCES.md:122`): it is stated clearly ("open by law, no conditions, § 18 HVGG, quoted in the service capabilities"; credit "© HVBG (2026), Daten bearbeitet"). I could not match it to the capabilities text: no capabilities file is in the repo, and the quote is not reproduced (only the section number, also in `Tools/data/raw-manifest.json:410`). Fix: paste the one quoted capabilities sentence into the row, or store the capabilities XML under `Review/sources/fetched/`. The LWK credit line is stated (dl-de/by-2-0 plus "Daten bearbeitet") with its page; not re-fetched [inferred].
3. Style, "X, Y and Z" lists (CLAUDE.md copy rule). `nahe.json:72` (sandstone, shale and quartzite), `nahe.json:90`, `mittelrhein.json:107`, `pfalz.json:105` (white, red and rosé), `pfalz.json:6` (whites, reds and rosés), `pfalz.json:107` (six Prädikat names in a row), `pfalz.json:109` (seven grapes), `rheinhessen.json:87` (five grapes listed over four sentences). Fix: split into one idea per line, or say "three still-wine colours" and name them on separate lines.
4. Exam-centric density in the last chapter of each guide: `nahe.json:92` (a run of Öchsle minima: 73, 78, 85, 120, 150, 120), `pfalz.json:107` (minima for Kabinett, Spätlese, Eiswein), `ahr.json` "reds" chapter (must weights and bar pressures). The "why it tastes the way it does" spine is clear up to the soil chapters, then turns into label rules. The numbers are correct against the specs; move them into the `label` terms (already there) and keep one line of taste per level in the chapter.

## Nits
1. `content/tiles.json:518` "Riesling in the Rhine gorge": the spec says "narrow V-shaped valley"; "gorge" is not in the spec or in the fact sheet's `why` row ("narrow Rhine valley"). Use "narrow Rhine valley".
2. `nahe.json:6` and `rheinhessen.json:6` lede: "terroirs" is used as a common noun. The card allows "Terroir" only as a section name. Suggest "differences between its soils and sites" (the spec says the same thing in German).
3. `content/tiles.json` pfalz region: "The plains below are almost flat". The spec says ridges and plains are mostly under 10% (average 4.5%). Say "mostly under 10%".
4. Alt text, `data/photos.json` `ahr-3`: "slate crags" names a rock type from the file title, not from the image (the photo shows a rock outcrop). Use "rock outcrops". `mittelrhein-4` ("tall vineyard tower") matches the image.

## Check 1: guides, three or more claims per guide against the specs (all supported)
- ahr: 18 km river stretch, 69% over 30%, Lohrsdorfer Kopf and Landskrone (spec lines 245-252); 9.8 °C, 650 mm, 1450 h (266-267); 15.3 and 21.5% Eiswein/TBA (198-200); 9-month bottle fermentation (314); seven municipalities: spec lines 144/558 list the Gemeinden but I did not count them [inferred]; "high minerality" at 280.
- mittelrhein: 12.16% Kabinett cap (33); 105 hl/ha (283); 55-350 m and 168° (321-325); 615,000 Wh/m2 (348); Spätlese not before 1 March (491); acidity and mineral notes tell rocks apart (88-89); "2026" at 503.
- nahe: 63% of area (643); 85% rule (595); 210 m and 12.5% slope (486-489); 9.3 and 13.8 °C, 580 mm (501-503); Weißherbst always single grape (131); Kabinett 9.5/73, Riesling Spätlese 10.3/78, Auslese 11.4/85 (40-49); BA/Eiswein 120° Öchsle, TBA 150° (55-61). Note: Auslese says "85° Öchsle" in the guide and the spec says 11.4% vol and 85°: correct.
- rheinhessen: 9.9/14.6 °C, 550 mm, 65% (355 mm) (317-324); 650,000 Wh/m2 (326); 175 m (296); 250-300 m plateaus and about 7% slope (292-294); Nierstein and Bingen steep (295); five single-vineyard grapes (448).
- pfalz: 170 m (335); 60% slopes and 4.5% average, 140° (337-341); 655 mm, 60% (390 mm), 665,000 Wh/m2 (369-373); Spätlese 11.4/12.2, Eiswein 16.9 (48-62); rosé "less alcohol, stronger acid perception" (111); Muschelkalk/Keuper/Jura "almost exotic" (353).
- No claim found that a spec does not support. No "Terroir guide" anywhere. Titles are "Why X tastes the way it does"-style; not exam-centric in framing, only in density (should-fix 4).

## Check 2: tile lines
All five region and five place lines are supported by their cited spec pages and the fact sheets' `why` rows, apart from nits 1 and 3. Ahr "mostly reds" (spec: mostly red wine); Mittelrhein "110 km" and "faces south" (average aspect 168°); Nahe "warm days, cool nights"; Rheinhessen 175 m and 550 mm; Pfalz 60% in the west.

## Check 3: photos (16 entries, ahr/mittelrhein/nahe/rheinhessen/pfalz -1 to -4)
- Licences: CC BY (3), CC BY-SA 3.0/3.0 de/4.0 (12), CC0 (1, rheinhessen-2). All allowed; licence URLs present; artist named on every entry; Commons page URL present. No NC or ND.
- Alt text describes the image, apart from nit 4. pfalz-1 and pfalz-3 are both St Martin; fine, different views.
- Not checked: whether the credit line is visible in the UI (cards render it from this file; CI covers it).

## Check 4: SOURCES.md Germany rows
Rows 122, 123, 189 read. Hessen licence and the LWK credit are stated; see should-fix 1 and 2.

## LeadBot follow-up (23 Oct 2026)
All 4 should-fix and 4 nits done: SOURCES row re-checked against the live `gu` layer (no Rheinhessen in it) and the HVGG sentence quoted with the capabilities kept raw; lists split; Prädikat minima cut from the closing chapters (Nahe, Pfalz, Ahr); "terroirs" replaced; tile nits and the ahr-3 alt text fixed. Guides re-checked with `check_guide.py` (0 errors, 0 warnings).
