# Check: ahr (source ahr-spec, Produktspezifikation „Ahr“ with Einziges Dokument, 16 pages)

Pliego is German; quotes are the German words.

## Title
KEEP p4/p7 "Why Ahr tastes the way it does" (no claim)

## Lede
FIX p7 "69% der Rebflächen weisen eine Hangneigung über 30% aus" / "überwiegend Sandsteinen („Grauwacken“) und nachgeordnet Tonschiefern": was "sit on steep slopes" for all vineyards; the east is mostly gentle slopes. Now "Most ... slope more than 30%".
KEEP p7 "Die dominierenden Schiefer- und Grauwackeböden bedingen eine hohe Mineralität der Weine" (body repeat of this line removed, see ground)

## Place: "A short, steep river valley"
KEEP title p7 "ca. 18 km langen Flussabschnitt" / "steile bis sehr steile ... Talhänge"
KEEP p7 "liegt im Rheinischen Schiefergebirge und gehört landschaftlich zur nördlichen Osteifel"
KEEP p7 "im ca. 18 km langen Flussabschnitt der Ahr zwischen Altenahr und Bad Neuenahr"
KEEP p7 "Die Talsohle liegt bei ca. 150 m NN im Westen und ca. 100 m NN im Osten"
KEEP p7 "im Westen 50 bis 150 m"
KEEP p7 "zwischen Rech und Dernau 200 bis 250 m breit"
KEEP p7 "steile bis sehr steile 150 bis 200 m hohe Talhänge"
KEEP p7 "im östlichen Teil ... vorwiegend auf flachen Hanglagen, wenigen Steillagen sowie Verebnungen der höheren Flussterrassen"
KEEP p7 "Ausnahmen sind der Lohrsdorfer Kopf und die Landskrone mit überwiegend Steillagen"
KEEP p7 "69% der Rebflächen weisen eine Hangneigung über 30% aus"
FIX p4 "Rebflächen der Gemeinden ... im Landkreis Ahrweiler des Landes Rheinland-Pfalz": seven-name list dropped (X, Y and Z list), Rhineland-Palatinate added.
Fly "Altenahr, the western end": KEEP p7 caption. Point [6.99, 50.52] kept [A]: Nominatim not reachable from this session (network call not approved); matches Altenahr village.
Fly "Landskrone": KEEP p7 caption. FIX point [7.07, 50.54] -> [7.15, 50.556] [A]: old point sat near Ahrweiler town, about 6 km from the Landskrone hill above Heimersheim. Not OSM-verified; recheck with Nominatim.
Missing flights: none added (Lohrsdorfer Kopf is a candidate, left out without a verified point).

## Weather: was "A long season in a sheltered valley"
FIX title p7: "sheltered" not on the page; now "A long season in a steep valley" ("lange Vegetationsperiode", "steile ... Talhänge").
FIX p7 "im Jahresmittel mit Tagesdurchschnittstemperaturen von 9,8° C": now "Averaged over the year, the daily mean temperature".
KEEP p7 "Jahresniederschlagsmenge von durchschnittlich 650 mm und etwa 1450 Sonnenscheinstunden"
FIX p7 "Die lange Vegetationsperiode in Verbindung mit der besonderen Topographie ..., den kleinklimatischen Bedingungen und der charakteristischen Zusammensetzung des Bodens bestimmen die Typologie": soil was dropped from the causes; added back, split into short lines.
FIX p7 "Ausprägung des Rebsortentyps mit feinen, aber klaren Aroma- und Geschmacksnoten": was "the grapes give"; now each grape shows its type with fine but clear aromas and flavours.

## Ground: was "Greywacke, slate and loess"
FIX title: X, Y and Z list; now "Greywacke and slate on the slopes" (p7).
KEEP p7 "vollständig im Bereich des Nordflügels des Ahr-Sattels"
KEEP p7 "überwiegend Sandsteinen („Grauwacken“) und nachgeordnet Tonschiefern ... (Unterdevon)"
KEEP p7 "im Westteil ... als harte graue Festgesteine"
FIX p7 "tiefreichend und intensiv verwitterte halbfeste bis lockere und häufig bunt verfärbte Gesteine": "streaked with colour" -> "discoloured in many colours".
FIX p7 "Rebflächen auf Kiesen und Lehmen der Talauen sowie der Mittel- und Hauptterrassen ... haben im gesamten Weinbaugebiet eine recht weite Verbreitung": hedge "recht weite Verbreitung" restored (quite widespread); split.
KEEP p7 "Häufig sind die Mittel- und Hauptterrassenverebnungen mit mächtigem Löß und Lößlehm bedeckt"
FIX p4 "Die Erzeugnisse der Ahr erhalten durch die unterschiedlichen Verwitterungsböden ... charakteristische Eigenschaften": minerality line repeated the lede; replaced with this p4 line, p4 added to cite.

## Rules: was "Red first, then rosé, white and sparkling"
FIX title: X, Y and Z list and an order the page does not give; now "Mostly red" (p4 "insbesondere Rotweine").
KEEP p4 "An der Ahr werden insbesondere Rotweine"
KEEP p4 "daneben auch traditionell Rosé- und Weißweine"
KEEP p4 "Weine aus diesem Ursprung können zur Herstellung von Qualitätsperlwein und Sekt b.A. ... verwendet werden"
FIX p4 "Überdruck von mindestens 1 bar und höchstens 2,5 bar" / "Sekt b.A. ... mindestens 3,5 bar": Qualitätsperlwein moved out of label into this beat with its rule; Sekt pressure added.
FIX p6 grape list: "Red grapes lead the list" is not on the page (it lists whites first and names no lead grape); "Portugieser" is "Blauer Portugieser"; "and many more" list dropped. Now two examples each.
KEEP p6 "Der Hektarhöchstertrag ist auf 100 hl/ha festgesetzt"
KEEP p4 "hell- bis dunkel rubinrot" / "Blaubeeren, Trockenfrüchte, Erdbeere und Kirsche" (split to avoid a four-item list)
FIX p4 "Im Geschmack entstehen hier Weine von besonderer Dichte": "particularly dense" -> "a particular density".
KEEP p4 "aus roten Rebsorten hell gekeltert" / "heller bis blassroter Farbe" / "frische, leichtere Art und seinen geringeren Taningehalt"
KEEP p4 "hellgrün bis gelbe Farbe" / "Pfirsich- und Zitrusaromen" / "Die Säure ist geschmacklich deutlich wahrnehmbar"
FIX p6 "Prädikatsweine dürfen nicht angereichert werden": was "The sweetest styles are Prädikat wines" (no source) and the no-enrichment rule narrowed to Eiswein; now applies to all Prädikat wines.
KEEP p5 "Kabinett alle Weißweinsorten 10,0%vol ... alle Rotweinsorten 10,6%vol"
KEEP p6 "Trockenbeerenauslese alle Rebsorten 21,5%vol" / "Eiswein alle Rebsorten 15,3%vol"
FIX p8 "Je nach Vegetationsstand und Standort müssen die Trauben ... zu einem früheren Zeitpunkt abgeerntet werden, um die für einen Sekt b.A oder Winzersekt prägnante Säurestruktur zu erhalten": hedge "je nach" restored; Winzersekt added.
KEEP p8 "mindestens 9 Monate auf der Flasche reifen"
ADD p5/p6 "Sekt b.A. oder Winzersekt" / "5.1.3. Sekt b. A., Winzersekt": Winzersekt was missing.
Missing types swept: Qualitätswein, Prädikatswein (6 Prädikate), Qualitätsperlwein, Sekt b.A., Winzersekt all present. Rotling (p6) only points to § 32 WeinV: left out.

## Label
ADD p5/p6 Qualitätswein: "Riesling 6,7%vol", "Dornfelder 8,8%vol", "auf bis zu 15%vol ... angereichert".
KEEP p5 Spätlese, p5/p6 Auslese, p6 Beerenauslese (all numbers match).
CUT Qualitätsperlwein from label: it is described in the rules beat, so its rule moved there.
ADD p2 still-wine terms trocken, halbtrocken, lieblich, süß with their sugar rules.
ADD p2/p3 Sekt terms brut nature, extra brut, brut, extra trocken, trocken, halbtrocken, mild.
Kabinett, Trockenbeerenauslese, Eiswein, Sekt b.A. stay in the rules beat only (famous styles).
Cite fixed: p4 dropped, p2 and p3 added.

## Fact sheet
- styles.text: sheet says "Sekt b.A. and Perlwein"; pliego p4 says "Qualitätsperlwein und Sekt b.A.".
- why.text: sheet says steep slopes in a narrow valley "give mostly red wines"; pliego p7 makes no such link. It ties the long season, topography, small-scale climate and soil to "feinen, aber klaren Aroma- und Geschmacksnoten" and the slate/greywacke soils to "hohe Mineralität".
- grapes.others: "Cabernet Dorsa" matches the grape; pliego p6/p15 misspells it "Carbernet Dorsa". No edit.
