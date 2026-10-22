# Release 68: what to test (a calmer map view)

The map view's top holds only the stop's name.
The keys sit at the foot of the map.

Hard-reload first (Cmd+Shift+R).

1. Open Rioja, click "Read with the map". Top left: the stop's name. Top right: zoom. Nothing else on top.
2. Scroll to the weather. The climate key sits at the foot of the map, right of the small Spain map.
3. At the soils, the rock key sits there too.
4. Click the "i" bottom right. A panel opens with the terrain height (x1.5 / x1.3) and the credits.
5. On a phone, the key is one line and scrolls sideways; the "i" panel has the full rock names.
6. The climate colours fade out at the edges instead of ending in a hard square.
7. Guides page: the photo credit line at the end is much shorter (release 67).

For you: PRs #199 (map bar B), #201 (one worktree per session, docs and a local hook only). Published from 0e15b91 (tag release-68).
Written after publish: the note missed #199 (third time on 22 Oct); ships in the next slice's PR.
Not checked: real Safari, iPad, phone.
