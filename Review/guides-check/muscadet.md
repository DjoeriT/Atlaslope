# Muscadet guide check
Source: muscadet-doc (PDO-FR-A0497, fiche technique / document unique). Guide: content/guides/muscadet.json. Checked 22 Oct 2026.

## Title
- KEEP "Why Muscadet tastes the way it does" (standard title)

## Lede
- KEEP p7 "adoption du seul cépage melon B"; p8 "les vins sont souvent élevés sur leurs lies fines"; p7 "pendant au moins un hiver"
- FIX p7 "apporte rondeur et gras"; p6 "les étés restent frais"; p8 "la modération des températures estivales est idéale pour préserver la fraîcheur": "cool summers keep" -> "mild summers help keep" (the page's claim is softer)

## place: Slopes and meadows around Nantes
- KEEP title p5 "vignes sur les coteaux et les buttes et de prairies bocagères dans les vallées"; p6 "au sud et à l'est de la ville de Nantes"
- KEEP p6 "au sud et à l'est de la ville de Nantes. Proche des côtes de l'océan Atlantique"
- KEEP p6 "s'étend sur 81 communes des départements de la Loire-Atlantique, de Maine-et-Loire et de la Vendée"
- FIX p6 "implantées essentiellement sur les versants formés par la Loire, la Sèvre et la Maine, le marais de Goulaine, le lac de Grandlieu": hedge "essentiellement" restored ("mainly"); split into two sentences, no five-item list
- KEEP p5 "prairies bocagères dans les vallées"
- KEEP p6 "se rattache à la fois à la Bretagne par son histoire et au Val de Loire par sa situation géographique"
- KEEP p6 "Port océanique à l'embouchure de la Loire"
- FIX p6 "s'affirme très tôt comme un important carrefour pour l'expédition de vins vers les îles britanniques et l'Europe du nord": added "Early on"
- Fly Lake Grandlieu: FIX caption p6 "proximité d'importantes masses d'eau (océan, estuaire de la Loire, lac de Grandlieu, marais de Goulaine)": "one of the lakes" -> "one of the large bodies of water" (it is the only lake named). Point [-1.67, 47.09] matches Lac de Grand-Lieu; OSM gave no result for the English name, kept.
- Fly Goulaine marsh: KEEP p6 "versants formés par ... le marais de Goulaine ... au sud et à l'est de la ville de Nantes". Point [-1.38, 47.2] matches Marais de Goulaine; OSM no result for the English name, kept.

## weather: Mild winters, cool summers
- KEEP title p6 "températures hivernales sont particulièrement douces et les étés restent frais"
- KEEP p6 "climat océanique caractérisé par la faible variation annuelle des températures"
- FIX p6 "du fait de la proximité d'importantes masses d'eau": the cause was dropped; now says the steadiness comes from these waters
- KEEP p6 "particulièrement douces et les étés restent frais, avec une ventilation assurée par les brises maritimes"
- FIX p6 "précipitations sont légèrement déficitaires pendant la période de végétation de la vigne, d'où un ensoleillement important pour cette latitude": "and" -> "so" (the page links them)
- KEEP p6 "les grandes marées de l'automne s'accompagnent parfois de fortes averses"
- FIX p8 "La douceur des hivers accentue cette précocité": winters add to the early start the soils give, they do not cause it alone
- KEEP p8 "l'ensoleillement estival et les vents marins protégeant la végétation des atteintes sanitaires"
- FIX p8 "la modération des températures estivales est idéale pour préserver la fraîcheur et les arômes délicats qui s'expriment dans les vins issus du cépage melon B": "Cool summers keep" -> "Moderate summer warmth is ideal for keeping"

## ground: Stony ground over old rock
- KEEP title p6 "riches en cailloux"; "Au Précambrien et à l'ère Primaire"
- KEEP p6 "géologie complexe"
- FIX p6 "des orogénèses ont conduit à la mise en place de roches plutoniques (granites, gabbros) et de roches métamorphiques (gneiss, micaschistes, éclogites, amphibolites)": six-rock list cut to two sentences with "such as"; mountain building added from the page
- KEEP p6 "recouvert localement par des sédiments tertiaires (argiles, sables à galets)"
- KEEP p6 "le plus souvent bruns sains, sableux et riches en cailloux"
- FIX p6 "délimite strictement les coteaux qui présentent des paysages ouverts, essentiellement ou traditionnellement plantés en vigne, et les parcelles présentant des sols filtrants, dotés d'une bonne aptitude au réchauffement, d'une capacité de rétention en eau limitée et d'une fertilité chimique modérée": "strictly" and the open, long-planted slopes restored; split in two
- KEEP p8 "la texture grossière des sols assure un démarrage précoce du cycle de la vigne et limite sa vigueur"
- KEEP p8 "réserve en eau réduite et à leur fracturation qui permet un enracinement des plants en profondeur"
- KEEP p8 "alimentation hydrique modérée et régulière à la vigne, gage d'une bonne maturité"

## rules: One grape, one white wine, a winter on the lees
- FIX title: "long on the lees" had no source; p7 "pendant au moins un hiver" -> "a winter on the lees"
- KEEP p2 "Les vins sont blancs, secs et tranquilles"
- KEEP p5 "Melon B" (only variety listed); p7 "adoption du seul cépage melon B"
- FIX p6 "Les premières traces écrites de plantations de ce « plant bourguignon » sous le nom « Muscadet » apparaissent au milieu du XVIIème siècle": the page dates the first written record of plantings under that name, not the name itself
- KEEP p6-7 "Après l'hiver rigoureux de 1709, qui a détruit en grande partie le vignoble nantais, le cépage melon B, plus résistant aux gelées, est replanté préférentiellement dans les meilleures situations"
- KEEP p3 "densité minimale à la plantation de 6500 pieds par hectare"
- KEEP p4 "Le rendement est fixé à 65 hectolitres par hectare"
- FIX p3 "le plus souvent dans une série fruitée ou florale, et un équilibre gustatif dominé globalement par la fraîcheur": hedge "globalement" restored ("overall")
- FIX p3 "MENTIONS TRADITIONNELLES ... Sur lie": "signature style" had no source -> "a traditional label term"
- KEEP p7 "maintenir les vins sur leurs lies fines de vinification pendant au moins un hiver sans aucun soutirage"
- KEEP p7 "apporte rondeur et gras aux vins"
- FIX p7 "l'absence de manipulation des vins et leur maintien sous atmosphère chargée en gaz carbonique, en limitant fortement les phénomènes d'oxydation ... permet de préserver jusqu'au printemps et au-delà, les arômes formés au cours de la fermentation alcoolique": "loses fewer aromas" -> shielded from oxidation, keeps fermentation aromas into spring and beyond
- KEEP p10 "conditionnés en bouteilles dans les chais de vinification entre le 1er mars et le 30 novembre de l'année qui suit celle de la récolte"
- FIX p7 "ils peuvent présenter un léger perlant dû au gaz carbonique résiduel": "often" -> "may"
- FIX p9 "peut être complété par la mention « primeur » ou « nouveau » pour les vins répondant aux conditions de production fixées pour cette mention dans le cahier des charges": "early-release" is not on any page; the page only gives the term and its vintage rule
- FIX p10 "Les vins bénéficiant des mentions « sur lie », « primeur » ou « nouveau » sont présentés avec l'indication du millésime": vintage rule now covers sur lie too
- FIX p9-10 "dénomination géographique « Val de Loire » ... inférieures ou égales ... à celles des caractères composant le nom de l'appellation": the use rules sit in the cahier des charges, but the letter-size rule is on the page, so the term stays with that rule
- Label sweep: p3 also lists "Clos" and "Château" as traditional mentions with no rule of their own here; not added. No `label` field in the guide. Wine types: p2 allows only white, dry, still; none missing.

## Numbers
81 communes (p6), 6,500 (p3), 65 hl/ha (p4), 1709 (p6), 17th century "XVIIème" (p6), 1 March and 30 November (p10): all confirmed.

## Fact sheet
- tastes.text: sheet says "Sur lie wines are rounder"; p7 says "présentent généralement un équilibre en bouche orienté davantage vers la rondeur" (usually).
- famous.styles "Primeur / Nouveau": sheet says "early-release wines"; p9 only says wines meeting the cahier des charges production rules for the mention, and p10 the vintage must be shown. Not a contradiction of meaning, unsupported by the page.
