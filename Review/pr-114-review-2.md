# PR #114 review 2 (commits 5bfdc91, 7653102): About page photos and source strip
Verdict: merge after fixes. 0 blockers, 2 P2, 3 P3. Ran: image sizes. Read: HTML, CSS, SOURCES.md, content. Not run: browser.

## Checked, fine
- Copy: the sentence matches content/guides/rioja.json:53 word for word. The cite "Documento unico PDO-ES-A0117 ... 2014 · p. 5" matches content/sources.json rioja-doc (title, 2014-11-26) and content/facts/rioja.json (rioja-doc:p5). The pliego says "algo superiores a 400 l/m2", so "about 400 mm" holds.
- No crop: all 5 photos and 3 page images have width/height attrs equal to the real pixel size (ran PIL). about.css:9-12 uses height:auto, no object-fit, no aspect-ratio. Column fr (1.3333/.728/.75/.75) equals each ratio, so the row shares one height. Nothing crops his photos.
- Headings: h1 About, then h2, no skip. Contrast: ink3 #6F6860 on white is about 5.4:1; the mark underline is decoration over ink text.
- 390px (CSS read): .letter and .chain go single column at 520px; photos become castle full width plus 3 small whole photos (about 115px each).

## P2
1. about/index.html:75,78 (page-image alt): the alt says "climate passage highlighted" but not what it says. A screen reader user gets no source content, and at 390px the page image (about 350px wide) is unreadable for everyone. Fix: put the quoted passage (Spanish, short English gloss) in the alt or a visually hidden line; mark the empty highlight `<i>` boxes aria-hidden.
2. about/index.html:75,78,81 and data/SOURCES.md:84-86: figcaptions never name the issuer or link the document, and the credit line (index.html:84) covers imagery only. SOURCES.md gives no licence basis for the pliego page ("Official public document" is not one); the EU page should name its reuse basis (Commission reuse decision 2011/833/EU, with attribution). Fix: captions "Consejo Regulador DOCa Rioja, 2023" and "European Commission, eAmbrosia, 2014", each linking the url already in sources.json; name the basis in the SOURCES.md rows, or mark the pliego "owner to confirm". The legal call is the owner's.

## P3
3. index.html:84 the credit "Esri, Maxar" is shorter than the in-app map attribution. Fix: copy the exact map string into the map figcaption (index.html:81) as well as below the strip.
4. index.html:72 the cite link goes to the atlas guide but its text names the EU document, so link and text disagree. Fix: link to the rioja-doc url, or word it "Rioja guide, source: ...".
5. about.css:25 step labels are .75rem uppercase; raise to .8rem. The strip shows the pliego before the EU document while the cite names the EU one; reorder or say why in the lead line.
