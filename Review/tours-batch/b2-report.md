# Tours batch 2 report (cangas, valdeorras, monterrei), #148
Builder: Sonnet, branch agent/builder/tours-b2 (from claude/tours-pilot). Not pushed.
- cangas: 8 stops (intro, place, narcea, navia, corias, weather, ground, rules). Photos new: narcea (Armando Gonzalez Alameda, CC BY-SA 4.0), corias (Adolfobrigido, CC BY-SA 4.0), leitariegos (Carmenmoran, CC BY 4.0); reuse cangas-1, cangas-2. Tour data 32 KB gz of 150.
- valdeorras: 7 stops (intro, place, sil, weather, barco, rua, rules). New photos: sil (Mayte Rios, CC BY-SA 4.0), barco (Estevoaei, CC BY-SA 4.0); reuse valdeorras-1, -2. Tour data 17 KB gz.
- monterrei: 7 stops (intro, place, tamega, castle, weather, ground, rules). New photos: castle (Ramon Pineiro, CC BY-SA 2.0), verin (HombreDHojalata, CC BY-SA 3.0); reuse monterrei-1..3. Tour data 10 KB gz.
- Rock keys added for all three (colours and unit names sampled from IGME MAGNA 50 at the stop views). Cangas has two swatches with the same label "Sandstones and slates" (two MAGNA colours, same unit name).
- npm test 446 pass (2.7 s), build 2 s, check.sh quick pass. Crop sheet looked at: no face/glass/bottle cut; castle crop trims the right wing, cangas-2 trims town edges.
- Shots: shots:tour phone+desktop all three; "imagery did not load" flags on a few desktop stops (cangas place/narcea, monterrei place) are false alarms, pictures show imagery (same as pilot).
- One commit for all three (shared files hold all three guides' entries; could not be split).
