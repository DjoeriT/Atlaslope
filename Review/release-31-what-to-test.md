# Release 31: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
Motion in the atlas (owner points 8 and 9). Best judged on a real Mac or iPad; the cloud recordings are software-rendered and choppy.
1. **Section bar.** Open the Rioja guide, tap "The land": the page glides there, the black marker slides along the bar, a short champagne rule sweeps under the heading. Scroll by hand: the marker follows the section you read.
2. **Charts.** In "The land" the climate bars grow in from the left, Rioja first and All of Spain last; the altitude bands open from the median, then the median tick and numbers appear. Hover a climate colour: that class lights in every row and in the legend.
3. **Guide to guide.** From a guide tap the study region badge (wider guide: slides in from the left), then a tile (narrower guide: slides in from the right, the tile photo becomes the header). Each guide opens at its top.
4. **Sections and photos.** Scrolling a guide, each block eases up as it enters. The full-screen photo viewer fades open.
5. **Map.** From Spain open a region, then a place, then search a far place (Jerez, then Rioja Alta): short hops are quick, long trips take longer, each starts and lands softly.
6. **Reduce motion** (macOS Accessibility › Display › Reduce motion): none of the above moves; everything is simply there.
7. **Card to guide and back.** On a map card tap "Explore Rueda": the card grows into the guide. Leave it with "‹ Map" at the top left (on a phone: the black "Show map" button at the foot), "Fly to Rueda", Atlas in the bar, Escape or the browser's back: the guide shrinks into the card, the map steps back and flies in to where you were.
8. **Rioja's study region badge** on the Rioja guide is plain text now (Rioja is its own study region), not a link to the same page.

## For you
One PR from `claude/atlas-motion-k1e4fa` (PR #95). Spec `Review/motion-spec.md`; handoff `docs/handoffs/2026-10-18-atlas-motion.md`; ReviewBot `Review/atlas-motion-review.md`, findings fixed. Recordings in the project files `atlaslope/mocks/atlas-motion-r1/`.
Not verified: Safari (view transitions arrived in Safari 18; older Safari simply gets no slide), iPad, real phones, frame rate on a mid phone.
