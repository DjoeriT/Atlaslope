# Design review: story view, Read with the map page, home stats tile
Verdict: FIX FIRST. Blockers 1, should fix 6, notes 5. Mode: design, from shots only (read; nothing run).
Not checkable: satellite imagery (no Esri key), real-device Safari/iPad, large text, reduced motion, hover/focus, the part of each page below the fold, iPad width (no shot).

## Blocker
1. Photos, credit line. Story fact cards (Haro station, Rioja soils, Siurana) show a photo and no "Photos: Name, licence, cropped and resized" line anywhere in the card or the visible strip (story-rioja-haro-desktop, story-rioja-soils, story-priorat-siurana). CLAUDE.md photo rule and visual-style Photos. Fix: one always-visible credit line under each card photo (0.7rem, ink 3), or confirm it sits elsewhere in view of the photo. Not reproduced as present in any shot.

## Should fix
2. Photos, subject. Haro station card leads with a railway platform and tracks (visual-style: no trains or unrelated buildings). Fix: owner picks another crop or photo, or accepts it as the fact's own subject.
3. Marker label collision, Priorat Siurana: the "Riu de Siurana" label sits under the marker dot, so the text reads "Riu d(dot)urana". Fix: offset the label from the marker.
4. No information by colour alone, Rioja soils: map shows rock-type colours with only a "Colours: rock types" tag and no legend. Climate has one. Fix: a legend for the geology colours as on climate, or label the zone drawn.
5. Phone, climate (story-rioja-climate-phone): legend overlaps the Spain minimap; legend names shortened ("Mild Med.", "Hot Med.") unlike desktop; the credit strip is cut over the text ("wine changes with it." shows under it). Fix: move the legend above the minimap or hide the minimap on phone; use full names; keep the text column clear of the strip.
6. Phone map covers about 40% of the screen with the card beneath only partly visible (story-rioja-haro-phone: card top hidden under the credit strip). Fix: check the sticky map height against one readable card, and add scroll offset so a card never starts under the map.
7. Fact-card relevance: Haro station card states "In Rioja Alta, half the land lies above 570 m", Soils card "6% of the land is steeper than 30%": measured lines that do not match the card's subject. visual-style Content: a highlight restates one sourced fact. Fix: pick a measure that fits each card, or drop the line where none does.
8. Approved mock v3 parity: round 3 shows a Rioja/Priorat switcher in the band and a "Terrain height x1.5 / x1.3" control on the map; the build has neither (only "Terrain x1.5" in the strip). Fix: confirm with the owner these were dropped on purpose; if not, restore them.

## Notes
9. Text column has 150-250 px blank stretches under some beats (climate desktop). The mock had them too; fine if intended as scroll room, but check on a 1194 px iPad.
10. "ON THE MAP" kicker on every card carries no fact (visual-style Type: kicker only where it carries a fact). Same on all cards, so low risk; the owner may keep it. Kicker also sits very tight to the card title.
11. Source line in cards: mock had "Source:" prefix; build shows the underlined title only. Readable, but less clearly a source.
12. Read with the map page (step5-page): two cards fill the left half and the right half is empty on desktop; Priorat text sits within 4 px of the photo credit line. Fix: more space above the credit line; keep left edge one grid. Phone: hard line break makes the intro wrap in 4 uneven lines ("place it names." alone).
13. Home stats tile (step5-home-stats): third stat "2 guides to read with the map" is underlined link text while the other two are plain; consistent with the card but the link affordance is only an underline on small print. Numbers regular weight, 8px rhythm OK. Corners 6px, no pills (SPAIN badge is square), no dark mode: all pass.

## Passes
Black band + champagne line, Newsreader/Plex use, no pills, 6px corners, one way out ("Back to Rioja"), square crops with focus on subject on the page, contrast of legend chips, zone names layer readable (step5-rioja-climate-zonenames).
