# Atlas cover card (22 Oct 2026, PR #202)

## Decided (owner, 22 Oct 2026)
- The Atlas needs a first card that shows what the atlas is before any country ("with more countries coming, we need to first entice people").
- Mock rounds, one page each at `Review/mock-atlas-cover/` (round 3 E1 kept; rounds 1-2 in this session's scratchpad only):
  round 1 A-D (A "not enticing"; liked B's feature story; "Map tours should be on there as well ofc"); round 2 E-G (liked E; "claims a bit
  too big", "Walk the land is too much", stills "not really sexy"); round 3 E1 motion chosen, headline "See where your wine comes from".
- Size check option A: `.webm` and `.mp4` are left out of the 2 MB download check like photos (`Tools/check.sh`, `docs/PROJECT.md`).

## Done
- `src/cards/AtlasCard.tsx`, `src/cards/atlasCover.ts`, strings under `strings.atlas`. The empty atlas hash opens the cover. Spain is
  `#country=spain`; the Spain card's trail is "Atlas". The map behind the cover fits the live countries. Country tiles list every country
  with places (Spain only today), and the counts come from the tree and `content/stories`.
- Media: `Tools/atlas/cover_media.mjs` writes `public/atlas/*`: two VP8 webm clips (tour 0.50 MB, slopes 0.55 MB), posters, three stills.
  Clips use preload none, play only while at least 40% on screen (scroll/resize check), and show the poster only under reduced motion.
- LeadBot fix [V]: the builder's IntersectionObserver never fired, because it was created during the card swap's view transition. It is
  replaced by a plain visibility check, checked in a production build (tour plays on load, pauses off screen, slopes clip plays on scroll).
- ReviewBot (`Review/mock-atlas-cover/review.md`): OK with a change. The imagery credit moved under the first clip; "Tours in N places".
  Licence read [A, not a legal opinion]: short loops of the app's own map on its own site count as screen captures (`data/SOURCES.md`).
- Older UI specs in 10 files that opened the bare atlas now open `#country=spain`, or expect the cover.

## Open
- Clip polish: the slopes clip has grey tile gaps in the top corners and a dark sky band (software GL); the tour clip's first frame is
  mid-flight. Fix: re-run `Tools/atlas/cover_media.mjs` on a real GPU (one small helper run).
- No mp4/H.264 copies: ffmpeg is not installed. iPads before iPadOS 17.4 may show only the poster [A]. `brew install ffmpeg` is the owner's call.
- Size headroom: without video the atlas is 1.96 MB of 2 MB (about 40 KB left).
- Review minors not taken: panel corners .3rem (matches visual-style.md); claims "Every place has a short guide" [R] and "drawn where the
  law puts it" kept.
- Cost [R, agent usage]: mocks 95K + 130K + 156K; builder 160K + 183K (past its 250K card: it hit the turn cap and was resumed); ReviewBot 29K.
- Portugal: main gained Portugal's first two places while this slice ran. The cover shows Spain only (`COVER_COUNTRIES` in
  `src/cards/atlasCover.ts`, the same gate as `SHOWN_COUNTRIES` for Home and Guides) until the owner picks how Portugal appears. When he
  does: drop both gates together, and rewrite the lede "Spain's wine places on a real map." (owner's words).
