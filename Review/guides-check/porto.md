# porto: sentence check (source porto-doc, Ficheiro técnico PDO-PT-A1540, Ares(2011)1406798; the pliego is Portuguese, so quotes are Portuguese)

## Title
KEEP "Why Porto tastes the way it does" (house title)

## Lede
FIX p12 "servindo como barreira à penetração dos ventos húmidos de oeste ... invernos muito frios e verões muito quentes e secos": "so" made the mountains the cause of the cold winters; the page lists them side by side.
FIX p12 "interrompida a fermentação, havendo elevação do título alcoólico volúmico, pela adição de aguardente"; p11 "entre os 19 e os 22% vol.": "grape spirit" -> "wine spirit" (aguardente vínica); dropped "then".

## place: "A river basin ringed by mountains"
KEEP title p11 "na bacia hidrográfica do Douro, encontra-se rodeada de montanhas"
KEEP p11 "área total de 250 000 hectares ... Situada no nordeste de Portugal, na bacia hidrográfica do Douro"
KEEP p11 "rodeada de montanhas que lhe dão características mesológicas e climáticas particulares"
FIX p11 "três sub-regiões naturalmente distintas": "natural" -> "naturally distinct"
KEEP p5 "devendo ser realizada no interior da região demarcada do Douro"
KEEP p13 "proibida a saída a granel ... ficando proibida a saída desse produto quando não haja sido previamente engarrafado no interior dessas zonas" (entreposto de Vila Nova de Gaia)
KEEP fly Douro p11; KEEP fly Vila Nova de Gaia p13, point [-8.61, 41.13] is the town (OSM gave no result; within 1 km of the centre)

## climate: title FIX "Walls against the Atlantic" -> "A barrier to the wet west winds"
FIX title p12 "barreira à penetração dos ventos húmidos de oeste": the page never names the Atlantic.
KEEP p12 "serras do Marão e de Montemuro, servindo como barreira à penetração dos ventos húmidos de oeste"
KEEP p12 "grandes amplitudes térmicas anuais, com invernos muito frios e verões muito quentes e secos"
FIX p12 "com valores maiores em Dezembro e Janeiro, e com valores menores em Julho ou Agosto": "falls mostly" -> "is highest"
KEEP p12 "As temperaturas médias anuais variam entre 11,8 e 16,5 ºC"
KEEP p12 "distribuem-se ao longo do rio Douro e dos vales dos seus afluentes, em especial os da margem direita"
KEEP p12 two banks differ (follows from the next two lines)
KEEP p12 "A margem norte do rio está sob a influência de ventos secos do sul"
KEEP p12 "a margem sul exposta aos ventos do norte, mais frios e húmidos, e a uma menor insolação"
KEEP fly Serra do Marão p12, point [-7.88, 41.25] is the Marão range (OSM gave no result)

## soils: title FIX "Stony slopes cut into steps" -> "Stony soils, terraced slopes"
FIX title p11: stony soils; terraces only "nas zonas de maiores declives", not every slope.
KEEP p11 "em solos pedregosos, sem utilização alternativa"
FIX p11 "A viticultura, enquanto actividade principal para a maioria dos agricultores ... condições climatéricas particularmente rudes": "Farming here is described as particularly harsh" talked about the source and moved "harsh" from the weather to farming.
KEEP p11 "armação do terreno em socalcos nas zonas de maiores declives"
FIX p11 "a cultura da vinha é extreme na maioria dos casos, coexistindo com amendoeiras e oliveiras na bordadura das parcelas": "often" is not on the page; now "in most cases the vine is the only crop", trees on the plot edges.
FIX p12 "As características do solo, a pedregosidade, a altitude, a exposição solar, o clima e a inclinação do terreno permitem a produção do vinho do Porto na multiplicidade": six-item list split into lines.
FIX fly Douro Superior caption: "eastern" is not on the page; now "reaching east to Vila Nova de Foz Côa" (p7 "o concelho de Vila Nova de Foz Côa" in Douro Superior). Point [-7.1, 41.1] is by Foz Côa (OSM gave no result).

## fortified (rules): title FIX "Stopped halfway, on purpose" -> "Stopped for sweetness"
FIX title p12 "até ao momento em que a quantidade de açúcar não fermentado dá ao vinho a doçura desejada": "halfway" is not on the page.
FIX p3 "só pode ser utilizada pelo vinho generoso a integrar na categoria de vinho licoroso": vinho generoso added, said plainly it is fortified.
KEEP p12 "depois de um desengace total ou parcial segue-se o esmagamento"
KEEP p12 "tradicionalmente era feito em “lagares” (recipiente de pedra)"
KEEP p12 "a maior parte dos vinhos são obtidos em centros de vinificação ... inteiramente mecanizadas"
KEEP p12 "A fermentação prossegue até ao momento em que a quantidade de açúcar não fermentado dá ao vinho a doçura desejada"
FIX p12 "pela adição de aguardente": "grape spirit" -> "wine spirit (aguardente)"
KEEP p12 "interrompida a fermentação, havendo elevação do título alcoólico volúmico"
KEEP p12 "açúcares redutores (provenientes das uvas) superiores a 17,5 g/L"
KEEP p3 "entre 19 % vol. e 22 % vol."
KEEP p3 "excepção do vinho do Porto branco leve seco que pode ter, no mínimo, 16,5 % vol."
FIX p4 sweetness table: the scale was shown by its two ends only; now all five steps with the terms explained (Extra-Seco 17,5 a 40; Seco 40 a 65; Meio Seco 65 a 85; Doce 85 a 130; Muito doce ou Lágrima > 130).
KEEP p8-p11 grape list, N and B both present
KEEP p10 Touriga Nacional N, Touriga Franca N, Tinta Barroca N; p9 Tinto Cao N; p10 Gouveio B; p8 Viosinho B
KEEP p12 "Conservaram-se as castas autóctones da região e a diversidade de castas aí existentes"
ADD p12 "constituem um elemento determinante das características qualitativas, em especial as aromáticas"
KEEP p4 "tawny, ruby, branco ou white e rosé ou rosado"
FIX p12 "Retinto (full); Tinto (medium full, ruby) ... Alourado claro (ligth tawny)": "deep ruby" -> "very deep (retinto)"; ruby is a middle step.
FIX p12 "Os Rosados ou Rosés e os Vinhos Brancos ... Branco pálido; Branco palha e Branco dourado": rosé added, straw step added.
ADD p11 Rosé "aroma e sabor jovem e fresco, revelando-se macio e com persistência frutada" (wine type missing from the rules beat)
ADD p12 Branco "aromas florais e frutados, complexidade variada e diferentes graus de doçura"
FIX p11 Vintage "retinto e encorpado, no momento da aprovação, de aroma e paladar muito finos": hedge "when approved" restored
FIX p11-12 Tawny "envelhecimento em madeira ou em depósitos ou vasilhas com outras características ... alourado": "aged in wood" -> "in wood or other vessels", colour added
KEEP p12 Tawny "macio e de persistência média"
KEEP p12 Ruby "lotação de vinhos de jovens que apresentam carácter frutado, cor tinta e algum corpo"
KEEP p11 Colheita "tinto ou branco ... uma só vindima, com estágio em madeira durante um período mínimo de 7 anos"

## label
KEEP Late Bottled Vintage p11 "uma só vindima, tinto e encorpado, no momento da aprovação, de aroma e paladar finos"
KEEP Crusted p11 "lotação de vinhos de diversos anos ... formação de depósito (crosta) na parede da garrafa onde se efectua parte do estágio"
KEEP Reserva p11 "complexidade de aroma e sabor, obtido por lotação de vinhos de grau de estágio variável"
KEEP Idade p11 "lotação de vinhos de diversos anos que estagiaram em madeira"
KEEP Branco Leve Seco p3/p12 "mínimo de 16,5% vol."; p3 added to the label cite
KEEP Lágrima p4 "Muito doce ou Lágrima > 130"
Sweep of the p3-p5 menções: Superior, Garrafeira, Fino, Escuro, Escolha and Crusting have no rule in this file (p4 sends the menções to Regulamento 242/2010), so none added. Vinho generoso is now in the rules beat. Vinho doce natural, D.O.C. and D.O. are only listed, so none added. Velho/Old and Muito velho/Very Old (p3) carry only a volatile-acidity ceiling (1,2 and 1,8 g/L), which tells a reader nothing about the wine, so not added. Open for the owner.
Famous styles Vintage, Tawny, Ruby and Colheita are not in label: correct.

## Fact sheet
- styles.text: sheet "from very dry to very sweet, with 19 to 22% alcohol"; pliego p4 scale starts at Extra-Seco 17,5 g/L (no very dry Port), p3 Branco Leve Seco may be 16,5%.
- famous.styles Tawny: sheet "Blend aged in wood"; pliego p11-12 "em madeira ou em depósitos ou vasilhas com outras características".
- famous.styles Vintage: sheet text is 17 words (limit 15); shortened, same facts.
