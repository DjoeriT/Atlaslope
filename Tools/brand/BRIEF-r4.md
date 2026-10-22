# AtlaSlope brand identity, round 4: two colourful big ideas

## Where we are (owner, 22 Oct 2026) [O]
- Rounds 1 and 2 were rejected: political, too modern, themes laid on top. He likes today's **clean white look**, but it is plain and not unique, and he
  wants it elevated in a drastic way. Round 3, the slope line (a real terrain profile as the brand), was "too black and white".
- So these two ideas must be **colourful** and still clean white. Every colour must be **real**: taken from the land itself.
- Keep today's type: Newsreader (headings, regular for big type, 500 for names) and IBM Plex Sans (reading). The page stays white. The site bar
  may stay black, or become white with a fine rule. Your choice; say which.

## The data: real aerial photos of each wine place
`assets/cutouts.json` is keyed by place name (8 heroes: Rioja, Priorat, Ribera del Duero, Rías Baixas, Jerez, Ribeira Sacra, Bierzo, Rueda, plus up to ~80
more at small size). Each entry is `{id, name, kind (DO/DOCa/DOP/VP...), w, h, path, palette: [{hex, vivid, share}], center: [lon, lat]}`.
- `assets/cut/<id>.jpg` is the IGN PNOA aerial photo of the place's bounding box, `w` x `h` px.
- `path` is the place's exact legal outline as an SVG path in that image's pixels. Clip the photo with it: `<svg viewBox="0 0 w h"><clipPath><path d=path>`.
- `palette` holds the six colours of the land inside the outline (k-means, sorted by share). `hex` is the measured colour. `vivid` keeps the same hue
  with saturation raised, because aerial photos are hazy. Wherever `vivid` is shown, label it as "brightened from the aerial photo". Never invent colours.
- Read it with python (keys, one entry without the path). Never print the paths or the whole file.
- Credit line wherever imagery or palettes show: "Aerial photos: PNOA © IGN · DOP boundaries © MAPA".
- Rioja Alta facts: zone of DOCa Rioja, 76 municipalities, 450 / 570 / 780 m (10th / median / 90th percentile), median slope 3.1°, Köppen Csb 71%.
  Guide text: quote `lede` and the first chapter from `/Users/djoeri/Developer/Atlaslope/content/guides/rioja.json`. No new facts.
- Photos from the ground: `assets/photos/*.webp` with `credits.json`. One visible credit line, no text on photos.

## Screens (each idea)
1. **Logo and mark:** the wordmark, the mark, the favicon at 64 and 16 px, and the site bar.
2. **Home** (desktop, 1440 wide): the headline exactly "Know the land behind the glass.", one short line, and "Open the atlas".
3. **Guide opening for Rioja** (the DOCa; that is the place we hold a cut-out for), with the Rioja Alta zone named in the text.
4. **The system:** how the idea scales to all of Spain's wine places.

## Rules
- NO drawn illustrations, icons or fake geography. Only real outlines, real photos and real measured colour. Text contrast at least 4.5:1:
  never put body text on a mid-tone colour without checking. Small corners, no pills. One idea per line, no "X, Y and Z" lists. Users see "AtlaSlope".
- One standalone file `parts/<x>.html` (x = `cut` or `col`). Google Fonts `<link>`s, one `<style>`, one inline `<script>`. The body is one
  `<section class="dir dir-<x>" id="dir-<x>">`, and all CSS sits under `.dir-<x>`. Assets are at `../assets/...`.
- Check: `python3 -m http.server <port> -d /Users/djoeri/Developer/Atlaslope/mocks/brand-identity-r4 &` (cut 8771, col 8772), then
  `cd /Users/djoeri/Developer/Atlaslope && node mocks/brand-identity-r4/shot.mjs http://localhost:<port>/parts/<x>.html /Users/djoeri/Developer/Atlaslope/mocks/brand-identity-r4/shots/<x>.png`.
  Crop it with `sips`, look at it and fix it. Ask yourself honestly: is it colourful, clean white, distinctive and unmistakably about land and wine? Stop the server.
