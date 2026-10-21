# Review (copy and licence) PR #175
Verdict: MERGE (0 blockers, 0 should fix, 3 notes). Read only; no shots opened.

1. Rock names (src/strings.ts:192, SOURCES.md row "Geology key colours"): faithful.
   - "Arenas, areniscas calcáreas y arcillas ocres, facies de Haro" -> "Sands, calcareous sandstones and ochre clays (Haro facies)": ok.
   - "Limolitas y arcillas rojas" -> "Siltstones and red clays": ok.
   - "Aluviales y llanura de inundación" -> "Alluvial deposits and floodplain": adds "deposits" (note, harmless; "Alluvium and floodplain" is closer).
   - "Pizarras corneanas" -> "Hornfelsed slates": ok (technical; lay readers may not know "hornfelsed").
   Note: the colour/unit match is approximate and SOURCES.md says so. The key label "Rock beneath the soil" is a claim about guide words, fine.
2. Copy rules: strings.ts:191-193 one idea per line; the rock names themselves contain "X, Y and Z" lists, but they are quoted unit names, so acceptable. Note: "Map tour" used consistently (jumpToTour). No Quiz/Study issue.
3. Licence: SOURCES.md row records "No licence stated", the IGME no-paid-value-added condition and the owner decision of 21 Oct; legend-colour row says "same terms". Credit "Source: IGME, MAGNA 50" exists at strings.ts:474-475 (geology, geologyShort). Not run in browser that it shows on every geology stop; the shots were not opened.
4. Slope key: arctan(0.30) = 16.7 deg, "about 17 deg" correct. Share 17%/16% in SOURCES.md is a different figure (land share), no conflict.
5. Tester note Review/release-62-what-to-test.md: plain language, ok. Note: item 4 says "(IGME)" jargon; proposed: "The names come from the Spanish geological survey, in English." Item 5 "slope tint" is fine.
