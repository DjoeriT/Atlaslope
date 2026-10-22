# Release 63: what to test (404 page, speed wins)

A wrong address now gets a real page.
The maps load less data and start faster.
Nothing else on screen changes.

Hard-reload first (Cmd+Shift+R).

1. Open atlaslope.com/nothing-here. You see "This page isn't here." with links to Home, Atlas and Guides.
2. Open the Atlas and zoom out to all of Spain. The map is flat there; the 3D relief comes in as you zoom closer.
3. Open the Rioja map tour. The relief is there from the first stop.
4. On a slow phone connection, the Atlas and a guide map show their satellite picture sooner than before.
5. The home page photo credit ends with "cropped and resized".

For you: PRs #176 (faster loop, builder tooling), #177 (404 page, credit), #179 (speed wins: terrain tiles at 512 px, relief from
zoom 7, tours from zoom 6, one fetch per data file), #178 (register watch script, local only, no site change), #180 (records).
Checks: main's CI run green on the merge of this PR. Not checked: real Safari, iPad, phone; load times on a real slow phone.
