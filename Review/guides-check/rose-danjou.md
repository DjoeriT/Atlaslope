# Check: rose-danjou (source rose-danjou-doc, fiche technique PDO-FR-A1007, document unique), 22 Oct 2026

## Title
KEEP "Why Rosé d'Anjou tastes the way it does" (standard title)

## Lede
FIX p6 "schistes ... « Anjou noir » ... craie tuffeau (Saumur) ... « Anjou blanc »": "dark schist" and "pale tuffeau" had no source; now the local names.
FIX p8 "climatologie empreinte de douceur, une géologie et une pédologie originale, confère aux vins une identité gustative qui s'exprime au travers de la fraîcheur": the page links climate and soil to freshness only, not "freshness with roundness"; the hills-and-wind cause is dropped from the lede.

## place (valleys)
FIX title p6 "versants des rivières et quelques plateaux": was "Slopes along the Loire and its tributaries"; the page does not name the Loire for the slopes.
KEEP p6 "le vignoble occupe principalement les versants des rivières et quelques plateaux"
KEEP p6-7 "moitié méridionale du département de Maine-et-Loire (129 communes) ... Deux-Sèvres (15 communes) et de la Vienne (9 communes)"
KEEP p7 "Quelques îlots subsistent dans le nord ... la vigne était implantée sur l'ensemble du département"
FIX p6 "Associée historiquement à l'ancienne province de l'Anjou": "follows" -> "historically tied to".
FIX p7 "le commerce est si florissant au XVIIIème siècle qu'afin de favoriser le transport, la rivière Layon ... est canalisée": "to ship the wine" -> to help transport as trade flourished.
Flight Layon: FIX point [-0.5, 47.2] (south of the river) -> Thouarcé on the Layon [-0.502, 47.266] (pack OSM lookup returned no result; town position from known coordinates). Caption FIX as above, p7.
Flight Saumur: KEEP p6 "craie tuffeau (Saumur) ... « Anjou blanc »"; point is Saumur.

## weather (climate)
KEEP title p7 "« douceur angevine »"
FIX p7 "écarts de température assez faibles compte tenu ... de la relative proximité de l'océan Atlantique ... régulateur thermique que jouent la Loire et ses affluents ... coteaux": X, Y and Z list split into lines, cause kept.
KEEP p7 "Ne parle-t-on pas de « douceur angevine » ... l'hiver, du long printemps et de l'automne, alors que les fortes chaleurs sont fréquentes en été"
KEEP p7 "reliefs d'orientation nord-ouest/sud-est jouent un rôle protecteur vis-à-vis des vents d'ouest souvent chargés d'humidité"
FIX p7 "faiblement arrosée, bénéficiant d'un effet de Foehn, à l'abri de l'humidité océanique du aux reliefs plus élevés du Choletais et des Mauges": shelter and low rain had been dropped; restored.
KEEP p7 "de l'ordre de 585 millimètres alors qu'elles sont de près de 800 millimètres dans le Choletais"

## ground (soils)
KEEP title p6 "« Anjou noir » ... « Anjou blanc »"
FIX p6 "deux grands ensembles géologiques": "meet" -> "spans".
KEEP p6 "A l'ouest, le socle précambrien et paléozoïque est rattaché au Massif Armoricain ... schistes, notamment ardoisiers"
FIX p6 "le substratum mésozoïque et cénozoïque du Bassin Parisien vient recouvrir le socle ancien": "younger" dropped (not on page).
KEEP p7 "Bien que très différents, ces sols sont généralement pauvres et ont une réserve hydrique modérée ... un bon comportement thermique"
FIX p8 "grolleau N, grolleau gris G ou pineau d'Aunis N colonisent les collines et replats sablo-graveleux": Grolleau Gris was missing.
FIX p8 "cabernet franc N et cabernet-sauvignon N apprécient ... sols peu profonds ou des sols bruns et à l'alimentation hydrique régulée permettant une production de vins rosés ronds et à bonne persistance aromatique": added the page's own taste link.
KEEP p8 "L'implantation du cépage gamay N privilégie les parcelles présentant des sols développés sur les roches précambriennes au cœur de « l'Anjou noir »"

## rules (rosé)
FIX title p8 "« rouget », dénomination locale d'un vin léger consommé dans les cafés": "café red" -> "café wine"; the page does not say red.
KEEP p8 "« L'Anjou » doit sa notoriété essentiellement à la production de vins blancs issus du cépage chenin B ... cabernet franc N, puis, un peu plus tard ... cabernet-sauvignon N, vont s'accélérer après la crise phylloxérique"
FIX p8 "vin léger consommé dans les cafés": "light red" -> "light wine".
KEEP p8 "grolleau N et grolleau gris G, qui donnent des vins « clairets » et peu colorés"
FIX p8 "Associés aux cépages grolleau ..., accessoirement aux cépages gamay N et pineau d'Aunis N, ils participent au développement d'une production importante de vins rosés emblématiques": "ils" is the Cabernets; the guide had made Grolleau the subject.
KEEP p2 "Les vins sont des vins tranquilles rosés"
KEEP p6 grape list (Cot N ... Pineau d'Aunis N), reworded as seven grapes.
FIX p2/p3 "supérieure ou égale à 7 grammes par litre" / "une sucrosité plus ou moins importante": "so" made a cause the page does not; now two facts.
CUT p3 "pêche, fraise, agrumes ... savant équilibre entre la fraîcheur et la rondeur ... persistance aromatique est intense": repeats the fact sheet tastes; kept only the new point, p3 "révélant en chacun les spécificités de leurs propres cépages".
KEEP p4 "Le rendement est fixé à 65 hectolitres par hectare. Le rendement butoir est fixé à 75"
KEEP p2/p3 "ne dépassent pas, après enrichissement, le titre alcoométrique volumique total de 12 %"
ADD p3 "L'utilisation des charbons à usage œnologique ... est interdite ; L'utilisation de morceaux de bois est interdite"
KEEP p9-10 "mention "primeur" ou "nouveau" ... obligatoirement avec l'indication du millésime"
KEEP p10 "Le terme « cabernet », ou l'indication du cépage cabernet-sauvignon N ou cabernet franc N est interdite dans la présentation et la désignation"
ADD p10 "nom d'une unité géographique plus petite sous réserve qu'il s'agisse d'un lieu-dit cadastré"
Wine types: still rosé only (p2); the pliego protects no other category. Traditional mentions p3 (Primeur, Clos, Château): Primeur carries its rule (p9-10); Clos and Château have no rule in the pliego and stay out.

## Fact sheet
- tastes.text: sheet "long aromatic persistence"; pliego "Leur persistance aromatique est intense" (p3, p8).
- climate.text: sheet ties the foehn effect to the NW-SE hills; pliego gives it to the higher Choletais and Mauges relief (p7).
- soil.text: sheet "Grolleau and Pineau d'Aunis" omits Grolleau Gris (p8).
- why.text: sheet "give fresh, round rosés"; pliego's causal link gives freshness (p8), roundness only for Cabernet sites (p8). Not plainly settled.
- famous.styles: Clos and Château are traditional mentions with no rule (p3), not styles. Left for the owner.
