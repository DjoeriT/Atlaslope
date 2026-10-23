# Sentence check: entre-deux-mers
Source: entre-deux-mers-doc (Fiche technique PDO-FR-A0406-AM01, Ares(2014)346367, 12/02/2014). Checked 22 Oct 2026.

## Title
KEEP "Why Entre-deux-Mers tastes the way it does" (standard title)

## Lede
FIX p4 "vaste plateau délimité par ... la Dordogne au nord et ... la Garonne au sud": "squeezed" -> "wide" ("vaste" is the page's word).
KEEP p6 "La vigne n'est plantée que sur les terrains les moins fertiles"
KEEP p1 "vins blancs secs tranquilles ... fleurs blanches ... agrumes ... destinés à être consommés jeunes"

## place: "A plateau between two rivers"
KEEP p4 title "vaste plateau délimité par la rive gauche de la Dordogne ... la rive droite de la Garonne"
CUT "The name means \"between two seas\"": no page says it. The sentence now opens "Entre-deux-Mers is a wide plateau in the Gironde."
KEEP p4 "vaste plateau ... Dans le département de la Gironde"
KEEP p4 "la rive gauche de la Dordogne au nord et la rive droite de la Garonne au sud"
KEEP p4 "cette appellation concerne 133 communes"
CUT "Vines are not planted everywhere on it.": p6 says it, the chapter cites p4-p5, and the soils chapter already carries it with p6.
KEEP p4 "Le vignoble se situe sur de hautes terres disséquées par de nombreux cours d'eau qui ont formé les coteaux"
FIX p5 "Le paysage ... est varié, les bois et prairies se partagent les coteaux exposés au nord, comme les parties humides ou alluviales": dropped "Around it", split the colon line, "cover" -> "share".
KEEP p5 "la vigne cerne les multiples bastides, ces bourgs historiques dont les places centrales sont le théâtre de marchés traditionnels"
KEEP p5 "issus d'une présence viticole très ancienne"
KEEP p5 "La colonisation gallo-romaine est la première à faire ... une région viticole de prédilection"
FIX p5 "A partir du XI ème siècle, les moines, plus particulièrement, développent la viticulture. L'installation des Bénédictins à La Sauve Majeure est un moment décisif": split in two; the settling (not the Benedictines) is the decisive moment; "plus particulièrement" kept as "above all".
Fly La Sauve Majeure: FIX caption p5 "Les religieux de l'Abbaye étendent le vignoble": dropped "from the 11th century", which the page ties to monks in general, not to the abbey. Point [-0.3, 44.775]: the pack had no OSM result; it lies within about 1 km of La Sauve abbey [A]. Kept.
Fly plateau: KEEP caption p4. Point [-0.2, 44.78] lies between Targon and Branne, inside the delimited communes [A]. Kept.
Missing flights: both rivers show in the plateau flight at zoom 9; the page names no single bastide. None added.

## weather
FIX title "Ocean air, softened" -> "Ocean climate, moderate rain": "softened" has no source; p4 "climat de type océanique ... pluviosité modérée".
KEEP p4 "Malgré son climat de type océanique ... bénéficie d'une pluviosité modérée"
KEEP p4 "Si les vents océaniques dominent"
FIX p4 "vents du sud-est moins humides": "drier" -> "less humid".
CUT "The two rivers help too.": the page credits the position "entre deux marées", not the rivers.
FIX p4 "un nivellement relatif des fluctuations saisonnières grâce à sa situation « entre deux marées »": the position now does the levelling ("somewhat" keeps "relatif"); the bores no longer share it.
KEEP p4 "l'influence des mascarets, ces vagues montantes lors des grandes marées, est très sensible à l'intérieur des terres"

## ground: "Clay for white grapes"
KEEP p4 title "les sols à prédominance argileuse sont très propices à l'implantation des cépages blancs"
FIX p4 "plateau calcaire d'âge tertiaire ... Le plateau argilo-calcaire s'étend entre 60 mètres et 100 mètres d'altitude en moyenne": "limestone mixed with clay" -> "clay and limestone".
ADD p4 "La région a ainsi reçu les alluvions des Pyrénées par la Garonne, et celles du Massif Central par la Dordogne" (two sentences).
FIX p4 "Les secteurs de plateau présentent des sols qui sont fréquemment constitués de formations de recouvrements limoneux d'origine éolienne plus ou moins épais, dénommés boulbènes": "On top" -> "On the plateau".
KEEP p4 "les sols à prédominance argileuse sont très propices à l'implantation des cépages blancs"
FIX p4 "Les formations superficielles de versant sont plantées en vignes lorsqu'elles sont associées à des expositions sud et ouest, le ruissellement en ayant éliminé les recouvrements sablo-limoneux": the planting rule was missing; now two sentences.
KEEP p5 "Les sols sont graveleux dans une matrice sablo-argileuse"
KEEP p5 "l'érosion des coteaux peut mettre en évidence la couche de molasse sous-jacente aux calcaires, en particulier ceux regardant la Dordogne"
KEEP p6 "La vigne n'est plantée que sur les terrains les moins fertiles"
FIX p6 "les sols profonds présentant une richesse minérale importante et surtout une forte réserve en eau utile sont exclus": one kind of soil with both traits, not two kinds.
FIX p6 "les fonds de thalweg, empêchant un écoulement normal de l'air froid, les bas de parcelles concaves, les bordures de ruisseaux et les pentes rendues hydromorphes par des mouillères sont exclues": thalweg explained; the list split into three sentences; "waterlogged slopes" -> "slopes waterlogged by wet patches".

## rules: "Only dry white, mostly Sauvignon"
KEEP p6 title "issus en grande partie du cépage sauvignon B"
KEEP p1 "Les vins sont des vins blancs secs tranquilles"
ADD p1 "teneur en sucres fermentescibles (glucose + fructose) inférieure ou égale à 4 grammes par litre"
KEEP p5 "un jugement du Tribunal Civil de Libourne, en date du 28 octobre 1924, a réservé l'appellation ... aux vins blancs et rouges"
KEEP p5 "le décret du 31 juillet 1937 reconnait l'appellation ... pour les vins blancs uniquement" (split from 1953)
KEEP p5 "En 1953 ... réservée aux seuls vins blancs secs"
FIX p6 "issus en grande partie du cépage sauvignon B, qui offre de bonnes qualités d'adaptation et d'expression": added the page's reason.
FIX p6 "souvent issus d'assemblages avec les autres cépages principaux comme le sémillon B, qui contribue à la rondeur ... la muscadelle B qui leur confère une certaine complexité aromatique": the wines are often blends; one idea per sentence.
FIX p6 "Accessoirement, les vieux cépages locaux, comme le merlot B ou le colombard B, le mauzac B et l'ugni blanc B, contribuent à enrichir les palettes aromatiques": Merlot Blanc is one of the old local grapes on the page; the three-item list split.
KEEP p4 "Sauvignon Gris G" under "CÉPAGES PRINCIPAUX" (Merlot Blanc now carried by the old-locals line)
KEEP p6 "Grâce à une connaissance très fine de leur terroir les vignerons maîtrisent le choix des cépages en fonction des types de sols"
CUT tasting paragraph (robe jaune paille, vifs ... amples et ronds, acacia, agrumes, fruits exotiques; p1/p5/p6): it repeats the fact sheet's `tastes` almost word for word.
ADD p6 "Ces derniers, plantés avec le cépage adapté, permettent l'expression d'arômes de fleurs blanches, d'agrumes et de fruits exotiques": the page's own cause-to-taste link.
ADD p5 "En 1955, l'usage de la dénomination « Haut-Benauge » est autorisé pour neuf communes"; p9 "inscrite immédiatement après le nom de l'appellation ... en caractères dont les dimensions ... ne dépassent pas celles": the famous style was missing from the rules beat.
ADD p9 "peut préciser l'unité géographique plus grande « Vin de Bordeaux » ou «Grand Vin de Bordeaux »".
FIX p5 "Dès les années 1930 le mouvement coopératif a été très présent": "busy" -> "strong".
KEEP p5 "Elles sont aujourd'hui au nombre de 18 ... vinifient 85 % des vins blancs"
Label: the guide has no `label` field. The p11 mentions (Appellation d'origine contrôlée, Clos, Château) get no rule of their own in this pliego; not added.
Wine types: the pliego protects only "vins blancs secs tranquilles"; no sparkling, sweet or liqueur wine. The rules beat names it.

## Numbers
133 p4; 60, 100 p4; 11th "XI ème" p5; 1924, 1937, 1953, 1955, nine "neuf" p5; 4 g p1; 18, 85 % p5. All confirmed.

## Fact sheet
- why.text: sheet says "fresh dry whites"; pliego says "vifs à l'attaque" (lively), never fresh, p1/p5.
- climate.text: sheet has the south-east winds evening out the seasons along with the tides; pliego credits only the "entre deux marées" position, and calls the levelling "relatif", p4.
- soil.text: sheet says the valleys are "gravelly over sandy clay"; pliego says "graveleux dans une matrice sablo-argileuse" (gravel in a sandy-clay matrix), p5.
- famous.styles "Vin de Bordeaux": pliego also allows "Grand Vin de Bordeaux", p9 (not sent as an edit; the name change is left to the owner).
