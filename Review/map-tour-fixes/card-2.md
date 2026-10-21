# Card 2 report (BuilderBot, Sonnet)

Branch `claude/map-tour-fixes-card2`, cut from `claude/map-tour-fixes` (that name is checked out in another worktree). Stopped at the turn limit: partly done.

| Fix | State |
|---|---|
| F2 geology key | Key done (guide words, MAGNA colours sampled; SOURCES note). NOT done: muting other units, edge feather (needs a tile protocol that recolours; idea below). |
| F8 slope key | Done, shown on steps whose measure line is about steepness. |
| F11 climate | Done in code: opacity .36 to .24, "Other" untinted. Not seen in a shot. |
| F5 phone | Strip 300 px, credit behind the "i" on phone and iPad (F12), fixed views back off by aspect (`stripZoomShift`). Not seen in a shot; own-stop pin not checked. |
| F6 speed | Only preconnect (ign.es, s3). Terrain deferral and lower first zoom NOT done, no before/after numbers. |
| Carry-overs | Map tour link gets a route icon beside the map icon; the stop's own zone label is left off (so it is not under the pin). Not seen in shots. |

Not run: shots-2, story.spec, Tools/check.sh, npm run build. Only `tsc --noEmit` and 3 new unit tests (+ climate test) pass.

Finding: MAGNA colours do not identify a rock type (same colour for several units, per-sheet), and IGME's units are "sandstone, calcareous sandstone and ochre clay (Haro facies)", not "clay-limestone". The key's match to the guide's words is approximate: owner to accept or reword.

Idea for the rest of F2: `maplibregl.addProtocol` that fetches the WMS tile, keeps pixels near the key colours, dims the rest, and masks by the focus outline blurred.
