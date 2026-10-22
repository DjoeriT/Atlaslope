# Colares sentence check
Source: colares-doc (Ficheiro técnico PDO-PT-A1461, Ref. Ares(2011)1405138, 22/12/2011). Guide: content/guides/colares.json.

## Title
- KEEP p6 "As características únicas do vinho de Colares devem-se às castas, solos e clima" (the guide is about why it tastes as it does).

## Lede
- KEEP p6 "situa-se próximo de Lisboa, entre a Serra de Sintra e o Oceano Atlântico"
- FIX p6 "devidas à proximidade do mar e à influência dos ventos marítimos, bem como à composição dos solos de chão de argila profundo cobertos por chão de areia": phylloxera line moved out of the lede (it was repeated in the ground beat); lede now gives the page's cause for the vines' "muito particulares" character.

## place: "Between the mountains and the sea"
- KEEP title p6 "entre a Serra de Sintra e o Oceano Atlântico"
- CUT "The vineyards lie close to Lisbon, between the Serra de Sintra and the Atlantic Ocean." (repeated the lede word for word; p6 cite dropped from the beat).
- KEEP p4 "compreende as freguesias de Colares, São Martinho, e São João das Lampas, do concelho de Sintra"
- Flight Serra de Sintra [-9.39, 38.79]: KEEP. Pack lookup had no result and a fresh Nominatim request was refused here; the point sits by Pena on the Sintra ridge, within the range. Caption KEEP p6.
- No other named river, valley, range or town in the pliego to add as a flight.

## sea: "Sea winds and damp summers"
- KEEP title p6 "influência dos ventos marítimos" / "húmido no Verão"
- KEEP p5 "clima de marcada influência marítima atlântica"
- KEEP p6 "proximidade do mar e à influência dos ventos marítimos" / "clima temperado e húmido no Verão"

## sand: "Vines in the sand"
- KEEP title p3/p5 "chão de areia"
- KEEP p5 "devem ser instaladas nos seguintes solos"
- KEEP p5 "Regossolos psamíticos, de areias assentes sobre materiais consolidados, tradicionalmente designados «chão de areia»"
- FIX p5 "Solos calcários pardos de margas ou materiais afins": "brown limestone marl" became "brown limy soil of marl or similar material" (calcário is limy; "ou materiais afins" was dropped).
- KEEP p5 "aptos para a produção de vinho branco ou de vinho tinto"
- KEEP p6 "chão de argila profundo cobertos por chão de areia"
- FIX p6 "condições tais que permitiram não terem sido afectadas pela filoxera que devastou as vinhas no final do século XIX": the page credits sea, sea winds and the soil together, not the soil mix alone.
- KEEP p3 "respeitar-se-á a prática tradicional de «unhar» a vara de pé franco no estrato subjacente à camada de areia"
- KEEP p3 "As vinhas devem ser conduzidas em forma baixa"
- FIX p3 "se aramadas, não deve o arame inferior, no qual será obrigatoriamente conduzida a cepa, exceder a altura de 30 cm": hedge "if wired" restored; split from the low-training sentence.

## wines: "Red and white, given time"
- KEEP title p4 "só podem ser comercializados após estágio mínimo"
- KEEP p2 "Os vinhos tintos e brancos com DO Colares"; p2 category "1. Vinho" only.
- FIX p5 OIV list: guide listed Ramisco among the listed reds, but the list (Vital B, Parreira Matias N, Malvasia B, Arinto B, Fernao Pires B, Castelao N, Galego Dourado B, Jampal B, Tinta Miuda N, Molar N) has no Ramisco; it appears only in "Dados sobre o produto". Two long grape lists replaced by counts (six white, four red) with one example each (style rule against "X, Y and Z" lists).
- FIX p5 "O vinho tinto da casta Ramisco apresenta uma cor rubi, é adstringente, mas amacia com o envelhecimento, adquirindo uma bela tonalidade acastanhada e desenvolvendo um aroma extraordinário": "when young" and "striking" dropped; source's "fine brownish shade" and "extraordinary aroma" used.
- KEEP p6 "Os vinhos brancos da casta Malvasia têm cor citrina, um aroma bastante frutado" (cite p6 is on the beat).
- KEEP p2 "título alcoométrico mínimo de 10% vol."
- ADD p4 "um título alcoométrico natural mínimo, em potência, de 9,5% vol." (must rule, missing).
- KEEP p4 "Vinhos tintos: 18 meses em vasilhame seguidos de 6 meses em garrafa"
- KEEP p4 "Vinhos brancos: 6 meses em vasilhame, seguidos de 3 meses em garrafa"
- KEEP p4 "fixada em 55 hl para os vinhos tintos e em 70 hl para os vinhos brancos"
- KEEP p3 "pelo menos, quatro anos de enxertia"
- CUT colour and finish sentences ("whites range from lemon to straw-gold...", "balanced, with a complex finish..."): true to p2 but they repeated the fact sheet's `tastes`.
- ADD p2 aroma scale in full, not by its ends: "vão do pouco aromático (tintos) ou ligeiro frutado (brancos) para vinhos com aroma com certa distinção, fino ou típico e outros com aroma bastante distinto ou típico intenso".

## Wine types and label terms
- Wine types: p2 only red and white still wine ("Vinho"); both named in the rules beat. No sparkling, generoso or licoroso.
- Label: the guide has no `label` field. p3 lists DOC, DO, Superior, Reserva, Garrafeira, Escolha, Colheita Seleccionada with no rule anywhere in the pliego, so none is added. p6 labelling (prior approval, brand mandatory) is national law, not added.

## Fact sheet
- why.text: sheet says "the sand kept them free of phylloxera"; p6 says sea, sea winds and clay under sand together ("condições tais que permitiram"). Edit returned.
- grapes.others: lists Ramisco under the p5 cite; the p5 OIV list lacks it, but p5 product data names "a casta Ramisco". Not changed.
- Other fields agree with p2, p4, p5, p6.
