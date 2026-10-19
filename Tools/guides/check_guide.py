#!/usr/bin/env python3
"""Machine check of a written guide against its sources, before the sentence check.

Usage: check_guide.py <manifest.json> <guide.json> [<guide.json> ...]

The manifest maps a source id (as in content/sources.json) to its text file under the repo, split into pages on form feeds:
{"sources": {"rueda-pliego": "Review/sources/fetched/pliego-PDO-ES-A0889-rueda.txt"}}

Fails (exit 1) on:
- a cite that is not "<id>" or "<id>:p<n>", names a source content/sources.json lacks, or a page the text does not have;
- a chapter with no "beat" or an unknown beat, a beat used twice, or beats out of order;
- exam framing (exam, WSET, Wine Scholar, remember, Study) or talk about the source instead of the place ("the pliego says").
Warns on: a number in a sentence that is not on the pages its block cites as digits (13,000 and 13.000 match; the source
may write it in words or roman numerals, so the sentence check confirms each one), minutes far from words / 200, flights that only go to the place itself.
"""
import json
import re
import sys
from pathlib import Path

BEATS = ['place', 'weather', 'ground', 'rules']
CITE = re.compile(r'^([a-z0-9-]+)(?::p(\d+))?$')
NUM = re.compile(r'\d[\d.,\s]*\d|\d')
BANNED = re.compile(r'\b(exam|wset|wine scholar|remember|study)\b', re.I)
SOURCE_TALK = re.compile(r'\b(the pliego|the rules say|the rulebook|the source|the document)\b', re.I)

root = Path(__file__).resolve().parents[2]
known = json.loads((root / 'content/sources.json').read_text())


def digits(s: str) -> str:
    return re.sub(r'\D', '', s)


def page_nums(text: str) -> set[str]:
    return {digits(m) for m in NUM.findall(text)} | {d for m in NUM.findall(text) for d in re.findall(r'\d+', m)}


def blocks(g: dict):
    """(where, texts, cites) for every cited piece of a guide."""
    yield 'lede', [g['lede']['text']], g['lede']['cite']
    for c in g.get('chapters', []):
        yield c['id'], c['paras'], c['cite']
        for f in c.get('fly', []):
            yield f"{c['id']}/fly {f['label']}", [f['caption']], f['cite']
        for z in c.get('cards', []):
            yield f"{c['id']}/card {z['title']}", [z['climate'], z['wine']], z['fly']['cite']
    if 'label' in g:
        yield 'label', [f"{t['term']}: {t['text']}" for t in g['label']['terms']], g['label']['cite']
    for k, e in (g.get('more') or {}).items():
        yield f'more/{k}', e['paras'], e['cite']


def check(manifest: dict, path: str) -> tuple[list[str], list[str]]:
    g = json.loads(Path(path).read_text())
    errs, warns = [], []
    texts: dict[str, list[str]] = {}
    for sid, f in manifest['sources'].items():
        texts[sid] = (root / f).read_text(encoding='utf-8').split('\f')

    for where, paras, cites in blocks(g):
        if not cites:
            errs.append(f'{where}: no cite')
        pages = []
        for c in cites:
            m = CITE.match(c)
            if not m:
                errs.append(f'{where}: bad cite {c}')
                continue
            sid, p = m.group(1), m.group(2)
            if sid not in known:
                errs.append(f'{where}: {sid} is not in content/sources.json')
            if sid in texts:
                if p and not 1 <= int(p) <= len(texts[sid]):
                    errs.append(f'{where}: {c} is past the end ({len(texts[sid])} pages)')
                elif p:
                    pages.append(texts[sid][int(p) - 1])
        nums = set().union(*(page_nums(t) for t in pages)) if pages else set()
        for para in paras:
            if BANNED.search(para):
                errs.append(f'{where}: exam framing: "{BANNED.search(para).group(0)}"')
            if SOURCE_TALK.search(para):
                errs.append(f'{where}: talks about the source: "{SOURCE_TALK.search(para).group(0)}"')
            if pages:
                for n in NUM.findall(para):
                    if digits(n) not in nums and not all(d in nums for d in re.findall(r'\d+', n)):
                        warns.append(f'{where}: number "{n.strip()}" is not on its cited pages as digits (the sentence check must confirm it)')

    seen = [c.get('beat') for c in g.get('chapters', [])]
    for b in seen:
        if b not in BEATS:
            errs.append(f'chapter beat {b!r} is not one of {BEATS}')
    tagged = [b for b in seen if b in BEATS]
    if len(set(tagged)) != len(tagged):
        errs.append('a beat is used twice')
    if tagged != sorted(tagged, key=BEATS.index):
        errs.append(f'beats out of order: {tagged}')

    words = sum(len(t.split()) for _, ts, _ in blocks(g) for t in ts)
    if abs(g.get('minutes', 0) - max(1, round(words / 200))) > 1:
        warns.append(f'minutes {g.get("minutes")} but {words} words')
    flies = [f for c in g.get('chapters', []) for f in c.get('fly', [])]
    if flies and all(f.get('place') == g['id'] for f in flies):
        warns.append('every flight goes to the place itself')
    return errs, warns


def main() -> int:
    manifest = json.loads(Path(sys.argv[1]).read_text())
    bad = 0
    for path in sys.argv[2:]:
        errs, warns = check(manifest, path)
        print(f'{Path(path).stem}: {"FAIL" if errs else "ok"} ({len(errs)} errors, {len(warns)} warnings)')
        for e in errs:
            print(f'  ERROR {e}')
        for w in warns:
            print(f'  warn  {w}')
        bad += bool(errs)
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
