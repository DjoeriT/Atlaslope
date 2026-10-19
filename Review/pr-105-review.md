# PR #105 copy review (30 new fact sheets, 30 tile headlines, sources.json)

Verdict: merge after fixes. Blockers 0, should fix 0, small wording 24, taste 5. Facts not re-checked (per card).
Copy section: `Review/visual-style.md` has no "Copy" heading; its "Content" section only says a headline restates one sourced fact (all 30 do). Rules applied: the owner rules on the card.
Terms in existing sheets (read): `styles` rows say "rosados" ("Whites, rosados and reds"); `tastes` rows say "Rosés:"; `famous` rows say "rosé" or "rosado" by wine name. The new sheets follow this except two `styles` rows. Spanish names and accents in place names, source titles and wine names are all correct (checked against data/places.json).
Three-item lists "Whites, rosados and reds" are the existing house pattern in `styles`, and descriptor lists in `tastes` are too, so not flagged.

## A. Tile headlines (`content/tiles.json`, places)
| place | current | proposed | kind |
|---|---|---|---|
| islas-canarias | Vines on their own roots, free of phylloxera (8 words, limit 7) | Vines on own roots, no phylloxera (6) | small |
| arinzano | Big day-night gaps slow the ripening | Big day-night swings slow the ripening (every other tile and sheet says "swings") | small |
| ayles | Calcareous soils poor in nitrogen | "Calcareous" is the only jargon word in a headline; "Limy soils poor in nitrogen" if the owner wants plainer | taste |
| dominio-de-valdepusa | Clay for power, limestone for velvet | keep; "velvet" is the sheet's own word, but it reads a little like sales copy | taste |
Note (outside the 30): existing `valle-de-la-orotava` "Gentle volcanic slopes at 400 to 800 metres" is 8 words. No three-item lists in any headline.

## B. Fact sheets
Id | field | current | proposed | kind
- islas-canarias | styles | Whites, rosés and reds; ... | Whites, rosados and reds; ... (house term in `styles`) | small
- catalunya | styles | Whites, rosés and reds; lightly sparkling aguja wines; liqueur wines. | Whites, rosados and reds; ... | small
- tharsys | styles | Quality sparkling wines, white and rosé. | Quality sparkling wines, white and rosado. (same line already says "rosados") | small
- tharsys | soil | pH 8.2-8.3 | pH 8.2 to 8.3 (other sheets write "8 to 9") | small
- arinzano | why | give a slow but good ripening. | ripen the grapes slowly and well. ("slow but" implies a contrast) | small
- arinzano | why, climate | temperature gap | temperature swing (house term) | small
- campo-de-la-guardia | why | Very salty soils high in potassium and low air humidity keep the grapes small, ... | Very salty soils rich in potassium, plus low air humidity, keep the grapes small, ... (first reading is "soils high in ... low air humidity") | small
- campo-de-la-guardia | styles | ... A barrel-aged white too. | There is also a barrel-aged white. | small
- calzadilla | soil | Highly limestone and strongly alkaline. | Very high in limestone and strongly alkaline. (not grammatical now) | small
- chozas-carrascal | why | ... one of the coolest sites in its district, on poor, limy soil. | ... one of the coolest sites in its district. The soil is poor and limy. (one idea per sentence) | small
- chozas-carrascal | climate | Continental with Mediterranean influence: 350 to 400 mm of rain, mostly in September, about 3,000 sun hours a year. Big day-night swings at ripening. | Continental with Mediterranean influence. Rain is 350 to 400 mm, mostly in September. There are about 3,000 sun hours a year. Big day-night swings at ripening. | small
- chozas-carrascal, rio-negro, la-jaraba, el-vicario | styles/famous "5+ months", "11+ months", "6+ in bottle", "3+ months", "3+ in bottle" | write "at least 5 months" etc. (plain English; other sheets already say "at least") | small
- la-jaraba | famous (Tinto monovarietal Merlot) | 6 months in oak and 6 in bottle at least. | At least 6 months in oak and 6 in bottle. | small
- la-jaraba | climate | ...: 14 to 16 °C mean, 450 mm rain a year. | ...: a mean of 14 to 16 °C and 450 mm of rain a year. | small
- vera-de-estenas | why | ...softens day-night swings and keeps humidity higher, which keeps the acidity balanced. | ...softens day-night swings and raises humidity, which keeps the acidity balanced. ("keeps ... keeps") | small
- vera-de-estenas | soil | Mainly brown limestone soils on mostly Miocene ground | Brown limestone soils, mainly on Miocene ground ("mainly ... mostly"). "Miocene" is geologist jargon; owner may want it dropped | taste
- abadia-retuerta | styles | Reds: single-grape (oak, 12 months minimum) or blended (6 minimum). | Reds: single-grape (at least 12 months in oak) or blended (at least 6). | small
- dehesa-penalba | climate | A milder microclimate, at 12 °C mean a year, with good west-east airflow. | A milder microclimate, with a mean of 12 °C a year and good west-east airflow. | small
- uruena | climate | Mean 11.4 °C and 2,650 sun hours. | The mean is 11.4 °C, with 2,650 sun hours. | small
- dominio-de-valdepusa | climate | dry hot summers | hot, dry summers | small
- el-vicario | famous (Blanco parcialmente fermentado...) | Chardonnay, Sauvignon Blanc; 15% or more of the must ferments in oak. | White from Chardonnay and Sauvignon Blanc; 15% or more of the must ferments in oak. (no subject now) | small
- el-vicario | famous (Tinto coupage) | at least 30% spends 3+ months in oak. | at least 30% of it spends 3 months or more in oak. | small
- el-vicario | famous (Vino dulce) | stopped at 46 to 90 g/l. | fermentation is stopped at 46 to 90 g/l of sugar. | small
- el-vicario | soil | calcium above 15 meq/100 g (over 3,000 ppm) | unit jargon; owner may prefer to keep only "over 3,000 ppm" or drop both | taste
- cava | why | Long, hot, sunny summers ripen even late grapes well, and cellars at about 13 to 15 °C suit the second fermentation in bottle. | Long, hot, sunny summers ripen even late grapes well. Cellars at about 13 to 15 °C suit the second fermentation in bottle. (two ideas) | small
- otazu | why | ...lengthen the growing cycle, which brings acidity and colour in balance. | ...lengthen the growing cycle, so acidity and colour stay in balance. | small
- bolandin | climate | Dry Cierzo wind | Dry cierzo wind (campo-de-borja tile writes it lower case) | small
- los-balagueses | why | gives the vines better sun exposure, which helps ripening and the polyphenols behind colour and body. | polyphenols is the only term not explained on this sheet; "the compounds behind colour and body" is plainer | taste

## C. sources.json titles
Existing pattern: "Documento único PDO-ES-xxxx (EU single document, Name)" for the EU single document and "Pliego PDO-ES-xxxx (pliego de condiciones, Name)" for the pliego. The 17+ plain single-document entries match.
- arinzano-doc2, bolandin-doc2, otazu-doc2: "Modificación normal PDO-ES-...-AMnn (EU Official Journal C/..., Name)". Not the existing pattern, and `shortTitle()` in `src/facts/format.ts` only maps titles starting "Documento único" or "Pliego" to a short tag, so these three would show the short tag "Modificación normal PDO-ES-A0183-AM02" instead of "EU single document" (read, not run). Proposed: "Documento único PDO-ES-A0183 (EU single document, amendment AM02, Pago de Arínzano)", same for the other two (small). If the amendment is a different kind of document, the owner may want a new short tag instead (taste).
- Amendment order is inconsistent within the new entries: dominio-de-valdepusa-doc "(EU single document, amendment AM02, Dominio de Valdepusa)" puts the amendment before the name; abadia-retuerta-doc2 and uruena-doc2 put it after. Proposed: name first, then amendment, as in the last two (change dominio-de-valdepusa-doc). small
- el-vicario-doc is a Pliego with the matching pliego pattern: fine.

## Not checked
Region/Spain ledes in tiles.json (card scope was the 30 headlines); facts; Spanish-language source quotations.
