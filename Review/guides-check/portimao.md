# portimao sentence check (source portimao-doc, Ficheiro técnico PDO-PT-A1452, Ares(2011)1404828)

## Lede
- FIX p5 "exposição em anfiteatro virado ao Sul ... acima das 3000 horas de sol por ano": dropped "of hills" (the page names no hills).
- KEEP p6 "os vinhos tintos são aveludados, encorpados ... notando-se o álcool".

## Title
- KEEP (standard title).

## place: "The Barrocal by the sea"
- Title KEEP p5 "instaladas no Barrocal ... influência marítima".
- FIX p4 "abrange o concelho de Portimão": "on the Algarve coast" -> "in the Algarve" (p4 NUTS "PT150 Algarve"; the page does not call it coastal).
- KEEP p4 "freguesia de Alvar e parte das freguesias da Mexilhoeira Grande e Portimão" (page spelling Alvar kept).
- KEEP p5 "As vinhas ... estão instaladas no Barrocal".
- KEEP p5 "sujeitas à influência marítima quer do oceano atlântico quer da ria do alvor".
- Fly Ria de Alvor KEEP p5 "ria do alvor". OSM gave no result. The point [-8.595, 37.135] sits on the estuary by Alvor, so it stays.

## weather: "Hot, dry and very sunny"
- Title KEEP p5 "quente, seco ... insolação acima das 3000 horas".
- FIX p5 "A localização meridional desta região e a protecção assegurada pela barreira montanhosa contra os ventos frios do Norte e a exposição em anfiteatro virado ao Sul fazem com que o clima seja acentuadamente mediterrânico": added the southern position the page names as a cause. Split into short sentences.
- KEEP p5 "quente, seco, pouco ventoso, amplitudes térmicas muito reduzidas".
- KEEP p5 "média de insolação acima das 3000 horas de sol por ano".
- KEEP p5 "a vindima inicia-se geralmente 8 a 10 dias mais tarde que em Lagoa".

## ground: "Sandstone and sand"
- Title KEEP p5 "arenitos ... areias".
- KEEP p5 "contribuem em grande parte para a sua diferenciação".
- KEEP p5 "Solos litólicos, não húmicos, de arenitos, grés de Silves ou afins, regossolos psamíticos".
- KEEP p5 "solos mediterrânicos vermelhos ou amarelos de arenitos ... solos podzolizados de areias e arenitos grosseiros".

## rules
- Title FIX: "Reds and whites, kept low" -> "Reds and whites only". p5 calls the trellis "bardo mais alto", so "kept low" contradicts the page.
- KEEP p2 "vinhos tintos ... vinhos brancos" (p2 category "1. Vinho" only; no other wine type in the pliego).
- KEEP p2 "12% vol. para os vinhos tintos e 11,5% vol. para os vinhos brancos".
- FIX p4 "Os mostos devem possuir um título alcoométrico volúmico natural mínimo": own sentence, "the must must" reworded.
- FIX p4-p5 grape list: two "X, Y and Z" lists that left out Moscatel Graudo, Cabernet-Sauvignon, Alicante Bouschet, Negra Mole and Monvedro -> counts (6 B, 9 N) with two examples each.
- KEEP p3 "Devem ter pelo menos quatro anos de enxertia".
- FIX p3 "conduzidas em bardo de cerca de 0,50 cm a 1 metro. A forma de poda deve ser em cordão (guyot) ou em taça": "trained low" -> "trained on a trellis about 0.50 to 1 m high" (p5 "bardo mais alto"). Cordon and taça are pruning forms; taça is a goblet, not a "bush shape".
- KEEP p4 "fixado em 60 hl quer para os vinhos tintos como para os brancos".
- CUT tasting paragraph (p2/p6 "equilibrados, delicados e suaves, com algum floral ... aveludados, encorpados, muito frutados"): accurate, but it repeated the fact sheet's `tastes` almost word for word, and the lede.
- Label terms: p3 lists D.O.C., D.O., Superior, Reserva, Garrafeira, Colheita Seleccionada with no rules of their own. The guide has no `label`; none added.

## Fact sheet
- famous.styles (unsure): sheet says the spec gives no rule for each term; p6 says a wine "com designativo de qualidade" must score at least 70 in tasting. The page does not tie that phrase to these four terms by name.
- All other fields agree with p2-p6.
