# Release 64: what to test (guide page C3, the map unfold)

Every guide page has a new layout.
Rioja and Priorat open their map with a big photo button.

Hard-reload first (Cmd+Shift+R).

1. Open the Rioja guide. Title and lede on the left, a photo card "Read with the map" on the right.
2. Scroll down. Text on the left, the stop photos and charts on the right, no boxes.
3. "How it tastes" sits in a champagne band.
4. Each section starts with a small line like "2 · The weather" above its title.
5. Open the Priorat guide. The weather and the rules sections now have a photo.
6. Open a guide without a map tour, e.g. Jumilla. No map card; one photo and "Fly to Jumilla".
7. On Rioja, click "Read with the map". The photo grows to fill the screen, then the map appears.
8. The map view has its own black bar: "Chapter 1 of 4", "Close the map", "Back to Rioja".
9. The reading column starts with "Rioja" and the lede, then the stops.
10. Scroll: the map flies from stop to stop.
11. Click "Close the map". You land on the same paragraph you were reading.
12. On a phone the map sits on top, the text below.

For you: PRs #187 (guide page C3, Priorat photos, checked crops), #189 (map unfold: v3 full-screen map mode, grow and
fold-back, heading B, lede in map mode). Published from 5320413 (merge of #189), main CI green.
Not checked: real Safari, iPad, phone; the unfold's timing on a slow device (about 3 s of full-screen photo before the map shows).
Records note: this tester note ships in the tours PR, not in #189 (missed before publish, 22 Oct 2026).
