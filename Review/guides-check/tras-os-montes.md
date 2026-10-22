# Sentence check: tras-os-montes (source tras-os-montes-doc, Ficheiro técnico PDO-PT-A1466, Ares(2011)1405272)

## Lede
- FIX p7 "Verões muito quentes ... maturações completas ... vinhos concentrados de cor e com teores alcoólicos elevados" / "solos essencialmente graníticos ... bem como as castas seculares ... elevada estrutura": was "reds with structure and colour"; the page says wines (not only reds), colour from climate, structure from soils plus grapes.

## Place (subregions)
- FIX title: "far north-east" and "pockets" not on the page; now "Three sub-regions in Alto Trás-os-Montes" (p5 "PT118 Alto Trás-os-Montes").
- KEEP p5 "corresponde à área das sub-regiões"; "PT118 Alto Trás-os-Montes".
- ADD p10 "Trás-os-Montes seguida ou não de Chaves / Planalto Mirandês / Valpaços": label may add the sub-region name.
- KEEP p5 Chaves parishes "No concelho de Vila Pouca de Aguiar, as freguesias de Capeludos e Valoura".
- FIX p5 "Os concelhos de Miranda do Douro; Mogadouro e Vimioso": X, Y and Z list split; "three whole municipalities, Miranda do Douro among them" plus Freixo/Moncorvo parishes.
- FIX p5 Valpaços: five-municipality list replaced by "parishes in five municipalities, Valpaços and Mirandela among them".
- Fly Planalto Mirandês: KEEP point (Miranda do Douro town, OSM gave no result for the plateau name); caption list FIX as above.
- Fly Chaves: KEEP [-7.47, 41.74] is Chaves, Portugal; the pack's OSM hit was Chaves in A Coruña, Galicia (wrong match), not used.
- ADD fly Valpaços [-7.31, 41.61], zoom 10, p5 (third sub-region; pliego names no river or range).

## Weather (summers)
- FIX title: "many microclimates" → "several" (p7 "os vários microclimas existentes").
- KEEP p7 "Verões muito quentes, com temperaturas altas e baixa pluviosidade".
- KEEP p7 "originando assim maturações completas ... concentrados de cor e com teores alcoólicos elevados" ("strong" → "deep" colour).
- KEEP p7 "o clima (salientando os vários microclimas existentes) ... os quais definem o que é o “terroir” desta região".

## Ground (granite)
- KEEP title and p7 "solos essencialmente graníticos com algumas manchas de xisto".
- ADD p7 "conjugam-se na perfeição, imprimindo aos vinhos resultantes, uma elevada estrutura e grande complexidade aromática" (soil with grapes; moved here from the lede's implied link).
- KEEP p7 "devem estar, ou ser instaladas, em solos com as características a seguir indicadas".
- FIX p7 Chaves "Solos mediterrânicos pardos ou vermelhos argiláceos e gneisses ou afins": "clayey soils on gneiss" → "soils on clay rocks and gneiss".
- KEEP p7 Planalto Mirandês "pardos ou vermelhos de xistos e gneisses"; Valpaços "pardos ou vermelhos de xistos".

## Rules (wines)
- FIX title: "Reds, whites, rosados, sparkling and fortified" was an X, Y and Z list; now "From still reds to fortified licoroso" (p2 "Vinho; Vinho licoroso; Vinho espumante").
- KEEP p7 "castas seculares características da Região, em união com novas plantações de castas nobres".
- FIX p5-p6 grape list: seven-name list replaced by "33 varieties" (counted: Boal Branco p5 plus 32 on p6) with two reds and two whites named; p5 added to cites.
- FIX p7 reds: tasting line repeated the fact sheet's `tastes`; now "geralmente encorpados ... fáceis de beber", "cor rubi a granada com reflexos acastanhados".
- KEEP p2 "Vinho tinto – 11,5%vol."
- FIX p7 whites: list replaced by "aroma jovem e fresco a frutos tropicais".
- KEEP p2 "Vinho branco e vinho rosado ou rosé – 11%vol." (rosado added).
- FIX p4 "processo de «bica aberta» ou com uma ligeira curtimenta": Portuguese term now explained (free-run juice off the skins).
- ADD p2 "Vinho Espumante – 10%vol." (sparkling minimum was missing).
- FIX p7 sparkling: "fine bubbles, fresh, fruity, light" list replaced by p7 "Os tintos apresentam uma espuma rosada e persistente" and "frutado exótico a lembrar lichias" (red sparkling was missing).
- KEEP p4 "Reserva – entre 12 e 24 meses ... Super-reserva ... entre 24 e 36 ... Velha reserva ... mais de 36 meses de engarrafamento antes do dégorgement".
- FIX p4 licoroso: now says plainly it is fortified, "pode ser adicionado álcool vínico neutro ou destilado de vinho" to must "em início de fermentação"; KEEP p2 "Vinho Licoroso – 16,5%vol.".
- ADD p3 "pelo menos quatro anos de enxertia", "abertura de poda à altura máxima de 1 m".
- KEEP p4 "fixado em 55 hectolitros".
- Label terms: p3 menções (DOC, DO, Superior, Reserva, Garrafeira, Escolha, Colheita Seleccionada) are listed with no rule, and the guide has no `label` field; nothing added. Espumante Reserva terms have their rule on p4 and stay in the rules beat.

## Fact sheet
- tastes.text: sheet says whites "citrus to golden"; p7 says "cor citrina a palha dourada" (citrus to straw-gold).
- why.text: sheet ties "structured" to the summers; p7 ties structure to soils and grapes, and the summers to colour and alcohol (not sure, wording).
- styles.kinds, famous.styles, grapes, soil, climate: agree with the pliego.
