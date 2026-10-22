#!/usr/bin/env python3
"""Print everything one guide helper needs, so it reads once and writes once (few steps, little re-reading).

Usage:
  pack.py write <region> <id> <source id>   rules + example + fact sheet + pliego extract, for the writer
  pack.py check <region> <id> <source id>   rules + guide + every pliego page in the extract + fact sheet + OSM lookups, for the checker
  pack.py sheet <region> <id> <source id> <page>...   fact sheet + only the pliego pages the checker's sheet notes cite

<region> is the folder in Review/guides-pipeline/ (with manifest.json and <id>.extract.txt) and the name of content/facts/<region>.json
(cataluna, andalucia...). Why: every helper step re-reads its whole context, so Andalucía's checkers re-read about 1.1M cached tokens
each to write 16K (owner 19 Oct 2026, "let's implement the way less steps").
"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GUIDE_SECTIONS = ('What a guide is', 'The page, top to bottom', 'Flights', 'Terroir: how it gets written')


def doc_sections(path: Path, wanted) -> str:
    out, keep = [], False
    for line in path.read_text(encoding='utf-8').splitlines():
        if line.startswith('## '):
            keep = any(line[3:].startswith(w) for w in wanted)
        if keep:
            out.append(line)
    return '\n'.join(out)


FACTS_BRIEF = """Fill this place's fact sheet from the spec below and nothing else (no memory, no other source).
Fields, all in plain English, short, one idea per sentence:
- why.text: one sentence, why the wine tastes the way it does (land and climate first). cite: the pages.
- grapes.main: the grapes the spec names as recommended/main ("castas recomendadas", or the ones it says most wine is made from), as
  [{"local": "<name as the spec spells it>"}]; [] when the spec does not single any out. grapes.others: every other authorised grape.
  cite / othersCite: the pages.
- styles.kinds: from red, white, rose, sparkling, fortified, sweet; styles.text one sentence.
- climate.text, soil.text, altitude.text: what the spec says, with numbers where it gives them; "" and [] when it says nothing.
- tastes.text: the spec's own description of the wines, short.
- famous.styles: up to 4 named styles or labels the spec defines (e.g. Reserva, Garrafeira, Espumante, Colheita Tardia), each
  {"name", "text"} with text at most 15 words giving its rule. producers.items: [] (the spec names none; leave it).
Limits (src/facts/check.ts; batch 1 broke 19 of them): why.text at most 25 words, tastes.text at most 40, at most 4 famous styles,
each famous text at most 15 words.
Every cite is "<source>:p<n>" for a page you read it on. Never invent a number. Translate from Portuguese faithfully.
"""


def sheet(region: str, pid: str) -> str:
    d = json.loads((ROOT / f'content/facts/{region}.json').read_text(encoding='utf-8'))
    s = d['sheets']
    entry = s.get(pid) if isinstance(s, dict) else next((x for x in s if x.get('id') == pid), None)
    return json.dumps(entry, ensure_ascii=False, indent=1)


def osm(guide: dict) -> str:
    """Nominatim point for every flight label, one request a second, a generic User-Agent with no personal details."""
    lines = []
    for ch in guide.get('chapters', []):
        for f in ch.get('fly', []) or []:
            q = f.get('label', '')
            url = 'https://nominatim.openstreetmap.org/search?' + urllib.parse.urlencode(
                {'q': f'{q}, Spain', 'format': 'json', 'limit': 1})
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Atlaslope guide check'})
                hit = json.load(urllib.request.urlopen(req, timeout=20))
                got = f"[{float(hit[0]['lon']):.4f}, {float(hit[0]['lat']):.4f}] {hit[0]['display_name']}" if hit else 'no result'
            except Exception as e:  # network refused: the checker looks it up itself
                got = f'lookup failed ({type(e).__name__})'
            lines.append(f"- {q}: guide has {f.get('point') or f.get('place')}; OSM {got}")
            time.sleep(1.1)
    return '\n'.join(lines) or '(no flights)'


def main() -> None:
    mode, region, pid, source = sys.argv[1:5]
    gp = ROOT / 'Review/guides-pipeline' / region
    tools = ROOT / 'Tools/guides'
    parts = []
    if mode == 'sheet':
        # Cataluña re-check, 19 Oct 2026: sheet helpers loaded the whole pliego and re-read it each step, about 600K tokens per place
        # for 3 or 4 edits. The checker already names the page of each note, so the pack carries only those pages.
        pdf = ROOT / json.loads((gp / 'manifest.json').read_text(encoding='utf-8'))['sources'][source]
        pages = (pdf.read_text(encoding='utf-8')).lstrip('\f').split('\f')
        wanted = sorted({int(n) for n in sys.argv[5:] if 0 < int(n) <= len(pages)})
        parts += [(f'Fact sheet entry "{pid}" (content/facts/{region}.json)', sheet(region, pid))]
        parts += [(f'Pliego page {n}. Cite as "{source}:p{n}"', re.sub(r'[ \t]{2,}', '  ', pages[n - 1]).strip()) for n in wanted]
        print(f'# SHEET PACK: {pid} ({region})\n')
        for title, body in parts:
            print(f'\n\n######## {title}\n\n{body}')
        return
    extract = (gp / f'{pid}.extract.txt').read_text(encoding='utf-8')
    if mode == 'facts':
        # Portugal batch 1, 22 Oct 2026: a new country's places start with an empty sheet; one Sonnet run fills it from the spec
        # (the pilot did this by hand-pasted runs, 0.4-0.5M each). Example: the Douro sheet, checked in the pilot.
        north = json.loads((ROOT / 'content/facts/pt-north.json').read_text(encoding='utf-8'))['sheets']
        parts += [('Brief', FACTS_BRIEF.replace('<source>', source)),
                  ('Example sheet (Douro; copy the shape and the style, never its content)', json.dumps(north[0], ensure_ascii=False, indent=1)),
                  (f'Spec, every page. Cite as "{source}:p<n>"', re.sub(r'[ \t]{2,}', '  ', extract))]
        print(f'# FACTS PACK: {pid} ({region})\n')
        for title, body in parts:
            print(f'\n\n######## {title}\n\n{body}')
        return
    if mode == 'write':
        parts += [('Brief', (tools / 'WRITER.md').read_text(encoding='utf-8')),
                  ('docs/guides.md (the parts a writer needs)', doc_sections(ROOT / 'docs/guides.md', GUIDE_SECTIONS)),
                  ('Example of the shape (copy structure, not wording)', (tools / 'example.json').read_text(encoding='utf-8'))]
    else:
        parts += [('Brief', (tools / 'CHECKER.md').read_text(encoding='utf-8'))]
        gf = ROOT / f'content/guides/{pid}.json'
        # One-shot route (oneshot.workflow.js): the guide is in the checker's prompt, not on disk yet, and oneshot.py checks the
        # flights against OpenStreetMap after the run.
        if gf.exists():
            guide = json.loads(gf.read_text(encoding='utf-8'))
            parts += [(f'The guide, content/guides/{pid}.json', json.dumps(guide, ensure_ascii=False, indent=1)),
                      ('OpenStreetMap lookups for the flights (already done; do not query again unless one failed)', osm(guide))]
    parts += [(f'Fact sheet entry "{pid}" (content/facts/{region}.json)', sheet(region, pid)),
              (f'Pliego, every page a guide may use. Cite as "{source}:p<n>"', re.sub(r'[ \t]{2,}', '  ', extract))]
    print(f'# {mode.upper()} PACK: {pid} ({region})\nManifest for check_guide.py: {gp.relative_to(ROOT)}/manifest.json\n')
    for title, body in parts:
        print(f'\n\n######## {title}\n\n{body}')


if __name__ == '__main__':
    main()
