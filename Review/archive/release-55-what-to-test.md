# Release 55: what to test (square photos on the Guides page)

Every guide card on the Guides page now has a square photo.
Each crop was checked so the subject stays in.

Hard-reload first (Cmd+Shift+R).

1. Open Guides. All guide cards in a row are the same size, with square photos.
2. Look at Arlanza and Lebrija. Each tower is in the square.
   Binissalem shows its bell tower. Méntrida shows the grapes.
3. Cards without a photo are squares too.
4. The showcased guide at the top and the region satellite tiles look as before.
5. On a phone, scroll the whole page. Nothing scrolls sideways.

## For you
- Commits: square photo cards (PR 144): CSS, `src/home/photoFocus.json` (5 of 49 off-centre), photo rule in CLAUDE.md, records.
- Checks: PR 144's CI run on its head commit (check, scope, UI 1-4 of 4); builder ran unit home + guides 23 of 23, UI home 6 of 6, build.
- Crops: all 49 checked against originals by LeadBot; no face, glass or bottle in any of them.
- Not verified: Safari, iPad, real phones.
