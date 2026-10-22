# Card A report: map mode (slice 2, #148 #127)

Status: done, partly (see differences).

## Steps
1. Close the map in the black band; focus to it on open, back to the card on close; Esc already closes (App). Commit "Map mode step 1" + spec follows. Tests: tsc, npm test 401 green (2.5 s).
2. Rest view (whole place, pitch 50) for How it tastes, In short, Producers and the end; phone map 42% of the screen. Commit "steps 2-3".
3. Opening picks the stop of the paragraph being read (jump, no flight). Open and close keep the same paragraph (data-b ids) at the same height under the bar, or under the pinned map on a phone. Checked in Playwright: Rioja 1440 346 -> 346 px, Priorat 1440 427 -> 427 px; phones follow the new reading area.
- story.spec.ts: 14 passed after one assertion changed (phone map 42%), 41 s.

## Differences from the mock
- Base is today's tour column (PlacePage `tour`, GuideMap), not a restored StoryView: it already is the v3 stage plus the 150 KB limit, lazy loading, geology from zoom 10, rock key, stop links; reading column is the live page itself, so nothing is retyped.
- No terrain-height toggle, locator inset or "Chapter n of 4" in the band (the mock has them). Caption stays "Stop n of N". Not done in this card.
- localStorage choice not added: the URL (&story) already keeps the state across reload.
- "Show the map" string not added (the card on the page does that job).
- Old GuideMap not removed: it is the new mode.
- Tools/shots-tour.mjs is stale against the C3 page (looks for a.fly inside #terroir-<chapter>; zone-card links now sit outside): stops 2 onwards are flagged. Not touched (outside may-edit).

## Shots
Review/map-unfold-build/shots/mode-<rioja|priorat>-<open|reopen>-<1440|390>.png (open at the first stop, imagery on).
