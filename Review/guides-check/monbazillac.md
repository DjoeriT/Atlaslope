# monbazillac: sentence check
Source: monbazillac-doc (Fiche technique PDO-FR-A0153-AM01, Ares(2014)2129363, 27/06/2014)

## Title
KEEP p3 "vins doux ... arômes de miel, acacia et pêche" (generic title)

## Lede
KEEP p3 "propice à la production de raisins concentrés par le Botrytis cinerea grâce aux matinées de brume ou brouillard suivies d'après-midi ensoleillées"
FIX p3 "Ces raisins ... donnent des vins doux, de couleur dorée avec des arômes de miel, acacia et pêche": "The result is" became "These grapes give" (the page links the grapes, not the weather, to the wine); three-item list broken up.

## place: The left bank of the Dordogne
KEEP p3 "Situé sur la rive gauche de la Dordogne" (title)
KEEP p3 "Situé sur la rive gauche de la Dordogne, le vignoble"
KEEP p2 "La récolte des raisins, la vinification, l'élaboration et l'élevage des vins sont assurés sur le territoire des communes suivantes ... Colombier, Monbazillac, Pomport, Rouffignac-de-Sigoulès et Saint-Laurent-des-Vignes"
KEEP p3 "L'aire de proximité immédiate pour l'élaboration et l'élevage des vins" (12 communes counted; "belt" reworded to "area of neighbouring communes")
KEEP p3 "Bergerac ... Sigoulès"
Fly "Monbazillac and its slopes": KEEP p3 "versants argilo-calcaires exposés nord"; OSM gave no result, point is about 1.4 km from Monbazillac village, within 3 km, kept.
Fly added "The Dordogne at Bergerac" [0.482, 44.8519], zoom 10: p3 "rive gauche de la Dordogne"; Bergerac is in the aire de proximité immédiate.

## weather: Mist in the morning, sun in the afternoon
KEEP p3 "matinées de brume ou brouillard suivies d'après-midi ensoleillées" (title)
KEEP p3 same words
FIX p3 "le vignoble ... est propice à la production de raisins concentrés par le Botrytis cinerea": "This suits Botrytis ... and gives concentrated grapes" became "This makes the vineyard well suited to grapes concentrated by Botrytis cinerea" (noble rot = p2 "pourriture noble").
FIX p3 "Tout l'art du vigneron consiste à cueillir les raisins (essentiellement cépage sémillon B) au stade optimal de la concentration": "winemaker" became "grower"; "mostly Sémillon" added.
KEEP p2 "vendangées manuellement par tries successives"

## ground: Clay-limestone facing north
KEEP p3 "versants argilo-calcaires exposés nord" (title)
KEEP p3 same words

## rules: Overripe grapes, picked pass by pass
KEEP p2 "raisins récoltés à surmaturité ... par tries successives" (title)
KEEP p1 "Vin blanc tranquille avec sucres résiduels ... Teneur en sucres fermentescibles >à 45g/l"
KEEP p2 "raisins récoltés à surmaturité avec action ou non de la pourriture noble"
KEEP p3 "essentiellement cépage sémillon B"
FIX p2-3 "CÉPAGES PRINCIPAUX Semillon B, Sauvignon gris G, Sauvignon B, Muscadelle B": "Sauvignon" became "Sauvignon blanc".
FIX p7 "CÉPAGES SECONDAIRES Chenin B, Ondenc B, Ugni blanc B": "allowed in smaller roles" became "listed as secondary grapes" (the page sets no share).
KEEP p2 "densité minimale de plantation de 4000 pieds à l'hectare"
KEEP p2 "Chaque pied porte au maximum 15 yeux francs. L'irrigation est interdite"; p2 "Rendement maximal: 40 hectolitre par hectare"
KEEP p3 "Ces raisins sont mis entiers dans le pressoir afin de faciliter l'extraction des moûts"
CUT "The wines are sweet and golden, with aromas of honey, acacia and peach, and sometimes citrus." p3 says it, but it repeats the lede and the fact sheet's tastes.
CUT "Sweetness is sometimes very high." p1 "la sucrosité est parfois très élevée" says it, but it repeats the fact sheet's tastes.
KEEP p3 "Une durée d'élevage est nécessaire pour permettre d'atteindre harmonie et plénitude"
FIX p4 "L'AOC Monbazillac peut être complétée de la mention traditionnelle 'Sélection de grains nobles', selon les dispositions fixées dans le cahier des charges": now says its rules sit in the full specification (famous style, stays in the rules beat; the guide has no label field).
FIX (added) p3-4 "peut préciser l'unité géographique plus grande « Sud-Ouest » ... ne sont pas supérieures ... à celles des caractères composant le nom de l'appellation": label term with its own rule, was missing.

Swept: wine types (only still white with residual sugar, p1; nothing missing). Mentions "Clos" and "Château" (p7) carry no rule in this pliego, left out. Enrichment (p2) only points to the cahier des charges, left out.

## Fact sheet
No disagreements with the pliego.
