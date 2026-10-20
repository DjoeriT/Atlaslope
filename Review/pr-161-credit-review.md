# PR #161 credit review (ReviewBot, code + licence)
Verdict: MERGE. Blockers 0, should fix 0, notes 3.

1. "cropped and resized" [R read guideCount.ts:97-108, guides.css:6,33]: every Guides-page photo (square cards, mosaic) uses object-fit:cover; creditLine is the only photo credit path there. Gated by /^CC BY\b/, so CC BY and CC BY-SA get it; CC0 and Public domain get no change note (correct, none required). The hero branch (guideCount.ts:159) skips the photo credit and shows the satellite caption: no photo shown, so no mismatch. No Guides-page path says only "resized".
 - Note A: a source photo that is already exactly square or 4:3 is not literally cropped; the wording over-states harmlessly (a CC BY change notice may list more than was done). [A]
 - Note B: place-page Credit.tsx:5 still says only "resized"; correct only if place-page photos are not cropped (not checked, out of scope). [A]
2. SOURCES section [R]: [V] tags rest on fetched pages with quotes; the 403 terms page is tagged [A]; Outcome is tagged [A, our reading] and lists the open points (keyless endpoint, "Maxar" vs "Vantor", no IP line). Follows from the quotes. The PNOA line is tagged [V, licence text] but cites a row not in this diff (not re-checked).
 - Note C: the credit string SAT_CREDIT (guideCount.ts:113) says "Esri, Maxar", which SOURCES itself calls outdated; owner decision recorded in the handoff. [R]
3. Nothing wrong found about CC BY-SA, CC0/PD or hero. Counts in data/photos.json: CC BY 28, CC BY-SA 137, CC0 8, PD 3. Unit test updated to the new wording [R, not run].
