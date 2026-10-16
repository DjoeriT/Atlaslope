# Handoff: release 3 build (16 Oct 2026)

Thread "Build release 3" (LeadBot). Follows `2026-10-16-release-3-start.md`.

## Done
- npm reaches the registry in this environment [V 14:46Z].
- Cards 1 to 4 built by builder agents in worktrees and merged into `claude/release-3-atlas-kupj5t`: `src/tree/` (Opus), `src/app/` shell, `src/map/`, `src/cards/` and `src/url.ts` (Sonnet). Costs in `Review/agent-spend-log.md`.
- ReviewBot (Opus) code review: `Review/release-3-review.md`, merge after fixes; the four should-fix points are fixed with three new UI tests. Nits stay open (listed in the report).
- `Tools/check.sh ui` green: 64 unit tests, 16 UI tests, 1.04 MB gzipped download (limit 2 MB) [V].
- atlaslope.com DNS: TransIP serves the four GitHub A records, the four AAAA records and www CNAME djoerit.github.io (serial 2026101601) [V 15:12Z]. The first save did not go through; `domain-check.yml` now asks all three TransIP servers and prints the zone serial.

## Decided (LeadBot defaults [A])
- UI tests build with `--mode uitest` into `dist/uitest`; debug flags exist only there and in dev.
- URL state lives in the hash: `#place=toro&view=lng,lat,zoom,bearing,pitch` or `#region=rioja`.
- A place without a boundary yet says so on its card; region cards have "All of Spain"; a place card's close button goes up one level.
- Framing max zoom 9 for a region, 10.5 for a place or zone (tune on the real map).

## Open
- Satellite and terrain have never loaded (no key or tile network in the container). The first proof is `live-map-check.yml` after publishing.
- HTTPS certificate, then Enforce HTTPS in Pages settings (owner's tick).
- Release 3 is published only on the owner's "publish release 3".
- Re-estimate tokens on measured figures (brief).

## Where things are
- PR #21 in DjoeriT/Atlaslope, branch `claude/release-3-atlas-kupj5t`. Digest and cards in `Review/release-3-*`.
