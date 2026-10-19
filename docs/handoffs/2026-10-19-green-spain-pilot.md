# Handoff: Green Spain pilot (19 Oct 2026)

## Done
- Nine fact sheets (`content/facts/green-spain.json`) corrected against the current pliegos (audit: 61 problems). The sources are in `content/sources.json` as `<place>-pliego`, and the texts are in `Review/sources/fetched/`.
- Nine Terroir sections (`content/guides/<id>.json`). Each uses four beats with `beat` tags, `label` terms, and 31 named-place flights. A Sonnet builder drafted them and an Opus sentence check followed: 321 KEEP, 92 FIX, 7 CUT, all applied. The logs are in `Review/guides-check/`.
- Map flags for the nine places (`content/flags.json`), at OSM points. The check is in `Review/guides-check/2026-10-19-flags-check.md`.
- Photos: seven replaced and two Álava photos added, with hand-written alt texts for the nine places.
- Study: a distractor that shares a main style word with the place's own styles is skipped (`src/quiz/questions.ts`).
- Community names use small "de" and "y" (`Tools/data/build_places.py`).
- `docs/guides.md`: the guide spec, both formats and the format log. The `CLAUDE.md` rule says any guide format change updates it in the same PR.

## Decided (owner, 19 Oct)
- A guide is the whole place page, and Terroir is its written section. A guide is a fun reference, not exam prep.
- Shape C, with D's chain later (#106). Extras are History, Places to visit with When to go, Food, Read the label, If you like this try, and Did you know, plus a "Say it" button. Outside sources come later (#103).
- Pliego required for Terroir. Flights only where the source names places worth flying to. Read the label skips terms already in Famous styles ("Keep both").

## Open
- Ribeira Sacra red yield cap: p1 and p10 disagree, so it is left out.
- The Getaria and Cangas pliego versions are not confirmed against the MAPA register (EUR-Lex returns an empty reply).
- Monterrei main grape is empty, because the 2025 pliego dropped "preferentes".
- No O Rosal flag (fails the 80 km test).
- Commons has no vineyard photo for Cangas or Álava, so the photos are a landscape and a glass. Re-pick if better ones appear.
- `Tools/data/photo_ship.py` resets alt to the file name when a slot is re-picked.

## Where
Branch `claude/project-thread-oge0zs` and the release 37 PR. Tester note: `Review/release-37-what-to-test.md`.
