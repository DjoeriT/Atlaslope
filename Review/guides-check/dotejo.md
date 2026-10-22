# dotejo sentence check (source dotejo-doc, Ficheiro técnico PDO-PT-A1544, Ref. Ares(2011)1406827)

## Lede
- KEEP p9 "sujeita a inundações periódicas ... responsáveis pelos elevados índices de fertilidade"
- FIX p9 "é a zona ideal para as castas tintas" / "ondulados suaves": "hills ... red-wine zone" -> "gently rolling Bairro is the ideal zone for red grapes"

## Title
- KEEP "Why DoTejo tastes the way it does" (house title)

## river (place)
- KEEP title p8 "Ribatejo ... nome da província ... regressar ao nome TEJO"
- KEEP p8 "O Tejo é o principal rio português"
- KEEP p8 "Ribatejo (que significa margem do Tejo em português)"
- KEEP p8 "decidindo-se regressar ao nome TEJO, o nome original"
- KEEP p8 "O principal acidente orográfico existente na região DoTEJO é a Serra de Aires e Candeeiros"
- FIX p8 "delimitando o que podemos chamar de Alto e Baixo Tejo": "what locals call" -> "what can be called"; terms explained (upper/lower Tagus)
- FIX p8-9 "continua a condicionar, umas vezes para o bem outras para o mal": added "sometimes for better and sometimes for worse"
- KEEP p9 "a cultura menos afectada pelas cheias que ocorrem cada vez com menos frequência, graças à gestão dos caudais feitas pelas diversas barragens"
- Flight "The Tagus at Almeirim": KEEP p5 "O limite natural que separa a sub-região de Almeirim das do Cartaxo e Santarém é o rio Tejo". Point at Almeirim, on the river plain (OSM gave no result; point matches the town, within 3 km).
- Flight "Serra de Aires e Candeeiros": FIX caption p8 "principal acidente orográfico ... delimitando o que podemos chamar de Alto e Baixo Tejo": "mountain range" -> "relief", "divides" -> "marks off". Point lies on the Candeeiros ridge (OSM no result), kept.

## climate (weather)
- FIX title: "Moderate, and sunny" -> "Moderate, with 2,800 hours of sun" (page gives the number, not the adjective) p9 "clima moderado ... insolação situa-se cerca das 2800 horas/ano"
- KEEP p9 "clima moderado"
- KEEP p9 "temperaturas médias compreendidas entre os 15,5º C e 16,5º C ... cerca das 2800 horas/ano"
- KEEP p9 "média anual de precipitação é de 750 mm"
- KEEP p9 "um pouco mais elevada a Norte ... zona de Tomar e um pouco menos elevada a Sul ... zona de Coruche"

## zones (ground)
- FIX title: "Campo, Bairro and Charneca" (X, Y and Z list) -> "Three zones of soil" p9 "três zonas distintas de produção"
- KEEP p9 "três zonas distintas de produção"
- KEEP p9 "O CAMPO, com as suas extensas planícies, adjacente ao Rio Tejo, conhecido também como a LEZÍRIA DO TEJO"
- FIX p9 "que se causam alguns transtornos": "cause trouble" -> "cause some trouble"; KEEP "elevados índices de fertilidade que aqueles solos de aluvião possuem"
- FIX p9 "por excelência a zona dos vinhos brancos, onde a casta Fernão Pires é raínha": "the zone of white wines" -> "the white-wine zone above all"
- KEEP p9 "situado entre o Vale do Tejo e os contrafortes dos maciços de Porto de Mós, Candeeiros e Montejunto"
- KEEP p9 "solos argilo-calcáreos em ondulados suaves, é a zona ideal para as castas tintas, nomeadamente a Castelão e Trincadeira"
- KEEP p9 "localizada a sul do CAMPO, na margem esquerda do Rio Tejo"
- KEEP p9 "solos arenosos e medianamente férteis"
- FIX p9 "apresenta rendimentos abaixo da média da Região, por outro lado induz a um afinamento, quer de vinhos brancos, quer de vinhos tintos": subject is the zone, not "the soils"
- KEEP p9 "terrenos planos, onde a altitude varia entre os seis e os dez metros"
- KEEP p10 "atingindo nalguns pontos, 200 metros de altitude"
- KEEP p9 "a grande profundidade por calhau rolado, sobre o qual se depositaram camadas de areia grossa ... areia fina, terminando por argila fina"
- Flight "Lezíria do Tejo, the Campo": KEEP p9 "extensas planícies ... inundações periódicas ... elevados índices de fertilidade". Point on the Tagus floodplain near Muge (OSM no result), kept.
- Flight "Montejunto": KEEP p9 "contrafortes dos maciços de ... Montejunto, com solos argilo-calcáreos em ondulados suaves". Point at the Serra de Montejunto summit (OSM no result), kept.

## wines (rules)
- KEEP title p9-10 (Campo "zona dos vinhos brancos", Bairro "zona ideal para as castas tintas")
- KEEP p9 Almeirim "predominam os vinhos brancos e é onde se produz a maior quantidade de vinhos"
- KEEP p10 Tomar "predominam os vinhos tintos"; p9-10 Cartaxo "Nesta sub-região predominam os vinhos tintos"
- FIX style (three-clause list split into sentences): p10 Chamusca "alguma predominância de vinhos brancos"; Coruche "ligeira predominância de vinhos tintos"; Santarém "relativo equilíbrio"
- KEEP p2 "Vinho ... vinho tinto e rosado ou rosé ... vinho branco"; added "still"
- KEEP p2 "vinho espumante de qualidade"
- FIX p4 "mosto ... em início de fermentação, ao qual pode ser adicionado álcool vínico neutro ou destilado de vinho"; p11 "adição de aguardente ao mosto em fermentação": "adding" -> "may be added", "fermenting must" -> "must at the start of fermentation"; said plainly it is fortified
- CUT colour and aroma paragraph (p2-3, p10): repeats the fact sheet `tastes` word for word in meaning; replaced by facts the sheet lacks (below)
- KEEP p4 "fermentação clássica em garrafa, ou o de fermentação em cuba, sendo neste caso obrigatório um estágio mínimo de nove meses" (9 -> "nine", as the page)
- KEEP p2 "vinho espumante de qualidade – 10,5%vol"
- ADD p10 "bolha fina a média"
- KEEP p2 "vinho licoroso – 17,5%vol"
- ADD p10 licoroso "quando têm origem em uvas brancas devem apresentar cor entre ligeiramente dourado e topázio"
- KEEP p5 "80 hectolitros para o vinho tinto e rosado e 90 hectolitros para o vinho branco"
- FIX p2 "Título Alcoométrico Adquirido Mínimo ... tinto e rosado ... 11,5%vol ... branco – 11%vol": "start from" -> "need at least" (acquired alcohol of the wine)
- ADD p3-4 "pelo menos três anos de enxertia ... conduzidas em forma baixa, em taça ou em cordão"
- ADD p10 "notação igual ou superior a 60 ... com designativo de qualidade ... características organolépticas destacadas, nomeadamente na estrutura e no equilíbrio aromático e gustativo, com notação superior ou igual a 65" (the only label-term rule the pliego gives)
- KEEP p11 "muitas castas autóctones que imprimem um forte carácter regional"
- FIX p11 "variedades de introdução relativamente recente, castas de valor reconhecido que reforçam a qualidade": restored the hedge "relatively recently" and "of recognised worth"

## Label terms
- Guide has no `label`. P3 lists the menções (D.O.C., D.O., Superior, Super reserva, Reserva velha or grande reserva, Reserva, Garrafeira, Escolha, Colheita Seleccionada) without any rule of their own; p10 gives the shared quality-term rule (score 65), now in the rules beat. No term added.

## Missing wine types
- All three categories named: vinho (red, white, rosé), vinho espumante de qualidade, vinho licoroso (fortified). None missing.

## Fact sheet
- famous.styles Reserva: sheet "quality wines must score at least 65"; pliego p3 lists Reserva only as a menção, p10 gives the 65 score to any wine "com designativo de qualidade", not to Reserva by name. Not sure.
- famous.styles Garrafeira: sheet "selected wines with outstanding structure and aromatic balance"; p3 lists Garrafeira only; the p10 structure/balance rule applies to every quality-designated wine, and "selected" is not on the page. Not sure.
- famous.styles Vinho licoroso: sheet "neutral wine spirit added"; p4 "pode ser adicionado" (may be added). Minor.
- Other fields (why, styles, climate, soil, altitude, tastes, grapes.others) agree with p2-p10.
