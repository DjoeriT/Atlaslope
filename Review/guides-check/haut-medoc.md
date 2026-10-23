# haut-medoc: sentence check
Source: haut-medoc-doc (fiche technique PDO-FR-A0710, document unique), checked 2026-10-22.

## Lede
- FIX p6 "nivellement relatif des fluctuations saisonnières": "evens out the weather" -> "partly evens out the seasons"; "gravel left by rivers" -> "river gravel".
- FIX p3 "couleur intense, tanniques ... excellentes aptitudes au vieillissement": dropped "grapes ripen fully" (vineyard management, not place, read as a cause) and the X, Y and Z list; p8 cite dropped.

## Title
- KEEP "Why Haut-Médoc tastes the way it does".

## upstream (place)
- Title KEEP p6 "en amont de l'estuaire", "dans le prolongement de l'agglomération Bordelaise".
- KEEP p6 "rive gauche de la Garonne puis de la Gironde dans le prolongement de l'agglomération Bordelaise".
- KEEP p6 "s'étire sur près de 50 kilomètres et à peine plus d'une dizaine de kilomètres d'est en ouest".
- FIX p6 "communes situées en amont de l'estuaire de la Gironde, expliquant le nom": "the name means the upper Médoc" (not on the page) -> "which explains the name"; added p6 "correspond ainsi à une partie de celle de l'AOC « Médoc »".
- KEEP p6-7 "relief peu marqué (entre 3 mètres et 50 mètres d'altitude)".
- KEEP p7 "limité à l'ouest par la forêt, à l'est par la Garonne ou par l'estuaire ... au sud par l'agglomération".
- FIX p7 "secteurs plus marécageux non viticoles": "marshy" -> "marshier".
- Flight "The 50 km of vineyard": FIX label -> "The 50 km zone" (p6 measures the zone, not the vineyard). Point mid-zone; OSM had no result for the label; kept.

## water (weather)
- Title FIX: "with a river to soften it" -> "evened out by water" (p6: ocean and Gironde both).
- KEEP p6 "climat à dominante atlantique".
- FIX p6 "se différencie des communes plus au nord du Médoc par un nivellement relatif ... pluviosité modérée": hedge "relatif" restored ("somewhat"), split in two.
- KEEP p6 "effet thermique régulateur engendré par la présence des eaux de l'Océan Atlantique et de la Gironde".
- FIX p6 "certaines années de quelques dépressions automnales pluvieuses": "a few" added.
- KEEP p6 "arrière-saisons chaudes et très ensoleillées".
- FIX p6 "Le climat océanique ... est à l'origine d'un effet millésime marqué": cause is the ocean climate, not "either way".
- ADD p6 "Mais les principales caractéristiques sont surtout associées à la géologie".
- Flight "The Gironde estuary": point [-0.8, 45.2] was on land west of Pauillac (~9 km off the water); moved to [-0.68, 45.22] in the estuary. Caption FIX: "façade fluviale" named.

## gravel (ground)
- Title KEEP p6 "découpage en croupes ... creusement des lits de la Garonne et de ses affluents".
- KEEP p6 "Les sols se répartissent ainsi entre".
- KEEP p6 "nappes de graves sableuses et argileuses charriées par la Garonne et la Dordogne au Quaternaire".
- KEEP p6 "sols argilo-calcaires tertiaires soumis à une poussée anticlinale".
- FIX p6 "le découpage en croupes (« cos »), fruit de l'érosion mais aussi du creusement des lits ... durant les périodes glaciaires": "cut the gravel" -> "cut the land".
- KEEP p6 "affluents (« esteys » et « jalles »)"; p7 "croupes ... délimitées par les jalles".
- KEEP p6 "de la petite dragée au gros galet, étagées en terrasses successives".
- FIX p8 "le vigneron médocain a consacré certains cépages à des types particuliers de sols": "old growers learned" -> "Médoc growers gave"; p8 cite added.
- KEEP p9 "merlot N sur les colluvions, le cépage carmenère N sur les sols de graves pauvres et secs".
- KEEP p9 "cabernet franc N sur les résurgences calcaires ou les sols sableux secs".
- ADD p9 "propices aussi au cépage cot N".
- KEEP p9 "petit verdot N dans les sols bien brunifiés".
- FIX p9 "pivot de l'assemblage, il s'exprime sur les sols de graves profondes": "does best" -> "shows itself".
- Flight "Gravel crests near Margaux": point is Margaux (p5 commune list); caption KEEP p7 "Du sud au nord, se succèdent les croupes de graves viticoles délimitées par les jalles".

## reds (rules)
- Title KEEP p8 "vins rouges de garde".
- KEEP p2 "vins tranquilles rouge"; p8 "produit en moyenne 250 000 hectolitres"; p2 cite added.
- ADD p2 "titre alcoométrique volumique naturel minimum de 11 %".
- KEEP p3 "couleur intense, tanniques".
- KEEP p3 "généralement d'assemblage dans lesquels le cabernet-sauvignon N est souvent majoritaire".
- KEEP p3 "merlot N est moins présent ... que dans ceux de l'AOC « Médoc »".
- KEEP p3 "cabernet franc N et ... petit verdot N concourent à la richesse des vins et plus rarement, ... cot N et ... carmenère N".
- FIX p3 "notes épicées qui se mêlent parfaitement aux notes vanillées dans le cas d'élevage en barrique": vanilla tied to barrel-aged wine.
- KEEP p3 "élevage en barrique plus répandu qu'en AOC « Médoc »".
- FIX p3 "rondeur, souplesse et des arômes de fruits rouges": X, Y and Z list split in two.
- FIX p3 "La structure et la complexité peuvent être renforcées par ... cabernet franc N ou ... petit verdot N, ce dernier apportant également de la fraîcheur": structure line was missing, so "also" had no anchor.
- KEEP p3 "raisins très mûrs et sains dont les rendements sont maîtrisés".
- KEEP p4 "densité minimale à la plantation de 6500 pieds par hectare"; ADD p4 "Le rendement est fixé à 55 hectolitres par hectare".
- FIX p3 "Les macérations longues sont ainsi possibles pour obtenir les vins concentrés souhaités": hedge "possible" restored.
- KEEP p3 "élevage d'au moins six mois est indispensable pour les assouplir", "excellentes aptitudes au vieillissement".
- FIX p9 "s'appuient essentiellement sur différents classements": "mainly" added.
- FIX p9 "cinq « crus classés » au sein de la zone géographique"; p9 "la logique de crus en Bordelais est consacrée par le Classement ... en 1855": the page does not tie the five to 1855, so the two facts are now separate sentences.
- KEEP p9 "crus bourgeois du Médoc en 1932 porte sur 444 crus dont 153 appartiennent".
- ADD p12 "L'étiquetage peut préciser l'unité géographique plus grande « Bordeaux - Médoc » ... pas supérieures ... aux deux tiers".
- Label sweep p3 mentions: Cru classé, Cru bourgeois, Cru artisan, Clos, Château. The pliego gives none of them a rule of its own. Cru classé and Cru bourgeois are famous styles (rules beat); Cru artisan, Clos and Château get no line. The guide has no `label` field.
- Wine types: only "vins tranquilles rouge" (p2). Nothing missing.

## Fact sheet
- styles.text: sheet says "usually blends led by Cabernet Sauvignon"; p3/p8 say "généralement d'assemblage ... cabernet-sauvignon N est souvent majoritaire" (usually blends, often led).
- climate.text: sheet says seasonal swings are evened out and "wet autumns or hot, sunny late seasons"; p6 says "nivellement relatif" and "certaines années".
- famous.styles Cru classé: sheet ties the five to 1855; p9 says only that five crus classés lie in the zone, with 1855 named separately.
