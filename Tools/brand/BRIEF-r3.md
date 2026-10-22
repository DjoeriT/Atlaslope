# AtlaSlope brand identity, round 3: the slope line

## Where we are (owner, 22 Oct 2026) [O]
- Rounds 1 and 2 were rejected. Swiss read as political. Survey, nautical, geology, label, register and ground colour read as too modern or as themes laid on top.
- The owner likes the **clean white look** of today's site. The problem is that it is plain and not unique: it could be any travel or wine site.
  He wants it **elevated in a revolutionary, drastic way**, better integrated and more distinctive.
- Today's site: a white page, a black top band with a champagne line, Newsreader headings (regular weight for big type, 500 for names),
  IBM Plex Sans for reading, and a satellite atlas as the home hero. Headline: "Know the land behind the glass."

## The idea: the slope is the brand
AtlaSlope = Atlas + Slope. Every wine place has a real terrain profile: the line you see when you cut the land open. That line, drawn from
real elevation data, is the ONE graphic of the identity. The page stays white and quiet. The line makes it unmistakable, and every
place has its own, like a fingerprint.
- **Logo:** the wordmark sits on a thin real profile line, the slope under the name. Use the Rioja line or the Spain line; say which.
  The favicon (16, 32, 64 px) is a tiny real slope from the same data, simplified by sampling, never redrawn.
- **Home:** an almost empty white page. One long line crosses it: the real Atlantic-to-Mediterranean transect through 13 DOs. Hovering
  or scrolling moves along it, and the DO under the cursor names itself (from `spans`). The headline sits above the horizon.
- **Guide (Rioja Alta):** opens with Rioja's own line, Sierra de Cantabria to Laguardia to the Ebro and into Rioja Alta. The Rioja Alta
  span (km 20.6 to 39.75) and its altitude band (450 to 780 m, 10th to 90th percentile) are marked. "Why it tastes the way it does" starts
  from what you see.
- **System:** a row of eight place fingerprints (Priorat, Ribera del Duero, Rías Baixas, Jerez, Rioja, Ribeira Sacra, Bierzo, Rueda), each
  its own real line at the same scale, so you see at a glance that Priorat is jagged and Rueda is flat.
- **Colour:** black ink on white, plus ONE accent per place: the colour of its wine. Use a deep red for Rioja, and white-wine gold for
  Rías Baixas and Rueda. That accent marks the selected place, the Rioja Alta span and the button. Nothing else is coloured.
- **Type:** keep Newsreader and IBM Plex Sans (Google Fonts), so the change is the line itself, not a new font. Precise small labels in
  Plex Sans: km, m, place names.

## Three treatments, subtle to bold (one block each)
- **T1 Hairline:** a 1 px line, labels on fine leaders. It's the quietest.
- **T2 Silhouette:** the land under the line is filled solid (black, or a warm near-black), like a horizon at dusk. The white sky holds the type.
  It's graphic and very recognisable.
- **T3 The line you travel:** the home is a sticky full-width line. Scrolling moves a marker along the 883 km, and the page's content
  (headline, then place cards for the DOs crossed) changes with the place under the marker. This is the most drastic, so make it truly work
  in the browser with real JS, not a static picture.

Each treatment shows: 1. the logo and favicon at 512, 64 and 16 px, plus the site bar; 2. the home (desktop ~1440 x 800); 3. the Rioja Alta guide opening;
4. the fingerprint row. One idea per line. Vertical exaggeration is honest and printed small (e.g. "height x 25").

## Data
- `assets/profiles.json` holds `{spain, rioja, places{...}, credit}`. Each profile is `{points: [[km, m|null], ...], marks: [{km, label}],
  spans: [{from, to, label}], length_km}`. A `null` height is sea or no data: draw it as sea level, 0. Read the structure with python (keys, lengths,
  marks, spans). Never print the full points arrays.
- Rioja Alta facts: zone of DOCa Rioja, 76 municipalities, altitude 450 / 570 / 780 m (10th / median / 90th percentile), median slope 3.1°,
  Köppen Csb 71%. Guide text: quote `lede` and the first chapter from `content/guides/rioja.json` (print just those). No new facts.
- Photos: you may use one or two from `assets/photos/` (credits in `credits.json`, one visible credit line, no text on photos), but the line leads.
- Visible credit line: the `credit` field.

## Rules
- NO drawn illustrations, icons or fake geography. Every line is the real data. No pills, small corners, text contrast at least 4.5:1, light pages.
- Users see "AtlaSlope". Copy: one idea per line, no "X, Y and Z" lists.
- One standalone file `parts/r3.html`: Google Fonts `<link>`s, one `<style>`, one inline `<script>`, body is one `<section class="dir dir-r3" id="dir-r3">`,
  with all CSS under `.dir-r3`. Assets are at `../assets/...`.

## Check
`python3 -m http.server 8761 -d /Users/djoeri/Developer/Atlaslope/mocks/brand-identity-r3 &`, then
`cd /Users/djoeri/Developer/Atlaslope && node mocks/brand-identity-r3/shot.mjs http://localhost:8761/parts/r3.html /Users/djoeri/Developer/Atlaslope/mocks/brand-identity-r3/shots/r3.png`.
Crop it with `sips`, look at it and fix it. For T3, also take a shot after scrolling: write a small Playwright snippet that scrolls and shoots.
Ask yourself honestly: is this distinctive, white, calm and unmistakably about land and wine? Stop the server.
