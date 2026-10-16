# Release 4 review: Rioja zone sheets (PR #24)

Verdict: merge after fixes. 0 blockers, 2 should fix, 3 notes.
Source: Review/sources/fetched/rioja-pliego-riojawine.txt, pages read: 2 (lines 58-112), 15 (754-816), 20 (1025-1071). [V] page boundaries checked against the lone page-number lines (14 at line 753, 15 at 816, 20 at 1071).

## Rule checks [V]
- Word counts (counted by script): why 19/20/18, styles 19/19/18, climate 17/20/16, soil 14/9/8/6, altitude 6. All within caps.
- English, own words: no pasted translation found. [R]
- Style kinds red/white/rose for all three zones: page 2 table gives minimum alcohol for tintos, blancos and rosados of Alta, Alavesa and Oriental, so the source allows all three. All values are in STYLE_KINDS. [V]
- `altitude` is a valid TextRow field (src/facts/types.ts:33). `rioja-pliego` source entry has kind "official" (used by 78 other entries). [V]
- The new source id is not referenced by any test or other file. [V]

## Rows
| Sheet / row | Verdict | Cite page |
|---|---|---|
| rioja soil (quarter, quarter, half) | supported (p15 table: 25% / 25% / 50%) | right |
| rioja altitude (about 700 m) | supported ("altitud maxima de unos 700 m", p15) | right |
| alta why | mostly supported; "made for barrel ageing" overstates "aptos para el envejecimiento en barrica" (suited to) | p20 right |
| alta styles | supported (p20 body, acidity, barrel; p2 whites and rosados carry zone name) | right |
| alta climate | supported (p20 fewer sun hours than the south, more rain, Sierra de Cantabria; p15 Atlantic) | right |
| alta soil | supported (p15 text and table) | right |
| alavesa why | "slightly riper" supported (graduacion algo mas elevada); "softer" is an inference from "algo menos de acidez" | p20 right |
| alavesa styles | supported (p20 versatile, young or ageing, blending) | right |
| alavesa climate | supported (p20 sunshine similar, rain somewhat lower, Sierra shelters from north). p15 says Atlantic predominates, the row opens "Atlantic meets Mediterranean", which is p20's wording and not wrong. | right |
| alavesa soil | supported (p15: clay-limestone, terraces, small plots) | right |
| oriental why | supported (p20 less rain, Mediterranean, more sun, higher strength, extract, blending, barrel) | right |
| oriental styles | supported (p20 young-drinking also possible; p2 minimum 12 / 11.5 / 11 against 11.5 / 11 / 10.5). "Riper, fuller" is p20 "grado mas elevado, extracto" | right |
| oriental climate | supported; "than the rest of Rioja" is slightly stronger than the source, which says "en general" more sun and less rain (p20) and "mas seco y calido" (p15) | right |
| oriental soil | supported (p15) | right |

## Findings
1. Should fix: alta why, "made for barrel ageing" -> "suited to barrel ageing" (the source says apt, not designed). [V]
2. Should fix: alavesa why, "softer" is not in the source; say "a little less acid" or drop it. [V]
3. Note: oriental climate "than the rest of Rioja" could read "than the other zones", same meaning, closer to the source. [R]
4. Note: p15 soil table is one block on the page that also opens the soil paragraph; cite is fine. [V]
5. Note: the cite for the alavesa and oriental styles on p2 only proves the zone name is allowed for white and rose, not that those are common styles there. Acceptable for "can also carry the zone name". [A]
