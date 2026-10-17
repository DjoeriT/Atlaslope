# Logo, favicon and tab title (17 Oct 2026)

## Done
- Three logo directions drafted on the real app header (topo drop, vineyard slope, serif A) and three title patterns.
- The owner picked the vineyard slope ("the slope itself. My favourite") and place-first titles (05:33Z) [O].
- Built: `public/favicon.svg` (a simpler three-row slope that stays readable at 16 px; wine tile on light tab bars, gold on dark ones),
  `public/favicon-32.png` fallback, `public/apple-touch-icon.png` (180 px, full detail), the mark in the header (`TopBar.tsx`, theme colours
  from `--accent` and `--accent-ink`), and the tab title from the open card (`App.tsx`, wording in `strings.ts`).
- Tests: tab title follows the walk; favicon links resolve; header mark is decorative (`tests/ui/cards.spec.ts`). The old title check in
  `placeholder.spec.ts` now expects the new home title.

## Decided
- Home title "Atlaslope · The wine atlas that quizzes you"; place and region titles "<name> · Atlaslope" [O].

## Open
- The home title promises a quiz; the quiz goes live with release 7. If this ships first, the tagline runs ahead by one release.
- No share preview (og:title, og:image) yet for links sent in chat apps; not asked for.

## Where things are
- Draft marks, the first-look sheet and the final preview: `/mnt/project-files/atlaslope/mocks/brand/`.
