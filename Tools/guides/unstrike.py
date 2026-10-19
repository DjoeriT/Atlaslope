#!/usr/bin/env python3
"""Write a pliego text without its struck-through words.

Usage: unstrike.py <pliego.pdf> <out.txt>

INCAVI's "control de canvis" PDFs keep deleted rules on the page, struck through. pdftotext keeps those words, so a writer
would cite rules that no longer apply (Cataluña, 19 Oct 2026: Tarragona, Conca de Barberà and Montsant). This drops every
character crossed by a thin line at mid-height and writes pages in the fetched format: a form feed, then "=== PAGE n / N ===".
"""
import sys

import pdfplumber


def struck(c, segs) -> bool:
    mid, h = (c['top'] + c['bottom']) / 2, c['bottom'] - c['top']
    return any(x0 <= c['x0'] + 0.5 and c['x1'] <= x1 + 0.5 and abs(y - mid) < h * 0.3 for x0, x1, y in segs)


def main(src: str, out: str) -> None:
    parts, dropped = [], 0
    with pdfplumber.open(src) as pdf:
        n = len(pdf.pages)
        for i, page in enumerate(pdf.pages, 1):
            segs = [(l['x0'], l['x1'], l['top']) for l in page.lines if abs(l['top'] - l['bottom']) < 1.5]
            segs += [(r['x0'], r['x1'], (r['top'] + r['bottom']) / 2) for r in page.rects if r['height'] < 1.5 and r['width'] > 3]
            gone = {id(c) for c in page.chars if struck(c, segs)}
            dropped += len(gone)
            kept = page.filter(lambda o: o.get('object_type') != 'char' or id(o) not in gone)
            parts.append(f'=== PAGE {i} / {n} ===\n' + (kept.extract_text() or ''))
    open(out, 'w', encoding='utf-8').write('\f'.join(parts) + '\n')
    print(f'{out}: {n} pages, {dropped} struck characters dropped')


if __name__ == '__main__':
    main(*sys.argv[1:3])
