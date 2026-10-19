# Guides page mock round, slice A (19 Oct 2026)

## Done
- Mock: `Review/mock-guides-v2/index.html` (one page, images inlined, 2.8 MB), published privately:
  https://claude.ai/artifact/8N4SwgEZtPX1UQBJYw4Wu2 (version 2). Tiles in `Review/mock-guides-v2/tiles/`, shot with
  `Tools/guides/region_tile_flags.mjs` (copy of `region_tile.mjs`, keyless Esri, adds views for andalucia, castilla-y-leon,
  green-spain, rioja). Design check: `Review/mock-guides-v2/design-check.md` (1 high, 4 medium, 3 low; all but two lows fixed in the mock).
- Owner picks [O, 19 Oct]: tiles option A = all 10 tiles show the whole region with the app's own place names, no flag chips
  (flag chips exist only where `content/flags.json` has a set: 3 regions); first 6 places per region, then "All <Region> guides".
- Release 53 (Meseta facts) published and live-checked [V].

## State
- All of this is on the LOCAL branch `worktree-agent-abdb812ae4b5269be` (worktree `.claude/worktrees/agent-abdb812ae4b5269be`),
  head = this handoff's commit. Not pushed. The build slice merges it into its own `claude/` branch first.

## Next: build slice (fresh session, big slice)
- Waits on the owner's OK of mock version 2 (asked 19 Oct, not answered yet).
- Build in `src/home/guideCount.ts` (guides list ~lines 60-160): jump row under the page head, `.slice(0, 6)` per region, link to the
  region page (`../atlas/#region=<id>&page`), photos keep their own ratio (drop the 3:2 `object-fit: cover` in the `.gl .gcard-c .ct`
  CSS; owner photo rule), drop the "Vino de Pago" kicker on photo-less tiles, design-check CSS (lede 1rem, meta .9rem, 44 px links).
- Region tiles: the mock's 10 tiles are NOT good enough (owner 19 Oct: "not really great"; LeadBot checked all 10 [V]). Fix them in the
  build, not the mock, then show the owner all 10 as one contact sheet before the PR. What is wrong, per the check:
  1. Framing: views are hand-set centres, so most tiles are mostly neighbours. Rioja is half Navarra; Green Spain is mostly
     Castilla y León places; Castilla y León cuts Bierzo into a corner and shows Meseta places; Andalucía shows Extremadura and
     La Mancha at the top with Jerez tiny; Valencia-Murcia shows half La Mancha.
  2. Weight: other regions' places are drawn as strongly as the region's own, so no tile says which region it is.
  3. Labels: small serif names, unreadable at tile size, and they collide (Utiel-Requena/El Terrerazo, Guijoso/Finca Élez,
     Priorat/Montsant/Tarragona, Campo de Calatrava/Valdepeñas, the Tenerife cluster). Baleares and Canarias are the best two.
  Fix in `Tools/guides/region_tile_flags.mjs` (rename to `region_tile.mjs` and archive the old one): fit each frame to the bounds of
  that region's own places (padding ~8%), not a hand-set view; draw places outside the region faint or not at all; label only the
  region's own places, bigger, dropping a label that collides. First check whether the app's own region view (`#region=<id>`)
  already fits and highlights a region, and reuse it if so [A, not checked]. Then replace `public/guides/<region>.webp` with the
  10 new tiles; the imagery line in `data/SOURCES.md` stays. Pilot 2 regions (Rioja, Andalucía) before shooting all 10.
- Tests: the home/guides unit test (`tests/unit/home.test.ts`) and the guides UI spec that the change touches; update `README`
  only if commands change. ReviewBot runs (new UI).
- Known, accepted: some app labels overlap on tiles (Canarias, Valencia-Murcia, Andalucía "Manzanilla-Sanlúcar"); Green Spain
  tile names are small at tile size. Card rows are ragged because photos keep their ratio.
- Cost so far, slice A: builder ~105K, reviewer ~26K [V, measured]; LeadBot side ~0.15M, mostly re-reads [A].
