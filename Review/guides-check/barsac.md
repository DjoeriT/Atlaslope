# Guide check: barsac (source barsac-doc, fiche technique PDO-FR-A0186-AM01, Ares(2014)2129516)

## Title
- KEEP "Why Barsac tastes the way it does" (house title).

## Lede
- FIX p1 "Vin tranquille blanc avec sucres résiduels ... issus de raisins botrytisés"; p3 "Les conditions microclimatiques particulières sont à l'origine du développement du champignon « Botrytis cinerea »". Old lede repeated the fungus chapter almost word for word, added "on the grapes" (not on the page) and tied typicity to "rich, unctuous" (a link the page does not make). Now: one sweet white from noble-rot grapes, microclimate lets the fungus develop.

## commune (place)
- KEEP title p3 "le territoire de la commune de Barsac, dans le département de la Gironde".
- KEEP p3 "La récolte des raisins, la vinification, l'élaboration et l'élevage des vins sont assurés sur le territoire de la commune de Barsac" (2 sentences).
- FIX p4 "L'aire de proximité immédiate, définie par dérogation pour la vinification, l'élaboration et l'élevage ... Preignac ... Sauternes". "instead" wrongly implied replacement; now "By exception ... may also make and age".
- KEEP p3 "La récolte des raisins ... sur le territoire de la commune de Barsac" (grapes still from Barsac).
- Flight "The commune of Barsac" [-0.3355, 44.615]: KEEP p3. OSM lookup in pack had no result and the network lookup was refused here; Barsac village is at about [-0.316, 44.608] [A], about 1.7 km away, inside the 3 km tolerance, so the point stays. Caption KEEP p3.
- Missing flights: the pliego names no river, valley, range or historic town; none added.

## fungus (weather)
- KEEP title p3 microclimate + p2 "présence de pourriture noble".
- KEEP p3 "Les conditions microclimatiques particulières sont à l'origine du développement du champignon « Botrytis cinerea »".
- KEEP p3 "qui confère leur typicité aux vins".
- KEEP p3 "L'alimentation hydrique favorise la concentration des aromes dans les baies" (hedge "favours" kept).
- FIX p3 "confère aux vins des nuances originales à ses vins, assez nerveux, et aux arômes persistants (nuances fruitées)". "turn out" dropped the page's "nuances originales" and the link to water supply; now "It gives the wines original nuances: fairly nervy, with persistent aromas of fruit."

## limestone (ground)
- KEEP title p3 "éléments calcaire du sol" (calcaire = limestone, not chalk).
- KEEP p3 "La distinction de Barsac repose sur les caractéristiques particulières de ses sols".
- KEEP p3 "La texture minérale des vins est liée aux éléments calcaire du sol" ("linked to", not "gives").

## tries (rules)
- KEEP title p2 "manuellement par tries successives".
- KEEP p1 "Vin tranquille blanc avec sucres résiduels (teneur > ou = 45g/l) issus de raisins botrytisés".
- FIX p1 "Il est très gras et onctueux en bouche, il se distingue par ses arômes puissants et équilibrés, très fruités et vifs". The aroma part was an "X, Y and Z" list and repeated the fact sheet `tastes`; kept "In the mouth it is very rich and unctuous", cut the aroma list.
- FIX (added) p1 "TAVNM 15%": minimum natural alcohol rule was missing; added "natural potential alcohol of at least 15%".
- KEEP p3 "Semillon B / Savagnin blanc B / Sauvignon gris G / Muscadelle B" (page says Savagnin blanc; kept as written). Grape list left as a list.
- KEEP p3 "La taille est sévère, précisée pour chacun des cépages"; p2 "Taille effectuée au plus tard le 1er mai".
- KEEP p2 "densité minimale à la plantation de 6500 pieds/ha".
- KEEP p2 "raisins récoltés à surmaturité (présence de pourriture noble) et manuellement par tries successives".
- KEEP p3 "obtenant ainsi une forte concentration des baies en sucres".
- KEEP p3 "Rendement maximal: 28 hectolitre par hectare".

## Wine types and label terms
- Only one product on p1: still white with residual sugar. Rules beat names it. No generoso, no sparkling.
- Label: p3 "Vin de Bordeaux" / "Grand Vin de Bordeaux" may be added (characters at most two-thirds of the AOC name, p3-p4); p6-p7 "Appellation d'origine contrôlée", "Clos", "Château" are traditional mentions. The guide has no `label` field; not added (owner's call whether to show them).
- Not used: p2 "L'enrichissement est autorisé selon les règles fixées dans le cahier des charges" (points to the cahier, so left out).

## Fact sheet
- soil.text: sheet says "limestone elements in the soil give the wines a mineral texture"; p3 says "La texture minérale des vins est liée aux éléments calcaire du sol" (linked to, not gives). Edit returned.
- climate.text "character": p3 "typicité"; close enough, no edit.
- styles.kinds ["white","sweet"], grapes, famous: agree with p1, p3.
