# Tavira sentence check (source tavira-doc, Ficheiro técnico PDO-PT-A1449, Ares(2011)1404738)

## Lede
- FIX p5 "solos mais arenosos, a cotas relativamente baixas ... resguardada dos ventos ... menor amplitude térmica (bastante uniforme)": "sandy, low ground" became "sandier soils at relatively low elevations"; "barely swing" became "fairly even".
- KEEP p5 "a vindima se inicia mais cedo que nas restantes regiões"

## place: The far south of mainland Portugal
- Title KEEP p6 "No extremo Sul de Portugal Continental"
- KEEP p6, p4 "No extremo Sul de Portugal Continental, o Algarve"; "PT150 Algarve"
- FIX p6 "zona bem definida, um compartimento com feições características, conferidas pela proximidade do mar, pelo clima, pela vegetação natural e pela cultura marcada pela longa ocupação árabe": four-item list split into three sentences.
- KEEP p5 "a cotas relativamente baixas e sem relevo acentuado e resguardada dos ventos"
- FIX p4 "abrange os concelhos de Faro, Olhão, São Brás de Alportel (parte ...), Castro Marim (parte ...), Tavira (... parte ...) e Vila Real de Santo António (a freguesia de Vila Nova da Cacela)": "parts of" all six was wrong; Faro and Olhão are whole. List split.
- Flight caption FIX p5 "cotas relativamente baixas": "Low-lying" became "at relatively low elevations".
- Flight point: the pack's OSM hit is Tavira in Cáceres, Spain (wrong place). The flight uses `place: "tavira"`, not its own coordinates, so nothing to correct in the guide; the places.json point should be checked to be Tavira, Algarve (about 37.13, -7.65).
- Missing flights: none. The pliego names no river, valley or range; the "barreira montanhosa" is unnamed and the concelhos are only listed.

## weather: Hot, dry and very even
- Title KEEP p6 "quente, seco ... amplitudes térmicas muito reduzidas"
- KEEP p6 "a protecção assegurada pela barreira montanhosa contra os ventos frios do Norte e a exposição em anfiteatro virado ao Sul" (reworded "rises like" to "faces south like", the page gives exposure, not rise)
- FIX p6 "A localização meridional ... fazem com que o clima seja acentuadamente mediterrânico: quente, seco, pouco ventoso, amplitudes térmicas muito reduzidas": added the page's own cause link (position, barrier, exposure make the climate).
- KEEP p6 "uma média de insolação acima das 3000 horas de sol por ano"
- KEEP p5 "Sendo uma região menos pluviosa ... um maior número de horas de calor pelo que a vindima se inicia mais cedo que nas restantes regiões"

## ground: Sand and sandstone
- Title KEEP p5 "arenitos ... areias e arenitos grosseiros"
- FIX p5 "numa região com solos mais arenosos": "mostly sandy" became "sandier".
- FIX p5 "litólicos, não húmicos, de arenitos, grés de Silves ou afins": "thin soils" became "rocky soils formed on sandstone, such as the Silves sandstone".
- KEEP p5 "solos mediterrânicos vermelhos ou amarelos de arenitos"
- KEEP p5 "solos podzolizados de areias e arenitos grosseiros"
- KEEP p6 "contribuem em grande parte para a sua diferenciação, qualidade e as suas características intrínsecas"

## rules: Light whites, easy reds
- Title KEEP p3 "pouco encorpados ... fáceis de beber"
- KEEP p2 "1. Vinho"; "Vinho tinto ... Vinho branco" (no other category: no sparkling, licoroso or rosé)
- FIX p5 "Negra Mole N ... Castelao N ... Arinto B ... Moscatel Graudo B": the old line called Negra Mole and Moscatel Graudo "local"; the page does not say which grapes are native. Now split by the page's N/B colour; five-grape list dropped.
- FIX (added) p5 "muitas castas autóctones que imprimem um forte carácter regional ... outras variedades de introdução relativamente recente" (said of the Algarve, so framed "In the Algarve").
- FIX (added) p2 "cor entre o amarelo citrino e o palha ... cor rubi definida que com o envelhecimento evolui para um tom topázio"
- FIX p2/p3 "pouco encorpados e apresentam um travo característico a zona quente ... fáceis de beber ... pouco taninosos": tasting paragraph repeated the fact sheet's `tastes` word for word; trimmed to two words each, colour added instead.
- KEEP p2, p3 "Vinho tinto - 12%vol / Vinho branco – 11,5%vol"
- KEEP p4 "fixado em 60 hl para o vinho tinto e para o vinho branco"
- FIX (added) p4 "devem ter pelo menos quatro anos de enxertia"
- FIX (added) p6 "Devem ter uma notação igual ou superior a 60 pontos": base score was missing.
- KEEP p6 "O vinho com designativo de qualidade ... notação superior ou igual a 70"
- Label: the guide has no `label`. p3 lists Superior, Reserva, Garrafeira, Escolha, Colheita Seleccionada with no rule of their own anywhere in the pliego, so none is added.
- Numbers: 12%, 11.5%, 60 hl, 3000 h, four years, 60 and 70 points all confirmed on the cited pages.

## Fact sheet
- famous.styles: sheet gives Reserva, Garrafeira, Superior as famous styles with the 70-point rule; pliego p3 only lists them as menções tradicionais and never ties them to "designativo de qualidade" (p6). Not plainly settled.
- Other fields agree (why, grapes, styles, climate, soil, altitude, tastes).
