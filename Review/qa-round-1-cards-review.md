# Code review: PR #51 (qa-round-1, head 466397c vs base 1d5e79d)

Verdict: MERGE AFTER FIXES. 0 blockers, 2 should-fix, 3 nits. Not run: Tools/check.sh (read-only review; CI is the gate). Everything below was read, not run, unless stated.

## Checked and fine
- Colour switch: `climate` is a feature property set in boundaries.ts:31, so `setData` needs no repaint. `apply()` (createMap.ts:110-112) sets fill and line colour, and runs on every menu change (MapView.tsx:61) and once at load (createMap.ts:127). `sel` stays the first `case` branch, so selection wine wins over both modes. Hover and dim are opacity-only and unaffected. Zones layers keep their fixed colour (style.ts:77), which is fine.
- The legend is hidden in the quiz and when boundaries are off. It has `role=group` with a label and `aria-hidden` swatches, and the text carries the meaning. Menu labels are min-height 2.75rem (44px).
- Data trail: place-measures.json holds 96 places (the SOURCES.md count matches, read via node). The SOURCES.md row names the origin, licence and script. The script's `missing` check still fails if a quizzed place has no boundary.
- Unit test "no place on map is grey" reads real data. Good.

## Should-fix
1. **Due counts mix two units.** src/app/App.tsx:101 builds `dueSet` from `plan.due` (memories: where and what per place). TodayCard.tsx:22 and doors.ts:28 count memories ("N due"). Cards.tsx counts distinct places ("Rioja 2 due", "Review N due today"). A learner with both memories of one place due sees Today say "2 due"; closes it; the Spain card then says "Review 1 due today". The Review button starts the same session as Today's button, so the number it promises should match. tests/ui/map-colours.spec.ts seeds one memory per place, so it cannot catch this. Fix: count memories in the card (a `Map<place, count>` from `plan.due`; sum for rows and for the button), or call the unit "places" everywhere. Add a seed with two memories due for one place.
2. **Disabled colour-by radios give no reason.** MapMenu.tsx: `<fieldset disabled={!menu.boundaries}>` has no visible disabled style (the old `.menu label[aria-disabled]` rule does not match), and no text says to turn on Place boundaries. Dead end, against the "every state says what happens next" rule. Fix: grey the fieldset (`.colourby:disabled{opacity:.5}`) and add a `<small>` hint such as "Turn on place boundaries" (strings.ts) while disabled.

## Nits
3. Review starts `startStudy(false)` through autoStart (QuizScreen.tsx:91-95), so it also adds today's new intake places. That matches the Today button but not the label "Review N due". Confirm that is intended, or reword.
4. The test for the colour switch checks `buildStyle` (map.test / climate.test.ts), not the live `apply()` path where the runtime switch happens. No UI test asserts `map.getPaintProperty('dos-fill','fill-color')` after clicking the radio. Add one if a debug hook exists.
5. map.css:8 `.menu label[aria-disabled="true"]` now looks unused (the climate "coming" row is gone). Remove it if nothing else sets it. `.tree` CSS is still used by PractiseScreen, so keep it.

Cards.tsx also has `cover` colour `"#8C2340"` hard-coded twice (the selection wine), and `['rioja','rias-baixas','jerez']` Spain cover picks are hard-coded. Both are acceptable but should be named constants.

Not checked: visual style, the mock, data/place-measures.json values, the measure_places.py run itself (needs network).
