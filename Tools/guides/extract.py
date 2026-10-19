#!/usr/bin/env python3
"""Cut a pliego text down to what a guide uses, keeping page numbers.

Usage: extract.py <pliego.txt> <out.txt>

Pages are split on form feeds (pdftotext); page n is the PDF page. Each kept page starts with "=== PAGE n ===" so a writer can
cite "<source>:p<n>". Kept: from section 1 (NOMBRE) up to section 9 (VERIFICACIÓN), the control-body part a guide never uses.
Gazette preambles before section 1 are dropped. If no section 1 is found, every page is kept.
"""
import re
import sys

START = re.compile(r'^\s*(?:1|A)[.)]?\s*(?:NOMBRE|DENOMINACI[ÓO]N)', re.I | re.M)
STOP = re.compile(r'^\s*(?:9|I)[.)]?\s*VERIFICACI[ÓO]N', re.I | re.M)


def pages(text: str) -> list[str]:
    parts = text.split('\f')
    return [re.sub(r'^=== PAGE .*$', '', p, flags=re.M) for p in parts]


def main(src: str, out: str) -> None:
    ps = pages(open(src, encoding='utf-8').read())
    first = next((i for i, p in enumerate(ps) if START.search(p)), 0)
    last = next((i for i, p in enumerate(ps) if i >= first and STOP.search(p)), len(ps) - 1)
    kept = []
    for i in range(first, last + 1):
        body = ps[i]
        if i == last and STOP.search(body):
            body = body[: STOP.search(body).start()]
        body = re.sub(r'[ \t]{2,}', '  ', body).strip()
        if body:
            kept.append(f'=== PAGE {i + 1} ===\n{body}')
    open(out, 'w', encoding='utf-8').write('\n\n'.join(kept) + '\n')
    words = sum(len(k.split()) for k in kept)
    print(f'{out}: pages {first + 1}-{last + 1} of {len(ps)}, {words} words')


if __name__ == '__main__':
    main(*sys.argv[1:3])
