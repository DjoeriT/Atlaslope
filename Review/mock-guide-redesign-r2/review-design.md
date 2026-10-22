# Design review: guide redesign r1 (22 Oct 2026, ReviewBot)

Verdict: fix first. 0 blocker, 4 major, 5 minor. Read the 4 contact sheets, ran two small Playwright scripts (hub toggles, button clicks, D measurements). No re-shoot.

## Major
1. D, 1440, big-number rows: "63,593 ha" (x 1084-1376, scrollWidth > clientWidth) and "60 months" (x 744-1036, scrollWidth > clientWidth) are wider than their 292 px column at 86 px type; "60 months" runs into "2017" (starts x 1084). Fix: size numbers to the column (clamp, or unit on a second line). [V]
2. D, 1440, sideways overflow: document scrollWidth 1455 vs 1440 (solo); 1417 vs 1390 inside the hub frame. Hidden by `overflow-x:clip` on body, so the cause (the big-number rows) remains. 390: 390, no overflow. Fix: remove the cause, keep the clip as a backstop. [V]
3. B, C, D, 1440, photos: every image is the app's 800 px file shown at 1440 wide (full-bleed hero, beat photos 1440 and 720 wide; D 12 images 800/1440, 800/720 ...). Soft at desktop. Fix: use larger sources for hero and full-bleed photos, or cap full-bleed photos at about 800 px wide. [V for D, read for B/C]
4. A, B, D, photo button: it does not open that option's map. It scrolls the hub to option C (C top at y 72) and opens C's map: the viewer leaves the option being judged. Tested A, B, D: all three land on C with the map open (after 4.5 s). Fix: say so on the button in the mock ("works in C only"), or keep the viewer in place and show a note. [V]

## Minor
5. Sierra de Cantabria photo twice in A, B and C (button/hero and the beat 1 stop photo). Fix: use a different hero or drop the repeat. [V from sheets]
6. Phone fold-back (C) lands on a stop card, not the paragraph. Fix: add a text twin or document the fallback. [A, from the builder, not re-run]
7. C phone, map mode: the top band wraps "Back to Rioja" over two lines next to "Close the map". Fix: shorten or stack. [V, screenshot after-a]
8. D, Marqués de Murrieta heading is 144 px; the text fits (no overflow measured) but is very large next to everything else; at 390 it wraps to two lines at 51 px. Check taste only. [V]
9. D and B, 1440 start of page: the title ("Rioja" in B) sits below the hero photo and is cut at the fold. Fix: title above the fold. [read, sheet-b]

## Confirmed with numbers
- Hub toggle: all four options, Desktop and Phone: frame resizes (1392 desktop, 410 phone), iframe 1390 or 390 wide, no sideways scroll at phone (docScrollW 390), hub scrollWidth 1440 = no hub scroll. Only D desktop has docScrollW 1417 > 1390 (finding 2). [V]
- Pages hold every section in all four sheets (read). No drawn icons, no text on photos, one credit line per set seen (read, sheets too small to read credit text).
## Not checked
Credit wording, photo crops at face level, large-text and reduced-motion beyond the README claims.
