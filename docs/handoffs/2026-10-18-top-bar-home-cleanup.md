# Top bar, home and placeholder pages (18 Oct 2026)

Thread "Top bar and home cleanup", owner asks 15:09-15:10Z. Branch `claude/top-bar-home-cleanup-iwlxak`. Big slice (two new pages). Owner 15:28Z: "Publish release 24" [O]. Tester note Review/release-24-what-to-test.md.

## Done
- Bar: 64 px (56 on a phone), 34 px mark, 1.6 rem wordmark, items semibold 1 rem. Items Atlas, Study, Guides, About on every page.
  Search only on the atlas (works in place); removed from the home bar, where it only threw you into the atlas (owner point 1).
  Phone atlas bar keeps mark, search, Atlas, Study; Guides and About wait for a phone menu.
- Placeholder pages `guides/` (the 4 written guides, "Terroir written for 4 of 79") and `about/` (how to study, sources, independence
  line, "Who made it" left for the owner's words). Plain HTML on the home page's styles; added to the build inputs in vite.config.ts.
- Home headline and numbers Newsreader 300 to 400 (visual-style.md updated). Open the atlas is the call to action: 60 px, semibold,
  champagne edge and arrow, and repeated on a black closing band.
- Side space: one 1320 px content column with a 24-64 px gutter (was 1200 px with 24 px). On 1280 px and wider the hero's text column
  ends 640 px past the content edge, so the headline keeps three lines and the atlas takes the rest.
- Copy rewrite (before and after in Review/copy-review-home-2026-10-18.md). "€0" became "Free, in beta, no account".

## Decided
- Owner points 1-5 and the CTA note, 18 Oct 15:09-15:10Z [O].

## Open
- Owner review of the copy and the first look. About's "Who made it" needs his words.
- "Free, in beta" tells visitors pricing may come later; his call whether that is the message.
- Privacy page (docs sweep, route privacy/) gets a link from About and the footer once it exists; kept out until then (no dead link).
- Guides placeholder is at `/guides/`; the website plan put the guides index at `/spain/` (slice 3 decides).

## Where
- Screens: /mnt/project-files/atlaslope/mocks/top-bar-cleanup/.
