# Release 10: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
Place guides (issue #14), built from the approved mock `Review/mock-guides-v1/`.

1. **Terroir on Rioja.** Open Rioja's full page. Under the title, "terroir, 4-minute read" jumps to the new Terroir section after the
   overview: four short chapters (the valley, west to east, soils, the barrel), each with its source line.
2. **On the map.** Each "On the map" button (seven on Rioja) leaves the page and moves the map: a place is framed, a named spot (Sierra de
   Cantabria, Haro's station quarter) gets a labelled pin. The card at the bottom left says why it matters. "Back to the guide" returns
   to the same chapter; the cross keeps you on the map with Rioja's card. The address survives a reload.
3. **The zones.** Rioja Alta, Rioja Alavesa and Rioja Oriental have shorter Terroir sections of their own.
4. **Test me.** At the end of Terroir, and on every quizzed place page, "Test me" starts a round of only that place and its zones.
   Browser Back from the round should not restart it.
5. **Plural.** A region with one place says "1 place to learn".
6. **Light and dark, iPad,** and the map moves over satellite (only checkable on the live site).

## For you
One PR from `claude/release-10-guides-rkyo7i`. Card `Review/release-10-card-1-guides.md`; mock check `Review/release-10-mock-design-check.md`;
ReviewBot `Review/release-10-review.md` (0 blockers, 4 should-fix, all fixed).
Known gaps against the mock: the inline "see Famous styles" link in the barrel chapter is plain text; the pin of a named spot stays on the
map after "Close and stay on the map" until another card opens. Rioja's guide is about 550 words, under the scope's 600 to 800, because
the sources say no more. Fly-there spots for Sierra de Cantabria and Haro's station quarter are coordinates picked by hand [A].
Not verified: Safari, a real iPad, the camera moves and pins over satellite (tiles blocked in the cloud container).
