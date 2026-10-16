# Release 4 code review (ReviewBot, PR #23, branch claude/release-4-reference-lm0q2o)

Verdict: merge after fixes. Blocking 0, should fix 3, nit 6.
Ran: `npm test` (85 passed) [V]; `npx vite build` and the check.sh size loop: 1,069,563 bytes gzipped, limit 2,000,000 [V]; grep of dist/assets for "fixture": none [V]. UI suite not run (passed on eafeece per card) [R].

## Blocking
None.

## Should fix
1. `src/cards/PlaceFacts.tsx:38` and `src/styles/app.css` (no `.more` rule): the "and N more" button is unstyled and under 44 px. It is a bare browser button inside a `dd`. Also, when clicked it unmounts itself (`open` returns the plain list), so keyboard focus drops to `body` and a screen reader user loses their place. `aria-expanded="false"` is hardcoded and never true. Fix: give `.more` the link styling plus `min-height:2.75rem` (or a padded inline-flex), keep the button mounted as a "Show fewer" toggle with `aria-expanded={open}`, or move focus to the list. [V by read; focus loss inferred A]
2. `src/styles/app.css:121` (`.src a{min-height:0;padding:.35rem 0}`): at .75rem text the source and credit links are about 28 px tall, below the project's 44 px target. They sit one per row, stacked, so adjacent targets are close. WCAG 2.2 AA (2.5.8) passes for inline text, but CLAUDE.md asks for 44 px. Either raise the padding (about .8rem) or record the exception. [A, computed not measured]
3. `.github/workflows/data-photos.yml:17`, `data-photos-ship.yml:21`: `pip install shapely pillow` is unpinned, in jobs that hold a `contents: write` token (checkout persists it) and then run with network access. A bad release of either package runs with write access to the branch. Pin versions (`pillow==x`, `shapely==x`). [R]

## Nits
1. `Tools/data/photo_ship.py:44-47,57`: a failed photo is printed and skipped, so the job ends green with missing photos. Exit non-zero when any key failed, after writing the others. [V by read]
2. `Tools/data/photo_ship.py:38-41`: `alt` is built from the Commons file name with a regex, so it can be an empty string or "Cebreros 2013 foto". `PhotoFigure` renders `alt=""` (decorative) while still showing the credit. Add a unit check that every photo has an alt of at least 3 words, or fall back to "Photo of <place>". The UI test only checks `alt=/.+/`. [A]
3. `src/cards/PlaceFacts.tsx:75-86`: if every photo fails to load, the `<ul class="photos" aria-label>` stays in the DOM, empty, with its .9rem top margin. Hide the list when all are broken (lift the state). [A]
4. `data/photos.json` `page` and `licenceUrl` go straight to `href`. All 149 `page` values start with `https://commons.wikimedia.org/` today [V], but nothing enforces it. Add one unit test so a `javascript:` URL from a future run cannot ship. `licenceUrl` is not rendered. [V]
5. `src/facts/check.ts`: `koppen`, `measures` and `mapa-list` are cited by the UI as fixed ids (`PlaceFacts.tsx:51,56`, `Cards.tsx` level row) but nothing checks they exist in `content/sources.json`. They do exist today [V]. If one is removed, `sourceRefs` drops the source line silently and the "source under every row" promise breaks. Add a test for the three ids.
6. `Tools/check.sh:33-36`: the 2 MB check excludes images, and `dist/photos` is now 26 MB for 149 files, loaded lazily on the place card only. Fine for Pages, but no limit guards it. Consider a per-file cap (the script targets about 150 KB) and a total cap. [V for size]

## Checked, no finding
- checkSheets covers every error on the card: unknown or unquizzed id, wrong region file, duplicate id (also across files, since `seen` is shared), text/grapes/kinds with no cite, bad cite shape and unknown source, unknown style kind, why empty or over 25 words, partial region file. Each has a test with exact message, and boundary 25 words passes. "The real content passes" runs against real files, no weakening: tests are all new files, none of the existing tests changed [V].
- Card order matches the card: why lede, official line, Level and rows, photos, report link, then Study region / Also within / Zones. Empty rows are hidden (`FactRows`), measured rows appear without a sheet, unquizzed places keep the release 3 card [V by read plus UI tests].
- Report link: returns null while `reportAddress === ''`; subject and body are `encodeURIComponent`-encoded, so no header injection [V].
- Photos hide on error, including the credit [V by read].
- Search: grape hits are tier 1, after all name matches, and show "main grape: X"; test "ranks a name match above a grape match" is a real behaviour test [V].
- Security: all external links have `target=_blank rel="noopener noreferrer"`; no `dangerouslySetInnerHTML` anywhere in the diff; workflows pass `github.ref_name` through `env`, interpolate only `run_id` in the shell, and never touch Wikipedia or Commons text in shell; Python runs with `-I` in all three workflows; `contents: write` is the only permission and is needed for the commit step; no secret is printed [V by read].
- Bundle: sheets, sources, measures and photos.json are in the JS bundle (index js 1.2 MB raw); total 1.07 MB gzipped, under the limit [V]. Debug flags stay out of dist [V].
- Tests that mirror implementation: `facts-format.test.ts` (not read in full) is small and format-only; acceptable.

Not checked: Python scripts `measure_places.py`, `photo_candidates.py`, `wiki_grapes.py`, `build_fact_sources.py` beyond a grep for subprocess/eval/shell (none in them); visual layout.

## LeadBot response
- Should fix 1 (the "and N more" button): fixed. It stays mounted and toggles to "Show fewer", aria-expanded follows the state, and it is styled at 44 px. A UI test checks height, focus and state [V, check.sh ui, 26 passed].
- Should fix 2 (source and credit links under 44 px): kept. They are inline links inside a line of text, which WCAG 2.5.8 exempts, and making them 44 px tall would push the rows apart without making them easier to hit. The owner can reopen this.
- Should fix 3 (unpinned pip): fixed, pinned to shapely 2.0.6 and pillow 11.0.0.
- Nits: left for a later release; none changes what a visitor sees today.
