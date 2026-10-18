# Polish pack (18 Oct 2026)

Thread "Polish pack", branch `claude/polish-pack-uy8nb0`. From the cutting-edge UI research (ideas 2, 3 and 4; owner card 06:18Z "Both, polish first").
Small slice, lean process. Planned as release 19 (the Explore quiz fix, PR #72, is lined up as 18); the number is whatever ships next.

## Done
- **Photos in the right size, with blur-up.** `Tools/data/photo_sizes.py` makes 160, 480 and 800 px copies of every photo in
  `public/photos/<w>/` and `data/photo-sizes.json` (full size plus a 16 px WebP preview per photo, 13 KB gzipped). `photosOf` gives a
  `srcSet` and `blur`; `src/cards/Img.tsx` renders every shipped photo with `srcset`, the slot's `sizes`, the blurred preview as its
  background, and a short sharpen-in (none for cached photos or under reduced motion). The photo workflow runs the script after each ship;
  `tests/unit/photo-sizes.test.ts` fails while a copy or preview is missing. Phones load only the first mosaic photo (the rest are lazy and hidden).
- **Type.** Newsreader is one variable font with the optical-size axis (`public/fonts/newsreader-latin-opsz-normal.woff2`, @fontsource-variable 5.3.0,
  OFL, 132 KB, preloaded), `font-optical-sizing:auto`. Headings `text-wrap:balance`, reading text `pretty`. Drop cap (two lines, accent colour,
  `initial-letter` with a float fallback) on the guide's opening paragraph (`.pg-lede`). Static files stay for the map glyph builder.
- **Scroll-linked motion** (`pages.css`, end): cover photos drift slower than the page, the region title lifts away, the page name slides into
  the bar beside the logo (desktop, 64em and up), and an accent progress line under the bar. CSS scroll timelines only, inside
  `@supports` and `prefers-reduced-motion:no-preference`. `.rcover` uses `overflow:clip` there, since `hidden` made it the title's scroller.

## Decided
- Not in this slice: the Explore Today card (owned by the "Quiz showing in Explore" thread, PR #72), quiz springs and map pulse (idea 5).

## Open
- Not verified: real Safari (26 has scroll timelines; older Safari and Firefox simply show no motion), iPad, phone hardware.
- Region tiles and mosaic still download the 1200 px file on 2x screens where the slot needs it; that is intended.
- Next: the story-guide mock, in a new thread the coordinator starts once this is live.
