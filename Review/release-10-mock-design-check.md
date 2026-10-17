# Guide mock design and source check, 17 Oct 2026

**Verdict: fix first.** 0 must-fix on design, 2 must-fix on source, 4 should-fix, 3 nit. Pliego lines below are in Review/sources/fetched/rioja-pliego-riojawine.txt. Checked: HTML read, 3 screenshots viewed (desktop light, iPad map, large text). The dark and 2 other desktop shots and Review/visual-style.md (absent in worktree) were not checked.

## Must-fix (source)
1. "Rioja's reds get their body, their colour and the fresh acidity that lets them age" (intro). Source l.1030-1032 says wines (vinos), not reds, and ties acidity to ageing only for Rioja Alta (l.1038-1041). Fix: "Rioja's wines get their body, colour and acidity."; drop "that lets them age" or move it to the Rioja Alta line.
2. "shelters the vines from the weather beyond" (A valley with walls). The Sierra de Cantabria is only said to give "protección" (l.1044, 1050); "weather" is not in the text (l.818 mentions wind for microclimates generally). Fix: "and the Sierra de Cantabria to the north protects the vines."

## Must-fix (design)
None.

## Should-fix
1. Rioja Alta/Alavesa/Oriental cards say "Reds" (Alta) and "Good young or aged" (Alavesa). Source l.1038-1056 says wines, not reds; Alavesa "tanto para consumo inmediato como envejecimiento" is fine. Change "Reds of medium strength" to "Wines of medium strength".
2. "Older documents call it Rioja Baja" is supported by the EU document p.5 (rioja.md "Delimited area"), not the pliego; the cited source line for that chapter does list p.5, so ok, but the Oriental card should point to it. Moving east "the Atlantic fades" is an inference of l.1048-1056; reword "Moving east the climate turns Mediterranean."
3. Nine near-identical "On the map" pills plus the aside's "Show Rioja on the map" (the page's main action) compete. Fix: keep the aside button as the only filled control (already so); label pills by place only with the pin icon and keep the "On the map" small label only on the first. Also add an aria-label such as "Show Sierra de Cantabria on the map" to each.
4. "Back to the guide" returns to #why (top), not the chapter the reader left. Fix: link back to the chapter anchor (add ids to each .gch). Close button ("Close and stay on the map") is clear; keep.

## Source check, sentence by sentence
Supported: 100 km Haro-Alfaro, 40 km, 700 m terraces, natural region (l.754-766 area); 63,593 ha, 3 provinces, 144 municipalities; Atlantic plus Mediterranean, mild, ~400 mm (l.768-771, "algo superiores"); clay-limestone 25/25/50 table and descriptions; soil sentence on balance, alkaline, low organic matter, moderate water; clay-limestone main source for ageing (l.1063-1066); alluvial and ferrous clay less body (l.1066-1068); Rioja Alta fewer sun hours, more rain; Alavesa more alcohol, less acidity, similar sun, less rain; Oriental less rain, more sun, extract, blending (l.1052-1056); one fifth of economy, oak barrels (l.1070-1073); 1857 Madrid, Haro station quarter, 1890 Reims (l.~1004-1010); Winkler fresh and acidic (l.1018-1021); 2017 traditional method sparkling whites and rosés. Caption: "mountain wall" is the mock's wording; "shelters Rioja Alta, and Alavesa even more" matches l.1044-1050.

## Nits
1. Source lines at .75rem grey: check ink3 on paper meets 4.5:1 in dark; the p.-number link has only .35rem padding, so the tap target is short of 44 px.
2. Mock prototype: every pill links to the Sierra caption; the build needs one caption per pill.
3. The tab bar shows "Overview" active while the guide fills the screen; "The guide" should be active in scroll-spy.

## Layout
Desktop, iPad and 125% text show no overflow; pills are 2.75rem tall (44 px ok); zone cards stack to one column under 1100 px; caption card is readable on the iPad map and does not cover the pin.
