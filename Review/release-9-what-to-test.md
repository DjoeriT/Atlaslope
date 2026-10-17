# Release 9: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
The travel look for places and regions (issue #37), built from the approved mocks in `Review/mock-travel-v1/`.

1. **Place card.** Tap a place on the map. The card now opens on a cover photo (arrows and dots when there are more), the name, the opening sentence and three quick facts. "Read the full page" is the main button.
2. **Full place page.** Photos up top (one to five, Rioja mixes in its zone photos), a bar to jump between sections, every section with its sources, the "at a glance" box, a climate bar and an altitude range. "Back to map" and "Show <place> on the map" bring you back. Back and forward in the browser work.
3. **Region page.** Open a region (for example Rioja), then "See the region": a cover photo and a tile per place; a tile opens that place.
4. **Photos.** Eleven places got a better first photo and Cava, Catalunya, Arínzano, Otazu and Valdeorras got photos. Places still without a photo (Jerez, Manzanilla, most Vinos de Pago) show their name on a clean cover. Five off-topic first photos were dropped (Calatayud's train, Abona's surf beach, Bullas' beach, Ribera del Guadiana's Roman theatre, Txakoli de Álava's road).
5. **Light and dark, iPad.** Both pages in both themes and on iPad width.

## For you
Commits: one PR from `claude/release-8-new-look-4kufin`. Cards `Review/release-9-card-1-place-page.md` and `-card-2-region-page.md`; photo audit in project files (`photo-pass/2026-10-17-audit.md`); ReviewBot `Review/release-9-review.md`.
Known gaps: soil and famous-style ageing stay text (the sheets hold them as text, not numbers, so no chart was invented); the mock's mini map in the at-a-glance box is left out; no "Show all photos" viewer; 26 places still without a photo and 10 first photos that are landscape or village rather than vines (issue #42).
Not verified: Safari, a real iPad, satellite under the pages (blocked in the cloud container).
