# Design check: cards-climate-v2 (Spain card, region card, climate legend, map menu)
Date 17 Oct 2026. ReviewBot, design mode. Read the 8 PNGs, visual-style.md; colours computed (ran: CIELAB deltaE, Machado CVD sims, WCAG ratio).

**Verdict: fix first. Blockers 0, should fix 8, notes 5.**
Owner decisions not reopened.

## Should fix
1. **Legend colours, CVD (colour distinguishability).** Legend, all states. Fills at 50% on #EFE9DC, deltaE (want >= 10): olive #97AA45 vs orange #D58A34 = 3.4 (protan), 4.5 (deutan); teal #3E7C93 vs purple #8D7BAE = 5.2/4.1; green #4E9A78 vs grey = 4.0/3.0; olive vs red = 12 only. Hue carries all the difference. Fix (lightness steps), test result: Oceanic #1F5F85, Humid #4FAE86, Med. warm #D2D45A, Med. hot #D1761C, Dry #B4A2DB, Hot and dry #9E2A1B. All pairs >= 10 under protan, deutan; tritan olive/grey ok. Remaining: green vs grey (0.3 deutan): see 2.
2. **Grey #9A948A not in legend and weakest on the map** (deltaE 15 vs cream; lowest of the seven). Any place without a climate shows grey with no explanation. Fix: add a legend row "No climate data" only when such places exist, with a 1px #6E6E6E dashed outline on those fills.
3. **Swatches do not match map fills.** Swatches are solid, map fills are 50% on cream (visibly paler). Fix: draw swatches as the same 50% fill over #EFE9DC, 1rem square, radius 0.25rem, 1px border of the full colour. Dark mode: same, since the map stays cream.
4. **Hover highlight relies on small opacity change** (spain-hover, region-cyl). Hard to see for small places, invisible to CVD users when colours are close. Fix: add 2px outline #1F1F1F (light and dark: the map is cream either way) and raise fill to 85%; also trigger on keyboard focus of the row (:focus-visible), not only mouse.
5. **"Hover a region to find it on the map" on touch** (spain-ipad, 834 px). iPad has no hover; tapping opens the region, so the sentence promises something unavailable. Fix: show the sentence only under `@media (hover: hover)`; on touch use the plain "76 places to learn in 10 regions, north to south." (wording stays the lead's).
6. **Region card hides the content on open** (region-rioja). 275px cover plus intro, grapes and sticky footer leave only the "Places" heading, no row visible. Fix: cover 16:7 (about 175px) on region cards, or collapse the cover once the list scrolls; min 1 row above the footer. Footer buttons: "All of Spain" needs a 2.75rem (44px) target; it looks about 36px.
7. **"7 due for review today" is plain text, a dead end** (spain-light). Says something is due, offers no way to act. Fix: make it a text button "Review 7 due" (min-height 2.75rem) that opens Quiz with those places; keep "N due" pills as non-interactive, add aria-label "1 place due for review".
8. **Lost from the old card (before vs spain-light).** (a) The per-region colour swatch: in "Study region" mode (menu-region) the rows have no colour, so rows cannot be matched to map colours. Fix: show a 0.75rem swatch at the row's thumbnail corner only in Study region mode. (b) The sentence "Colours on the map are the regions" is gone; add it back in that mode only. (c) **Counts changed**: old card summed 106 places (Castilla y León 16, Meseta 25, Navarra and Aragón 11, Cataluña 12, Valencia and Murcia 11); new shows 76 (13, 11, 6, 10, 6). Explain or correct before the owner sees it; a tester will read it as a bug. Spain card is also two regions short of view (Andalucía, Balearic, Canary below scroll): fine, but give the list bottom a fade so scrolling is evident.

## Notes
- Chips "Main grapes here" (Rioja): look like buttons (outlined). If not clickable use flat tint pills #F7E6EA/#2A251B; if clickable, 2.75rem tall.
- Rioja region card reuses the Spain cover photo (Nicondarreta); Rioja should lead with its own photo.
- Grape line wraps to 3 lines on iPad (Cataluña), giving uneven rows: show at most 2 grapes there.
- iPad: search box truncates ("Search places anc"); check if pre-existing. Navarra row thumbnail looks square-cornered (no radius 1rem) vs its neighbours.
- Menu: group heading "COLOUR PLACES BY" and "unavailable" are light grey; check >= 4.5:1 (#6E6E6E on white is 5.1; not measured from the mock). Menu rows are 44px: ok.

## Checked, ok
- "N due" pill contrast: wine #8C2340 on #F7E6EA 7.2:1 (about 6.1 on the darker hover tint); dark gold #C9A54E on #2A251B 6.5:1 (4.4 on #4A3F25, avoid that tint).
- Cover 16:11 with credit pill, serif/sans use, kicker, radius, dark theme (gold on black, map keeps its colours): match visual-style.md.
- One main action per card (rows on Spain, "See the region" on region); legend labels are plain.
- Rows at least 44px; cover arrows about 44px.
- Not checked: large text (125%), the Andalucía/Balearic/Canary rows, keyboard order in the live DOM.

## What LeadBot did with it (built in PR for #50, not in the mock)
1. Legend colours: took the proposed set (#1F5F85, #4FAE86, #D2D45A, #D1761C, #B4A2DB, #9E2A1B).
2. Grey: after measuring the 17 unmeasured places on the map, every place on the map has a climate group (unit test), so no grey row.
3. Swatches are drawn as the map draws a place: a 55% fill with a solid edge.
4. Hover: fill 85%, edge 2.8 px; keyboard focus on a row already lights the place up (`hoverProps`).
5. "Hover a region…" sits in its own span hidden under `@media (hover: none)`.
6. Covers on the Spain and region cards are 16:7. "All of Spain" is already 44 px (`.btn` min-height 2.75rem) [V].
7. "N due for review today" is now a "Start today's round · N due" button (the round also brings new places, as Today does). Counts are memories due, matching the Today card (code review should-fix 1).
8. Study-region mode shows its own legend (the ten regions and colours), replacing the old row swatches and sentence. Counts: the
   mock counted quizzed places only; the built card counts every place, as the old card did (106), and due counts include zones.
Notes: grape chips are drawn flat (no border) so they don't read as buttons.
