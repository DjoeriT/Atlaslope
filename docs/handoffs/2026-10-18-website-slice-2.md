# Handoff: website slice 2 (18 Oct 2026)

Thread "Website slice 2" (owner go 11:55Z: "OK let's go"; plan `Review/website-plan.md`, slice 2).

## Done
- Home page `index.html` at the root: plain HTML ported from the approved mock `Review/mock-home-v1/`, styles in `src/home/home.css`,
  no map script. Hero and screens are WebP in `public/home/` (listed in `data/SOURCES.md`); the featured guide uses the Rioja Alta photo
  already in `public/photos/`. `tests/unit/home.test.ts` keeps its numbers equal to what the Spain card counts (106 places, 10 regions [V]).
- The atlas moved to `atlas/index.html` (Vite multi-page, `vite.config.ts`). Files in `public/` are reached through `ROOT` (`src/site.ts`).
  Links from before (`/#place=...`, `#quiz`) forward from an inline script in the home page's head.
- Site bar `SiteBar` (`src/app/TopBar.tsx`, `src/styles/site.css`): logo (home), Atlas, Study, search. Replaces the floating brand menu and
  the Explore | Quiz toggle; place and region pages use it too (`PageTop`, with Back to map). The map and its cards sit in `.stage` under it.
- Quiz is Study in every label (`src/strings.ts`) and in the address (`#study`; `#quiz` still parses). Save or load progress is a link
  at the bottom of the Study screen. `atlas/#search` (the home page's Search) focuses the search field.
- Favicon, app icons and share card in black and champagne; the share card (`Tools/share/make_share_image.py`) carries the tagline
  over the hero, as `public/share.jpg` (120 KB; the PNG was 700 KB, too big for chat previews). `robots.txt` lets preview bots read
  `/atlas/`. The live map check and map preview workflows now open `/atlas/`.
- UI tests run against `atlas/` (`playwright.config.ts`); new `tests/ui/home.spec.ts` (home, forwarding, Study address, search).

- Reviews: design check `Review/website-slice-2-design-check.md` and code review `Review/website-slice-2-code-review.md`; the should-fix
  findings are fixed (home search matches the atlas field at 44 px, Study keeps the open card, back-to-Study pill and map menu under the bar,
  dead brand/toggle CSS removed). `Tools/check.sh ui` passed locally (107 UI tests) [V].

## Decided (owner cards)
- 11:56Z: source names, not logos, until MAPA and IGN agree. 11:57Z: Guides and About stay out of the bar until their pages exist;
  the hero's second action is "Start studying" instead of "Browse the guides".
- 11:56Z: also update the favicon and the social-sharing metadata (done in this slice).

## Open
- Slice 3 (static guide pages, `/spain/` index, per-place share cards, sitemap) and slice 4 (About) bring Guides and About into the bar.
- Logos: clean official files and an OK from MAPA and IGN.
- The Study screen's first door is also called "Study" ("Study or review"); fine for now, revisit if it reads oddly.
- Cloud screenshots of the atlas zoomed into Rioja over satellite sometimes miss the place fills (seen again here); the phone and Study shots draw.
- Code folders keep the name quiz (`src/quiz/`, `src/quiz-ui/`), as the plan says.
