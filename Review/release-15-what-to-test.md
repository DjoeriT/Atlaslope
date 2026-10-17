# Release 15: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
Landscape through the place colours (owner, 17 Oct 15:17Z). The mastery map moves to 16 and ready for friends to 17.

1. **Spain-wide.** The whole-Spain view looks as before: the climate colours as strong as today.
2. **Zooming in.** Zoom towards Rioja or Ribera del Duero. From the region view on, the colour turns into a light tint with a firm
   outline, so vineyards, rivers and villages show through. Close in on a town the colour is nearly gone and only the outline remains.
3. **Selected place.** Open a place card: the selected place still stands out (wine outline, a bit more tint) when zoomed in.
4. **Quiz.** In a quiz round over the satellite photo, the places you tap are still easy to see.
5. **Plain atlas.** Turn satellite off: colours stay solid at every zoom, as before.

## For you
Branch `claude/project-thread-xkhjw7`; change in `src/map/layers.ts`. Checks: `Tools/check.sh ui` passed on 7402a78 (258 unit, 95 UI tests).
Before/after shots in `Review/mock-zoom-detail/shots/` (spain-z6, rioja-z9). Not verified: Safari, a real iPad, a quiz round over the photo.
