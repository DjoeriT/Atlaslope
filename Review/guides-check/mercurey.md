# Mercurey sentence check
Source: mercurey-doc (Fiche technique PDO-FR-A0404, document unique). Checked 2026-10-22.

## Lede
- KEEP p8 "l'exposition générale de la zone géographique vers le soleil levant ... réchauffement matinal précoce et une situation à l'écart des brouillards matinaux, fréquents dans la plaine"
- FIX p7/p8 "pinot noir N, cépage principal, qui représente 87%" / "Les vins rouges sont à la fois, élégants et puissants": dropped "gives" (page does not tie the red style to the grape); fog line no longer copied word for word in the weather beat.

## Place
- FIX title p6 "relief calcaire ... la plaine de la Saône": "ridge above the Saône" became "Limestone slopes beside the Saône plain".
- KEEP p6 "fait partie de la « Côte chalonnaise » ... à une dizaine de kilomètres à l'ouest de Chalon-sur-Saône"
- FIX p6 "allongé selon une direction nord/sud, d'orientation générale vers l'est": added "generally".
- KEEP p6 "la limite entre, à l'ouest, les contreforts calcaires du massif granitique du Mont-Saint-Vincent et, à l'est, la plaine de la Saône"
- FIX p6 "sur les flancs de deux vallées perpendiculaires drainant la « Côte chalonnaise ». La topographie est complexe.": "cross ... so the landscape is complex" became drain, two sentences, invented "so" removed.
- FIX p6 "L'alternance de niveaux de calcaires durs et de marnes (calcaires argileux), moins résistants à l'érosion": marl explained, "wear at different speeds" said as the page does.
- KEEP p6 "une suite de crêtes boisées, séparant des « combes » aux sols marneux, occupées par des vignes"
- KEEP p5/p6 "communes de Mercurey et Saint-Martin-sous-Montaigu"
- KEEP p7 "couvre, en 2010, une superficie de 677 hectares"
- Flight 1 FIX point: [4.7, 46.7] was ~15 km south of Mercurey; now [4.717, 46.84] (village). Caption KEEP p6 "crêtes boisées, séparant des « combes » ... occupées par des vignes". Nominatim call not approved in this run; point from known village coordinates.
- Flight 2 KEEP point [4.854, 46.781] (Chalon-sur-Saône). Caption FIX p6: the ten kilometres are from Chalon to the zone, not from the plain to Mercurey.

## Weather
- KEEP title p7 "douceur méridionale" / "très ensoleillés" / "se répartissent régulièrement"
- KEEP p7 "Le climat est océanique dégradé, subissant des influences méridionales et continentales"
- KEEP p7 "La douceur méridionale pénètre par la vallée de la Saône, atténuant les influences océaniques"
- FIX p7 "donnant des mois estivaux très ensoleillés": now tied to the southern mildness, as the page does.
- KEEP p7 "précipitations annuelles moyennes inférieures à 800 millimètres ... sans sécheresse estivale"
- FIX p7/p8 "permet un réchauffement rapide de l'atmosphère, tôt dans la matinée" / "conditions méso-climatiques favorables à l'élaboration de grands vins": paragraph repeated the lede; now carries the page's own link to great wines, hedge "favour" kept.

## Ground
- KEEP title p8 "leur couverture de cailloutis ... drainage optimal"
- FIX p6 "coteaux d'expositions diverses, dont l'altitude est comprise entre de 220 mètres et 350 mètres": added "facing various directions".
- FIX p6 "Les sols sont majoritairement calcaires" / "Dans les coteaux, ils sont de nature calcaire, le plus souvent développés sur une mince couche de colluvions riches en cailloux": "often" became "mostly", "limestone" soil became "limy", colluvium explained.
- KEEP p6 "Le substrat calcaire est à quelques décimètres de profondeur"
- KEEP p6 "placages d'argiles à « chailles » (rognons siliceux) génèrent des sols plus acides, très caillouteux et parfois très filtrants"
- KEEP p6 "Ils sont toujours très bien drainés"
- FIX p8 "La nature calcaire des substrats et leur couverture de cailloutis, combinés au relief, assurent des conditions de drainage optimal compensant la régularité des précipitations": relief added.

## Rules
- KEEP title p7/p8 "pinot noir N, cépage principal" / "climats"
- KEEP p2 "des vins secs tranquilles blancs ou rouges"
- KEEP p7 "cépage principal, qui représente 87% des surfaces plantées"
- FIX p6 "Chardonnay B / Pinot Noir N / Pinot Gris G": "Chardonnay is the main white grape" is not on any page; now "the other grapes allowed".
- FIX p8 "La vinification traditionnelle bourguignonne favorise une durée de vie importante": tasting lines repeated the fact sheet `tastes`; replaced with the long-life line, hedge kept.
- KEEP p8 "dans la majorité des cas élevés en fûts, notamment ceux bénéficiant de la mention « premier cru »"
- FIX p8 "Les vins blancs sont des vins secs, décrits généralement comme riches et puissants": aromas dropped (in `tastes`), "generally described" hedge kept.
- KEEP p8/p7 "identifient, fréquemment, leurs cuvées par le nom du « climat »" / "nom régional des lieudits"
- KEEP p8 "Certains de ces « climats », les mieux exposés et en général sur un substrat calcaire, peuvent bénéficier de la mention « premier cru »"
- FIX p12 "LISTE DES CLIMATS": the list has 32 names (16 per column), not 30.
- KEEP p12 "porté immédiatement après le nom de l'appellation ... pas supérieures ... à celles des caractères composant le nom de l'appellation"
- FIX p12 "qu'il s'agisse du nom d'un lieu-dit cadastré ; et que celui-ci figure sur la déclaration de récolte ... à la moitié": harvest-declaration condition added, term explained, split into two sentences.
- ADD p12 "peut préciser l'unité géographique plus grande « Vin de Bourgogne » ou « Grand Vin de Bourgogne »" (label sweep).
- ADD p12 "l'indication du cépage ... ne figure pas dans le même champ visuel que les indications obligatoires ... ne dépassent pas 2 millimètres" (label sweep).
- FIX p9 "Vendu longtemps sous le nom de « vin de Beaune »": "sometimes" became "long"; joined "and 1936" split off.
- KEEP p7 "l'appellation d'origine contrôlée « Mercurey » est reconnue par décret, dès 1936"
- KEEP p7 "Les premiers « climats » classés en « premier cru » sont reconnus en 1943"
- FIX p8 "dans la proportion de 60% par vente directe, le négoce étant toujours fortement présent": "about" dropped, merchants added.
- Not added: Clos and Château (p3 mentions traditionnelles) have no rule in the pliego. No other wine types: p2 allows only dry still reds and whites.

## Fact sheet
- famous.styles[0].text: sheet says 30 listed climats; pliego p12 lists 32.
