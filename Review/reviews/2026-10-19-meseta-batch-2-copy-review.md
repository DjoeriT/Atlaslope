# Review: PR #135 Meseta batch 2 (3a7ecab), code review, copy focus

**Verdict: merge after fixes. Blockers 0, should fix 1, notes 2.**

## Checks
1. Copy [ran grep over the 8 guides]: "Quiz", "Terroir guide", WSET/WSG, exam framing in guides: none. confirmed. Visible titles/ledes: no "X, Y and Z" list (regex hit only two ledes that are sentences with two clauses, not lists). confirmed. Body lists of grapes/styles accepted as in batch 1 (Almansa, Casa del Blanco, El Vicario, Guijoso, Campo de Calatrava each have grape or style lists).
   - "Terroir guide" appears in `Review/release-51-what-to-test.md` line 3 [ran]. See finding 1.
2. Facts [ran regex against extracts, 22 sentences, 8 guides; Campo de Calatrava and La Jaraba read in full]: all confirmed.
   - Campo: 13,583.71 ha, 4,500 km2, 330 l, 10,000/13,000 kg/ha, 16% vol, Brut nature <3, Seco 17-32, Dulce >50, 88.9 vs 301.0, 20.3 vs 15.4, 15.6 C, 52%.
   - La Jaraba: strontium 111.67-158.41, Canforrales 76.59, Manteleros 20.19 ("casi 8 veces"), wines >2.2 up to 3.3, neighbours 0.95-1.6, 14-16 C and 450 mm, 92 ha woodland, 225 l, Merlot 6+6 months.
   - Almansa 89%, 250 mm, 4,500 kg/ha; Casa del Blanco lithium up to 10x, 0.86-2.9 mg/kg, zinc/copper equivalence; El Vicario 1,252 ha, >15 vs 8-10 meq/100 g; Finca Élez 1,080 m; Guijoso 960 m, cold maceration 5-12 h, 14-19 C; Pago Florentino 90% Tempranillo, 7-21 days, harvest 15 days earlier ("quince días").
3. Fact sheet [ran]: La Jaraba grapes.main = Merlot, Tempranillo (Cencibel); pliego section 7 lists exactly MERLOT and TEMPRANILLO-CENCIBEL. confirmed. All 25 sheets: main grapes are {local} objects, 0 bad. confirmed. Moving the listed grapes from others to main in 5 sheets matches the pliego "main" sections (spot-read Finca Élez s.6, Casa del Blanco p3).
4. Tester note [read]: Meseta row 12+8 = 20 guides, total 104 files in content/guides: matches. La Jaraba main grapes: matches. Valdepeñas: no `valdepenas.json` in content/guides. confirmed. "main grape: Merlot" search label not run in the UI [read only].
5. Roster test [read diff]: 8 ids added in sorted order; no other change.

## Findings
| # | Severity | Where | Fix |
|---|----------|-------|-----|
| 1 | should fix | `Review/release-51-what-to-test.md` line 3 "8 more Meseta places get their Terroir guide." | Rule: never "Terroir guide". Change to "8 more Meseta places get their guide." |
| 2 | note | `content/guides/la-jaraba.json` chapter "Oak-aged reds and a Sauvignon Blanc white" | Wording is fine; "Sauvignon Blanc" is a grape name. No change. |
| 3 | note | `content/guides/la-jaraba.json` "Wines from the neighbouring zones hold 0.95 to 1.6 mg/l" | Matches the pliego's measured range; the pliego also says "around 1 mg/l" elsewhere. No change. |
