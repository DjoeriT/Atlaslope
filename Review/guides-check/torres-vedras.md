# torres-vedras: sentence check
Source: torres-vedras-doc (Ficheiro técnico PDO-PT-A1465, Ares(2013)3493723, 15/11/2013)

## Lede
- FIX p6 "área mais ampla para a produção de vinhos brancos, aproximando-se mais da orla costeira e em terrenos mais baixos, o que lhe confere uma frescura de sabor e algum acídulo": "white grapes grow low" read as vine training; now says the white area lies nearer the coast on lower ground. Cite p7 dropped.
- FIX p6 "colinas da zona mais interior, onde as castas tintas com boa maturação viabilizam ... vinhos encorpados ... com uma acidez e força tânica que permite um envelhecimento": "made to age" widened; now "with the acidity and tannin to age".

## Place: "Two zones, coast and hills"
- KEEP title p6 "orla costeira" / "colinas da zona mais interior"
- KEEP p6 "acidentada orografia dos terrenos"
- KEEP p6 "zona de relevo suave até às várzeas que bordejam os cursos de água próximos"
- KEEP p6 "essencialmente, de policultura ... espalhando pelas diversas encostas, ocupa nelas um lugar cimeiro"
- KEEP p6 "área mais ampla para a produção de vinhos brancos"
- KEEP p6 "aproximando-se mais da orla costeira e em terrenos mais baixos"
- KEEP p6 "A área para a produção de vinhos tintos engloba as colinas da zona mais interior"
- FIX p4 "Vinhos tintos e brancos: Do município de Torres Vedras ...": "Part of the area lies in Torres Vedras" understated it; the red area lies wholly in Torres Vedras.
- FIX p4 "Exclusivamente para vinhos brancos: Do município de Mafra ... Sobral de Monte Agraço ... Do município de Torres Vedras": the white-only area also takes in more Torres Vedras parishes; reworded so Mafra and Sobral read as the white area reaching further.
- KEEP flight label p7 "então designada TURRES VETERAS"
- KEEP flight caption p7 "por necessidade de um centro logístico-comercial, a maior polarização de toda a zona vinhateira em torno da então designada TURRES VETERAS"
- KEEP flight point: the OSM lookup by label returned nothing; [-9.2685, 39.0915] is within about 1 km of Torres Vedras town centre (39.091, -9.259). The pliego names no river, valley or range, so no flight added.

## Weather
- FIX title p6 "influência atlântica": "the Atlantic nearby" not said; now "Mild, under Atlantic influence".
- KEEP p6 "clima ameno e sem grandes oscilações de temperatura"
- KEEP p6 "revelando as características mediterrânicas com influência atlântica"
- KEEP p6 "precipitação média de 700 mm por ano"
- FIX p7 "influência atlântica que se faz sentir no período de maturação das uvas": "grapes and wines ripen" misread the next clause ("e vinhos tintos de cor granada"); now "while the grapes ripen".
- KEEP p7 "vinhos brancos frutados e aromáticos revelando uma frescura que retrata a influência atlântica"

## Ground
- FIX title p7 "geralmente em solos superficiais, de baixa fertilidade": "thin and poor" dropped the hedge; now "Clay-limestone, mostly shallow".
- KEEP p6 "predominantemente argilo-calcários, pardos e vermelhos"
- KEEP p6 "textura variável entre argilosa, argilo-arenosa e franca"
- KEEP p7 "geralmente em solos superficiais, de baixa fertilidade"
- FIX p7 "o clima ameno ... são características que tornam únicos os vinhos desta região": "this is what the wines owe their character to" made it the sole cause (the page also counts human factors, "Para além deste factores"); now "help make the region's wines unique".

## Rules: "Fresh whites, ageworthy reds"
- KEEP title p6 "frescura de sabor" / "permite um envelhecimento"
- KEEP p2/p4 "Vinho tinto ... Vinho branco" (category "1. Vinho"; no other wine type anywhere in the pliego)
- FIX p5-p6 OIV list, 20 + 5 = 25, "a. Inventário das principais castas" empty: "The rules list" was about the source; reworded.
- KEEP p5 "Arinto B", "Fernao Pires B"
- KEEP p6 "Touriga Nacional N"
- KEEP p6 "Os vinhos brancos são frutados e aromáticos, revelando uma frescura de sabor e um certo acídulo"
- CUT p6 "aproximando-se mais da orla costeira ... o que lhe confere uma frescura": true, but repeats the lede.
- KEEP p6 "cor granada e granada acastanhada, de aroma vinoso intenso"
- KEEP p6 "com certa adstringência quando jovens"
- FIX p6 "adquirindo com o envelhecimento uma macieza, elegância e aveludado": "soft, elegant and velvety" was an X, Y and Z list; split into two sentences.
- CUT p6 "castas tintas com boa maturação ... acidez e força tânica que permite um envelhecimento": true, but repeats the lede.
- FIX p3 "pelo menos, três anos de enxertia ... salvo em casos excepcionais a autorizar pela CVR": the exception was dropped; added.
- KEEP p3 "em forma baixa, em taça ou em cordão"
- KEEP p4 "80 hl para os vinhos tintos e 90 hl para os vinhos brancos"
- KEEP p2 "Vinho tinto – 11,5 %" / "Vinho branco – 11%"
- KEEP p4 "tintos só podem ser engarrafados após um estágio de oito (8) meses ... brancos ... três (3) meses"
- Cite p7 dropped from this chapter (no sentence left on it).
- Label: the guide has no label field. p3 lists D.O.C., D.O., Superior, Reserva, Garrafeira, Escolha and Colheita Seleccionada with no rule of their own anywhere in the pliego, so none is added.

Counts: KEEP 27, FIX 11, CUT 2.

## Fact sheet
- why.text: sheet says "Low, mild Atlantic-influenced hills"; pliego p6 says "acidentada orografia" and puts the whites on low coastal ground, the reds in the inland hills. Edit proposed.
- famous.styles: sheet omits "Superior"; p3 lists it under Alínea b) beside Reserva and Garrafeira. Edit proposed.
- tastes.text: reds are also "granada acastanhada" (p6); minor, not proposed.
