# ReviewBot copy check, PR #109 (head 7f69564)

**Verdict: merge after fixes.** 0 blocking, 11 small, 3 notes. Scope: copy only. Facts were not re-verified; no cites were spot-checked
(only two spellings were checked against pliegos). No exam framing, no "guide" for Terroir, no "the pliego says" lines, no hype beyond two words (F1).
Photo credits: all 22 photos of the nine places have artist, licence, licence URL and page (ran, script).

## Small findings
1. content/guides/monterrei.json, lede: "The climate and soils give the local grapes optimal conditions." Hype and empty. Fix: cut it, or say what the swing does ("Big swings slow ripening and keep the freshness", already in the facts sheet).
2. content/guides/valdeorras.json, weather: "The climate is ideal for first-quality dry wines, best above 450 m." "Ideal" is hype. Fix: "Dry wines of the first quality come from sites above 450 m."
3. content/guides/txakoli-bizkaia.json, label term "Fermentado en Barrica": "A Berezia that fermented ..." Berezia is never explained on the page, so the term points elsewhere. Fix: "A Berezia (a txakoli aged for at least 5 months) that was fermented in wooden barrels of up to 600 litres." Same for facts sheets 0 and 3 in content/facts/green-spain.json (they use "Berezia" bare).
4. content/guides/ribeira-sacra.json, term "Rosado": "... so it is always Súmmum." Súmmum is not explained anywhere. Fix: say what it is in the same sentence or drop the clause.
5. content/guides/txakoli-alava.json, rules: "The wines are round and low in acidity." The lede says "characteristic acidity", ground says acidity is a trait, and the next line gives 9 to 12 g/l total acidity. The page contradicts itself (the facts sheet 3 "round txakoli" repeats it). Fix: check the pliego line; if it says low, say "gentle" and drop "characteristic acidity" in the lede.
6. content/guides/txakoli-alava.json, title of chapter "rules": "Hondarribi Zuri against mildew" but the text says "Hondarrabi Zuri". Both occur in the pliego; one page should use one. Fix: "Hondarrabi Zuri". Also Getaria uses "Ondarrabi" (matches its pliego, ran); add nothing, but keep in mind a reader sees three spellings.
7. content/guides/ribeira-sacra.json fly "Canón do Sil" vs content/flags.json set 7 name "Cañón del Sil". Same place, Galician in one, Spanish in the other. Fix: "Canón do Sil" in both (the guides use Galician for other Galician names).
8. content/flags.json set 10 "Vilardevós": "Monterrei slope subzone", while content/guides/monterrei.json says "Monterrei hillside". Fix: one word for the subzone (the pliego's own term).
9. content/guides ledes: guide format asks for a two-sentence lede. Three sentences in cangas, rias-baixas, ribeira-sacra, ribeiro and monterrei. Fix: trim to two or change docs/guides.md.
10. content/guides/rias-baixas.json lede and txakoli-bizkaia.json lede: "Mild, wet Atlantic weather and poor granite soils." is a fragment; "an Atlantic, humid, temperate climate" is an adjective list. Fix: "Bizkaia has a humid Atlantic climate with cool summers and little sun."
11. content/guides/ribeira-sacra.json fly "Canón do Sil": "run to their meeting through steep gorges" reads oddly; same in the Portomarín / A Peroxa flags in flags.json set 7 ("The area runs from here to A Peroxa" and the mirror line), which only point at each other. Fix: merge into one flag or give each its own fact. Also valdeorras weather "Minimum temperatures reach 8 °C and maximum 33 °C" is unclear (a minimum of 8 °C?); say "Highs reach 33 °C and the mean is 11 °C" if the source allows.

## Notes
- N1. content/guides/monterrei.json fly "Monterrei castle hill": "One writer said the valley's wines stood alongside those of Porto." Names no writer or date; add the date or make it "A 17th-century writer ..." if the pliego gives one.
- N2. data/photos.json alt "Biscay" (txakoli-bizkaia-2) vs "Bizkaia" everywhere else. Use Bizkaia.
- N3. content/facts/green-spain.json sheet 5: "85 %" with a space; all other copy uses "85%". Sheet 7: "Castes" (Galician for varieties) is unexplained.

## Checked and fine
- Tile in content/tiles.json ("Spain's green north", lede) reads plainly; "Inland Galicia turns drier and hotter" matches Monterrei and Ribeiro.
- Alt texts describe the picture; the Okondo and Cangas photos show landscape and town, not vines, and say so.
- No comma splices found; lists of three are rare and sit in source facts (grapes, rocks).

## Fixed in this PR (LeadBot)
- 1, 2: hype cut. The Monterrei lede is now two sentences, and the Valdeorras line reads "Dry wines of the first quality come from sites above 450 m."
- 3: Berezia is explained inside the Bizkaia barrel term. The sheets keep Berezia as a Famous style with its own text.
- 4: the Rosado term now says what Súmmum is ("the Súmmum rule of 85% principal grapes").
- 5: the pliego itself says both: "característica acidez" (p. 240 line) and "vinos redondos, de baja acidez" (line 307). "Low in acidity" is cut from the rules beat, and the measured acidity stays.
- 6, 7, 8, N2, N3: names aligned. Hondarrabi Zuri, Canón do Sil in the flags too, hillside subzone, Bizkaia, 85%, and Castes explained.
- 9, 10: the five three-sentence ledes are trimmed to two, and the Bizkaia and Rías Baixas ledes are whole sentences.
- 11: the Sil caption is reworded and the Valdeorras temperatures read as lows and highs. The Portomarín and A Peroxa flags are kept, because they mark the two ends of the zone as the pliego names them.
- N1: the writer is named, Federico Justo Méndez, Brotes de Raíces Históricas (Monterrei pliego).
