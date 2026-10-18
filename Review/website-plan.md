# AtlaSlope as a website: plan (18 Oct 2026)

Ask [O] (10:47Z, 11:03Z): a persistent top bar, a home page that explains the tool, the tool as its own menu item, and what else.

## Short answer
Yes, with two corrections.
1. The home page is the front door, not the point. What makes this a website (for Google, for sharing, for a student on a phone) is
   that every region and DO gets its own real page at a real address, readable without loading the map: `atlaslope.com/spain/rioja/`.
   Today there is one page, and every shared link shows the same generic card [V: index.html comment on link previews].
2. "For Google" collides with a decision you made: the site is link-only before v1, robots.txt and noindex keep search engines out
   [V: docs/scope.md:92, decision #35]. Going public is a separate call. Build the site now, keep it hidden until Spain has more
   than 4 of 79 Terroir sections [R], otherwise Google's first impression is thin pages.

## Site map
Top bar, black band, same on every page: **logo (home) · search · Atlas · Study · Guides · About** (proposed 11:10Z after his
"Home, Atlas, Study, About?": logo already means home; Atlas and Study are the tool's two modes and replace the floating
Explore | Quiz toggle; Guides lists the place pages). Phone: logo, search icon, Menu.

| Address | What | Loads the map? |
|---|---|---|
| `/` | Home: the atlas as hero, proof, three real screens, one featured guide (see "Home page") | no |
| `/atlas/` | Today's tool, unchanged inside. View state stays in the `#` part (`/atlas/#place=toro&view=...`) | yes |
| `/atlas/#study` | Study: quiz, progress file, later the mastery map; it needs the map, so it lives in the tool | yes |
| `/spain/` | Guides index: every DO grouped by region, travel-listing style, photo per row | no |
| `/spain/rioja/`, `/spain/rioja/rioja-alta/` | The place or region page you already have, as a static page with its own title, description and share card, plus "Open on the map" | no |
| `/about/` | Who made it and why, how to study with it, sources and credits (the data licences require attribution, this gives it one home) | no |

Old links keep working: `atlaslope.com/#place=toro` forwards to `/atlas/#place=toro`.

## Words (owner 11:10-11:12Z)
Each place's page is its **guide** ("the Rioja guide"); the long read on it is the guide's **Terroir** section (src/pages/PlacePage.tsx:182).
The bar item is **Guides**, a listing of every guide. Progress counts Terroir sections written (4 of 79). The existing labels "From the Rioja
guide" and "Back to the guide" (src/strings.ts:187-188) now fit and stay. Earlier "Regions" in this plan means Guides.

Quiz becomes Study across the project (owner 11:11Z): every label people read, docs and tester notes. Rides slice 2, which moves
the Explore | Quiz toggle into the bar as Atlas | Study anyway (11 strings in src/strings.ts [V]). Address `#quiz` becomes `#study`, the old
one forwards. Code folders (`src/quiz/`, `src/quiz-ui/`) keep their names: renaming them buys nothing for users.

## Home page (owner 11:20-11:49Z)
Mock `Review/mock-home-v1/` (approved look; review `Review/home-mock-review.md`, benchmark of ten sites `Review/home-benchmark.md`).
- Salon book look: white page, big Newsreader headline, black and champagne, soft 0.4 rem buttons (owner 11:49Z).
- Tagline "Know the land behind the glass." (card 11:34Z). Sub-line names WSET and Wine Scholar students.
- The atlas itself is the hero, on satellite with Rioja selected, a sourced fact card and a study question on it (card 11:39Z: map, not a photo).
- Proof under the button: 106 places, 10 study regions, every fact sourced. "Free, in your browser, no account."
- Sources strip shows the organisations' logos (owner 11:47Z). Before launch: clean official files and an OK from MAPA and IGN
  (the ministry mark carries Spain's coat of arms; the EU emblem may not suggest endorsement).
- Then three real app screens (atlas, guide, study), one featured guide (Rioja), footer. No pillars, no closing band.
- Competitor to watch: GuildSomm opens on a Rioja DO map. Our edge: satellite, every fact sourced, free.

## What else I propose
- Pages and map link both ways: a page says "Open on the map", a map card says "Read the page". One place, two views.
- One share card per place (its photo and name), so a link to Toro in WhatsApp shows Toro.
- A `sitemap.xml`, generated from the place tree, ready for the day you go public.
- On the atlas the bar stays slim (about 52 px) and the floating brand and search move into it, so the map loses little.
  On a phone the bar is logo plus a menu button.
- Skip: blog, newsletter, accounts, pricing page, cookie banner. None helps a student learn Spain, and some are outward services.

## How (technical default, reversible)
GitHub Pages has no server-side routing, so a real address must be a real file. Default: keep Vite and React, and add a build step
that renders each page to static HTML (`dist/spain/rioja/index.html`) from the same React components the app uses, so the two can't
drift. Home and pages ship without MapLibre (about 0.8 MB of script [R]). Not picked: a single-page app with a 404 fallback (Google
sees a 404), or moving to a framework like Astro (cleaner fit, but rebuilds the pipeline and tests for little gain now).

## Slices (one thread each)
1. **Mock** (this thread, done): home page with the top bar; design check `Review/home-mock-design-check.md`.
2. **Top bar + home + /atlas/ + old-link forwarding.** Small-to-medium; one release.
3. **Static place and region pages + /spain/ index + per-place share cards + sitemap.** The big one; one release.
4. **About** (your words for the "why"; I draft structure only, credits generated from data/SOURCES.md).
5. **Go public**: remove noindex and robots block. Owner card 11:09Z: "Decide later", site stays link-only, no date.

## Context
Static site on GitHub Pages at atlaslope.com, Vite + React + MapLibre, everything in one page today with `#` addresses (src/url.ts).
Black band and champagne land in release 20 (PR #77), the band is meant to become this bar. Content: Rioja and 3 zones have guides;
about 120 places and regions have data and pages [V: 121 ids in data/places.json].

## Upside (measured where possible)
- Addresses: 1 page today, about 120 real pages after slice 3 [V: count above], each with its own title and share card.
- Home and pages load without the map script: first view drops roughly 0.8 MB of JavaScript [R, to re-measure on the build].
- A friend opening a shared Toro link sees Toro's photo and name in the preview, not the generic card. Test case for slice 3.

## Risks
- **Map height**: a bar costs about 52 px on the atlas; mitigated by moving brand and search into it. Check on a 13-inch laptop and phone.
- **Two navigations**: the bar plus the map's own controls can feel busy. The mock must prove it doesn't.
- **Going public costs**: the Esri satellite key has a free quota tied to atlaslope.com [R]; public traffic could hit it. Check quotas before slice 5.
- **Trademarks**: "for WSET and Wine Scholar students" is fine as a description; no WSET or WSG logos, names in titles, or their text (house rule).
- **Old links**: forwarding must keep the map view; covered by a UI test in slice 2.
- **Thin content if public too early**: see slice 5.

## Effort [A, rough]
Mock 0.2 to 0.3 M tokens. Slice 2: 0.4 to 0.6 M. Slice 3: 0.6 to 1.0 M. Slice 4: 0.1 to 0.2 M. Slice 5: nil. Total 1.3 to 2.1 M.
