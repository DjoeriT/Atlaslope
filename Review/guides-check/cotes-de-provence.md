# cotes-de-provence: sentence check

Source: cotes-de-provence-doc (fiche technique PDO-FR-A0392, document unique, 14 pp.). Checked 2026-10-23.

## Title and lede
- KEEP title (standard guide title).
- KEEP p9/p10 "diversité des situations géo-pédologiques et ... des mésoclimats", "damier naturel"; p6 "longue saison sèche et chaude"; p6-7 "Ces vents froids dégagent le ciel et dessèchent l'atmosphère". Added p7 cite.
- FIX p9/p10 "choix des variétés", "terre d'assemblage"; "89 %", "robe rose pâle": "mostly pale, fruity rosé" → "mostly pale rosé" (page says fruity *or floral*).

## place
- FIX title p6 "basse Provence calcaire, à l'ouest et au nord ... cristalline, au sud et à l'est": "limestone hills to crystalline coast" → "limestone west to crystalline east" (hills/coast not in this line).
- KEEP p6 "s'étend de la basse Provence calcaire ... (Maures et Esterel)".
- KEEP p6 "longe les plages de la Méditerranée, se faufile dans les vallées, s'étale sur la rocaille écrasée de soleil".
- KEEP p6 "s'arrête aux lisières parfumées des pinèdes".
- KEEP p6 "84 communes, dont 68 ... Var, 15 ... Bouches-du-Rhône et une ... Alpes-Maritimes, sur les rives du fleuve Var".
- FIX p6 "excluant les territoires dominés par des influences climatiques continentales": "shaped by" → "dominated by" (Sainte-Victoire itself has continental influences, p10).
- FIX p9 "le plus étendu parmi les vignobles provençaux. Il couvre, en 2009, plus de 20000 hectares": the 2009 date belongs to the area, not the ranking.
- KEEP fly Massif des Maures p7 "implanté en îlots au cœur des forêts de pins et de chênes-lièges". Point [6.4, 43.25] is in the massif (OSM no result; Collobrières ~6.31, 43.24).
- KEEP fly Saint-Tropez p8 "ports de commerce, tels ceux de Saint-Tropez ... favorisé l'exportation ... notoriété". Point matches the town (OSM hit was a street in Xàbia, ignored).

## weather
- FIX title "Hot, dry and swept by the mistral" → "A long hot season and the mistral": p6 mistral "influence est décroissante d'ouest en est", so not the whole area is swept.
- KEEP p6 "climat méditerranéen de type provençal ... longue saison sèche et chaude, des hivers doux et secs, des automnes et des printemps pluvieux".
- KEEP p6 "températures moyennes annuelles atteignent 15°C".
- KEEP p6 "entre 600 millimètres et 900 millimètres", "supérieur à 2700 heures".
- FIX p6-7 "Les vents du nord et du nord-ouest sont les plus importants (Mistral) ... dégagent le ciel et dessèchent l'atmosphère": added "are the strongest", split sentence.
- KEEP p6 "Leur influence est décroissante d'ouest en est".
- KEEP p7 "vents du sud et du sud-est sont porteurs d'humidité et de pluies ... croissante de l'ouest vers l'est".
- KEEP p6/p7 "selon la présence de lignes de reliefs et en fonction des ouvertures ... mer", "de nombreux mésoclimats".
- FIX p10 "concentration de la matière première et de préservation sanitaire ... dus aux vents dominants": "Those winds" (read as the south winds) → "The prevailing winds".

## ground
- FIX title "Five landscapes, five soils" → "Five natural zones" (p7 "cinq grandes zones naturelles"; soils are more than five).
- FIX p7 "grandes lignes de reliefs d'orientation dominante est-ouest, au sein de laquelle s'identifient cinq grandes zones naturelles": the ridges run east-west, not the zones.
- FIX p7 "constitué de granits, gneiss, micaschistes ... Le vignoble y est implanté en îlots au cœur des forêts": "granite, gneiss and mica-schist carry the vines" → the massif is that rock and the vines sit in islands in the forest (also drops an X, Y and Z list).
- FIX p7 "enveloppe le massif des Maures à l'ouest, au nord et nord-est, de Toulon jusqu'à Saint-Raphaël ... grès rouges et de pélites ... sols argilo-sableux de couleur rouge ou lie-de-vin": "clay-sands" → sandy clay soils; added extent; split sentence.
- KEEP p7 "a conquis les sols à bon régime hydrique, abandonnant les sols peu profonds développés sur grés à la pinède et à l'olivier".
- FIX p7 "calcaires fortement plissés ... implanté en îlots sur des parcelles présentant des sols marno-calcaires ... s'étagent souvent en terrasses": "hills give marl-limestone soils" (causal) → hills, and vines on marly limestone soils.
- FIX p7 "synclinal largement ouvert sur la mer. Marnes et grés ... dominent ... sols peu profonds à bon régime hydrique": marl and sandstone are the rock, not "shallow marl and sandstone soils".
- FIX p7 "délimité, au nord, par la chaîne de Sainte-Victoire ... parfois violemment soumis au Mistral ... sur les collines et piémonts ... grès calcaires et d'argiles gréseuses": "limestone sandstones" → limy sandstone (calcaire); "can blow" → "sometimes blows"; added hills and foothills; split the long sentence.
- KEEP p10 "les parcelles, précisément délimitées pour la récolte des raisins, reposent sur des sols peu profonds à bon régime hydrique" (added "marked out for the harvest").
- KEEP fly Montagne Sainte-Victoire p7 "délimité, au nord, par la chaîne de Sainte-Victoire". Point [5.6, 43.53] is on the ridge (OSM no result).

## rules
- KEEP title p10 "terre d'assemblage"; p9 rosé "grande majorité".
- KEEP p9 "89 % de la production en 2009".
- FIX p2 "vins tranquilles blanc, rouge ou rosé", p9/p3 "Les vins blancs, secs": cite p2, p3 added.
- FIX rosé sentence: it repeated the fact sheet's `tastes` word for word. Rewritten from p9 "selon leur origine, une palette aromatique fruitée ... ou florale, mêlée de notes minérales ou empyreumatiques ... équilibrée entre rondeur et vivacité".
- FIX red sentence, same reason, from p9 "cuvaison courte, à consommer rapidement", "longue garde, aux arômes complexes de fruits noirs, cacao, venaison, épices et aux tanins puissants, soyeux": "firm" → "powerful"; added cocoa, game.
- FIX white sentence, same reason, from p9 "robe jaune à reflets verts ... d'agrumes, floraux (fleurs blanches), balsamique ou de miel".
- KEEP p8 "lieu de passage entre l'Italie, l'Espagne et la Vallée du Rhône ... nouvelles variétés qui se marièrent aux variétés locales plus anciennes".
- KEEP p8 "sous les excès du climat méditerranéen, chaque cépage apporte ses qualités et ses insuffisances ... rare qu'un vin issu d'une seule variété présente un équilibre parfait".
- KEEP p8 "grenache N, cinsault N, syrah N, tibouren N, mourvèdre N, carignan N et cabernet-sauvignon N, pour les vins rouges et rosés" (added "seven black grapes").
- KEEP p8 "souvent associée une faible part de cépages blancs ... vermentino B (dénommé localement rolle) et le cépage sémillon B".
- KEEP p8 "clairette B, ugni blanc B, vermentino B, et dans une moindre mesure le cépage sémillon B, sont à la base des vins blancs".
- KEEP p10 "grenache N et tibouren N apportent richesse en alcool et rondeur, ... cinsaut N, finesse et élégance, ... syrah N, arômes fruités ... mourvèdre N une bonne aptitude au vieillissement" (split into short sentences).
- FIX p10/p13 "trois dénominations géographiques ... pour les vins rosés et les vins rouges"; p13 "peut être complétée des dénominations géographiques complémentaires": now says they are label additions for red and rosé only.
- FIX p10-11 Sainte-Victoire "extrémité occidentale ... climat aux influences continentales", "sols à dominante carbonatée, caillouteux et filtrants ... climat plus frais qui implique un décalage dans la pleine maturité ... les vins rosés sont plus vifs et plus structurés": "limestone and stony soils" → stony, free-draining carbonate soils; added continental influence and the rosé effect.
- FIX p11 Fréjus "influences maritimes marquées ... presque permanent ... « La Montagnère »", rosés "très ronde, avec une sensation de gras", "vins plus gras (vins rosés)": "rounder" → "very round and full".
- FIX p12 La Londe "terminaison côtière, au sud-ouest des Maures occidentales", "sols schisteux et filtrants", rosés "équilibre entre fraîcheur (vivacité) et rondeur (gras)": "its wines balance" → "its rosés balance" (the reds are "puissants").
- KEEP p9 "arrêtés ministériels du 7 Août 1953 et du 20 juillet 1955 ... 23 propriétés ... « crus classés »" (also p3 mention traditionnelle). Famous style: kept here, not in `label`.
- KEEP fly Fréjus p11 "extrémité nord-est de la Dépression Permienne", "Ouvert vers la mer", "presque permanent ... La Montagnère". Point [6.74, 43.43] is the town (OSM hit was a Barcelona fountain, ignored).

## label
- FIX p13 "unité géographique plus grande « Vin de Provence » ... pas supérieures ... figure dans le même champ visuel": added the same-field-of-view rule.
- Sweep p3 mentions: "Appellation d'origine contrôlée" (base term), "Cru classé" (famous style, in rules beat), "Clos" and "Château" have no rule of their own anywhere in the pliego: not added. Dénominations Sainte-Victoire, Fréjus, La Londe: famous styles, in rules beat.
- Wine types: p2 still white, red, rosé only. All three named. No sparkling, sweet or fortified category.
- Numbers checked: 84, 68, 15, one, 20,000, 2009, 15 °C, 600, 900, 2700, 89%, 23, 1953, 1955.

## Fact sheet
- famous.styles[0] Sainte-Victoire: sheet "on limestone soils"; pliego p11 "sols à dominante carbonatée, caillouteux et filtrants". Edit proposed.
- famous.styles[1] Fréjus: sheet "rounder wines"; pliego p11 rosés "très ronde ... gras", reds "élégance ... tanins fins". Roundness is the rosés'. Edit proposed.
- famous.styles[2] La Londe: sheet "fresh and round" for all; pliego p12 gives that balance to rosés, reds are "puissants". Edit proposed.
- tastes: reds "firm tannins"; pliego p3/p9 "tanins puissants, soyeux". Close, not changed.
