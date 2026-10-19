# Release 36: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
1. **Rioja's page.** It opens on "Why Rioja tastes the way it does", then four numbered beats: the place, the weather, the ground, what the rules make. Each beat has its text on the left and its facts on the right.
2. **Fly through it.** Tap "Haro to Alfaro, the whole valley" in beat 1. The map flies there. "Back to the guide" returns to that beat.
3. **The answer.** After the beats: How it tastes, then In short with five facts. Tap a fact; the page glides to its beat.
4. **A page without written text.** Open Toro. Same four beats, filled from its fact sheet.
5. **If you like this, try.** Near the end of Toro or Rioja: three other places with the same grape or climate. Each opens its page.
6. **Test me** is now a small line near the end, not a box. It still starts a round in Study.
7. **Phone.** On a phone the beats stack, with no sideways scroll.

Not visible yet, on purpose: Say it, Read the label, Did you know, History, Places to visit and Food to try there. Each shows once it has sourced text.

## For you
One PR, #107, from `claude/project-thread-5vnwi1`. Handoff `docs/handoffs/2026-10-19-guide-shape-c.md`. Design check `Review/guide-shape-c-design-check.md`.
Not verified: Safari, real phones and iPads (iPad width checked in Chromium).
