# Sentence check: rheinhessen (source rheinhessen-spec, Produktspezifikation g.U. "Rheinhessen", 10 pages)

Quotes are the pliego's German words. check_guide.py: 0 errors, 0 warnings.

## Title
- KEEP "Why Rheinhessen tastes the way it does" (standard guide title)

## Lede
- FIX p6/p7 "Plateaus aus widerständigem Kalkstein", "Kalksteine der Plateaubereiche sind meist mit Löss überlagert", "Mergel der Hangbereiche werden oft von Löss ... verschleiert": dropped "wind-blown" (the page never says it).
- FIX p2 "Weißer Riesling sind besonders geeignet, um die Unterschiede der verschiedenen Terroir Rheinhessens widerzuspiegeln": dropped the added "grown on these different grounds".

## basin (place)
- KEEP title p4/p6 "Rheinbogen", "Mainzer Becken"
- KEEP p4 "im Norden und im Osten zwischen Bingen und Worms durch den Rheinbogen begrenzt"
- FIX p4 "im Nordwesten durch die Nahe": "closes the northwest corner" -> "forms the northwest border"
- KEEP p6 "annähernd deckungsgleich mit ... dem Mainzer Becken"
- KEEP p6 "Plateaus aus widerständigem Kalkstein, welche durch breite Talungen mit sanften Hügeln und Niederungen durchschnitten werden"
- KEEP p6 "zwischen 250 und 300 Metern über NN"
- KEEP p6 "Niederungen 100 bis 150 Meter über NN"
- KEEP p6/p7 "Der Weinbau konzentriert sich auf die Hangbereiche, die durchschnittliche Hangneigung beträgt allerdings rund 7 %"
- KEEP p7 "Steillagenanbau findet man insbesondere im Bereich um Nierstein und in Bingen"
- KEEP p7 "Es dominieren Expositionen von Südost bis Südwest"
- Fly Nierstein: KEEP p7, point [8.333, 49.87] is the town (OSM lookup failed; known town centre within 1 km)
- Fly Bingen: FIX label "where the Nahe meets the Rhine" (no page says the confluence) -> "steep slopes in the northwest"; FIX caption "the other place" (page says "insbesondere", not only) -> "also found in Bingen"; cite p4 dropped, p7 kept. Point [7.9, 49.967] is Bingen am Rhein, within 1 km.
- No missing flight: the guide already flies to the two named places.

## climate (weather)
- FIX title "Dry and fairly mild": the page gives numbers only, never dry or mild -> "Warmer toward the Upper Rhine" (p7 "höchsten Jahresdurchschnittstemperaturen mit zunehmender Nähe zum Oberrheingraben")
- KEEP p7 "Jahresdurchschnittstemperatur beträgt circa 9,9 °C", "Vegetationsperiode liegt bei 14,6 °C"
- KEEP p7 "niedrigeren Jahresdurchschnittstemperaturen liegen im Südwesten ... an der Grenze zum Saar-Nahe-Becken"
- ADD p7 "Mittlere Temperaturwerte findet man auf dem rheinhessischen Tafel- und Hügelland" (the scale was shown by its two ends only)
- KEEP p7 "mit zunehmender Nähe zum Oberrheingraben"
- KEEP p7 "Niederschlag von etwa 550 mm"
- KEEP p7 "durchschnittlich 65 % (355 mm)"
- KEEP p7 "direkte solare Einstrahlung von ungefähr 650 000 WH/m²"

## soils (ground)
- KEEP title p7 "Kalksteinen", "Mergeln", "Löss"
- FIX p7 "Der größte Teil von Rheinhessen ist von tertiären Gesteinen, welche überwiegend von quartären Sedimenten ... überlagert werden": hedge "überwiegend" restored, Quaternary named.
- KEEP p7 "Kalksteine der Plateaubereiche sind meist mit Löss überlagert"
- FIX p7 "die Kalke und Mergel der Hangbereiche werden oft von Löss oder Hangsedimenten verschleiert, wohingegen die Mergel der Niederungszonen von Auen-, Terrassen- oder Umlagerungssedimenten bedeckt sind": the guide put the slope cover on the lowlands too; split into slopes and lowlands.
- KEEP p7 "Für die Bodenbildung stellt der Löss bzw. Lösslehm das wichtigste Ausgangssubstrat dar"
- FIX p7 "Sockel aus Rotliegend-Gesteinen ... lediglich im äußersten Südwesten ... und bei Nierstein": "Red" dropped (not on the page), Rotliegend explained as the rock base.
- KEEP p7 "in der Nähe von Bingen treten devonische Quarzite und Tonschiefer auf"
- KEEP p7 "Im Durchschnitt wächst der Wein in einer Höhe von 175 Metern über NN"

## wines (rules)
- FIX title "Mostly white, in every style": no page says most wines are white -> "Many grapes, many styles" (p6 grape list, p7 "Vielfalt der Rebsorten")
- FIX p2 "Die Weine werden überwiegend als Rebsortenweine ausgebaut, die die Typizität der verschiedenen Rebsorten widerspiegeln": this is about whites being mostly varietal, not most wines being white.
- CUT colour and "yellow and tropical fruit, fresh, clear" lines: they repeat the fact sheet `tastes`. Replaced with page facts the sheet lacks: p2 "vereinzelt auch mit floralen Muskat Noten"; p2 "Barriquefässern und Tonneaus ... malolaktische Gärung und feine Röstaromen"; p2 "Rebsortenverschnitten werden oft restsüß, in der Geschmacksrichtung lieblich" (lieblich explained).
- FIX p2 "von einer prägnanten Säure geprägt und vereinen Mineralität mit eleganter Frucht": "sharp" -> "pronounced".
- FIX p9 "Namen von Einzellagen ... mindestens 85% aus den folgenden Keltertraubensorten": five-grape list split into short lines (no X, Y and Z list).
- KEEP p9 "zu mindestens 85%"
- ADD p9 "Zur Herstellung von ... Beerenauslese, Trockenbeerenauslese und Eiswein sind alle Keltertraubensorten gemäß Nummer 8 zugelassen" (missing exemption)
- KEEP p9 "Abgesehen davon dürfen die Erzeugnisse aus allen gemäß Nummer 8 zugelassenen Rebsorten hergestellt werden"
- ADD p5 "Der Hektarhöchstertrag ist auf 105 hl/ha festgesetzt"
- FIX p2 "Mittelschwere Weine haben eine weiche Säure und zurückhaltende Tanninstruktur": soft acidity was widened from medium-bodied reds to all reds; added "sowohl als Rebsortenwein als auch im Verschnitt".
- KEEP p3 "Körperreiche Weine können ... würzige und rauchige Aromen zeigen"
- FIX p3 "ausschließlich aus roten Trauben ... meist von mittlerem Körper ... dezent ausgeprägten Aromen nach roten Früchten und Beeren ... frischen, lebendigen Säure": "light" was wrong, the page says medium body.
- FIX p3 "blass- bis hellroter Farbe ... Verschneiden weißer und roter Trauben oder Maische": "pale red" -> "pale to light red".
- FIX p5 "Sekt b. A., Winzersekt, Qualitätsperlwein": "b. A." explained.
- ADD p4 "Als Cremant bezeichnete Schaumweine zeigen oft eine weiche, cremige Struktur ... sehr feinen Perlage" (style missing)
- FIX p8 "Wenn es sich um die Spezialität des Verfahrens der traditionellen Flaschengärung handelt ... mindestens neun Monate auf der Flasche reifen": rule applies to traditional bottle fermentation, not every bottle-fermented one.
- FIX p8 "Je nach Vegetationsstand und Standort müssen die Trauben ... zu einem früheren Zeitpunkt abgeerntet werden ... prägnante Säurestruktur": hedge restored.
- ADD p4 "Perlweine sind frisch, fruchtig und spritzig ... meist aus aromatischen Rebsorten"
- FIX p2/p3 "Trockenbeerenauslese alle Rebsorten 21,5 % vol und 150° Öchsle", "überreifen, eingetrockneten oder edelfaulen", "höheren Grad der Konzentration": wording aligned, TBA vs BA difference added.
- FIX p2/p3 "weitgehend gesunden, reifen Trauben, die zum Zeitpunkt der Ernte und Kelterung witterungsbedingt gefroren sind", "120° Öchsle": "healthy" -> "largely healthy", frozen at picking and pressing.
- Wine-type sweep (p1, p5): Wein, Qualitätsschaumwein, Perlwein, Sekt b. A., Winzersekt, Crémant, Rotling, rosé, Weißherbst, Blanc de Noir, all Prädikat levels: all now named. No generoso or vino de licor in this pliego.

## Label
- ADD p1/p8 Qualitätswein: "7,5 % vol und 60° Öchsle", "8,8 % vol und 68°", "7,8 % vol und 62°", "dürfen angereichert werden"
- KEEP Kabinett p1 "9,5 % vol und 73° Öchsle", "10,0 % vol und 76°"; p8 "dürfen nicht angereichert werden"
- KEEP Spätlese p1/p2 "11,4 % vol und 85°", "12,2 % vol und 90°"; p3 "vollreifer Trauben"
- KEEP Auslese p2 "12,5 % vol und 92°", "13,0 % vol und 95°", "13,8 % vol und 100°"; p3 "voll- bis überreifer"
- KEEP Beerenauslese p2 "16,9 % vol und 120°"; p3 "überreifen, eingetrockneten oder edelfaulen"
- ADD Weißherbst p5 (traditional term b), p3 "blass- bis hellroter Farbe ... ausschließlich aus roten Trauben"
- Not added: Classic, Liebfrau(en)milch, Riesling-Hochgewächs (p5 b) have no rule anywhere in the pliego. Trockenbeerenauslese, Eiswein, Winzersekt, Rotling stay in the rules beat only (famous styles).
- Cites: p5 added.

## Fact sheet (content/facts/de-rheinhessen.json, not edited)
- why.text: sheet "wind-blown loess", "dry, fairly mild basin"; pliego names loess without "wind-blown" and never calls the climate dry or mild (p7).
- tastes.text: sheet "Riesling: sharp acidity", "Rosés: light"; pliego p2 "prägnanten Säure", p3 "meist von mittlerem Körper".
- soil.text: sheet "Red Rotliegend rock surfaces at Nierstein"; pliego p7 says Rotliegend surfaces only in the far southwest and at Nierstein, and does not say red.
- famous.styles Winzersekt: sheet "bottle-fermented versions"; pliego p8 limits the nine months to traditional bottle fermentation.
- famous.styles Eiswein: sheet "healthy grapes"; pliego p3 "weitgehend gesunden" (largely healthy).
- styles.text: sheet "sweet Prädikat wines up to Eiswein"; pliego p2 the top level is Trockenbeerenauslese (150°), Eiswein 120°.
