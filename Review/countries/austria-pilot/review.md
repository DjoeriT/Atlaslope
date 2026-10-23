# ReviewBot: PR #258 Austria pilot (Wachau, Neusiedlersee), issue #149

Verdict: MERGE AFTER FIXES. Blockers 0, should fix 5, notes 7. Tags: [V] ran or read in the diff/sources, [A] inferred, [N] not checked.
Budget: stopped near 70%. Not checked: running the unit suite, the first-load size (PR says 2,054,466 B), the on-demand loader code path, phone/iPad shots, 10 of 13 guide claims.

## Should fix
1. Wachau chapter "wines" holds rule mechanics outside `label` (content/guides/wachau.json): max yield 10,000 kg/ha and "up from 9,000", "list of grapes is restricted", "picked by hand", "vintage is always on the label", and the Spitzer Graben fly caption (Großlage / Ortswein / Riedenwein). Rule says mechanics only in `label`. [V]
2. Wachau chapter title "Mostly white, in three steps" promises three steps the text never gives (they sit in the label block as Gebiets-/Orts-/Riedenwein). Retitle. [V]
3. Two Wachau claims not found in spec-wachau.txt by grep: "Grapes are picked by hand" (no Handlese/hand hit) and the Spitzer Graben Großlage statement (line 38 is cut in my view, so not confirmed either way). Builder says 5/5 checked; re-check these two. [V grep, not reproduced]
4. Place page shows source label "MAPA list" under Level DAC (Wachau shot, wachau-desktop.png). MAPA is Spain's ministry; wrong for Austria. Needs an Austrian label (RIS / EU register). [V screenshot]
5. Country page eyebrow reads "LEARN: Not yet for Austria." and top nav says "Study" on the same page; vocabulary is "Study" (glossary). Check whether Germany shows the same; if so fix both together. [V screenshot, A on Germany]

## Notes
- N1 Code: Austria wiring mirrors Germany (countries.ts, countryPages.ts, places builder, wset-at course, tree parent list). Other countries untouched. Tests: only count/list changes (346 to 348 places, none 265 to 267, guides list, country lists); no limit loosened. [V]
- N2 tests/unit/home.test.ts adds `const guided = places;` and swaps two uses: a no-op alias, churn. Drop it or say why. [V]
- N3 Merge with main kept Germany: content/tiles.json 27 mosel/rheingau/pfalz/nahe matches on both sides; data/SOURCES.md Germany rows 5 on both; the PR removes no SOURCES line. [V]
- N4 Outlines: build_places sets boundary "at-areas" under data/countries/at/; loader was not in the diff, so on-demand loading rests on existing generic code. [A, N]
- N5 Licence: map credit string is present in createMap.ts and asserted in map.test.ts: "Austria outlines: © Land Niederösterreich, © Land Burgenland, Statistik Austria (CC BY 4.0), approximate". Attribution control is the compact "i" button, same as other countries. I did not check that each source's CC BY 4.0 is recorded in SOURCES.md for the Rieden and the municipal limits. RIS reuse terms: SOURCES.md names the RIS URLs; I found no explicit reuse statement. Add one line. [V read, N]
- N6 Photos: 8 Commons photos, CC BY-SA 4.0, CC BY 3.0, CC BY 2.0, credit line format "Photos: Name · licence · cropped and resized" shown on place and country pages. Country page credit shows only the two shown cards (Kasa Fue, Loidhold), correct. `cardPhotos` lists five ids while only two cards show; harmless. Wachau place page says "All 3 photos" though 4 were picked [A: one maybe hidden by crop test; check]. [V]
- N7 Copy lists: "tobacco or chocolate", "vanilla and chocolate", "ripe tannins and plum jam", "apple or pear and of citrus fruit" are X-and-Y runs; tiles "Riesling and Grüner Veltliner" are proper names (allowed). Label terms keep the rule mechanics (DAC, Gebietswein, Reserve 13.0%, Fruchtsüß 45 g/l). Vinea Wachau / ÖTW not used (#85 fine). Tile lines and /at/ intro "From the Danube to the lake." are marked draft. Positioning fine: no Study push. Site footer still says "Spain and Portugal" (pre-existing). [V]

## Claims spot-check (sources: spec-wachau.txt, spec-neusiedlersee.txt)
Confirmed [V]: Wachau 8 municipalities incl. Dürnstein and Spitz; yield 10,000 kg now, 9,000 before; Rheinriesling citrus from bedrock; Neusiedlersee Zweigelt on gravel/sand/saline soils, sour cherry or plum from steel; humidity and autumn fog favour noble rot; Reserve at least 13.0%; Pannonian centre, dry hot summers.
Not reproduced [V]: "picked by hand" (Wachau). Not checked [N]: 17 / nine grape counts, 4.0 g/l, 45 g/l, Winden and Jois exclusion, tobacco/redcurrant.

## Visual (shots read: neusiedlersee-map-rieden, neusiedlersee-map-legal, wachau-desktop, country-desktop)
- Rieden outline (272 km2) is patchy islands that stop at the lake shore; the legal-area outline (999 km2) reads as one clean area including the lake and the Hungarian border. Both are honest if labelled approximate. Owner decision stands; my lean: Rieden outline is the more truthful vineyard picture but looks broken at first glance. Not mine to decide. [V]
- Layout fits visual-style (black band, champagne accents, 6px corners, square guide cards). No contrast or overlap problems seen at desktop. Phone, iPad, large text, reduced motion not viewed. [N]
