# Card 2 report (BuilderBot, Sonnet)

Branch `claude/map-tour-fixes-card2` (cut from `claude/map-tour-fixes`, whose name is held by another worktree). Shots: `Review/map-tour-fixes/shots-2/`.

| Fix | State |
|---|---|
| F2 key | Done. Titled "Rock beneath the soil:", then IGME's own unit names for the colours (clay-limestone row = "Arenas, areniscas calcáreas y arcillas ocres (facies de Haro)", "Limolitas y arcillas rojas", "Aluviales y llanura de inundación"; Priorat "Pizarras corneanas"). No guide words added: the guide's soils come from the Pliego, MAGNA 50 maps bedrock. Colours sampled from the IGME render (data/SOURCES.md). |
| F2 edge | Outside fade goes from 25% to 60% black at geology stops: the sheet rectangle is hidden (`rioja-soils-1440.png`). Non-key units NOT muted. |
| F8 | Slope key ("Steeper than 30% (about 17°)") at steepness stops, with the rock key at both soils stops (`rioja-soils-390.png`). |
| F11 | Climate opacity .36 to .24, "Other" untinted (`rioja-climate-1440.png`). |
| F5/F12 | Strip 300 px; credit behind the "i" at phone and iPad width (`rioja-alta-1024-credit*.png`); fixed views back off by aspect; legend one scrolling line on phone. Stop 1 on phone shows Haro and the north of the valley, not clearly to Alfaro (`rioja-stop1-390.png`): the zoom shift is a first guess, needs the owner's eye. |
| Carry-overs | Map tour link has a route icon, same height and baseline as Show map (`top-buttons-1440.png`, plus a spec). Own-zone label left off. The stop-5 pin shot was not captured (scroll script missed the step); not verified. |
| F6 speed | Relief (terrain and hillshade) starts after the first idle. Same method before and after: cold load of the Rioja tour at 390 px, 1.6 Mbps and 150 ms latency, Chromium, 30 s window. First non-local tile response 11.7 s to 5.6 s; terrain requests before it 27 to 13; terrain requests in 30 s 61 to 55. No pin exists at the opening view, so time to first pin is not measurable. Lower first-view zoom NOT done (opening zoom is already 6.7). Preconnect to ign.es and s3 is in `index.html`. |

Imagery: PNOA/Esri tiles did not load in the headless shots (only terrain and the vector basemap), so shots show relief, not satellite.

Tests: `npm test` 386 passed; `story.spec` 12 passed (3 new: keys, button height, phone strip 300 px); `Tools/check.sh` full passed (2 MB: 1,942,437 B of 2,000,000; tours 52,760 and 15,894 B of 150,000 each); build ok. Timings: check.sh 7.5 s, story.spec ~28 s, shots 5 to 11 min.
