# Sentence check: pauillac (source pauillac-doc, fiche technique PDO-FR-A0713, document unique)

## Title and lede
- KEEP title "Why Pauillac tastes the way it does" (standard title)
- FIX p6/p8 "propriétés drainantes des sols", "proximité de l'estuaire qui protège le vignoble des excès du climat": "wide" dropped (no source); "evens out the weather" now the page's "excesses of the climate"
- FIX p8 "puissants et charpentés notamment grâce à l'assemblage où le cabernet-sauvignon N est particulièrement dominant": the page does not credit Cabernet with the colour; now "dominates the blend and helps make the wines powerful and structured"

## estuary (place)
- KEEP title p6 "La ville et le port de Pauillac sont situés en contrebas de ces croupes sur la rive de l'estuaire"
- KEEP p5 "partie centrale de la presqu'île du Médoc, à 50 kilomètres au Nord de Bordeaux sur la rive gauche de l'estuaire"
- FIX p4/p7 "parcelles ... Cissac-Médoc, Saint-Estèphe, Saint-Julien-Beychevelle et Saint-Sauveur": four-name list replaced by "four other communes" ("neighbours" not on the page); added p7 "car elles appartenaient historiquement à des crus classés de la commune de Pauillac"
- KEEP p6 "modelé de croupes de graves"
- KEEP p6 "trois principaux systèmes de croupes viticoles"
- KEEP p6 "la plus étendue dans la partie méridionale ... Saint-Lambert et Bages"
- FIX p6 "la plus réduite dans la partie centrale ... hameau d'Artigues": "A smaller one" -> "The smallest"
- KEEP p6 "la croupe septentrionale organisée autour du hameau du Pouyalet"
- KEEP p6 "La ville et le port ... en contrebas de ces croupes sur la rive de l'estuaire"
- KEEP p7 "près de 1 250 hectares"
- KEEP p7 "grandes propriétés ... qui exploitent 90 % du vignoble ... une soixantaine de petites exploitations"
- KEEP p7 "cave coopérative qui depuis 1933 fédère les petits vignerons pauillacais"
- Flight "Pauillac and its port": KEEP p6 caption; place id unchanged
- Flight "The Gironde estuary": KEEP caption p8 "l'estuaire qui protège le vignoble des excès du climat"; FIX point [-0.78, 45.22] lay on land west of Pauillac town (vineyards near Lafite), about 6 km from mid-estuary; moved to [-0.70, 45.24] [A] (pack OSM lookup returned no result, point from known geography)

## ocean (weather)
- FIX title "An ocean that smooths the edges" (no source) -> "Water that evens out the temperature", p6 "effet thermique régulateur engendré par la présence des eaux de l'Océan Atlantique et de la Gironde"
- KEEP p6 "climat océanique tempéré"
- KEEP p6 "effet thermique régulateur ... Océan Atlantique et de la Gironde"
- KEEP p6 "certaines années de quelques dépressions automnales pluvieuses"
- KEEP p6 "arrière-saisons chaudes et très ensoleillées"
- FIX p6 "est à l'origine d'un effet millésime marqué": "Either way, the vintage makes a marked difference" -> "This gives a marked vintage effect"

## gravel (ground)
- KEEP title p6 "recouvrent presque totalement les marnes et calcaires"
- KEEP p6 "terrasses graveleuses disposées parallèlement à l'estuaire ... de 3 à 30 mètres"
- KEEP p6 "d'âge quaternaire et d'une épaisseur de l'ordre d'une dizaine de mètres en moyenne"
- KEEP p6 "recouvrent presque totalement les marnes et calcaires de l'éocène et de l'oligocène"
- FIX p6 "réseau hydrographique dense affluent de la Gironde : les « esteys » et les « jalles »": "small" dropped (no source), "flowing into the Gironde" added
- KEEP p6 "les zones de dépressions sont souvent comblées de sables éoliens"
- KEEP p6 "alluvions récentes appelées localement « palus »", "argiles grises et noires des « palus »"
- FIX p8 "l'aire parcellaire de production délimite les parcelles dont la nature des sols est graveleuse ou sablo-graveleuse": now about the appellation's plots, not "vines grow"
- FIX p8 "teneur en sable fin ... soit assez faible": "little" -> "fairly little"
- FIX p8 "alluvions modernes, ... placages de sables éoliens importants ou mal drainées car situées sur sous-sol imperméable": "X, Y or Z" list split; impermeable subsoil cause added
- FIX p6 "propice, par les expositions, la proximité de l'estuaire et les propriétés drainantes des sols, à la naissance d'une viticulture de très haute qualité": hedge "propice" kept as "favour", list split
- KEEP p8 "terres de prédilection du cabernet-sauvignon N mais le merlot N s'y exprime également très bien"
- Flight "Saint-Lambert and Bages": KEEP p6; point [-0.757, 45.18] within about 1 km of both hamlets [A] (OSM no result)

## claret (rules)
- KEEP title p3 "le cabernet-sauvignon N est particulièrement dominant"
- KEEP p2 "Les vins sont des vins tranquilles rouges"
- KEEP p3 "l'assemblage où le cabernet-sauvignon N est particulièrement dominant"
- KEEP p3 "le merlot N reste présent afin d'apporter rondeur et fruit"
- FIX p3 "La structure et la complexité sont renforcées par le cabernet franc N voire plus rarement le petit-verdot N": "add" -> "strengthen"
- KEEP p5 "Cot N, Carmenere N" (p5 added to the chapter cite)
- CUT p3/p8 "de couleur très soutenue ... puissants et charpentés ... aptitude au vieillissement remarquable ... bouquet d'une grande complexité": true, but the whole paragraph repeats the fact sheet's `tastes`; power and structure stay in the lede
- KEEP p4/p8 "densité minimale ... 7000 pieds", "densité réelle bien au-delà des 7 000 pieds"
- FIX p8 "permet d'obtenir grâce à des rendements maîtrisés, des raisins très mûrs, sains et très concentrés": the density is now part of the cause; "very concentrated" restored
- FIX p8 "macérations très longues et des extractions importantes sont ainsi possibles pour obtenir la structure nécessaire au vieillissement": purpose added
- FIX p8 "un élevage, fixé à au moins six mois, est indispensable pour favoriser les combinaisons tanins-anthocyanes nécessaires à la stabilisation de la couleur et à l'enrobage des tanins perdant ainsi leur dureté": hedge "favoriser" kept as "helps"; split into three sentences
- FIX p4 "Le rendement est fixé à 57 hectolitres par hectare. Le rendement butoir est fixé à 63": "basic yield" -> "set yield", ceiling of 63 added
- KEEP p7 "produit en moyenne 55 000 hectolitres de vins rouges tranquilles"
- KEEP p8 "Dès les débuts de la commercialisation sur le marché londonien des « New French Clarets », au XVIIIème siècle, les vins de Pauillac sont parmi les plus reconnus"
- FIX p8 "Avec aujourd'hui 18 crus classés ... cette commune compte le plus grand nombre de crus classés": term explained as "classified estates (crus classés)"
- FIX p8 "dont les premiers Lafite-Rothschild, Latour en 1855 et Mouton-Rothschild en 1973": "added in 1973" -> first growth since 1973

## Sweeps
- Wine types: p2 still red only; the rules beat says so. No other type.
- Label terms: p3 lists Cru classé, Cru bourgeois, Cru artisan, Clos, Château with no rule of their own; the guide has no label field, nothing added. p9 allows "Bordeaux - Médoc" as a larger unit on labels, not added (no beat asks for it).
- Missing flights: the estuary flight already covers the named water; no other river or range described.

## Fact sheet
- soil.text: sheet says "Wet, sandy or modern alluvial plots are excluded"; p8 excludes only thick wind-blown sand ("placages de sables éoliens importants"), modern alluvium and poorly drained plots, while sandy-gravel soils are included. Edit returned in "sheet".
- famous.styles lists Cru classé, Cru bourgeois, Château; p3 also lists Cru artisan and Clos (omission, not a contradiction; not returned).
