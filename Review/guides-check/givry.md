# Givry sentence check
Source: givry-doc (cahier des charges / document unique, PDO-FR-A0578, fiche technique 14 pp). Checked 2026-10-22.

## Title
KEEP "Why Givry tastes the way it does" (standard title)

## Lede
FIX p8 "exposition générale ... vers le soleil levant, face à la plaine de la Saône ... à l'écart des brouillards matinaux, fréquents dans la plaine": "sit above the plain" became "face ... across the plain"; "common" -> "frequent".
FIX p8 "Ces situations sont à mettre en relation avec les caractères d'élégance, de finesse et de souplesse attribués traditionnellement aux vins rouges": dropped "The appellation links" (line about the source) and the three-item list; now "These slopes are linked to the elegance and suppleness long credited to its reds".

## place: "A limestone slope facing the sunrise"
KEEP title p6 "relief calcaire ... d'orientation générale vers l'est"; p8 "soleil levant"
KEEP p6 "fait partie de la « Côte chalonnaise », en Bourgogne ... une dizaine de kilomètres à l'ouest de Chalon-sur-Saône"
FIX p6 "relief calcaire, allongé selon une direction nord/sud, d'orientation générale vers l'est": "ridge ... facing east" -> "long limestone rise ... facing broadly east" (hedge "générale" restored).
KEEP p6 "la limite entre, à l'ouest, les contreforts calcaires du massif granitique du Mont-Saint-Vincent et, à l'est, la plaine de la Saône" (added "limestone" to the foothills)
FIX p5/p6 "Dracy-le-Fort, Givry, et Jambles": rewritten to avoid the X, Y and Z list.
FIX p8 "un ensemble très groupé autour de la commune de Givry ... coteaux, orientés à l'est et au sud": "village of Givry" -> "Givry" (page says commune).
KEEP p6 "L'altitude des coteaux de « Givry » est comprise entre 200 mètres et 420 mètres"
Flight "The Côte chalonnaise at Givry": KEEP p8 caption; point about 1.5 km west of the village [A], within 3 km.
Flight "Mont-Saint-Vincent": KEEP p6 caption; FIX point [4.6728, 46.7233] -> [4.4842, 46.6262]. The old point lay ~16 km NE of Mont-Saint-Vincent, near Saint-Désert. New point from known coordinates of the village on the massif's summit [A]: the pack's OSM lookup failed and a fresh Nominatim request was not approved this run; re-check when network is allowed.

## weather: "Southern warmth up the Saône"
FIX title p6 "La douceur méridionale pénètre par la vallée de la Saône": "warmth" -> "mildness" (douceur).
KEEP p6 "Le climat est océanique dégradé subissant des influences méridionales et continentales"
KEEP p6 "La douceur méridionale pénètre par la vallée de la Saône, atténuant les influences océaniques"
KEEP p6 "des mois estivaux très ensoleillés"
KEEP p6-7 "précipitations annuelles moyennes inférieures à 800 millimètres ... régulièrement sur l'année, sans sécheresse estivale"
KEEP p7 "L'exposition générale des parcelles de vigne permet un réchauffement rapide de l'atmosphère, tôt dans la matinée"
FIX p8 "à l'écart des brouillards matinaux, fréquents dans la plaine": "common" -> "frequent".
Flight "The Saône plain": KEEP p8 caption; point sits on Chalon-sur-Saône in the plain [A], acceptable.

## ground: "Clay-limestone under a skin of stones"
FIX title p8 "La nature calcaire des substrats et leur couverture de cailloutis": the stones cover the substrate, not the clay-limestone soil; now "Limestone under a cover of stones".
KEEP p6 "coteau en pente douce dans sa partie basse, sur un substrat calcaire, plus redressé dans sa partie supérieure. L'ensemble est daté du Jurassique supérieur"
KEEP p6 "De petits vallons recoupent le versant principal. Ils font affleurer des formations calcaires du Jurassique moyen"
FIX p6 "atteignent localement les marnes du Lias": Lias explained as Early Jurassic.
KEEP p6 "L'ensemble des substrats est recouvert d'un épandage caillouteux de versant"
KEEP p6 "sols relativement peu diversifiés, argilo-calcaires"
KEEP p6 "Superficiels, plutôt secs et d'une fertilité modérée sur les niveaux de calcaire"
FIX p6 "plus profonds et bénéficient d'une bonne réserve hydrique sur les niveaux marneux": "hold more water" -> "hold a good reserve of water".
FIX p8 "La nature calcaire des substrats et leur couverture de cailloutis, combinés au relief, assurent des conditions de drainage optimal compensant la régularité des précipitations": the guide said limestone and stones drain well on their own; the page says only combined with relief. Two sentences rewritten.

## rules: "Mostly Pinot Noir, red and white"
KEEP title p7 "essentiellement planté en cépage pinot noir N"; p2 "vins secs tranquilles blancs ou rouges"
KEEP p2 "Les vins sont des vins secs tranquilles blancs ou rouges" (only wine types in the pliego: no sparkling, sweet or rosé)
KEEP p7-8 "90% des surfaces plantées au sein de l'aire délimitée ... premier cru et 80% ... « Givry »"
FIX p7 "A cette époque sont déjà cultivés sur les « climats » réputés ... les cépages fins de Bourgogne que sont les cépages pinot noir N et chardonnay B": tied to the Middle Ages as the page does.
KEEP p6 "Pinot Gris G / Pinot Blanc B" ("on the list" -> "allowed")
CUT tasting paragraph (4 sentences, p3/p8 "fins et élégants, souples, avec des tanins présents mais soyeux ..."): accurate, but it repeats the fact sheet's `tastes` almost word for word.
FIX p7 "« climats » réputés (nom régional des lieudits)" + p8 "en situation de mi-coteau, en exposition sud et est": climat explained.
KEEP p8 "légèrement plus ronds et puissants et possèdent un potentiel de garde plus important, lorsqu'ils sont issus des « climats » classés en « premier cru »"
FIX p11 "peut être complété par la mention traditionnelle « premier cru »": "follows Givry" was stated as a must; now "may add".
FIX p12 "porté immédiatement après le nom de l'appellation ... dimensions ne sont pas supérieures": the rule now belongs to the climat name, letter-size rule added.
KEEP p12 LISTE DES CLIMATS: counted 38 (19 + 19); Clos Salomon and Clos Jus listed.
ADD p12 b) "le nom d'un lieu-dit cadastré ... à la moitié de celles des caractères": missing label term.
ADD p12 c) "« Vin de Bourgogne » ou « Grand Vin de Bourgogne »": missing label term.
Not added: p3 mentions "Clos" and "Château" are only listed, with no rule of their own in the pliego.
KEEP p4 "densité minimale à la plantation de 8000 pieds à l'hectare"
ADD p7 "Les remarques faites par Jules GUYOT, au XIXème siècle, sur la forte densité de pieds à l'hectare, sont toujours d'actualité"
KEEP p5 "Vins blancs 60 / Vins rouges 54" (rendement)
KEEP p7-8 "superficie est proche de 300 hectares"; "La production annuelle atteint 12.000 hectolitres"
FIX p7 "domaines familiaux de petite taille (moyenne 7 hectares)": "small" restored, sentence split.
Cite: p3 dropped (tasting cut), p4 kept for density.
Flight "Clos Salomon": KEEP p7 "création de domaines laïques comme « Le Clos Salomon »", p12 list. Point not checked against OSM (lookup failed, no new request approved) [A].

## Fact sheet
- why.text: sheet says slopes sit "above the Saône plain's fog"; p8 says "à l'écart des brouillards matinaux" (away from it).
- soil.text: sheet says soils over "Upper Jurassic limestone and marl"; p6 says the marls are Lias, reached locally in small valleys, with Middle Jurassic limestone there too.
- grapes.main: empty; p7 says the vineyard is "essentiellement planté en cépage pinot noir N" (80%, 90% in Premier Cru). p5's "principales variétés" list is empty, so this one is not sure.
- styles, climate, altitude, tastes, famous.styles: agree with the pliego.
