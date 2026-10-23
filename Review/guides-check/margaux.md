# Margaux sentence check
Source: margaux-doc (Fiche technique PDO-FR-A0329, document unique, 10 pp.)

## Lede
- KEEP p5 "rive gauche de l'estuaire de la Gironde sur un ensemble de terrasses graveleuses"
- KEEP p6 "effet thermique régulateur engendré par la présence des eaux"; p3 "rouges", "une certaine finesse soulignée par des arômes fruités"
- Title "Why Margaux tastes the way it does": KEEP (standard)

## place (estuary)
- Title KEEP p6 "collines", p5 "rive gauche de l'estuaire"
- KEEP p5 "rive gauche de l'estuaire de la Gironde sur un ensemble de terrasses graveleuses"
- KEEP p4/p5 "5 communes du département de la Gironde"; p4 "Arsac, Cantenac, Labarde, Margaux et Soussans"
- KEEP p5 "la plus vaste des appellations « communales » du Médoc"
- FIX p7 "noyaux viticoles surtout situés sur les croupes graveleuses": hedge restored ("mostly on the gravelly rises")
- KEEP p7 "La forêt se concentrait à l'ouest"
- KEEP p7 "les prairies et pâtures étaient l'apanage des terres de palus"
- KEEP p7 "la vigne est apparue dès l'époque gallo-romaine"
- KEEP p7 "à partir du XVIème siècle ... les « bourdieux », les ancêtres des châteaux viticoles"
- KEEP p7 "assainissement des terres entrepris sous le règne de Louis XIV sous l'impulsion des ingénieurs hollandais, le vignoble gagne rapidement les croupes graveleuses"
- KEEP p7 "Vers 1760, la quasi-totalité du vignoble moderne est constituée"
- Flight caption KEEP p5. Point FIX: [-0.71, 45.05] sat about 3 km west of Margaux, inland, away from the estuary. Moved to [-0.665, 45.045], between the village and the shore. OSM gave no result and the Nominatim request needed approval, so this point is from known coordinates [A].

## weather (climate)
- Title KEEP p6 "effet thermique régulateur engendré par la présence des eaux"
- KEEP p5 "climat océanique tempéré"
- KEEP p6 "effet thermique régulateur ... de l'Océan Atlantique et de la Gironde"; p8 "l'estuaire qui protège le vignoble des excès du climat"
- KEEP p6 "s'associent parfois quelques dépressions automnales pluvieuses"
- KEEP p6 "qui expliquent en grande part l'effet millésime"

## ground (terraces)
- Title FIX: "Gravel, sand and silt" was an X, Y and Z list. Now "Gravel terraces between sand and silt" (p6 terraces, sable des landes to the west, palus limono-argileuse to the east)
- FIX p6 "dépôts fluviatiles ... de la Garonne": "deposits" becomes "river deposits"
- KEEP p6 "Disposés en terrasses ... collines qui s'étagent aujourd'hui entre 6 et 33 m d'altitude"
- KEEP p6 "haute terrasse ... argile sableuse à graviers et petits galets"; "La taille des galets n'excède pas 35 mm"
- KEEP p6 "leur a valu le nom de « graves dragées »"
- KEEP p6 "exclusivement dans la partie sud de la commune d'Arsac"
- KEEP p6 "basse et aux moyennes terrasses ... nettement plus grossier, des dimensions de galets supérieures à 80 mm sont fréquentes"
- KEEP p6 "débâcles consécutifs de la fonte des glaciers au cours des différentes périodes glaciaires"
- KEEP p6 "le plateau qui s'établit entre 30 et 40 m ... d'origine éolienne : le sable des landes"
- KEEP p6 "bande d'un à deux kilomètres"; "altitudes inférieures à 5 m"; "palus"
- KEEP p6 "à dominante limono-argileuse mais parfois plus sableuses"
- FIX p6 "le plus souvent à une formation ... à dominante argileuse ... ou à des calcaires et des marnes": "mostly clay, or else" becomes "most often clay, or" (the hedge covers both)
- KEEP p7 "affleure de façon ponctuelle"
- FIX p8 "Ces noyaux d'élite s'étendent sur les terrains situés sur lesdites terrasses, leurs colluvions et leur support géologique argileux ou calcaire": the page means elite sectors, not "best-known estates". Now "elite cores".
- Flight caption KEEP p6. Point FIX: [-0.665, 44.99] lay east of Arsac village, toward Cantenac and Labarde, not in southern Arsac. Moved to [-0.69, 44.975]. From known coordinates [A], since OSM gave no result.

## rules (red)
- Title KEEP p3 "cépage roi", p2 "vins tranquilles rouges"
- KEEP p2/p7-8 "uniquement des vins tranquilles rouges"
- KEEP p3 "couleur rouge intense et une excellente aptitude à la garde"
- KEEP p3 "Ces vins sont de grande garde"
- KEEP p3 "cépage roi du Médoc, il occupe près de 60 % des surfaces en vigne"
- KEEP p3 "sa structure, son bouquet et son potentiel de vieillissement"
- KEEP p3 "cépage d'appoint incontournable, ne représente que rarement plus de 30 % des assemblages"
- KEEP p3 "rondeur, générosité et complexité des arômes"
- KEEP p3 "cabernet franc N plus rare, apporte élégance et subtils arômes épicés"
- KEEP p3 "petit-verdot N produit un vin assez complet en couleur, en fruits et en tannins"
- KEEP p5 "Cot N", "Carmenere N"
- KEEP p4 "densité minimale à la plantation de 7 000 pieds à l'hectare"
- KEEP p4 "rendement est fixé à 57 hectolitres"; "rendement butoir est fixé à 63" (p4's 60 hl/ha ceiling for some row spacings is not mentioned)
- FIX p8 "les vins du futur château Margaux sont nommément désignés et se vendent à un prix trois fois supérieur": the claim was widened from one château to all Margaux wines. It now names the future Château Margaux.
- KEEP p8 "éventail unique de 21 grands crus classés". Term explained ("its classed growths").

## Also checked
- Wine types: only "vins tranquilles rouges" (p2, p7). The rules beat names it.
- Label terms: p3 lists Cru classé, Cru bourgeois, Cru artisan, Clos and Château as mentions traditionnelles, but no page gives any of them a rule. The guide has no label, and none was added.
- Missing flights: the only named feature is the Gironde estuary, which already has a flight.

## Fact sheet
- tastes.text: the sheet says "very good ageing ability". p3 says "une excellente aptitude à la garde", so it should say "excellent".
- No other field contradicts the pliego. famous.styles is empty, and styles.kinds ["red"] matches p2.
