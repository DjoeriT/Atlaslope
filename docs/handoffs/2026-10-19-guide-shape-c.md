# Guide shape C (19 Oct 2026, PR #107, release 36)

## Done
- Every place page is shape C: "Why X tastes the way it does" in four beats (place, weather, ground, rules), How it tastes, In short, plain sections, a small Test me door. Pages without a guide file get the beats from their fact sheet.
- New optional guide fields, shown only when filled (`src/facts/guides.ts`): chapter `beat`, `say`, `label`, `more.{fact,history,visit(+when),food}`. The four Rioja guides carry `beat`.
- If you like this, try: computed in `alikePlaces` (`src/pages/helpers.ts`).
- `guideFlyWarnings` (`src/facts/check.ts`) warns when a guide flies only to its own place. It warns today for rioja-oriental.
- The at-a-glance aside is gone; In short replaces it.

## Decided (owner)
- Shape C picked 19 Oct 04:58Z. D's cause chain comes later (#106).
- "Keep both" (05:49Z): Famous styles stays in the rules beat. Read the label holds only the other bottle terms.
- Pronunciation goes up top, written first, audio later. When to go sits inside Places to visit.
- The flight check warns and never fails.

## Open
- Sources for Did you know, History, Places to visit, Food to try there: #103, owner to decide.
- Whether the WSET and Wine Scholar badges under the title stay (asked in the pilot thread).
- Pre-existing, not this slice: `.pg-back` is 42px tall, and the floating Show map button covers photo credits at 150% text on phones.

## Where
Mock `Review/mock-guide-shape-c/`. Style `Review/visual-style.md` "Place page". First look https://claude.ai/artifact/E8CPe2XR1LXu6ruiYKrah4. Field spec mirrored to the pilot's `docs/guides.md`.
