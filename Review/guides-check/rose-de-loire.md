# rose-de-loire check (source rose-de-loire-doc, fiche technique PDO-FR-A0150, 11 pages)

## Title and lede
- KEEP title (standard guide title).
- FIX p7 "sols ... de bonnes capacités de drainage" / "joue un rôle de régulateur thermique": "soft stone" dropped (the west is hard Primary rock); "The result is" cut, the page does not tie soil or river to taste.
- FIX p8 "Frais et désaltérant ... apprécier toute son originalité dans sa jeunesse": "best drunk young" -> "to enjoy young".

## river (place)
- FIX title p7 "sur environ 200 kilomètres": "Two hundred kilometres" -> "Some 200 kilometres".
- KEEP p7 "longe la Loire et ses affluents, la Vienne, l'Indre et le Cher, sur environ 200 kilomètres".
- KEEP p7 "plateau ondulé" / "294 communes dont certaines sont célèbres par leur château".
- FIX p7/p8 "formations primaires des contreforts du Massif Armoricain ... Secondaire et, dans une moindre mesure, du Tertiaire de la frange sud-ouest du Bassin Parisien"; "roches dures du Primaire et tendres du Secondaire et du Tertiaire": "in the west" and "old" not on the page; now names Armorican Massif and Paris Basin, keeps the Tertiary hedge.
- FIX p8 "a largement modelé, au fil du temps": added "largely".
- Fly "The Loire in Touraine" [0.69, 47.39]: Tours (listed p4), on the Loire; Touraine p8. KEEP. Caption KEEP p7.

## climate (weather)
- FIX title p7 "influence plus continentale": "land in the east" -> "a continental touch in the east".
- KEEP p7 "Le climat est océanique."
- FIX p7 "A l'ouest, où l'influence océanique est la plus forte, les températures sont régulières, les hivers sont doux et les chaleurs estivales restent modérées": "so" made a cause the page does not state (it says "où"); three-item list split.
- KEEP p7 "la frange orientale, correspondant à la Sologne viticole, connaît une influence plus continentale".
- FIX p7 "cumul des précipitations légèrement supérieur au reste de la zone ... entre 550 millimètres et 650 millimètres" / "vers l'est, l'amplitude thermique a tendance à s'accroître": split in two, "towards the east" kept.
- KEEP p7 "la Loire et ses affluents joue un rôle de régulateur thermique".

## soils (ground)
- FIX title: "Schist, clay-limestone and tuffeau" was an X, Y and Z list, and tuffeau is a building stone on p7, not a soil.
- KEEP p7 "sols schisteux ou argilo-schisteux sur la partie occidentale et de sols argilo-calcaires ... dans sa partie orientale".
- KEEP p7 "réserves utiles en eau modérées et de bonnes capacités de drainage".
- KEEP p7 "L'étage géologique du Turonien est essentiel."
- FIX p7 "d'une façon plus générale, de l'ensemble du bâti architectural de la région": "most of the region's buildings" -> "more broadly, the region's buildings".
- KEEP p7 "d'innombrables cavités ... devenues des caves, à la température et à l'hygrométrie constante".
- KEEP p7 "vouées à la culture des champignons et au stockage du vin".
- KEEP p9 "ne retient que les parcelles présentant des sols drainants sur argilo-calcaires ou sur schistes".
- Fly "Saumur, tuffeau country": MOVED to rules beat. The page never calls Saumur tuffeau country; p7 names Saumur only for the clairet gift. Point [-0.08, 47.26] is Saumur, kept.

## dry-rose (rules)
- KEEP title p2 "vins tranquilles rosés secs"; category p2 "1. Vin" only. No other wine type in the pliego.
- KEEP p2 "vins tranquilles rosés secs".
- KEEP p2 "titre alcoométrique volumique naturel minimum de 9,5 %" / "sucres fermentescibles ... inférieure à 3 grammes par litre".
- KEEP p2/p4 "ne dépassent pas, après enrichissement, le titre alcoométrique volumique total de 12,5 %".
- KEEP p4 "Le rendement est fixé à 60 hectolitres par hectare."
- CUT colour, aroma and palate sentences (p2/p8): they repeated the fact sheet's `tastes` word for word. FIX "at its most original when young" -> kept only the new detail, p8 "il donne l'impression de croquer des fruits mûrs".
- FIX p6 list of seven varieties: the six-name list (X, Y and Z) -> "Seven grapes are allowed" (sheet shows the names).
- KEEP p8 "privilégier la plantation des cépages cabernet franc N et grolleau N dans la partie occidentale ... partie orientale ... surtout planter ... gamay N et pineau d'Aunis N", split in two.
- ADD p8 "La configuration de la zone géographique et le climat océanique expliquent ces choix."
- FIX p7 "l'arrivée du cépage « Breton », qui n'est autre que le cépage cabernet franc N, originaire du Bordelais, les producteurs élaborent un nouveau vin, rosé, dénommé alors « clairet », qui dévoile des arômes de fruits rouges": growers made it, not the grape; origin and aromas added.
- FIX p8/p9 "vins rosés pour des volumes importants dénommés « rouget » en Anjou et « vin gris » en Touraine"; "frais, original, gouleyant et présentant un titre alcoométrique volumique peu élevé": "light" is not the page's word -> "fresh and low in alcohol".
- KEEP p8 "L'appellation d'origine contrôlée « Rosé de Loire » est reconnue ainsi en 1974."
- ADD p10 "peut préciser le nom d'une unité géographique plus petite sous réserve : qu'il s'agisse d'un lieu-dit cadastré ; que celui-ci figure sur la déclaration de récolte" (label term with its own rule).
- Label sweep p3: "Appellation d'origine contrôlée", "Clos", "Château" are listed with no rule of their own: not added. "Val de Loire" (p10) only a type-size rule: not added. Guide has no `label` field.
- Fly "Saumur" [-0.08, 47.26], caption p7 "l'offrande faite par les habitants de Saumur de deux « busses » (soit 536 litres) de vin « clairet » à JEAN V, Duc de Bretagne". KEEP.
- Missing flights: the guide flies to the Loire and Saumur; no other flight added.

## Fact sheet
- soil.text: sheet says "tuffeau limestone of the Turonian is key"; p7 says the Turonian stage is essential as the source of tuffeau building stone, and does not call it a soil or limestone.
- why.text: sheet says "mild oceanic climate" and Cabernet Franc and Grolleau "grown for a fresh dry rosé"; p7 gives mild winters only in the west, p8 has Cabernet Franc and Grolleau in the west and Gamay and Pineau d'Aunis in the east, chosen for the land and climate.
- famous.styles: sheet says "light" rouget and vin gris; p9 says "frais, original, gouleyant", "titre alcoométrique volumique peu élevé".
