# Touraine sentence check

Source: touraine-doc (fiche technique PDO-FR-A0501, document unique, pages 2-15). Guide: content/guides/touraine.json. Checked 22 Oct 2026.

## Lede
- FIX p7/p8/p10 "le Cher, l'Indre et la Vienne, viennent rejoindre la Loire"; "atténuation nette de son influence ... à hauteur du méridien de Tours"; "Sous l'influence du climat, un encépagement ...". Was a near-copy of the climate beat's grape line ("splits the vineyard in two", "take over" overstated a climate limit); rewritten as confluence plus fading ocean influence.
- KEEP title "Why Touraine tastes the way it does" (house title).

## Place: confluence
- FIX title: "Where four rivers meet the Loire" -> "three rivers". p7 names the Cher, the Indre and the Vienne joining the Loire.
- KEEP p7 "plateau mollement ondulé, au sud-ouest du Bassin Parisien ... le Cher, l'Indre et la Vienne, viennent rejoindre la Loire"
- KEEP p7 "implanté sur une centaine de kilomètres, s'organise le long des vallées, à l'exception de la Sologne viticole, à l'est ... en situation de plateau, entre le Cher et la Loire"
- KEEP p7 "L'altitude générale dépasse rarement 100 mètres ou 120 mètres, sur le territoire des 143 communes"
- KEEP p11 "5 dénominations géographiques complémentaires sont reconnues"
- FIX p7 "« Amboise » et « Mesland » ... le long du Val de Loire ... « Azay-le-Rideau » borde la vallée de l'Indre ... Cher abrite en son aval ... « Chenonceaux » ... « Oisly » occupe le plateau oriental". Long list sentence split into one per area; "eastern" plateau restored.
- KEEP fly Chenonceau p11 "s'étire sur les coteaux des deux rives du Cher"; point [1.07, 47.325] is Chenonceaux village (OSM pack gave no result; checked by known position).
- FIX fly Oisly p7 "repose, en situation de plateau, entre le Cher et la Loire": caption kept; point [1.38, 47.35] moved to the village at [1.383, 47.383] (about 3.5 km off).

## Weather: climate
- FIX title: "An ocean breeze" -> "An ocean influence". p8 speaks of "influence océanique", no breeze.
- KEEP p8 "climat océanique, avec une atténuation nette de son influence ... à hauteur du méridien de Tours"
- KEEP p8 "précipitations d'environ 550 millimètres, à l'ouest, qui vont jusqu'à 650 millimètres, à l'est, et une plus grande amplitude thermique, à l'est"
- FIX p10 "un encépagement reposant sur les cépages chenin B et cabernet franc N est développé dans la partie occidentale ... sauvignon B, cot N et gamay N sont privilégiés dans la partie orientale. Le méridien de Tours marque cette limite climatique naturelle." "That line is where the grapes divide" / "grow" sharpened to the page: developed in the west, favoured in the east, the meridian marks the climate line.
- FIX p12 "une saison sub-sèche la plus accentuée de la région Touraine": "driest season of the whole Touraine area" -> "most marked dry season in the Touraine region".
- KEEP p12 "Ce milieu naturel offre des vins à la fraîcheur marquée"
- FIX p12 "L'amplitude thermique élevée et la situation géographique mets en valeur des cépages précoces": the position was dropped and "suits" replaced the page's "show off"; both restored, sentence split.
- KEEP fly Amboise p11 "Le plateau de craie tendre ... altitude comprise entre 80 mètres et 100 mètres"; point [0.98, 47.41] is Amboise.

## Ground: soils
- FIX title: "Flint, limestone and gravel" (X, Y and Z list) -> "Flint clay on the slopes, gravel in the valleys" (p8 "premières pentes ou « côtes » des vallées"; "terrasses d'alluvions anciennes").
- KEEP p7 "On distingue parmi ces parcelles"
- KEEP p7-8 "sols dérivés de l'argile à silex, auxquels sont mêlés des sables miocènes ... « bournais perrucheux »"
- FIX p8 "argiles à silex ou « perruches », ou des sols argilo-calcaires, pierreux ... «aubuis»": the guide gave "aubuis" to both; flint clay is "perruches", stony clay-limestone is "aubuis".
- KEEP p8 "ce sont des sols chauds et perméables, qui reposent sur les premières pentes ou « côtes » des vallées"
- FIX p8 "terrasses d'alluvions anciennes, dénommés localement «graviers»": local name added.
- KEEP p10 "ne retient que les parcelles présentant des sols drainants développés principalement sur turonien et sénonien"
- KEEP p10 "L'argile à silex ... couvre majoritairement les sols des vallées intermédiaires"
- KEEP p10 "Ces silex, nombreux en surface, jouent alors un rôle important lors de la maturité en augmentant les taux d'échanges de chaleur du sol"
- KEEP p10-11 "sauvignon B se plait notamment sur ... « perruches » et « d'aubuis » ... maturité constante, au fil des ans"
- KEEP p11 "gamay N ... repose principalement sur ... « argiles à silex » et les vins qui en sont issus sont fruités et alertes"
- FIX p12 "sables et graviers continentaux et les formations dites « de Sologne » composées de sables, argiles et faluns": Sologne formations added; wine type moved to the rules beat.

## Rules: wines
- KEEP title "Sauvignon, gamay and a bottle-fermented sparkler" p9 "sauvignon de Touraine » et « gamay de Touraine »"; p14 "seconde fermentation en bouteille".
- KEEP p2 "vins tranquilles blancs, rouges, rosés et des vins mousseux blancs et rosés" (cite p2 added to the beat). Split into two sentences.
- FIX p3 white tasting line (pale gold, citrus, exotic fruit, white flowers, fresh end): repeated the fact sheet's `tastes`; replaced with p3 "rondeur en bouche et des finales fraiches et bien équilibrées".
- KEEP p11 "Ils représentent les 2/3 de la production ... en 2009"
- KEEP p11 "des caractères frais et originaux"
- CUT gamay red tasting line and rosé tasting line (p3/p10): repeated `tastes`. Replaced by the missing label term: ADD p13-14 "suivi obligatoirement de l'indication « gamay » ... inscrite immédiatement en dessous du nom de l'appellation".
- KEEP p11 "Les vins rouges à l'est du méridien de Tours ont le cépage cot N comme colonne vertébrale, tandis que le cabernet franc N s'impose à l'ouest"
- FIX p11 "Ils apportent une belle structure tannique": the cabernet franc tasting line repeated `tastes`; replaced with the page's tannin line.
- KEEP p13 "peut être complété par l'une des dénominations géographiques complémentaires ... «Amboise», «Azay-le-Rideau», «Chenonceaux», «Mesland», «Oisly»"
- FIX p11 "les vins blancs sont généralement secs, mais peuvent parfois présenter des sucres fermentescibles et être qualifiés de « demi-sec », « moelleux » ou « doux »": French terms explained, sentence split.
- FIX p11 "Les cépages grolleau N et chenin B colonisent les collines et replats sablo-graveleux": "whites mostly from chenin" and "rosés from grolleau" were not on the page.
- KEEP p11 "les vins rosés sont élaborés obligatoirement par la technique de pressurage direct précédant la fermentation" (split out).
- FIX p11 "au moins jusqu'au 30 avril de l'année qui suit celle de la récolte ... au moins jusqu'au 31 août": "respectively"-style pairing split into one sentence per colour.
- KEEP p12 "Les vins rouges et rosés, principalement issus du cépage gamay N"
- KEEP p12 "vins blancs secs à partir du seul cépage sauvignon B ... au moins jusqu'au 30 avril"
- ADD p14 "Les vins blancs bénéficiant des dénominations ... «Amboise», «Mesland» ou «Azay-le-Rideau» sont obligatoirement présentés ... avec la mention «demi-sec» ... «moelleux» ou « doux »"; rosés of Amboise and Mesland the same. Missing label rule.
- FIX p3/p10/p14 "Primeur": the page gives "consommés rapidement dans les mois suivants leur élaboration" for rosés only (p10) and lets gamay reds carry the term (p3). Guide had widened the drink-soon line to all; now says rosés and gamay reds may carry it, primeur rosés are made to drink within months. "nouveau" explained.
- KEEP p14 "sont obligatoirement présentés avec l'indication du millésime"
- ADD p14 "peut préciser le nom d'une unité géographique plus petite, sous réserve : qu'il s'agisse d'un lieu-dit cadastré; que celui-ci figure sur la déclaration de récolte". Missing label term, explained.
- FIX p14-15 "exclusivement élaborés par seconde fermentation en bouteille; La durée de conservation en bouteilles avant dégorgement ne peut être inférieure à 9 mois": guide read as 9 months of fermentation; now 9 months in bottle.
- FIX p12 "Constatant que des vins mis en bouteilles dans les caves avaient parfois tendance à fermenter à nouveau ... souhaité maîtriser ce phénomène ... à partir du XIXème siècle": century added.
- FIX p12 "caves creusées dans le tuffeau ... vastes espaces tempérés de stockage": "large, temperate" restored.
- FIX p12 "L'originalité territoriale des vins blancs est traduite par l'obligation de la présence de 60% de cépage chenin B ou d'orbois B": section is sparkling; "whites" -> "sparkling whites".
- ADD p3 "structure à dominante acide qui apporte aux vins toute sa fraîcheur": sparkling wines had no character line.
- FIX p12 "L'élevage long « sur lattes » contribue à développer les arômes briochés et la complexité": "on the lees" is not the page's term; now "in bottle, sur lattes", with complexity.
- KEEP fly Azay-le-Rideau p11 "entre les vallées de la Loire et de l'Indre ... collines et replats sablo-graveleux"; point [0.47, 47.26] is Azay-le-Rideau.

Missing wine types: the pliego protects still white, red and rosé, and sparkling white and rosé (p2). All named. No generoso or vin de liqueur. Traditional mentions "Clos" and "Château" (p4) are only listed and given no rule in the pliego, so they are left out.

## Fact sheet
- famous.styles "Primeur / Nouveau": sheet says "Made to drink within months" for all primeur wines. The pliego says this only of rosés (p10 "vinifiés pour être consommés rapidement dans les mois suivants"); gamay reds may carry the term (p3). Proposed: "Rosés and gamay reds; rosés made to drink within months; vintage on label." (not sure: wording).
- No other field disagrees: styles.kinds (red, white, rose, sparkling) matches p2; climate, soil, altitude and tastes match p3, p7, p8, p10 and p11.
