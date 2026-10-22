# Design check, round 1 (LeadBot, 21 Oct 2026)

Checked against Review/visual-style.md and CLAUDE.md "Style", "Photos hard rule", "Mock language", by screenshot at 1440 and 390 px.

Fixed:
- Scenes (3), desktop: the photo was a small block over a half-empty column; it now fills the column, with larger type.
- Scenes (3), phone: the photo was a thumbnail beside the text; it is now a full-width strip above it.
- "The valley, the soils and the barrel" (an X, Y and Z line, twice) now reads "From the valley to the barrel".
- No sideways scroll at 390 px [V].

Not fixed, for the build:
- Stop 2's sentence is a fragment ("Atlantic. More rain…"); it is the live tour text in content/stories/rioja.json.
- The soils stop shows the bright yellow geology layer; it is the real map layer, loud next to the photos.
- Photo crops are by eye; a build needs checked crops (crop sheet).
- Stills cannot show motion: the picked direction gets a live motion test next.
