# Release 61: what to test (Map tours inside the guide)

The map tour is now part of the guide page itself.
Every chart and section stays; the map sits beside them.
Search is in the top bar on every page.

Hard-reload first (Cmd+Shift+R).

1. Open the Rioja guide. Under the lede, a black band with a slowly moving satellite picture says "Map tour · 9 places to fly to".
2. Tap "Open the map". The same guide gets a map on the right (on a phone: a map strip on top).
3. Scroll. The map follows the section you read. The climate chart and the map now use the same colours and names.
4. Tap a "See … from above" link or a zone card. The map flies there.
5. Tap a small champagne dot on the map: a card with one guide sentence and its source. Escape closes it.
6. Tap "Hide map". You are back on the plain guide.
7. Open a guide without a tour, for example Alella. It still has "Show on map".
8. The top bar shows Atlas, Study, Guides, About and the search field. Type "rio" and pick Rioja.
9. On the Guides page, Rioja and Priorat cards say "Map tour". "Show only guides with a map tour" shows just those two.
10. Old links atlaslope.com/map-tours/ and /read-with-the-map/ open that list.

For you: PR on branch claude/map-tour-guide; checks in the PR's CI run. Not checked: real Safari, iPad, phone.
