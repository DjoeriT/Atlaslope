# Cataluña second check: priorat, penedes, cava (19 Oct 2026)

Independent second checker (Opus) after the Sonnet writer and the Opus sentence check. Source: each pack from
`Tools/guides/pack.py check cataluna <id> <id>-pliego` (Priorat pliego Nov 2021, Penedès pliego July 2026, Cava pliego).
Every sentence, title, caption and label term was read against the pliego. Fixes are in `content/guides/<id>.json`;
`check_guide.py` passes on all three (0 errors; the remaining number warnings are siglo XII, doce meses, and Penedès
counts and months written in words, all checked).

## Priorat: 76 sentences checked, 7 misses

- Lede had three sentences, but the format allows two. Merged into two, and "the vines suffer" dropped, since the ground beat says it (p22).
- Weather title "Kept from the sea": the page says *relativo aislamiento*, so the hedge was dropped. Now "Set back from the sea" (p22).
- "Hard ground and dry weather keep the vines small, which makes disease less likely": the page says *propician ... facilita una baja incidencia*, so the sentence was too strong. It now says they favour small vines and help keep disease low (p22).
- "...this brings low yields and small vines": small vines said twice in one beat. Cut the second mention (p24).
- "The grapes ripen fully and can be picked at the best moment": the page says *favorecen la maduración completa*, but the guide stated it flat. Hedged, and the cause is now named (p22).
- "The wines are marked by concentration, body and structure" (rules beat) repeated the lede word for word. Cut (p23).
- Label was missing two terms with their own rule: Roble and Fermentado en barrica. Both added (p28).
- Not added: crianza, reserva and gran reserva are listed as traditional terms (p29) but the pliego gives them no rule.

## Penedès: 49 sentences checked, 8 misses

- Rules para 1 repeated the lede's "best ripeness only here" sentence. The rules beat now carries the page's own cause for the whites' freshness, acidity and fruit: *debido al tipo de suelo, al clima único y al factor humano* (p15).
- Ground title "Deep, well-drained soils": the page never says deep (40-120 cm or more), and drainage is *en general* good. Now "Loamy soils that mostly drain well" (p14).
- "The grapes and wine must be organic" was given for sparkling only. The page makes all wines, sparkling, aguja and liqueur wines and all grapes organic from the 2025 harvest. Now a general rule (p2, p4, p5, p12).
- The still wine types (white, rosado, red) and their minimum strength were missing from the rules beat. Added (p1).
- The tasting paragraph (whites, rosados, reds) duplicated the How it tastes card built from the fact sheet. Replaced with the rosado cause line (p15) and the still types.
- "Labelled from Brut natural ... to Dulce" gave two ends of a seven-step scale. It now says "in seven steps" (p4).
- The label lacked terms the pliego defines: Gran Vino de Mas, Nuevo, Joven, Roble, Barrica, Fermentada en barrica, No degollado, and Reserva for sparkling (15 months). All added (p3, p20, p22, p26, p27).
- Vino de Mas was missing its 15% lower yield. Added (p12).
- Fact sheet: climate says "wide temperature gap", but the pliego says only *diferencial térmico* (p15), and the sheet cites penedes-doc instead of the pliego.

## Cava: 60 sentences checked, 7 misses

- The guide framed Cava as Catalan: only the Comtats de Barcelona provinces were named. Added Valle del Ebro (Álava, La Rioja, Navarra, Zaragoza), Almendralejo (Badajoz) and Requena (Valencia) (p6, p7).
- Both flights were in Catalonia, and the Serra de Prades point sat on a street in Vilanova de Prades, which is not one of the subzone's towns. Replaced with a flight to Requena, a zone outside Catalonia (p6, p7).
- "Chalky soils" (title and sentence): *calcárea* means calcareous or limy. Chalk is a specific rock the page does not name. Now "Limy" / "calcareous (limy)" (p9).
- Lede had three sentences. Merged into two (p10, p12).
- Rules were missing organic certification and vines of at least 10 years for Reserva, Gran Reserva and Paraje Calificado. Added, and the vine age is now said once (p3, p9).
- Rules were missing yields: 12,000 kg/ha in general, 10,000 for Reserva and Gran Reserva, 8,000 for Paraje Calificado. The vintage on the label is mandatory for those wines. Both added (p9, p21).
- The standard-cava tasting paragraph duplicated the How it tastes card. Cut (p2).
- The label was missing Guarda, Guarda Superior and Elaborador Integral, each defined by the pliego. Added (p22, p23).
- Fact sheet: soil says "chalky", but the pliego says *calcárea*.

## Miss patterns to add to Tools/guides/CHECKER.md

1. **Hedge verbs flattened**: *favorecen*, *propician*, *facilita* or *permite* written as a plain fact ("the grapes ripen fully"). The check should quote the verb and keep its strength.
2. **Rules narrowed to one type**: a rule the pliego applies to all wines, such as organic from 2025, gets attached to one style only. Grep each rule's scope.
3. **Multi-region DO framed as one region**: list every zone with its provinces or region, and do not put all flights in one region.
4. **Glossed rock words**: *calcárea* written as chalky, *pizarra* as schist, and so on. Taste and ground words must translate, not upgrade.
5. **Title adjectives without source**: "Deep", "Kept from". Check each title adjective against a page word.
6. **Lede length and lede echoes**: the lede must be two sentences, and no body sentence may repeat a lede sentence word for word.
7. **Tasting paragraph in the rules beat** that repeats the fact sheet's `tastes`, which already renders as How it tastes.
8. **Label sweep**: grep sections like *indicaciones*, *menciones* and *términos* for every term with its own rule (Roble, Barrica, Joven, Nuevo, No degollado, Guarda, Elaborador Integral). The checker found the famous ones and missed the rest.
9. **Wine-type requirements beyond ageing**: for Reserva-type terms, also check vine age, yield, organic status and mandatory vintage, not only months.
10. **Scale endpoints**: a seven-step scale shown as "from A to G" needs the step count, or it reads as two stations.
