# Sentence check: bourgueil (source bourgueil-doc, PDO-FR-A0729 fiche technique, Document unique)

## Title
KEEP "Why Bourgueil tastes the way it does" (standard title)

## Lede
FIX p5 "vaste coteau globalement orienté au sud": was "south-facing chalk slope". Only the lower slope is on chalk and mid-slope is clay-silica (p5), and "globalement" was dropped. Now "broad slope facing generally south".
FIX p7 "sont favorables une expression aromatique fruité… tanins fins et souples" / "sont propices à la production de vins rouges plus opulents": was "The gravel gives… the chalk gives". Hedges restored ("favour", "suits"), and the soil named as sandy. Cite p5 added.

## place: "A slope between forest and river"
KEEP p5 title "bordée, au nord, par la forêt de Gâtine et au sud, par la Loire"
KEEP p5 "au nord de la Loire, quelques kilomètres en amont de la confluence… avec la Vienne, à l'extrémité nord-ouest du vignoble de « Touraine »"
KEEP p5 "bordée, au nord, par la forêt de Gâtine et au sud, par la Loire"
KEEP p5 "pour un tiers, sur un vaste coteau globalement orienté au sud et coiffé par la forêt"
KEEP p5 "pour les deux tiers restants, sur les terrasses et les croupes, localement dénommées « montilles »"
FIX p5 "entaillé par la vallée du Changeon… orienté nord-sud… limite entre les communes de Bourgueil et de Benais": added "runs north to south".
KEEP p6 "La zone géographique couvre 8 communes du département d'Indre-et-Loire" (also p4 list)
FIX p6 "Il apparaît que l'origine du vignoble… soit liée à la fondation de l'abbaye de Bourgueil, en 990, qui nous livre les premières traces écrites": the hedge was dropped ("Vines were first recorded"). Now "seems tied to… which left its first written traces".
Flight "The Changeon valley": FIX. [0.1, 47.3] lies about 6 km west of Bourgueil, near Saint-Nicolas-de-Bourgueil, not on the Bourgueil–Benais line. Moved to [0.19, 47.29], between the two villages. Nominatim was refused in this run, so this point is [A] and should be confirmed on OSM.
Flight "Bourgueil abbey": KEEP p6. The point is on the east side of Bourgueil, within about 1 km of the abbey [A]. No OSM lookup was possible.

## weather: "Milder and drier than Touraine"
FIX title p6 "plus doux et plus sec que celui de l'ensemble de la région Touraine": was "than its neighbours", which widened the comparison.
KEEP p6 "climat sensiblement plus doux et plus sec que celui de l'ensemble de la région Touraine"
KEEP p6 "températures minimales, moyennes et maximales y sont d'un degré supérieures ; précipitations annuelles… inférieures d'environ 75 millimètres"
KEEP p6 "Le plateau densément boisé et qui coiffe le coteau viticole assure une protection vis-à-vis des vents froids venant du Nord"

## ground: "Chalk above, gravel below"
KEEP title p5 (chalk on the slope, sand and gravel at its foot)
FIX p5 "sols bruns calcaires développés sur la craie micacée glauconieuse du Turonien, ou la craie tuffeau jaune": "limestone soils" changed to "limy soils" (calcaires).
FIX p5 "sols argilo-siliceux, issus des formations argilo-sableuses du Sénonien": added "of the Senonian".
KEEP p5 "terrasses d'alluvions anciennes et… « montilles »… sont filtrants, sablo-graveleux, plus ou moins caillouteux"
KEEP p7 "Le fleuve a dégagé par érosion le grand coteau. Il a également déposé les alluvions qui représentent l'essentiel du substratum"
FIX p7 "sols sablo-argileux ou sablo-graveleux sont favorables une expression aromatique fruité… tanins fins et souples qui expliquent le succès des vins dès l'année de récolte": soils named as the page names them. "please from the year" changed to "explains their success from the year of the harvest".
KEEP p7 "substratum turonien sont propices à la production de vins rouges plus opulents, disposant d'une bonne structure tannique"
FIX p6 "résiste longtemps au phylloxéra, dont la propagation est plus lente dans les sables": was "sandy soils slowed phylloxera". Now the slower spread in sand is stated as the page does.
KEEP p6 "reconstitution rapide en vignes greffées, et avec le seul cépage cabernet franc N"
Flight "The Loire at the foot of the slope": KEEP p7. The point is about 1 to 2 km north of the river south of Bourgueil [A], under the 3 km limit.

## rules: "Cabernet franc, red and rosé"
KEEP title p2 "vins tranquilles rouges ou rosés", p6 cabernet franc
KEEP p6 "Localement dénommé « breton », le cépage cabernet franc N, est le cépage principal"
KEEP p5 "Cabernet franc N / Cabernet Sauvignon N"
KEEP p2 "Les vins sont des vins tranquilles rouges ou rosés"; p6 "près de 95% des volumes"
CUT p3/p6 reds' colour, tannins and fruit: this repeated the fact sheet `tastes` almost word for word. The fruit clause had also dropped "le plus souvent".
CUT p3/p6 rosé aromas: this repeated the fact sheet `tastes` word for word.
FIX p3/p7 "Certains vins, plus opulents, gagnent à être gardés quelques années. Ils pourront alors révéler… cacaotées, légèrement fumées ou épicées": "and then show" changed to "can then show", and the comma splice split into two sentences.
ADD p2 "rouges… sucres fermentescibles… inférieure ou égale à 2 grammes par litre / rosés… 4 grammes par litre": new sentence.
KEEP p4 "Le rendement est fixé à 55 hectolitres par hectare. Le rendement butoir est fixé à 67"
KEEP p3 "taillées, avant le 1er mai"; p7 "une taille courte"
KEEP p7 "l'interdiction de certains clones"
ADD p8 "peut préciser le nom d'une unité géographique plus petite, sous réserve qu'il s'agisse d'un lieudit cadastré et que celui-ci figure sur la déclaration de récolte": new label sentence.
KEEP p6 "En 2009, le vignoble couvre 1 400 hectares, exploité par 180 viticulteurs"
Label sweep: p3 lists the mentions "Clos" and "Château" but gives them no rule of their own, so neither was added. No other style or category is in the pliego. Still red and rosé are both named.
Cites: the chapter cite list was cleaned of a duplicate p3, and p8 was added.

## Fact sheet
- climate.text: the sheet says "temperatures about 1 °C higher". p6 says "d'un degré supérieures", with no "about" (the "environ" applies to the rain only).
- soil.text: the sheet says "brown limestone soils". p5 says "sols bruns calcaires" (limy).
- grapes, styles, tastes, famous: they match.
