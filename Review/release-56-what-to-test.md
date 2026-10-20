# Release 56: what to test (photo and imagery credits)

Photo credits now say the photos were cropped.
The satellite credit names Vantor, Maxar's new name.

Hard-reload first (Cmd+Shift+R).

1. Open Guides. Under each row of photos, CC BY credits end in "cropped and resized".
2. Open any guide. The cover photo credit ends in "cropped and resized" too.
3. Under each satellite picture (Guides tiles, home, About) the credit reads "Imagery: Esri, Vantor · Spain: PNOA © IGN".
4. On the map, zoom in close. The corner credit names Esri and Vantor.
5. Share atlaslope.com in a chat. The preview's corner says "Esri, Vantor" (chat apps may show the old card for a while).

## For you
- Commits: PR 161 (merge `7c784a3`): `creditLine` and `Credit.tsx` wording, «Esri, Vantor» in six places, `public/share.jpg`
  rebuilt (sips, quality 60, 162 KB), Esri terms section in `data/SOURCES.md`, ReviewBot report `Review/pr-161-credit-review.md` (2 rounds, merge).
- Checks: PR 161's CI on its head (check, scope, UI 1-4 of 4); publish run 39381650049 reused it; unit 314 of 314 locally.
- Live check [V]: atlaslope.com/guides/ shows 11 «Esri, Vantor» and "cropped and resized".
- Not verified: place pages live, Safari, iPad, real phones, link-preview caches.
- Late: this note belonged in PR 161 and came in the docs PR after the release.
