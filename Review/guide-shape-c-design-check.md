# Guide shape C: design check (ReviewBot, 19 Oct 2026, commit b002565)

Verdict: FIX FIRST. 0 blockers, 8 should fix, 6 notes. Checked by reading PlacePage.tsx, pages.css (shape C section), strings.ts, helpers.ts
(alikePlaces), visual-style.md and the six screenshots (Toro and Rioja at desktop and phone viewed; rioja-alta not viewed). The mock
(Review/mock-guide-shape-c/index.html) was NOT compared line by line. Large text, reduced motion and iPad width were not run.
Findings marked [read] come from code, [seen] from a screenshot. Screenshot capture artefacts (map legend and zoom buttons floating over
the page, the satellite notice, "Show map" overlapping the title on the phone shot) are not counted as bugs.

## Should fix (clear fixes unless marked TASTE)
1. Beat headings without a written chapter render in UPPERCASE ("THE PLACE", "THE WEATHER", "WHAT THE RULES MAKE") [seen: toro-desk,
   toro-phone]. pages.css:237 sets text-transform:none on `.pg-beat h3`, so another, more specific rule wins. Visual-style allows uppercase
   only for kickers that carry a fact. Rioja (with chapters) shows sentence case, so the two pages look inconsistent. Fix: find the winning
   rule, raise specificity of the shape C rule, add a test on the computed style.
2. "Test me" button wraps to two lines ("Test / me") on Toro desktop and phone [seen]. pages.css:239 sets nowrap, yet it wraps, so something
   overrides it or the flex row is too narrow (the phone rule at :194 stacks the column). Fix: make the button `min-width:max-content` and,
   on phone, full width or left aligned under the text; keep height at least 44px.
3. In short: the five lines are links with the same ink colour as the text, no underline until hover (pages.css:~276) [read, seen].
   Nothing says they are links (WCAG 1.4.1, 2.4.4 intent) and the target is one text line, under the 44px rule. Fix: a trailing arrow
   or always-on underline in the foil colour, and `display:block;min-height:2.75rem` on the link.
4. Uppercase small headings inside the beats ("CLIMATE", "MEASURED CLIMATE", "SOIL", "ALTITUDE", "FAMOUS STYLES", "MAIN GRAPES")
   come from `.pg-h3` (pages.css:78, uppercase, .08em) [seen]. They are kickers that carry no fact and repeat the beat ("Climate"
   under "The weather"). Fix: sentence case, 0.9rem, weight 600; drop "Climate" and "Soil" where the beat title already says it.
5. "Four beats hold their facts once" is not met: Level and Study region appear in the badge row under the title AND in beat 1 [seen: Toro
   beat 1 is only those two rows]; In short repeats the climate and soil sentences word for word under the beats on Toro [seen]. Beat 1 is
   thin without a chapter. Fix (taste, see 13): drop Level and Study region from beat 1 when the badges show them, or drop the badges'
   duplicate; for In short, use the shortened `firstLine` only when the beat text is longer, otherwise a label-only line.
6. Jump bar overflows on desktop and cuts "Food to try there" ("Foo") at the edge with no scroll cue [seen: rioja-desk]. Fix: a fade at the
   edge or fewer items (drop Producers and Food from the bar, or wrap). Also the bar says "The rules" while the beat says "What the rules
   make": use one label.
7. Copy in the "If you like this, try" cards [read: strings.ts alsoGrape, sameClimate]: "Also Tempranillo" is a fragment, and "Same climate:
   oceanic" uses a colon label. Fix wording: "Grows Tempranillo too" / "Oceanic climate too" (wording is the owner's; propose only).
   Quality: ranking falls back to tree order (helpers.ts:145 `a.order - b.order`), so the same places repeat on every Tempranillo page
   (Sierras de Málaga on Toro and Rioja) [seen]. Fix: tie-break by shared main grapes count, then nearness in study region.
8. Copy rules: `zonesShort` joins names with " · " and the grapes line builds "X and N more" in code (PlacePage.tsx:303) [read]. Owner
   rule is one idea per line, no "X, Y and Z" lists. Also the title "Fly to Toro" (strings showOnMap) conflicts with visual-style
   ("Show [place] on the map") and sits near the "On the map" pills. Fix: align one of the two (owner decision, see 14).

## Notes
9. Beat head with a chapter shows a small kicker ("The place") above the chapter title [seen: Rioja]. It repeats the nav label rather
   than a fact. TASTE: keep as a wayfinder, or move it into the number line.
10. In short shows only when 3 or more facts exist (PlacePage.tsx:321); the owner said five. A place with 3 or 4 shows a short box [read].
    TASTE/clear: confirm 3 minimum is intended.
11. Meta ("3 zones · 4-minute read") sits in the badge list labelled "Where it sits" (PlacePage.tsx:351, 355) [read]; the label does
    not fit a read time. Fix: move the meta out of the labelled list.
12. In short box and How it tastes: In short is capped at 46rem and left aligned, leaving the right half empty on desktop [seen]. TASTE.
13. TASTE: whether beat 1 should lose its fact rows when the badges say the same (see 5).
14. TASTE: "Fly to" vs "Show on the map" naming (see 8).
Also: section ids `place`, `weather`, `ground`, `rules`, `short` are generic and could collide with other elements [read]; contrast of
.78rem source lines on the paper2 panel (How it tastes) is not covered by contrast.test.ts that I saw: add it. The Rioja screenshots
carry placeholder text ("Sample text ... Not sourced"); it must not ship. Reduced motion: shape C adds no motion [read]. Focus rings on beat
headings exist (pages.css:240) [read].
