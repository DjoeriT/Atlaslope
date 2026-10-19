# Sample check of the guide checker: Jerez and Granada (19 Oct 2026)

Second look at the Opus sentence check (`Review/guides-check/jerez.md`, `granada.md`, rules `Tools/guides/CHECKER.md`).
Each guide was read end to end against the full pliego text (all pages, via `Tools/guides/pages.py`), not only the cited pages.
Guides and fact sheet not edited. Page numbers are `pages.py` pages.

Neither guide talks about "the pliego" or uses exam framing. Every flight goes to a place the pliego names
(Guadalquivir marismas, Puerto Real salt pans, Jerez de la Frontera; Sierra Nevada, Molvízar, Contraviesa-Alpujarra).
Every number in both guides matches its page.

## Jerez (`content/guides/jerez.json`, pliego PDO-ES-A1483)

The sentence level is sound. The misses are mostly wine types the guide leaves out.

1. **Type left out: Dulce.** p2 "- Dulce: vino elaborado a partir de mostos de uvas con o sin pasificación de una o más de las
   variedades autorizadas"; p3 "Aroma: aromas de miel". The guide names only Pedro Ximénez and Moscatel as sweet natural wines.
2. **Types left out: Pale Dry, Pale Cream, Medium.** p2 "Pale Dry ... ≥4 g/L e inferior a 50 g/L", "Pale Cream ... igual o superior a 50 e
   inferior a 115 g/L", "Medium ... igual o superior a 4 g/L e inferior a 115 g/L". The guide covers the generosos de licor family
   only through Cream, and Cream appears only in `label`.
3. **Unfortified and fortified generosos never told apart.** p1 "I. Vino ... Los «vinos generosos» se obtienen mediante vinificación en seco"
   beside "II. Vino de licor ... a. Vinos generosos ... fortificados con alcohol"; p7 "la diferencia entre unos y otros se reduce a la
   utilización o no de la práctica enológica tradicional de la fortificación, que en determinados vinos protegidos puede ser sustituida
   por otras técnicas también tradicionales como el asoleo". The checker's own fact-sheet note raised this, but the guide was never
   changed. The guide never says whether a generoso is fortified.
4. **Lede narrows the cause of humidity.** The lede says "a zone kept humid by frequent night breezes off the Atlantic", but p7 credits the
   marshes and salt pans as well: "salinas y esteros ... Junto con las frecuentes brisas nocturnas procedentes del cercano océano, estos
   factores contribuyen al mantenimiento de los niveles de humedad". The checker's FIX gave the breezes the whole cause. Minor.
5. **"sun-dried" for "pasificada".** Rules beat: "fortifying must from overripe or sun-dried grapes". p1 says "mostos de uva sobremadura o
   pasificada" (raisined), which names no drying method. Asoleo (p4 "exposición de los racimos de uva al sol") is one way, and the page
   does not equate the two. Better: "overripe or raisined grapes". Minor.
6. **Title "Hot and sunny".** p8 "de carácter cálido" means warm, and the guide's own paragraph says "warm". Titles are not on the
   CHECKER.md list of things to check, so no title in either guide was checked. Minor.

Not counted, but worth a line if the guide grows: Fino may not be aged in Sanlúcar de Barrameda (p5 "con excepción de Sanlúcar
de Barrameda"; p20 transition to 31 Dec 2030). The label terms "En rama", "Pale / Golden / Brown" and "Medium Dry / Medium Sweet"
are defined with their rules on p18-p19. Leaving out "Viejo" and "Añejo" is right: p20 ties them to the Términos Tradicionales
de Andalucía, which is other law.

Fact sheet section: all four disagreements in the log were applied (fact-sheet-fixes.md, jerez). Spot checks:
- `grapes.others` "Palomino, Beba, Perruno, Vigiriega": correct against p7 "Palomino, Listán Blanco o Palomino Fino, Pedro Ximénez,
  Moscatel de Alejandría, Beba, Perruno y Vigiriega".
- `climate.text` (5 °C, 35 °C, >300 days, about 600 mm, Nov/Dec/Mar): correct against p8.
- `famous.styles[0]` "long-aged ones up to 9 g/l": supported, but it drops the condition on p2, "siempre que el contenido de acidez
  total ... no sea inferior en más de 2 gramos por litro al contenido en azúcar". Minor.

**Verdict: checker missed 6** (2 of them wine types left out, plus 1 type split the pliego makes; 3 minor wording points).

## Granada (`content/guides/granada.json`, pliego PDO-ES-A1475)

The sentences are sound and every number checks. The misses are in label terms, one caption and two titles.

1. **Name for overripe-grape wines left out, for a wrong reason.** The log says «Naturalmente Dulce» / «Vendimia tardía» was "left out
   correctly: p5 leaves its conditions to 'la legislación correspondiente'". But p1 defines the type with its own rule: "Vinos naturalmente
   dulces o de vendimia tardía, aplicable al vino de uva sobremadurada elaborado sin aumento artificial de su graduación y con el alcohol
   procedente en su totalidad de la fermentación, con un grado alcohólico natural superior a 15 % vol.". p12 makes the term mandatory:
   "En el caso del vino de uvas sobremaduras, se incluirá obligatoriamente la mención «naturalmente dulce» o «vendimia tardía»". The
   rules beat describes the wine but never gives the name it must carry. It can go in the rules beat, since it is a famous style. The
   beat also drops "all alcohol from fermentation, no enrichment".
2. **Sparkling Reserva left out; the label term reads as still-only.** p5 "la indicación «Reserva», únicamente se podrá emplear en la
   presentación de un espumoso, cuya crianza, contada desde el momento del tiraje hasta el degüelle, no sea inferior a dieciocho meses".
   The guide's `Reserva` text gives only the still-wine rule, so a reader would apply it wrongly to a Granada sparkling Reserva.
3. **Widened caption.** The Contraviesa-Alpujarra flight says "This subzone caps yields lower than the rest of the province". p9 shows the
   sparkling cap is the same in both: "así como de 12.000 kg para las uvas destinadas exclusivamente a la elaboración de vinos espumosos".
   Better: "caps red and white yields lower".
4. **Title "Thin, hungry slate".** p11 says most vineyards stand on "tierras pardas meridionales sobre rocas metamórficas de naturaleza
   silicea", and slate appears only as something that breaks down ("descomposición de pizarras y esquistos arcillosos"). "Hungry" is
   not the source's word ("muy pobres en materia orgánica, fósforo y nitrógeno"). Titles are not checked under CHECKER.md.
5. **Title "A province with a snowy wall".** No page mentions snow. Sierra Nevada appears only as the supply route (p10). Minor.

Not counted: Contraviesa-Alpujarra has shorter variety lists than the province (8 white, 8 red; p9-p10), and the guide gives only
the province's 12 and 10. The province's sparkling varieties (p9) are not listed. Sparkling sweetness levels run from brut nature to
dulce (p1). A vintage is mandatory on still wines (p5).

Fact sheet section: all items in the log were applied (fact-sheet-fixes.md, granada). Spot checks:
- `grapes.others` 12 white + 10 red: correct against p9 (Vigiriego ... Viognier; Tempranillo ... Petit Verdot).
- `climate.text` "absolute highs average 39 °C and lows -4 °C; 450 mm ... about 70 rainy days": correct against p11.
- `soil.text`: correct against p11.

**Fact sheet miss:** `famous.styles` "Vino espumoso de calidad: White, rosé or red sparkling wine". The pliego allows white and rosé
only. p2 says "vino base blanco o rosado utilizado para la elaboración de los vinos espumosos", and the p3 tasting notes for espumosos
cover only "los blancos" and "los rosados". Neither the checker nor fact-sheet-fixes.md caught it.

**Verdict: checker missed 5** in the guide (1 mandatory label name wrongly cut, 1 label rule left out, 1 widened caption, 2 titles),
plus 1 fact-sheet error.

## For the checker brief
- Titles are not on the CHECKER.md list of things to check. Both guides have unsupported titles ("Hot", "hungry slate", "snowy wall").
- CHECKER.md has no step to grep the whole pliego for wine types the guide leaves out. Jerez lost four types (Dulce, Pale Dry,
  Pale Cream, Medium) and the unfortified/fortified split.
- The "points to other law" CUT rule needs a line saying: check whether another page gives the term its own rule (Granada p1/p12).
