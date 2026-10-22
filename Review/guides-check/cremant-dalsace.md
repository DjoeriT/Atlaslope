# cremant-dalsace: sentence check (source cremant-dalsace-doc, fiche technique PDO-FR-A0917)

## Lede
FIX p8 "alternance de journées chaudes et de nuits fraîches ... assurent une bonne maturité des raisins (sucres et acidité tartrique)": "warm" -> "hot"; "keep sugar and acidity in balance" -> "good ripeness in both sugar and acidity".
FIX p8 "des notes aromatiques plus mûres apparaissent, accompagnées souvent de notes beurrées ou de pain grillé": hedge "often" restored; "months on the lees" -> "ageing on the lees".

## place: "A ribbon along the Vosges"
KEEP title p6 "120 km de long pour souvent moins de 1 km de large".
KEEP p6 "zone septentrionale ... principalement établie sur la face orientée à l'est du piémont des Vosges".
KEEP p6 "S'étendant sur 120 km ... enclave aux environs de Cleebourg ... jusqu'à Thann à la hauteur de Mulhouse".
FIX p6 "succession de collines sous-vosgiennes, entrecoupées de vallées profondes ... relief souvent accusé": "low hills below" -> "hills at the foot of" (page does not say low).
KEEP p6 "L'altitude des plantations se situe majoritairement entre 200 mètres et 400 mètres".
KEEP p5 "Département du Haut-Rhin ... Département du Bas-Rhin".
Flight Colmar [7.358, 48.079]: OSM gave no result; point matches Colmar centre, kept. FIX caption p7 "1800 heures par an à Colmar": "sits on the Vosges foothills" cut, no page says it.
Flight Thann [7.105, 47.808]: OSM gave no result; point matches Thann, kept. KEEP caption p6 "jusqu'à Thann à la hauteur de Mulhouse".

## weather: title FIX "against the rain" -> "against the ocean", p7 "écran protecteur contre les influences océaniques".
KEEP p6 "Le climat est clairement semi-continental : les écarts de température sont importants".
KEEP p6 "température moyenne du mois de janvier est de 1,9°C".
KEEP p6 "étés chauds et secs (la température moyenne du mois de juillet est supérieure à 20°C)".
KEEP p7 "écran protecteur contre les influences océaniques, rôle amplifié par effet de foehn surtout en automne".
KEEP p7 "ensoleillement élevé (1800 heures par an à Colmar)".
KEEP p7 "sommets des Vosges ... de l'ordre de 2000 millimètres ... entre 500 millimètres et 650 millimètres".
KEEP p7 "alternance de journées chaudes et de nuits fraîches".
FIX p8 "associés à une hauteur de feuillage élevée assurent une bonne maturité": tall foliage restored as co-cause.
FIX (added) p8 "L'altitude moyenne du vignoble (200 mètres à 400 mètres) qui correspond à la ceinture thermique optimale permet d'assurer un équilibre qualitatif de l'acidité naturelle".
KEEP p8-9 "faibles précipitations de la fin de l'été et l'amplitude thermique ... maintenir un très bon état sanitaire".
KEEP p9 "indispensable à la qualité du pressurage et propice à l'élaboration d'une mousse fine".

## ground: title FIX "A rift broken into small pieces" -> "A mosaic left by the Rhine rift", p7 "mosaïque de compartiments de petite surface" (the land is broken up, not the rift).
KEEP p7 "L'effondrement du fossé rhénan ... réseau de failles ... mosaïque de compartiments de petite surface".
KEEP p7 "zone de rupture entre la plaine sédimentaire rhénane et le massif cristallin vosgien".
KEEP p7 "toutes les couches de terrain ... remises à nu par l'érosion".
KEEP p7 "sols bruns sur schistes, granite ou grès ... peu profonds, filtrants, de tendance acide".
FIX p7 "sols colluviaux des cônes de déjection, et sols alluviaux, sablo-graveleux ... (bordure de la plaine alluviale)": fan soils added.
FIX p7 "sols bruns calcaires ou de type rendzine des collines sous-vosgiennes ... bon régime hydrique": "limestone" -> "limy"; hills location added.
KEEP p9 "trouver pour chacun des six cépages ... ses conditions d'expression optimale".
KEEP p9 "en privilégiant fraîcheur et acidité conjuguée aux caractères fruités" (tied to the previous sentence).
Flight edge of the Rhine plain [7.43, 48.2]: OSM gave no result; on the plain edge near Châtenois and Scherwiller (both p5), kept. KEEP caption p7.

## rules: title FIX "Pinots, picked by hand, aged on the lees" -> "Picked by hand, aged on the lees" (Chardonnay and Riesling are allowed too, p7).
KEEP p2 "vins mousseux de qualité blancs ou rosés" + p10 "seconde fermentation en bouteille" (cite p10 added).
KEEP p2 "ces derniers étant issus des seuls cépages pinot noir N".
KEEP p7 "auxerrois B, chardonnay B, pinot blanc B, pinot gris G, pinot noir N et riesling B" (grape list kept as data).
KEEP p7 "d'orienter le choix vers la famille des pinots".
FIX p7 "plusieurs maisons champenoises ont apporté leur savoir-faire": "several" restored.
FIX p7 "découvrant précisément l'outil lors de l'exposition universelle de 1900 à Paris, Julien DOPFF a souhaité expérimenter": "tried it" -> "set out to try it".
KEEP p8 "par décret du 24 août 1976".
KEEP p8 "manuellement ... récipients ne devant pas contenir plus de 100 kilogrammes".
FIX p8 "Les raisins destinés à l'élaboration de vins blancs doivent être versés entiers dans le pressoir": wording.
KEEP p3 "L'utilisation de morceaux de bois est interdite".
KEEP p4 "Le rendement est fixé à 80 hectolitres par hectare".
KEEP p8/p10 "période d'élevage de 12 mois au moins à compter de la date de tirage"; p9 "souvent bien plus long que neuf mois".
FIX p9 "en développant des arômes tertiaires, conforte la complexité des vins": "adds more complex, tertiary aromas" -> "develops tertiary aromas and adds to complexity".
CUT "fresh and fine, with fruity notes and a light mousse": p8 says it, but it repeats the fact sheet tastes and the lede.
KEEP p3 "La grande majorité des vins sont mis en marché ... sous la catégorie « brut »".
Wine types: only "vin mousseux de qualité" white or rosé (p2); both named. Mentions p3 (Clos, Château, Appellation d'origine contrôlée) get no rule of their own on any page; guide has no label field, none added.

## Fact sheet
- why.text: sheet "Cool, dry, sunny foothills"; p6 says summers "chauds et secs", p7-8 "journées chaudes et de nuits fraîches". Nothing calls the foothills cool.
- tastes.text: sheet "Lees ageing adds riper, buttery or toasty notes"; p3/p8 "accompagnées souvent de notes beurrées ou de pain grillé" (hedge dropped).
- climate.text: "Warm days" vs p7 "journées chaudes" (hot); minor, not sent as an edit.
- famous.styles "Crémant d'Alsace" names the appellation itself, not a style; left for the owner, not sent as an edit.
