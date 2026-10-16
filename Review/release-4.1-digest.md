# Release 4.1 digest: how it tastes, famous styles, producers, planted-area grapes (issue #27)

One page for every card in this release. Agents read this, the lines named here and their own card; never scope, decisions or the brief whole.

## What ships (owner cards, 16 Oct 2026 19:31-19:38Z, recorded in `docs/scope.md`)
- **How it tastes**: one row, colour, nose and palate, from the official document's wine descriptions, cited. [O]
- **Famous styles**: the named styles each official document defines (Crianza, Fino, Fondillón...), cited. [O]
- **Famous producers**: up to three producers or wines per place, only those the place's Spanish Wikipedia article singles out, cited;
  the owner can swap any; gaps allowed. [O]
- **Main grapes from planted area** for the 30 sheets without one: most planted = main, cited. [O] Source not found yet (see below).

## Decisions that apply
- Fact sheet rule: write only what a source says; our own English sentences (`NOTICE.md`); never Wine Scholar Guild material. [O]
- Wikipedia is for main grapes and producers only; never for tastes or styles. [O for producers, release 4 rule for the rest]
- Card order (LeadBot default [A]): why line; Main grapes, Other grapes, Styles, **Famous styles**, **How it tastes**, Climate,
  Köppen, Altitude, Soil, **Famous producers**; then photos. New rows reuse the existing row and source-line pattern, so they are a
  small tweak (LeadBot's own UX check; the owner sees a screenshot before merge) rather than a new mock.
- Release without planted area if no source turns up; the 30 empty main grapes then move to the next release (owner card, 20:06Z). [O]

## Shape (`src/facts/types.ts`, checked by `checkSheets`)
```json
"tastes":    { "text": "≤ 40 words", "cite": ["<id>-doc:pN"] },
"famous":    { "styles": [ { "name": "Gran Reserva", "text": "≤ 15 words" } ], "cite": ["<id>-doc:pN"] },
"producers": { "items": [ { "name": "Bodega as the article names it", "wine": "optional wine it names" } ], "cite": ["<id>-wikinotes"] }
```
All three are optional; an empty row is `{ "text": "", "cite": [] }`, `{ "styles": [], "cite": [] }`, `{ "items": [], "cite": [] }`.
Limits: tastes 40 words, famous styles 4, producers 3, producers cite only a `wikipedia` source.

## Files
- Official extracts: `Review/sources/places/<id>.md`, section «Wine descriptions» (and «Wine categories»). Zones use `rioja.md` (and
  `Review/sources/fetched/rioja-pliego-riojawine.txt` for the zone sections only, cite `rioja-pliego:pN`).
- Producer notes: `Review/sources/wikipedia-notes/<id>.md`, section «Paragraphs naming producers or wines» (a loose keyword filter:
  most hits are not producers). Source id `<id>-wikinotes` in `content/sources.json`.
- Planted area: `Review/sources/wikipedia-notes/<id>.md` «Paragraphs about planted area»; Wayback copies of the MAPA DOP reports in
  `Review/sources/fetched/wayback-*` (pending). LeadBot writes the grape rows centrally once a source is confirmed.

## Cards
| Card | Model | Files | Depends on |
|---|---|---|---|
| Rows on the place card, types, check, tests (LeadBot, small) | – | `src/facts/`, `src/cards/PlaceFacts.tsx`, `src/strings.ts`, `src/styles/app.css`, `tests/` | – |
| `release-4.1-card-1-write.md`, four runs (A green-spain + castilla-y-leon; B rioja + ebro + cataluna; C mediterranean + meseta + baleares; D andalucia + canarias) | Sonnet | `content/facts/<region>.json`, the three new rows only | sources.json |
| Planted-area main grapes (LeadBot) | – | `grapes.main` / `grapes.cite` of the 30 empty sheets | a confirmed source |

One PR for the release (code and sheets). ReviewBot (Sonnet) checks a random sample of new rows against the extracts and the code diff.

## Estimate
0.6 to 0.8 M tokens [A] (release 4 measured about 0.8 M with seven rows per sheet; this adds three rows). Brake at 1.2 M.

## Outcome (LeadBot, 16 Oct 2026)
- Ships as **release 6** (the publish workflow takes whole numbers; release 5 was the world map).
- Tastes 76 of 79 sheets, famous styles 75, producers 7 [V, count script]. Jerez has no tasting row (its document only names types).
- Producers: the Spanish articles singled out one (Lebrija); the owner picked English Wikipedia (card 20:11Z), which singled out six more.
- Planted area: the MAPA DOP reports (Wayback copies) have no grape varieties [V]; moved to issue #29 per the owner's card (20:06Z).
- Card rows built by LeadBot instead of a builder (small: about 60 lines); taste rows split into one line per colour after the UX check.
