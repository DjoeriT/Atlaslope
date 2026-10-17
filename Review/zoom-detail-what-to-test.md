# Sharper map close in: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
The close-in map slice (#55). It takes the next free release number when published.

1. **Sharp photo in Spain.** Zoom into Haro or Jerez until single streets show. The photo should stay crisp (IGN's own
   aerial photo), with vine rows visible, not a soft blur.
2. **Border.** Fly to Tui on the Miño, or along the Portuguese border. Spain is sharp, Portugal is Esri's photo; there is no
   empty band or hard grey square where they meet.
3. **Place names.** Close in you see towns, villages, rivers and the main peaks in the app's own type. The wine place names stay the
   largest. Start a quiz round that hides names: the town names hide too.
4. **Plain atlas.** Turn satellite off in the menu: names turn dark on the light map.
5. **Tiles fading in.** Zooming in, finer tiles fade in over about half a second. Squares that stay blank or blurry for long
   are worth a screenshot.

## For you
Branch `claude/project-thread-xkhjw7`. Mock `Review/mock-zoom-detail/`, approved. Handoff `docs/handoffs/2026-10-17-zoom-detail.md`.
Not verified: Safari, a real iPad, a slow connection.
