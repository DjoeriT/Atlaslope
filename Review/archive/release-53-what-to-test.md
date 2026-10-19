# Release 53: what to test (Meseta fact-sheet fixes)

Five Meseta fact sheets now say only what their official pages say.
Nothing else on the site changes.

Hard-reload first (Cmd+Shift+R).

1. Open Campo de Calatrava. The soil line reads "Dark soils, clay loam below, often stony on top".
2. Open Finca Élez. The why line names the altitude and the dry continental air first.
   Then it says good acidity balances fairly high alcohol.
3. Open Campo de la Guardia. It lists five main grapes, Syrah among them.
   Only Malbec and Petit Verdot are listed as other grapes.
4. Open Manchuela. The styles line says the reds also come dry to sweet.
   It also names Crianza to Gran Reserva reds.
5. Open Méntrida. Under famous styles, the Crianza line starts "Oak brings power, structure and body".
6. Open Uclés. It is unchanged: its grapes are still all listed as other grapes.

## For you
- Commits: the Doors case fix (PR 138, Mac build only), docs after release 52 (PR 139), Meseta unsure facts (PR 140), this records PR.
- Checks: PR 140 green on 609a398 (check, scope, UI 1-4 of 4); `npm test` 308 of 308 locally.
- Open: none for Meseta facts.
- Not verified: Safari, iPad, real phones.
