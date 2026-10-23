# fitou: sentence check against fitou-doc (fiche technique PDO-FR-A0195, document unique)

## Title
- KEEP "Why Fitou tastes the way it does" (standard guide title)

## Lede
- FIX p5/p7 "deux entités distinctes" + "Le vignoble produit uniquement des vins rouges": was "Dry, stony soils and low yields push Fitou towards rich, warm reds that keep well"; p7 says "sols secs et pauvres" and "rendements de faibles à modérés", and the result is a hedge ("contribuent à donner des vins riches, chaleureux et à très bon potentiel de garde"). Now: red only, two pieces; soil, climate and growers "help give" rich, warm reds that keep very well.
- FIX p7: Carignan/Grenache sentence repeated in the rules beat; moved there (lede repeated in body).

## place: "Two pieces, between sea and hills"
- FIX title: was "Two vineyards, one sea apart from the hills"; "one sea apart" has no source. p5 "Entre Méditerranée et Massif des Corbières … deux entités distinctes".
- KEEP p5 "deux entités distinctes, séparées par un plateau calcaire et distantes d'une quinzaine de kilomètres"
- KEEP p5 "l'une à l'est, s'étend sur 5 communes du piémont des Corbières maritimes, en bordure d'étangs et de la mer"
- KEEP p5 "l'autre à l'ouest, regroupe 4 communes, plus en altitude, au pied du Mont Tauch (917 mètres)"
- KEEP p5 "une série de petites collines prolongées par une longue plaine caillouteuse"
- KEEP p5/p6 "surplombée par la presqu'île du plateau de Leucate, promontoire de 50 mètres d'altitude visible de la mer"
- KEEP p6 "petits bassins organisés autour de vallées étroites et fermées, dominées par des coteaux aux pentes abruptes"
- Flight Leucate plateau: KEEP caption p5/p6. Point [3.03, 42.91] not re-checked: pack lookup gave no result and the Nominatim retry was refused by the sandbox. [A] within ~3 km of the plateau.
- Flight Mont Tauch: KEEP caption p5. Point [2.69, 42.89] not re-checked (same reason). [A] summit lies roughly 2-3 km south-west; worth one lookup.

## weather: "Windy coast, cooler hills"
- KEEP title p6 "très souvent venté" / "moins venté, plus frais"
- KEEP p6 "méditerranéen chaud et sec mais nuancé selon les secteurs"
- KEEP p6 "très souvent venté, (200 jours de vent de nord/ouest)"
- FIX p6 "la faible pluviométrie (600 millimètres en moyenne par an) est compensée par l'humidité maritime": "low" was dropped; restored.
- KEEP p6 "plus en altitude, et éloigné de la mer, le climat est moins venté, plus frais"
- KEEP p6 "précipitations plus élevées de l'ordre de 700 millimètres en moyenne par an"
- KEEP p6 "L'ensoleillement pour les deux secteurs reste élevé"

## ground: "Stony, shallow and warm"
- KEEP title p6 "caillouteux, peu profonds et chauds"
- KEEP p6 "en zone littorale, des sols argilo-calcaires issus de l'altération des calcaires et des sols alluvio-colluviaux dans les zones basses"
- KEEP p6 "sur la zone montagneuse, des sols développés sur schistes, calcaires ou grès ou … sur quelques rares terrasses caillouteuses"
- KEEP p6 "Ces sols ont en commun d'être généralement caillouteux, peu profonds et chauds"
- FIX p8 "la vigne trouve un peu de place au milieu des garrigues, dans les vallons, sur les bas de pente, sur le peu de terre accumulée au cours des millénaires": "garrigue" now explained; four-item list split into two sentences.

## rules: "Only red, always a blend"
- KEEP title p2/p3 "vins secs tranquilles rouges" / "assemblage … d'au moins 2 cépages"; p7 "uniquement des vins rouges"
- KEEP p2/p3 "Les vins sont des vins secs tranquilles rouges" / "d'au moins 2 cépages"
- KEEP p7 "deux cépages méditerranéens traditionnels que sont le carignan N et le grenache N"
- KEEP p5 "Mourvedre N, Grenache N, Syrah N, Carignan N"
- KEEP p7 "Le cépage carignan N apporte la puissance, tempérée par la générosité et l'onctuosité du cépage grenache N"
- FIX (added, moved from lede) p7 "le tout conférant aux vins un velouté et un fondu caractéristique"
- FIX p7 "Entre les sols argilo-calcaires de la zone littorale et les sols plus difficiles de la zone montagneuse se développe un gradient d'aptitude propice à la présence du cépage syrah N, qui développe finesse et complexité autour de notes de violette et de petits fruits": the soil condition behind Syrah was dropped; restored.
- KEEP p7 "mourvèdre N, notamment en bordure littorale, qui, grâce à sa structure tannique, apporte un potentiel de garde important"
- KEEP p7 "sols secs et pauvres … une taille courte et des rendements de faibles à modérés"; p4 "Le rendement est fixé à 45 hectolitres par hectare"
- CUT p3/p7 "Riches en tanins, les vins sont puissants, charpentés … fruits rouges et d'épices … fruits noirs, de truffe, de grillé, voire de cuir ou de gibier": correct, but repeats the fact sheet `tastes` word for word.
- FIX p7 "Pour affiner la structure tannique, une période minimale d'élevage jusqu'au 15 avril de l'année suivant celle de la récolte": the reason was missing; added.
- CUT p3/p7 "Ils peuvent être appréciés dans leur jeunesse, mais ils vieillissent merveilleusement": repeats the fact sheet `tastes`.
- FIX (added) p8 "peut préciser l'unité géographique plus grande «Languedoc» … pas supérieures … à la moitié": the only label rule with its own terms was missing.
- Label sweep: p3 mentions "Appellation d'origine contrôlée", "Clos", "Château" have no Fitou rule of their own; not added. Wine types: only dry still red (p2); nothing missing.
- Numbers: 15 km (p5 "une quinzaine"), 5 and 4 communes, 917 m, 50 m (p5-6), 200 days, 600 mm, 700 mm (p6), 2 varieties (p3), 45 hl/ha (p4), 15 April (p7): all confirmed.

## Fact sheet
- why.text: sheet says "Carignan and Grenache at low yields"; pliego p7 says "rendements de faibles à modérés" (low to moderate) and names "sols secs et pauvres" with short pruning. Edit proposed.
- No other field disagrees (grapes, styles.kinds red, climate, soil, altitude, tastes, famous.styles empty all match p2-p7).
