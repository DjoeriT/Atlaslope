# Polish slice: icons and missing photos (17 Oct 2026)

## Done
- Favicon and Home Screen icon now use the vineyard-slope logo in the release 8 colours (white and wine light, gold on black dark).
  Owner card 12:05Z, "Mix": `public/favicon.svg` and `favicon-32.png` are a bolder 4-row slope that stays readable at 16 px;
  `apple-touch-icon.png` (180 px) and the new install icons `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` copy the 5-row header
  logo. The manifest had no icons before; a UI test checks they resolve. First look: `/mnt/project-files/atlaslope/polish/icons-first-look.png`.
- Photos (#42): a category pass (`photo_candidates.py cats`, run in GitHub Actions because Commons throttles the container) walked
  hand-picked Commons categories for the 4 quizzed places without a photo. Picked: Jerez 3, Ribera del Guadiana 3, Manzanilla 1
  (flor in a cask; no open vineyard photo of Sanlúcar). Preview: `/mnt/project-files/atlaslope/polish/photo-picks.png`.

## Decided
- Icon "Mix" [O, card 12:05Z].

## Open
- Txakoli de Álava: 376 files seen in its categories, none kept (no vine photo naming Aiara, Amurrio, Okondo or Llodio). Stays empty.
- The other 26 places in #42 are not quizzed (mostly Vinos de Pago) and stay without photos; 17 quizzed places have only one photo
  and 15 still lead with an off-topic photo (audit `/mnt/project-files/atlaslope/photo-pass/2026-10-17-audit.md`).
- iOS ignores theme for Home Screen icons, so the Home Screen icon is always the wine version.

## Where things are
- Category list per place: `CATS` in `Tools/data/photo_candidates.py`; results `Review/sources/photo-candidates-cats.json` and
  `Review/sources/contact-sheets/cats-*.jpg`; picks in `Review/sources/photo-picks.json`.
