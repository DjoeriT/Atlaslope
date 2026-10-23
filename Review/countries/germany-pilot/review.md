# ReviewBot review of PR #245 (Germany pilot, #149)

**Verdict: merge after fixes.** Blocker 0, major 2, minor 6. Read-only review; I ran no tests (CI covers them). Tags: [V] verified by reading or grep, [A] assumed.

## Major
1. **Map credit does not meet dl-de/by-2-0** (`src/map/createMap.ts:94`, `data/SOURCES.md` areas row). The map shows «Germany outlines: LWK Rheinland-Pfalz (dl-de/by-2-0), approximate, for information». SOURCES.md prescribes «© LWK RLP (2026), dl-de/by-2-0, https://weinlagen.lwk-rlp.de [Daten bearbeitet]». The licence asks for source, year, a licence link and a change note. The Mosel outline is modified (union, 150 m closing, simplification), so "Daten bearbeitet" is required. SOURCES.md also still says the terms of use are "checked when the credits line is built [A]". They are not checked. Fix: use the prescribed wording with a link, and check the terms. [V] The test at `tests/unit/map.test.ts` pins the short string and must change with it.
2. **Mosel guide breaks the positioning in the "rules" chapter** (`content/guides/mosel.json`, chapter `grapes`, 14 paragraphs). It is a rulebook dump: single-vineyard 85% rules, Öchsle minimums, Sekt rest time, yield cap. It is not "why it tastes the way it does". The Rheingau equivalent is shorter. Fix: keep the grape and style paragraphs and move the Prädikat and Sekt mechanics into a short label block, as Rheingau does. Wording is the owner's call. [V]

## Minor
1. Lists of the form "X, Y and Z" appear in both guides, for example Mosel chapter `river` paragraph 0 (four stretches), `grapes` paragraph 5 (four varieties) and the Prädikat ladder. Some are inherent (the ladder). The rest need a one-idea-per-line pass. [V]
2. Mosel has no `label` section, but Rheingau does. The guide format is inconsistent between the two. [V]
3. `src/home/countryPages.ts` comment says "no photos yet" but `cardPhotos` is filled. Stale comment. [V]
4. `tests/unit/data-layers.test.ts` now excludes `to-fetch` places for fr, it and de alike. The change is needed for the Rheingau only. Narrow it to `de`. Other count changes are justified: tree 339 to 341, "none" 258 to 260, to-fetch 13 to 14, with the Rheingau named in the test. No test is loosened otherwise. [V]
5. The country page nav and box say "Learn" while the card says "Study". This is shared code and existed before the PR, so it is not Germany-specific. Note for the vocabulary rule. [A]
6. `src/home/photoCrops.json` (157/152) and `data/photo-sizes.json` (835/795) diffs are mostly reformatting and reordering. No existing entry changed in value (checked by script); 5 crops were added. Noisy but safe. [V]

## Checked and confirmed
- Wiring: `countries.ts`, `countryPages.ts` and `build_places.py` mirror Italy. Other countries are unchanged apart from test lists. Outlines and `zones-mosel` are described as on-demand loads, with `boundary` "de-areas". Rheingau is `to-fetch`, openly documented. I did not run the app to confirm the on-demand loading. [V, partly A]
- Facts, 14 claims checked against the spec text (flattened): Mosel 65 to 375 m, 180 m average, 50% SE to SW, 195°, 9.7 and 14.1 °C, 760 mm and 60%, 652,000 Wh/m², Riesling 62%, 87%, 76% and 99%, 125 hl/ha, 9 months, Öchsle 73, 88 and 150. Rheingau 30 km, 80% Riesling, 10.6 and 15.4 °C, 582 mm, 1603 h, 100 hl/ha, 9.8, 13.0, 21.5, 11.4 and 17.7, 3.5 bar, VDP, figs and olives. All match. Tile lines match the cited pages. [V]
- Licences: Commons photos are CC BY-SA 4.0 (3), CC BY 4.0 (1) and CC BY-SA 3.0 (1), each with author, page and licence URL. Credit lines on the country and home pages use the shared, existing format (licence and "cropped and resized" said once). BKG is not used, so it needs no credit. LGB-RLP basemap is not shown, so none is needed. [V]
- Screenshots (country desktop, home desktop, Mosel phone): black band, champagne, white page, 6px corners, no pills, no dark mode. Germany's tile sits alone on a second row, which is fine. [V]
- No WSET or WSG text found in the guides. [V, spot-read]
