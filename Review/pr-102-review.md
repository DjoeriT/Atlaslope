# PR #102 review (map flags). Verdict: MERGE AFTER FIXES. 0 blockers, 4 should fix, 3 notes.

Facts (read against Review/sources/fetched/rioja-pliego-riojawine.txt and the EU Jerez single document, fetched and pdftotext'd): all 9 lines and all pages confirmed. Haro/Alfaro 100 km, Ebro both banks (p14/15); alluvial 50% "cercana a los ríos" (table, p15); Reims 1890 (p19); Sierra de Cantabria (p20); Jerez/Puerto/Sanlúcar aging, Guadalete south edge, Moscatel in Chipiona and Chiclana (jerez-doc p3); Manzanilla-Sanlúcar DO title (manzanilla-doc, no page).
Not run: vitest (no node_modules in the worktree).

## Should fix
1. content/flags.json haro/ebro/sanlucar/alfaro lines hold two ideas each (visual-style Content: one idea per line). Split or keep one: Haro "A French firm here hired a champagne maker from Reims in 1890." (the "westernmost" fact is the p15 one; pick one). Ebro: drop the alluvial sentence or move it to its own flag. Sanlúcar: keep the ageing line, drop the Manzanilla sentence (or the reverse). Alfaro: "down the valley" is not in the source (it says 100 km separate Haro from Alfaro); use "Rioja's easternmost town, 100 km from Haro."
2. src/map/flags.ts show() (early return on same key): no update() call. The card or sheet opening/closing, window resize and iPad rotation change `.card`/`.bottomright` rects but no moveend fires, so a chip can sit under the card until the next pan. Fix: also call update() on map 'resize' and at the end of the card open/close (or from render() after flags.show), and drop the key short-circuit for update().
3. flags.ts update() vs labels.ts: labels read `.mapflag` visibility, but labels' own update only runs on its events. After flags.update() moves or hides a chip, labels are stale (place name under a chip, or a name hidden for a hidden chip). Fix: flags.update() ends by triggering labels' refresh (pass a callback to addFlags), or register flags' listeners after labels' and re-run labels from flags.show().
4. Keyboard: flags.ts open() uses focusAfterOpen:false and nothing returns focus. A keyboard user presses a chip and the popup (Fly to, links, Close) is not reachable in tab order from there; on close, focus is lost. Fix: on open, focus the popup's first button/heading (tabindex -1); on Escape/close, focus the chip. Add an explicit keydown Escape on the chip/popup (MapLibre only closes on Escape in some versions; inferred, not run).

## Notes
5. map.css .mapflag: min-height 2rem plus the ::after inset gives about 44px of hit area (read, ok); the visible chip is 32px. Fine for WCAG 2.5.8; the 44px rule is met only by the pseudo-element, so check it with a real tap on iPad.
6. flags.ts SHIFTS tries 0, -36, +36 px only; a crowded set at zoom 7 to 8 can hide chips silently (by design, "hidden"). Hidden chips get tabIndex -1, correct.
7. Quiz: confirmed read-only: createMap.ts calls flags.show(null) on quiz entry and render() returns early in quiz, so no chips in quiz; leaving quiz resets shownKey to '' so chips return. No listener or marker leak found: clear() removes markers and the popup, remove() unhooks both map events.

## LeadBot: fixed in this PR
All four should-fix findings: one idea per line (`lines` array, Alfaro "100 km from Haro"), chips re-place on resize and every show(), place names re-check after chips move (`labels.refresh`), focus moves into the box and Escape or the cross returns it to the chip (UI test). Notes: 44 px target to check on a real iPad.
