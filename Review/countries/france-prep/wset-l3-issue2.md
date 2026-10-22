# WSET Level 3 Wines: Issue 2 check against the France names table

Source [V]: https://www.wsetglobal.com/media/11731/wset_l3wines_specification_en_highres_may2022_issue2.pdf (linked from https://www.wsetglobal.com/qualifications/wset-level-3-award-in-wines/, labelled "Specification (2022, Issue 2)").
Saved to `data/raw/countries/fr/wset-l3-spec-issue2.pdf` (git-ignored). 281118 bytes, sha256 `1cd76b4b4029c3fba1d60dd45be0aad90b3eb323e935c27d087aaad57600a55d`, 34 pages, PDF created 29 Jun 2022 (QuarkXPress) [V].

## Finding
The file is **byte-identical** to the PDF the current table was built from (same sha256) [V]. It is Issue 2 (May/June 2022): the copyright page lists "Issue 1, 2016 / Issue 1.1, 2017 / Issue 2, 2022" and the page footers read "Issue 2", but the cover and title page still print "Issue No. 1, August 2016" (not updated by WSET) [V]. The qualification page offers no other specification link (only this file and the SAT, `/media/11766/wset_l3wines_sat_en_may2022_issue2.pdf`); no newer issue found [V]. Tries: qualification page, cache-busting query strings (3), two guessed media paths (404) [V].

`diff` of pdftotext output between the old and new file is empty [V].

## Changes against `wset-l3-names.md`
- Added: none [V]
- Removed: none [V]
- Regrouped: none [V]

The earlier "Issue 1" doubt in `wset-l3-names.md` can be corrected: the table already rests on Issue 2 [V].

## Counts per batch (unchanged, counted from the table) [V]
Burgundy 28, Loire 18, Bordeaux 17, Rhône 14, South 10, South-West 6, Beaujolais 6, Champagne 6, Alsace 3. Total 108.

## Register matches for added names
None added, so none needed.
