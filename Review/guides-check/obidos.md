# Óbidos sentence check (source obidos-doc, Ficheiro técnico PDO-PT-A1469, Ref. Ares(2011)1405394)

## Lede
- FIX p6/p7 "Rodeada pela sua muralha do séc. XIV" / "colinas e outeiros" / "textura franca a argilosa de calcários pardos e vermelhos" / "Da conjugação destes factores resultam vinhos tintos ... frutados ... brancos ... muito frescos": dropped "low" (no source), "clay-loam" -> "loam to clay" (franca = loam), "fresh, fruity wines" -> "fresh whites and fruity reds"; rewritten so it no longer repeats body para 1.

## Titles
- KEEP guide title.
- FIX hills title p6: "under a medieval wall" -> "running to a walled town" ("na direcção de e até Óbidos").
- FIX soils title p6: "Clay-loam" -> "Loam to clay" ("textura franca a argilosa").
- FIX wines title: dropped the "X, Y and Z" list; now "Fresh whites and bottle-fermented bubbles" (p2 "brancos ... frescos", p4 "fermentação em garrafa").

## place (hills)
- KEEP p6 "Das abas da Serra de Montejunto, para noroeste, na direcção de e até Óbidos, estende-se uma numerosa sucessão de colinas e outeiros, cobertos por uma “manta de retalhos” onde a vinha sobressai"
- KEEP p6 "Rodeada pela sua muralha do séc. XIV, que preserva ainda a sua identidade medieval"
- KEEP p6 "Óbidos constitui o ex-libris duma região agrícola importante, onde a vinha ocupa desde sempre um lugar predominante"
- KEEP p6 "abrange parte dos concelhos de Bombarral, Cadaval, Caldas da Rainha e Óbidos"
- KEEP p4 "Zona NUTS PT16B Oeste"
- Flight Óbidos: KEEP p6; point [-9.157, 39.36] is the walled town (OSM gave no result; matches the town's known coordinates).
- Flight Serra de Montejunto: KEEP caption p6 "Das abas da Serra de Montejunto, para noroeste"; FIX point [-9.0, 39.16] -> [-9.057, 39.177] (the summit; about 5 km off; OSM gave no result, so from known summit coordinates [A]).
- Missing flights: none; the range and the town are the only named landscape features.

## ground (soils)
- FIX p6 "solos de textura franca a argilosa de calcários pardos e vermelhos": "clay-loam to clayey, formed on" -> "loam to clay texture, of" (franca = loam; "formed on" not said).
- KEEP p6 "solos calcários pardos ou vermelhos ... e/ou solos mediterrânicos pardos ou vermelhos de materiais não calcários"
- KEEP p6 "com a exposição aconselhável para a produção de vinhos de qualidade"

## rules (wines)
- FIX p2 "1. Vinho / 4. Vinho espumante", p6-p7 "vinhos espumantes brancos": "red, white and rosado wine, plus white sparkling" -> "still wines and white sparkling wine" (colours are named in the vinification para; no list).
- FIX p5-p6 39 OIV varieties (26 + 13, B and N): "The rules list" (line about the source) -> "39 grape varieties are allowed".
- FIX tasting para: it repeated the fact sheet's `tastes` (p6 descriptors). Rewritten from p7 "Da conjugação destes factores resultam vinhos tintos que são abertos de cor, tons rubi, ... frutados, macios e com algum corpo" and "vinhos brancos suaves, muito frescos, brilhantes, de aromas e frutados e florais com ligeiros toques minerais"; split into reds and whites.
- FIX p7 sparkling "espuma fina e persistente, aroma fino e frutado, sobressaindo os aromas secundários, com boa complexidade de aromas e um bom equilíbrio entre acidez e frescura": added secondary aromas and complexity.
- FIX p4 "método clássico de fermentação em garrafa": "second fermentation" -> "fermentation in the bottle" ("second" not on the page).
- KEEP p4 "brancos ... de uvas brancas ou de uvas tintas pelo processo de “bica aberta”"; "rosados ... “bica aberta” com uma maceração muito leve"; "tintos ... exclusivamente de uvas tintas, por curtimenta com maceração intensa"
- KEEP p2 "Vinho tinto – 12 % / Vinho branco e rosado – 11% / Vinho espumante – 11% vol."
- KEEP p4 "70hl para os vinhos tintos, 90 hl para os vinhos brancos e rosados e 90 hl para os vinhos espumantes"
- KEEP p3 "pelo menos quatro anos de enxertia ... conduzidas em forma baixa, em taça ou cordão"
- Wine types: p2 protects vinho and vinho espumante; both named. No generoso or licoroso.
- Label terms p3 (D.O.C., D.O., Superior, Super reserva, Reserva velha/grande reserva, Reserva, Garrafeira, Escolha, Colheita Seleccionada): listed only, no rule on any page, so none added.

## Fact sheet
- why.text: says "clay-loam to clayey"; p6 says "textura franca a argilosa" (loam to clay).
- soil.text: says "Clay-loam to clayey"; p6 same.
- famous.styles: Reserva, Garrafeira, Colheita Seleccionada only listed on p3 with no rule; the text "Traditional quality term allowed on labels" is accurate. Superior, Super reserva, Reserva velha and Escolha are also listed but absent (omission, not edited).
- tastes, styles, grapes (39 match p5-p6): agree.
