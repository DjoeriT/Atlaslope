# Fact sheet template (release 4)

Writers fill `content/facts/<study-region-id>.json`. One file per study region, holding every quizzed place of that region in course
order (`jq '.places[] | select(.region=="<id>" and .quiz!="none") | [.id,.name,.kind,.courseOrder]' data/places.json`).

## File shape
```json
{
  "region": "castilla-y-leon",
  "sheets": [ { ...one sheet per place... } ]
}
```

## One sheet
| Field | Required | What goes in it |
|---|---|---|
| `id` | yes | The place id from `data/places.json`. |
| `why.text` | yes | One sentence, at most 25 words: why the wine tastes as it does here (place, grape, climate or soil). Our words. |
| `grapes.main` | yes, may be `[]` | The main grapes, each `{ "local": "Tinta de Toro", "grape": "Tempranillo" }`; drop `grape` when the local name is the grape name. Main only when a source says so (see "Main grapes"). |
| `grapes.others` | yes | Every other grape the official document allows, as local names, in the document's order. |
| `grapes.cite` / `grapes.othersCite` | yes | Citations for `main` and for `others`. |
| `styles.kinds` | yes | Any of `red`, `white`, `rose`, `sparkling`, `fortified`, `sweet`, as the official document allows them. |
| `styles.text` | yes | At most 20 words on what is made, e.g. «Mostly dry reds from old-vine Garnacha; fresh whites from Albillo Real; some rosado.» |
| `climate.text` | yes | At most 25 words from the document's climate section: type, rain, heat, frost, wind. Numbers when the document gives them. |
| `soil.text` | yes | At most 20 words: the main soils the document names. |
| `altitude.text` | only when the document states vineyard altitude | At most 15 words. The app shows the measured altitude anyway. |
| every row's `cite` | yes | A list of `"<sourceId>"` or `"<sourceId>:p<N>"`; `N` is the page the extract gives (heading or the «Página N» marker). Source ids are in `content/sources.json`. |

## Main grapes (in this order; stop at the first that answers)
1. The official extract ranks them: «variedad principal», «preferente», or the document singles out grapes in its own text (wine description or link with the area: «la base de los vinos», «elaborados principalmente con»). Cite the official source.
2. Otherwise the Wikipedia extract `Review/sources/wikipedia/<id>.md`, **only** if its title is about this wine place and it plainly names the main grapes. Cite `<id>-wiki`.
3. Otherwise `main: []` and every grape goes in `others`. Do not guess.
A main grape must also be allowed by the official document. If Wikipedia names a grape the document does not allow, leave it out and say so in your report.

## Rules
- If an extract section is empty or cut short (Cebreros's grape list is), search the full document for that section only: `rg -n -A 40 "variedades" Review/sources/fetched/<file named in the extract header>`. Never read a full document whole.
- Write only what the sources say. If a row has nothing in the extract, write `"text": ""` with `"cite": []`; the app hides an empty row and the check accepts it. Never fill from memory.
- English, plain words, our own sentences. No marketing words («excepcional», «único»). Grape local names keep their accents.
- Zones (Rioja Alta, Rioja Alavesa, Rioja Oriental) use the Rioja extract; write only what it says about that zone.

## Example (Cebreros, from `Review/sources/places/cebreros.md`)
```json
{
  "id": "cebreros",
  "why": { "text": "Old bush vines on granite slopes above 1,000 m keep Garnacha fresh despite hot, dry summers.", "cite": ["cebreros-doc:p11", "cebreros-doc:p12"] },
  "grapes": {
    "main": [ { "local": "Garnacha Tinta" }, { "local": "Albillo Real" } ],
    "cite": ["cebreros-doc:p11"],
    "others": [],
    "othersCite": []
  },
  "styles": { "kinds": ["white", "rose", "red"], "text": "Whites, rosados and reds, young and barrel-aged; reds age well.", "cite": ["cebreros-doc:p11"] },
  "climate": { "text": "Mediterranean with a continental touch: hot, dry summers, short mild winters, 400 to 800 mm of rain, mean 12 to 15 °C.", "cite": ["cebreros-doc:p10"] },
  "soil": { "text": "Sandy loam over granite, slightly acid and poor in organic matter; some schist.", "cite": ["cebreros-doc:p9", "cebreros-doc:p10"] },
  "altitude": { "text": "Some plots above 1,000 m; vines mostly on south-facing slopes.", "cite": ["cebreros-doc:p9", "cebreros-doc:p11"] }
}
```
(Cebreros's grape section is empty in the extract, so `others` is empty here; a writer would say so in the report.)
