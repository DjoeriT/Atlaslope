# Review, PR #189 map unfold (ReviewBot, Sonnet, 22 Oct 2026)

Written by LeadBot from ReviewBot's reply (its own file was lost with its worktree). Verdict: merge after fixes. Blockers 0, should fix 3, notes 4.

## Should fix
1. Map mode hides the hero (`{!tour && ...}` in PlacePage): lede and its cite, "say", badges, crumb are not in the reading column. Main kept them with the map open. Owner question. [V]
2. MapCard `open` had no re-entry guard (double click: two `.grow`, go() twice); closing early left the overlay up to ~3.5 s. Fixed by LeadBot: busy ref, try/finally, `dropGrow()` on hide. [V]
3. User-facing copy for owner sign-off: "Close the map", "Chapter n of N", "Back to {name}", "Where the map is in Spain", "Terrain height", "Slopes >30%". [V]

## Notes
- Focus to Close the map on open and back to the card on close (UI test). No Esc handler, same as main. [V]
- Reduced motion: no grow, fade at most 250 ms (UI test); no scroll lock, nothing leaks after close. [V]
- unfold.ts cleanup: idle listener `{once}` stays until the next idle when the cap fires first; fade now in try/finally (fixed); crossFade leaves a forwards fill on `.pg`. [A]
- Credits intact (phone folds them behind the "i"); 150 KB per-tour check untouched; no dead code seen. [V]
