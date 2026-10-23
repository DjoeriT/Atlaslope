# cotes-du-rhone-villages check: source cotes-du-rhone-villages-doc (PDO-FR-A0664, document unique)

## Lede
- FIX p8/p10 "souffle en moyenne 120 jours par an" / "protège les vignes des attaques cryptogamiques" / "concentration induite ... par la constance du Mistral": "about" → "on average"; dropped the three-item list and "clears the sky for sun" (said in climate); "north wind" from "vent du nord".

## valley (place)
- Title KEEP p8 "la vallée du Rhône est un fjord méditerranéen ... Après le retrait de la mer"
- FIX p8 "La zone géographique correspond à la région naturelle de la vallée du Rhône. Le fleuve en constitue le cœur": subject is the area, not the vineyards
- FIX p8/p9 "95 communes ... entre Montélimar et Avignon ... rive occidentale et ... orientale"; p9 "s'étend sur 4 départements": subject "the area"
- KEEP p8 "fjord méditerranéen qui s'allonge jusqu'à Vienne"
- FIX p8 "sous l'action des phénomènes d'érosion (pluies, vents, érosion fluviatile)": dropped the "rain, wind and river" list, kept "erosion"
- KEEP p8 "Le paysage est ainsi dominé par les coteaux et les terrasses"
- FIX p9 "La proximité du Rhône assure aux vins un bon débouché commercial": "carried the wine to market" → "gave the wine a good market"
- FIX p8 "probablement apportés par des colons grecs, 600 ans avant Jésus-Christ": "about" removed
- FIX p10 "a permis le commerce des vins dès la colonisation grecque et donc le maintien, depuis plus de 2000 ans d'une tradition viticole": the 2000 years are the wine tradition, not the trade
- Fly "The Rhône valley" FIX caption p8 "vineyards" → "area". Point between Montélimar and Avignon, OK (no OSM result in pack).
- Fly "Vaison-la-Romaine" KEEP p9 "PLINE loue la qualité des vins issus des nombreux coteaux qui bordent l'Ouvèze (Roaix, Vaison-la-Romaine, Séguret, Sablet, …)"; FIX caption: dropped the four-name list. Point [5.075, 44.241] is the town (no OSM result in pack).

## climate (weather)
- Title FIX p8 "souvent violent et toujours asséchant": "violent" dropped the hedge "souvent" → "a drying wind"
- KEEP p8 "méridionale, méditerranéen avec des étés chauds et secs et une faible pluviométrie annuelle"
- KEEP p8 "septentrionale, continental tempéré, avec une pluviométrie équivalente"
- KEEP p8 "Les précipitations surviennent principalement en automne et à la fin de l'hiver"
- FIX p8 "pendant la période végétative ... l'évapotranspiration n'est compensée que par de rares précipitations, sous forme orageuses en été": growing season restored
- KEEP p8 "Les réserves en eau du sol s'épuisent progressivement ... ralentissement puis un arrêt de la croissance végétative"
- KEEP p8 "Mistral, vent du nord souvent violent et toujours asséchant"
- KEEP p8 "montagnes et collines, encadrant la vallée, crée un effet de couloir ... renforçant la force du vent"
- FIX p8 "dégageant le ciel et favorisant une forte insolation dépassant toujours 2500 heures": hedge "favorisant" restored ("favours")
- KEEP p10 "Mistral, violent, froid et sec, qui protège les vignes des attaques cryptogamiques"
- FIX p10 "bonne maturité des raisins par un ensoleillement important, une pluviométrie adaptée et la concentration induite, elle aussi, par la constance du Mistral": ripeness comes from sun, suited rain and concentration; the Mistral does the concentrating

## soils (ground)
- Title KEEP p8 three bulleted soil types
- KEEP p8 "Les sols rencontrés sont de fait de natures très différentes"
- KEEP p8 "sols développés sur terrasses fluviatiles"
- KEEP p8 "sols développés sur marnes et calcaires tendres"
- FIX p8 "ou encore sols issus de l'érosion (marnes, sables, grès ou molasses)": "The rest come from eroded ..." → "Others again come from erosion: ..." (the page's own list kept)
- KEEP p10 "longueur de garde variable selon les types de sol"
- KEEP p10 "plus légers sur les sols sableux ou sablo-limoneux, plus riches, tanniques sur les sols caillouteux ou argileux"

## wines (rules)
- Title KEEP p4 "grenache N ... d'au moins 50 %"; p12 dénominations géographiques complémentaires
- KEEP p4 "Les vins rouges et rosés représentent l'essentiel de la production (98 %)"
- CUT "full and generous, with good colour" (p4 "pleins, généreux avec une bonne intensité colorante"): repeats the fact sheet's tastes
- KEEP p4 "longueur de garde variable selon les types de sol ... et l'assemblage des cépages déterminé par le savoir-faire du producteur"
- FIX p4 "est présent dans les assemblages dans une proportion d'au moins 50 %": "must make up" → "makes up" (page describes, does not prescribe)
- KEEP p4 "Les cépages syrah N ou mourvèdre N lui sont associé"
- FIX p7 variety list: four-name list cut to Cinsaut and Carignan
- KEEP p4 "Les vins blancs (2 % de la production)"
- CUT "round in the mouth, sometimes with notes of spice and vanilla" (p4): repeats the fact sheet's tastes
- FIX p7 variety list: four white names cut to Viognier and Roussanne
- KEEP p4 "Les vins sont des vins tranquilles et secs"
- KEEP p6 "Le rendement est fixé à 44 hectolitres par hectare"
- FIX p12 "peut être complété par une des dénominations géographiques complémentaires suivantes pour les vins répondant aux conditions de production fixées pour ces dénominations": 17 names counted; they are place names, not all villages (Plan de Dieu, Massif d'Uchaux, Signargues); added the rule; list cut to two names
- KEEP p9 "les producteurs expriment le désir de valoriser et d'identifier les meilleurs vins par un nom géographique"
- KEEP p9 "en 1966, ... associer au nom ... « Côtes du Rhône », le nom de quelques communes ... puis, en 1967, à la reconnaissance de ... « Côtes du Rhône Villages »": split into two sentences
- Fly "Cairanne" FIX point [4.9, 44.22] → [4.929, 44.231] (about 2.8 km off the village; no OSM result in pack); caption "village names" → "extra place names", p12 "« Cairanne »"
- Wine types: p2 "vins tranquilles blancs, rouges ou rosés": all three named. No sparkling, sweet or liqueur wine.
- Label terms: p4 mentions traditionnelles "Villages", "Clos", "Château" carry no rule in this document; the guide has no label field, nothing added.

## Fact sheet
- famous.styles[0] "Villages with a place name": sheet says "one of 17 named villages"; p12 says 17 "dénominations géographiques complémentaires", some not villages (Plan de Dieu, Massif d'Uchaux, Signargues).
- Otherwise agrees with p2, p4, p7, p8, p10.
