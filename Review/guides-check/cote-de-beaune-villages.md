# Check: cote-de-beaune-villages

Source: cote-de-beaune-villages-doc (fiche technique PDO-FR-A0401, 13 pages). Checked 2026-10-22, sentence by sentence.

## Title and lede
- KEEP title (standard form).
- FIX lede s1 p8 "communes situées en front de « Côte », donnent des vins généreux à la maturité poussée et aux tanins souples": "ripe fruit and soft tannins" → "from very ripe grapes, with supple tannins".
- FIX lede s2 p8 "cachées dans les vallées entamant le plateau des « Hautes Côtes » offrent des vins sont plus frais, élégants et fruités": named the Hautes Côtes, restored "fruitier" (taste word dropped).

## place: "A tectonic ridge around Beaune"
- KEEP title p6 "relief d'origine tectonique"; "de part et d'autre de la ville de Beaune".
- KEEP p6 "relief rectiligne s'allongeant sur environ 25 kilomètres".
- KEEP p6 "Ce relief d'origine tectonique".
- KEEP p6 "plateaux calcaires des « Hautes Côtes », à l'ouest, d'une altitude comprise entre 400 mètres et 500 mètres".
- KEEP p6 "la plaine de Bresse, à l'est, fossé d'effondrement tertiaire dont l'altitude, au droit de la « Côte », est proche de 250 mètres".
- KEEP p6 "12 communes, de part et d'autre de la ville de Beaune, dans le département de la Côte-d'Or, et de 4 communes contiguës du département de Saône-et-Loire" (list p5).
- KEEP p6 "Plusieurs vallées interrompent la continuité de la « Côte » et découpent profondément les plateaux de l'arrière-pays".
- KEEP p6-7 "Le vignoble occupe les reliefs constituant le front de « Côte » et s'insinue le long des versants des vallées".
- Flight "The Côte de Beaune ridge": FIX point. It sat on Beaune [4.84, 47.02], the same point as the Beaune flight; moved to the middle of the ridge near Meursault [4.77, 46.98] (Meursault is on p5's list). Caption KEEP p6. OSM gave no result for the ridge; Nominatim lookups were not approved this run, so the point is from known coordinates of Meursault [A].
- Flight "Maranges": FIX label "the southern end" → "in Saône-et-Loire" (p6 gives a NE/SW direction but does not name an end). Point [4.68, 46.92] lies within about 2 km of Cheilly-, Dezize- and Sampigny-lès-Maranges [A]. Caption KEEP p5 list, p6 "4 communes contiguës".

## weather: "Sheltered behind the Morvan"
- KEEP title p6 "à l'est du massif du Morvan … bénéficie d'un abri climatique".
- FIX p6 "Le climat est océanique frais, perturbé par des influences continentales ou méridionales conduites par l'axe Rhône-Saône": "with … influences that travel up" → "disturbed by continental or southern influences carried along".
- KEEP p6 "régime pluviométrique modéré et régulier (environ 750 millimètres par an), sans sécheresse estivale affirmée".
- KEEP p6 "une moyenne annuelle de 10,5°C".
- KEEP p6 "La « Côte », à l'est du massif du Morvan et des plateaux de Bourgogne".
- FIX p6 "un avantage thermique ainsi qu'un déficit pluviométrique notable pour la région": "notably less rain than the rest of the region" → "a rain shortfall that is notable for the region" (no comparison with the rest of the region on the page).
- Missing flight ADDED: "The Morvan massif" [4.05, 47.05], zoom 8.5, caption cite p6. Point from known coordinates (Haut-Folin area) [A]; Nominatim lookup not approved this run.

## ground: "Hard limestone, soft marl"
- KEEP title p7 "calcaires durs et des niveaux de marnes (calcaires argileux) plus tendres".
- KEEP p7 "formations calcaires datées du Jurassique moyen et supérieur".
- KEEP p7 "Alternent des niveaux de calcaires durs et des niveaux de marnes (calcaires argileux) plus tendres".
- KEEP p7 "Localement, des horizons dolomitiques s'intercalent".
- KEEP p7 "Le substrat est souvent masqué par des épandages mêlant des éboulis à des argiles et limons".
- FIX p7 "Très pierreux et peu épais, en haut de versant, sur les marnes": added "over the marls".
- KEEP p7 "plus riches en particules fines et plus épais, en piémont (quelques décimètres à 1 mètre)".
- KEEP p7 "versants bien exposés à des altitudes comprises entre 230 mètres et 400 mètres".
- KEEP p7 "pente moyenne de 20%, pouvant aller jusqu'à 40 %".
- FIX p7 "La nature argilo-limoneuse des sols les rend parfois sensibles à l'érosion": hedge "parfois" restored ("some soils" → "are sometimes prone").
- KEEP p7 "peu évolués, généralement carbonatés, peu épais et bien drainants".
- KEEP p7 "Plutôt pierreux et maigres, en haut de versant, ils sont plus profonds et argileux, sur les replats et le piémont".

## rules: "Red Pinot Noir, in many shades"
- KEEP title p8 "principalement planté en cépage pinot noir N"; p9 "une large palette de nuances".
- FIX chapter cite: p9 added (the "range of shades" sentence is on p9).
- KEEP p2 "Les vins sont des vins rouges tranquilles secs".
- KEEP p8 "principalement planté en cépage pinot noir N, cépage autochtone bourguignon".
- KEEP p6 variety list "Chardonnay B / Pinot Noir N / Pinot Gris G / Pinot Blanc B"; "no white" follows from p2.
- CUT "The wines are ruby red, often with measured, velvety tannins and fine fruit." p3/p8 say it, but it repeats the fact sheet's `tastes` word for word.
- FIX p3/p8 "Les vins de certains secteurs du sud … ont un caractère plus tannique et plus colorés que ceux du nord, dotés d'une grande finesse": kept the sector contrast, moved into the shades paragraph in two lines.
- KEEP p9 "Le relief, la diversité géologique et la variété de sols … induisent ainsi dans les vins une large palette de nuances".
- CUT "Front-of-slope villages make generous wines … Villages hidden in the valleys … fresher, more elegant and fruitier ones." p8 says it, but it repeated the lede.
- KEEP p4 "densité minimale à la plantation de 9000 pieds par hectare"; p5 "L'irrigation est interdite".
- KEEP p5 "Le rendement est fixé à 50 hectolitres par hectare. Le rendement butoir est fixé à 58".
- KEEP p8 "L'usage est d'élever les vins pendant plusieurs mois".
- KEEP p8 "reconnus en appellation d'origine contrôlée « Côte de Beaune-Villages », en 1937".
- FIX p8 "se vendent généralement sous le nom des « crus » les plus réputés comme « Beaune », « Corton », « Pommard » ou « Volnay ». Ces noms étant réservés, dès 1936": the four names were examples ("comme"), not a closed list; rewritten as two lines with "such as Beaune or Volnay", no "X, Y and Z" list.
- KEEP p8 "les vins rouges des autres communes de la « Côte de Beaune », dont la réputation est établie".
- Flight "Beaune": point KEEP (town centre about 47.02 N, 4.84 E [A]). FIX caption p8 "La « Côte de Beaune » alimente en « vins fins » les maisons de négoce beaunoises": cut "Its name gave the appellation its name" (no page says it); "bought" → "supplied … with fine wines", dated to the 18th century as on p8.

## Label
- KEEP Lieu-dit p11 "nom d'un lieu-dit cadastré … figure sur la déclaration de récolte"; p12 "pas supérieures … à la moitié de celles des caractères composant le nom de l'appellation".
- KEEP Vin de Bourgogne p12 "peut préciser l'unité géographique plus grande « Vin de Bourgogne » ou « Grand Vin de Bourgogne »".
- Sweep: p3 mentions traditionnelles (Appellation d'origine contrôlée, Villages, Clos, Château) have no rule in the pliego, so not added. p12 c) grape-variety label rule (not in the same visual field, at most 2 mm) is a layout rule, not a term; not added.
- Wine types: p2 allows only still dry red; the rules beat names it. No other type.

## Fact sheet
No field disagrees with the pliego. `famous.styles` is empty and `styles.kinds` ["red"] matches p2. Climate "warmer and drier than the surrounding region" is a fair reading of p6 "avantage thermique ainsi qu'un déficit pluviométrique notable pour la région".
