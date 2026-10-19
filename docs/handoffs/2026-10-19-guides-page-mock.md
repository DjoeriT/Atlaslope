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
- Replace `public/guides/<region>.webp` with the 10 new tiles (or re-shoot from the script); `data/SOURCES.md` line for the imagery stays.
- Tests: the home/guides unit test (`tests/unit/home.test.ts`) and the guides UI spec that the change touches; update `README`
  only if commands change. ReviewBot runs (new UI).
- Known, accepted: some app labels overlap on tiles (Canarias, Valencia-Murcia, Andalucía "Manzanilla-Sanlúcar"); Green Spain
  tile names are small at tile size. Card rows are ragged because photos keep their ratio.
- Cost so far, slice A: builder ~105K, reviewer ~26K [V, measured]; LeadBot side ~0.15M, mostly re-reads [A].
