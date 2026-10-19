# Green Spain map flags: source check (ReviewBot, 19 Oct 2026)

Scope: `content/flags.json`, sets txakoli-bizkaia, txakoli-getaria, txakoli-alava, cangas, rias-baixas, ribeira-sacra, valdeorras,
ribeiro, monterrei, against `Review/sources/fetched/pliego-*.txt` (page markers `=== PAGE n / N ===`). Rías Baixas checked against the
DOG file `pliego-PDO-ES-A1119-rias-baixas.txt`. Read-only; nothing committed.

## Verdict: fix first

33 flags, 35 lines: **22 KEEP, 11 FIX, 2 CUT**.
Severity: 3 blockers, 9 should fix, 4 notes.

- **Blocker** Ribeiro: Pontevedra and Carballeda de Avia both CUT, which leaves 1 flag, below the 3-flag minimum. Two replacements
  from the pliego are proposed below (Miño, Avia).
- **Blocker** Monterrei / Verín: the line misreads the list. Verín has 14 parishes in the valley subzone, not 2.
- **Blocker** Rías Baixas: all four cites say `p8`. That page only fits the agacal copy. In the DOG file the subzone table is on **p10**.
- **Should fix**: these lines claim more than the source: Monterrei "rivalled Porto" (a quote from one author stated as fact), Ribeira Sacra's name line (two ideas in one line), Padrón (only 3 parishes), Cangas del Narcea ("seven" is the reader's count, and it leaves out Tineo), plus small wording drifts in Bakio, Ibaizabal, Amurrio, O Barco and Ribadavia.
- **Note**: the positions (inferred, from memory of the map, not measured). Nominatim may have returned the middle of a municipality instead of the town. Points that look 4 to 7 km off the town or feature: Cangas del Narcea (about 6 km S), Verín (about 5 km S), Oímbra (about 4 km W), Quiroga (about 7 km E), Amurrio (about 4 km E), Padrón (about 3.5 km NE, and the town parish itself is not in the DO), Cañón del Sil (about 8 km S of the gorge). Re-check against OSM `place=town/village` nodes or the gorge way. Bilbao is inside its DO (all of Bizkaia, p5). Donostia is inside (all of Gipuzkoa since 2007, p4). Pontevedra is the only point outside its DO, about 38 km west of Ribadavia.
- **Note**: Rías Baixas has 4 of its 5 subzones. O Rosal is missing ("O Rosal, Tomiño, A Garda | Todas", p10). It could be added as a fifth flag.

## txakoli-bizkaia (area: every municipality of Bizkaia, p5)

| Flag | Line | Verdict | Spanish quote | Fix |
|---|---|---|---|---|
| Bakio | One of the places where txakoli survived into the 20th century. | FIX (should fix) | "a mediados del siglo XX el Txakoli sobrevive en varias zonas rurales de Bizkaia. Principalmente en Bakio" (p8) | One of the main places where txakoli still survived in the mid-20th century. |
| Bilbao | A 15th-century visitor marvelled at the vines around the city. | FIX (note) | "visitó Bilbao en el siglo XV, se asombró de la gran cantidad de viñas que rodeaban la ciudad" (p8) | A 15th-century visitor was amazed by how many vines surrounded the city. |
| Lekeitio | Its ordinances of 1338 exempted from tax the timber used to train vines. | KEEP | "en 1338, las ordenanzas de Lekeitio dictan una disposición sobre la exención de impuestos para las maderas que sirvieran para emparrar viñedos" (p7) | |
| Ibaizabal | With the Butrón, it gives its name to one of the two main valleys. | FIX (should fix) | "la existencia de dos valles principales, de los ríos Ibaizabal y Butrón" (p7) | With the Butrón, it has one of the two main valleys. ("gives its name" is not in the source.) |

Worth a flag: all four yes. Bilbao is a good anchor and is inside the DO. p8 also has the 1399 Bilbao ordinances and the 1623 txakolineros' brotherhood, which could be other lines.

## txakoli-getaria (area: all of Gipuzkoa since 2007, p4)

| Flag | Line | Verdict | Spanish quote | Fix |
|---|---|---|---|---|
| Getaria | In the 19th century it kept 35 ha of vines in sheltered spots. | KEEP | "conservando la primera 35 has. de viñas en zonas abrigadas" (p4) | |
| Zarautz | In the 19th century it kept 4 ha of vines, under Santa Bárbara. | KEEP | "y la segunda 4 has. al amparo de Santa Bárbara" (p4) | |
| Aia | One of the three municipalities the DO began with. | KEEP | "los tres municipios iniciales de Aia, Getaria y Zarautz" (p4) | |
| Donostia / San Sebastián | A charter granted to the city in 1180 already mentions vines. | KEEP | "el viñedo se menciona ya en el Fuero otorgado a San Sebastián por el Rey de Navarra Sancho I en 1180" (p3) | |

Worth a flag: yes. Aia's line is the weakest, but it is a real fact about where the DO started.

## txakoli-alava (area: Amurrio, Artziniega, Ayala/Aiara, Laudio/Llodio, Okondo, p4)

| Flag | Line | Verdict | Spanish quote | Fix |
|---|---|---|---|---|
| Amurrio | One of the places where txakoli was common practice by the 9th century. | FIX (should fix) | "en el siglo IX la producción de txakoli en Álava era práctica común ... particularmente en Amurrio, Llodio y Ayala" (p5) | One of the places where making txakoli was common practice in the 9th century. ("by" moves the date.) |
| Laudio / Llodio | A gift of vineyards to the lost monastery of San Víctor is recorded in its Gardea quarter. | KEEP | "una donación de viñedos al desaparecido monasterio de San Víctor del barrio de Gardea en Llodio" (p5) | |
| Artziniega | Vines are recorded at Retes de Tudela in 864. | KEEP | "en el año 864 de viñas en Retes de Tudela (Artziniega)" (p5) | |
| Ayala / Aiara | Vines were grown for wine in the Tierra de Ayala in 964. | KEEP | "en el año 964 se cultivaban en la Tierra de Ayala vides para la elaboración de vino" (p5) | |

Position note: the Amurrio point is about 4 km east of the town (inferred).

## cangas (area: 7 municipalities plus 9 parishes of Tineo, p3)

| Flag | Line | Verdict | Spanish quote | Fix |
|---|---|---|---|---|
| Cangas del Narcea | One of the seven municipalities of the area. | FIX (should fix) | "términos municipales de Allande, Cangas del Narcea, Degaña, Grandas de Salime, Ibias, Illano, Pesoz y las parroquias que pertenecen al término municipal de Tineo" (p3) | Corias's vineyards spread from here into the neighbouring municipalities. Quote: "se extendían no solo por el término municipal de Cangas del Narcea, sino también por los municipios limítrofes" (p5). If the area line stays: "One of the seven municipalities the area takes in whole." |
| Narcea | With the Navia, it is one of the two main rivers of the area. | KEEP | "siendo el Narcea y el Navia los más importantes" (p4) | |
| Monasterio de Corias | The vine spread widely after this Benedictine monastery was founded in the early 11th century. | KEEP | "su gran expansión se produce con la fundación del Monasterio benedictino de San Juan Bautista de Corias a comienzos del siglo XI" (p5) | |

Position note: the Cangas del Narcea point (43.116) is about 6 km south of the town (about 43.176) (inferred).

## rias-baixas (DOG file; subzone table on p10, not p8)

| Flag | Line | Verdict | Spanish quote | Fix |
|---|---|---|---|---|
| Cambados | A municipality of the Val do Salnés subzone. | KEEP, cite FIX (blocker) | "Val do Salnés: Cambados, Meaño, Sanxenxo ... Todas" (DOG p10) | cite `rias-baixas-pliego:p10` |
| Salvaterra de Miño | A municipality of the Condado do Tea subzone. | KEEP, cite FIX | "Condado do Tea: Salvaterra de Miño, As Neves, Arbo ... Todas" (DOG p10) | cite p10 |
| Soutomaior | Its municipality forms the Soutomaior subzone. | KEEP, cite FIX | "Soutomaior / Soutomaior / Todas" (DOG p10) | cite p10 |
| Padrón | A municipality of the Ribeira do Ulla subzone. | FIX (should fix) | "Padrón / Carcacía, Iria Flavia, Herbón" (DOG p10) | Three of its parishes belong to the Ribeira do Ulla subzone. Cite p10. |

Worth a flag: the four lines only say which subzone a place is in. That is useful on a map, but the set reads flat. The pliego names no other places in its history section, only rivers ("los ríos Ulla, Umia, Oitavén, Xabriña y Miño con sus afluentes Tea y Louro", DOG p12). Missing subzone: O Rosal. Proposed fifth flag: **O Rosal**, "Its municipality is one of the O Rosal subzone's three whole ones." (owner picks the wording; quote "O Rosal, Tomiño, A Garda | Todas", p10). Padrón town parish is not listed, so the pin may sit just outside the area.

## ribeira-sacra

| Flag | Line | Verdict | Spanish quote | Fix |
|---|---|---|---|---|
| Portomarín | The area runs from here to A Peroxa. | KEEP | "se extiende desde Portomarín a A Peroxa y desde Os Peares a Quiroga" (p11) | |
| A Peroxa | The area runs from Portomarín to here. | KEEP | same (p11) | |
| Quiroga | The area runs from Os Peares to here. | KEEP | same (p11) | |
| Cañón del Sil, line 1 | The Sil and the Miño flow through steep canyons towards their meeting. | KEEP | "Los ríos Miño y Sil discurren hacia su confluencia a través de gargantas o cañones de fuerte verticalidad" (p11) | |
| Cañón del Sil, line 2 | The canyons and the religious buildings gave the area its name, which goes back to the 12th century. | FIX (should fix) | "la monumentalidad del agua manifestada en los cañones del Sil y del Miño y la monumentalidad de las edificaciones religiosas dieron lugar a la Rivoyra Sacrata o Ribeira Sacra, denominación que se remonta al siglo XII" (p13) | Split into two lines: "The canyons and the religious buildings gave the area its name." / "The name is first recorded in 1124." ("la primera mención ... se remonta al año 1124", p13) |

Note: the Portomarín and A Peroxa lines say the same thing. That is acceptable for a span. Position notes (inferred): Quiroga is about 7 km east of the town, and the Cañón del Sil point (42.3185) looks about 8 km south of the gorge (about 42.39 to 42.42).

## valdeorras

| Flag | Line | Verdict | Spanish quote | Fix |
|---|---|---|---|---|
| O Barco de Valdeorras | Clay-limestone soils lie in the north of the area, here and in Rubiá. | FIX (should fix) | "Afloramentos calizos: ... aparecen en la mitad norte de la comarca, en los municipios de O Barco y Rubiá" (p12) | Limestone outcrops lie in the northern half of the area, here and in Rubiá. |
| A Rúa | Loose granite soils lie here, in Petín and in Larouco. | KEEP | "Suelos graníticos: en los ayuntamientos de A Rúa, Petín y Larouco destacan unos suelos sueltos" (p12) | |
| Sil, line 1 | The river crosses the area from east to west. | KEEP | "el río Sil atraviesa la comarca de este a oeste" (p11) | |
| Sil, line 2 | Its left bank is steep and its right bank gentler. | KEEP | "laderas con mucha pendiente en el margen izquierdo, y más suaves ... en el derecho" (p11) | |

Note: the Sil point is about 1.8 km from the O Barco point, so the chips may overlap. Check in the shots.

## ribeiro

| Flag | Line | Verdict | Spanish quote | Fix |
|---|---|---|---|---|
| Ribadavia | Its municipal ordinances of 1579 set out where vines could be grown. | FIX (should fix) | "ya en 1579 las ordenanzas municipales de Ribadavia especificaban zonas de cultivo (parroquias)" (p20) | Its municipal ordinances of 1579 already named the growing areas, by parish. Optional second line: "WIPO counts them among the first signs of geographical-indication protection in Spanish law." ("La Organización Mundial de la Propiedad Intelectual las reconoce como los primeros indicios de protección de una indicación geográfica en el derecho español", p20) |
| Carballeda de Avia | One of the nine municipalities listed whole for the area. | CUT (blocker, with Pontevedra) | "ayuntamientos de Ribadavia, Arnoia, Castrelo de Miño, Carballeda de Avia, Leiro, Cenlle, Beade, Punxín y Cortegada" (p13) | The quote backs the line, but the place is not worth a flag: any of the nine would fit the same line. Replace with **Avia** (river/valley): "Albilla do Avia is a native grape of the Avia valley." ("Albilla do Avia, variedad autóctona del valle del Avia", p1, the amendment's preamble). |
| Pontevedra | The main port for shipping the wine by sea. | CUT (blocker) | "Pontevedra es el principal puerto para su transporte marítimo, seguido de los de Vigo, Baiona y A Coruña" (p19) | The translation is faithful, but the point is about 38 km outside the DO. It pulls the map extent out to the coast, and the source's tense hides that this is historical trade. Replace with **Miño** (river, in the area): "Sea air reaches the area mainly up the Miño valley." ("La influencia marítima que penetra principalmente por la cuenca del río Miño", p16) |

After this the set has 3 flags: Ribadavia, Avia, Miño. The new positions need OSM points (the builder adds them in `data/SOURCES.md` terms).

## monterrei

| Flag | Line | Verdict | Spanish quote | Fix |
|---|---|---|---|---|
| Verín | Its parishes of Verín and Vilamaior do Val belong to the Monterrei valley subzone. | FIX (blocker) | "las parroquias de Abedes, Cabreiroá, Feces de Abaixo, Feces de Cima, Mandín, Mourazos, Pazos, Queizás, A Rasela, Tamagos, Tamaguelos, Tintores, Verín y Vilamaior do Val del ayuntamiento de Verín" (p11) | Fourteen of its parishes belong to the Monterrei valley subzone. |
| Oímbra | Its parishes of Oímbra, Rabal and San Cibrao belong to the Monterrei valley subzone. | KEEP | "las parroquias de Oímbra, Rabal y San Cibrao del ayuntamiento de Oímbra" (p11) | |
| Vilardevós | The whole municipality is in the Monterrei slope subzone. | KEEP | "Subzona ladera de Monterrei: comprende el ayuntamiento de Vilardevós" (p11) | |
| Monterrei | The wines of the Monterrei valley rivalled those of Porto. | FIX (should fix) | "Federico Justo Méndez ... afirmaba: «los vinos del valle de Monterrei, por su excelente calidad, se codearon con los vinos de Oporto»" (p12) | One writer said the valley's wines stood alongside those of Porto. (This is an author's claim, not the pliego's own fact. Owner picks the wording.) |

Position notes (inferred): the Verín point (41.8955) is about 5 km south of the town (about 41.94), and Oímbra is about 4 km west of the village. Monterrei (the castle) looks right.

## Not checked
- Positions were not measured against OSM: no network lookups, which is read-only scope. All offsets above are inferred.
- Sets outside the card, the app rendering, and `content/sources.json` cite ids.
