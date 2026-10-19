# Guide page: Show map button (19 Oct 2026)

Done: on wide screens the top "‹ Map" link on guide and region pages is an outlined "Show map" button with the map icon (`src/pages/PageTop.tsx`, `src/styles/motion.css` `.pg-back`), PR #118, release 46.
Decided: owner meant the top "‹ Map", not the in-text fly-there links; a first try restyling those as buttons was rejected ("not good, revert") and reverted in the same PR. The fly-there links keep the link style of owner point 14.
Lesson: when the owner names a UI element vaguely, screenshot the candidates and ask in one line before building (cost one round trip here).
Open: nothing.
