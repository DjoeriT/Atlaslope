# Sentence check: beira-interior

Source: beira-interior-doc (Ficheiro técnico PDO-PT-A1546, Ref. Ares(2011)1406834, 23/12/2011). Checked 22 Oct 2026.

## Lede
- FIX p7 "A altitude média das vinhas ... varia entre os 300 e os 700 metros" + p2 "grande frescura que lhe é dada essencialmente devido à altitude": the hedge "mainly" was dropped. It is now "mainly what gives the reds their great freshness".
- KEEP p2 "vinhos brancos ... de grande exuberância aromática e muita frescura ... tintos ... aromas a especiarias e frutos vermelhos"

## sub-regions (place)
- FIX title: "in the high interior" has no source. It is now "Three sub-regions with Roman roots" (p7 "remonta ao tempo dos romanos").
- KEEP p7 "Sub - regiões de Castelo Rodrigo Cova da Beira e Pinhel": split out of the list sentence.
- CUT p7 "300 e os 700 metros": the altitude is already in the lede, so it is not repeated here.
- KEEP p7 "remonta ao tempo dos romanos"
- FIX p7 "diversos lagares talhados nas rochas graníticas onde na época o vinho era produzido": "Many ... still the proof" is now "Several ... where wine was made at the time, are the proof".
- FIX p7 "no limiar do século XII pelas mãos dos Monges de Cister ... a vinha teve um grande incremento": "Around" is now "At the turn of".
- FIX p7 "foram tomadas medidas de protecção ... dada a sua qualidade e importância social e económica": the reason was added and the sentence was split.
- Flights: OSM gave no result for either point, and a new lookup was not approved in this run. The points are checked from known positions instead.
  - Castelo Rodrigo [-6.95, 40.88]: the village is at about [-6.964, 40.877], so it is within 2 km. KEEP.
  - Cova da Beira [-7.5, 40.28] sits on Covilhã, inside the Cova da Beira concelhos (p5). At zoom 9 it is KEEP.
- Added flight: Pinhel [-7.064, 40.774] p7, the third sub-region. This point is from known town coordinates, not Nominatim (flagged).

## dry-summer (weather)
- FIX title: "Wet winters" is now "Rain in winter and spring" (p7 "concentrada nos meses de Inverno e primavera"). "almost none in summer" is p7 "No verão por sua vez quase não chove".
- KEEP p7 "O clima mediterrâneo que caracteriza a região"
- KEEP p7 "800 a 1000 mm/ano" + "irregular distribuição anual de precipitação"
- FIX p7 "dando normalmente origem a um excesso de água no solo neste período": "at that time" was added.
- KEEP p7 "No verão ... quase não chove" (now its own sentence)
- KEEP p7 "Julho e Agosto como os mais secos do ano ... inferior a 10 mm/m2"
- CUT "The dry summer, together with the soils, is what the rules point to for the white wines' aromas": this talks about the source, and p7 credits "O clima associado às características dos solos" (climate as a whole) for whites and reds alike. The link is kept once, in the ground chapter.
- CUT "The reds get their freshness mainly from altitude": it repeats the lede.
- Cite p2 dropped from this chapter, since nothing here uses it any more.

## old-rock (ground)
- FIX title: "Schist, gneiss and granite" was an X, Y and Z list. It is now "Soils on schist and granite" (p7).
- FIX p7 "devem estar, ou ser instaladas, em solos": "are meant to" is now "must".
- KEEP p7 "Solos mediterrânicos pardos ou vermelhos de xistos metamorfizados e gneisses"
- KEEP p7 "Solos mediterrânicos pardos de xistos ou grauvaques do pré-câmbrico"
- FIX p7 "Solos litólicos não húmicos de granitos e migmatitos": "litólicos" was dropped. It is now "a stony, non-humic soil".
- FIX p7 "O clima associado às características dos solos são elementos fundamentais para se obterem vinhos brancos de grande exuberância aromática ... vinhos tintos mais complexos": "the key" is now "fundamental". The taste list that repeated the lede was trimmed.

## wines (rules)
- FIX p5-p6 OIV list (10 + 31 = 41 varieties, the "principais castas" inventory on p5 is empty): "The rules list a long run of grapes" talked about the source. It is now "Forty-one grape varieties are allowed".
- KEEP p5-p6: Encruzado B, Bical B, Touriga Nacional N, Baga N. KEEP p5 inventory empty, so none is named as a main grape.
- KEEP p4 "exclusivamente a partir de uvas tintas, por curtimenta e sua maceração intensa"
- KEEP p4 "curtimenta parcial de uvas tintas ou de curtimenta conjunta de uvas tintas e brancas, não podendo as uvas brancas ultrapassar 15%"
- FIX p4 "claretes são elaborados segundo o processo estabelecido na alínea anterior ... uvas brancas ultrapassar 45%" + p2 "máximo de 11,5% vol.": "lighter red" has no source. It is now "made the same way".
- FIX p4 "exclusivamente a partir de uvas brancas pelo processo de «bica aberta» ou ... maceração muito leve": the term bica aberta is now explained as "pressed straight off the skins".
- FIX p4 "mistura de uvas brancas e tintas em que aquelas não excedam 30%": "aquelas" means the white grapes. The guide said red grapes at most 30%, which is the wrong way round. It now says white grapes at most 30%. This is the most serious error.
- ADD p4 "não carecem de qualquer período de estágio, podendo ser ... comercializados logo que sejam certificados"
- FIX p2 "menção «Selecção» — 13% vol. / 12% vol." (these are minimums) + p4 "mínimo de 12 meses / seis meses": "at least" was added and the comma splice was split.
- KEEP p2 "Vinho espumante — 11% vol." (minimum) + p4 "mínimo de nove meses de permanência nas instalações do preparador após a data do engarrafamento"
- ADD p2 "Os vinhos espumantes reflectem muita frescura e apresentam grande exubrerancia arómatica": the sparkling wine had no taste line.
- FIX p4 "rendimento máximo ... vinhos com direito à DO Beira Interior é fixado em 55 hl": this applies to all wines, so it moved out of the sparkling paragraph into its own line.
- Wine types swept (p2, p4): vinho (tinto, palhete/palheto, clarete, branco, rosado) and vinho espumante. All are named. There is no generoso or licor.
- Label terms swept (p3): D.O.C., D.O., Superior, Super reserva, Reserva velha (grande reserva), Reserva, Garrafeira, Escolha and Colheita Seleccionada are listed with no rule in this pliego, so none is added. Selecção has its own rule (p2, p4) and stays in the rules beat.

## Fact sheet
- famous.styles Clarete: the sheet says "Light red". p4 says it is made like palhete with white grapes up to 45%, and p2 gives 11.5% at most. Nothing says "light".
- famous.styles Selecção: the sheet says "needs 13% alcohol". p2 gives minimums, so it should read "at least 13%" (white "at least 12%").
- soil.text: the sheet says "non-humic soils on granite". p7 says "Solos litólicos não húmicos de granitos e migmatitos" (migmatite left out; not sure, minor).
