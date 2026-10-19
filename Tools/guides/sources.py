#!/usr/bin/env python3
"""Sources step for a region, by script: one status line per place, no agent (route "Run a region locally", step 2).

Usage: sources.py <region> [--fetch]

For each fact sheet in content/facts/<region>.json it takes the source "<id>-doc" (or "<id>-pliego") from content/sources.json,
finds its text under Review/sources/fetched/ (eAmbrosia attachment -> att-*-<n>.txt, EUR-Lex/Cellar -> the oj-*.html whose
fetched URL matches, converted once to .txt; a pliego -> pliego-*-<id>.txt), cuts it with extract.py into
Review/guides-pipeline/<region>/<id>.extract.txt and writes manifest.json beside it. With --fetch a missing eAmbrosia PDF is
fetched and run through pdftotext; a missing EUR-Lex text goes through the Publications Office Cellar (SPARQL on the CELEX
number, then the work's HTML), because EUR-Lex refuses scripts. A place the script cannot do prints "AGENT" and the reason:
only those get a small agent. Why: Mediterranean, 19 Oct 2026, one prep agent took 14.5M tokens over 107 calls.
"""
import html
import json
import re
import subprocess
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FETCHED = ROOT / 'Review/sources/fetched'
SPARQL = 'https://publications.europa.eu/webapi/rdf/sparql'
UA = {'User-Agent': 'atlaslope-sources/1.0'}


def get(url: str, accept: str = '*/*') -> bytes:
    req = urllib.request.Request(url, headers={**UA, 'Accept': accept, 'Accept-Language': 'es'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def html_text(raw: str) -> str:
    raw = re.sub(r'(?is)<(script|style|head)\b.*?</\1>', '', raw)
    raw = re.sub(r'(?i)<br\s*/?>|</(p|div|tr|h\d|li|table)>', '\n', raw)
    raw = re.sub(r'(?i)</t[dh]>', '  ', raw)
    text = html.unescape(re.sub(r'<[^>]+>', '', raw))
    return re.sub(r'\n[ \t]*\n(?:[ \t]*\n)+', '\n\n', text).strip() + '\n'


def cellar_html(celex: str) -> str:
    """The Spanish HTML of a CELEX work, through the Cellar instead of EUR-Lex."""
    q = ('PREFIX cdm: <http://publications.europa.eu/ontology/cdm#> SELECT ?w WHERE { ?w cdm:resource_legal_id_celex '
         f'"{celex}"^^<http://www.w3.org/2001/XMLSchema#string> }} LIMIT 1')
    res = json.loads(get(f'{SPARQL}?{urllib.parse.urlencode({"query": q, "format": "application/sparql-results+json"})}'))
    rows = res['results']['bindings']
    if not rows:
        raise LookupError(f'no Cellar work for CELEX {celex}')
    return get(rows[0]['w']['value'], 'text/html').decode('utf-8', 'replace')


def fetched_by_url(url: str) -> Path | None:
    man = json.loads((FETCHED / 'manifest.json').read_text(encoding='utf-8'))
    for name, v in man.items():
        if url in (v.get('url'), v.get('final_url')):
            hits = [FETCHED / name] if (FETCHED / name).exists() else sorted(FETCHED.glob(name + '.*'))
            if hits:
                return hits[0]
    return None


def text_for(sid: str, src: dict, fetch: bool) -> tuple[Path | None, str]:
    url = src.get('url', '')
    m = re.search(r'/attachments/(\d+)', url)
    if m:
        hits = sorted(FETCHED.glob(f'att-*-{m.group(1)}.txt'))
        if hits:
            return hits[0], 'local'
        pdo = re.search(r'PDO-ES-[A-Z]?\d+', src.get('title', ''))
        if not (fetch and pdo):
            return None, 'eAmbrosia attachment not fetched (run with --fetch)'
        pdf = FETCHED / f'att-{pdo.group(0)}-{m.group(1)}.pdf'
        pdf.write_bytes(get(url, 'application/pdf'))
        subprocess.run(['pdftotext', '-layout', str(pdf), str(pdf.with_suffix('.txt'))], check=True)
        return pdf.with_suffix('.txt'), 'fetched'
    if 'europa.eu' in url:
        hit = fetched_by_url(url)
        if hit and hit.suffix == '.txt':
            return hit, 'local'
        if hit:
            out = hit.with_suffix('.txt')
            if not out.exists():
                out.write_text(html_text(hit.read_text(encoding='utf-8', errors='replace')), encoding='utf-8')
            return out, 'local html -> txt'
        celex = re.search(r'CELEX[:%3A]+([0-9A-Z]+)', url, re.I)
        if not (fetch and celex):
            return None, 'EUR-Lex text not fetched and no CELEX number in the URL'
        out = FETCHED / f'oj-{sid}-{celex.group(1)}.txt'
        out.write_text(html_text(cellar_html(celex.group(1))), encoding='utf-8')
        return out, 'fetched via Cellar SPARQL'
    pid = sid.rsplit('-', 1)[0]
    hits = sorted(FETCHED.glob(f'pliego-*-{pid}.txt'))
    if hits:
        return hits[0], 'local'
    return None, f'no local text for {url[:60]}'


def main() -> None:
    region, fetch = sys.argv[1], '--fetch' in sys.argv
    sheets = json.loads((ROOT / f'content/facts/{region}.json').read_text(encoding='utf-8'))['sheets']
    known = json.loads((ROOT / 'content/sources.json').read_text(encoding='utf-8'))
    out = ROOT / 'Review/guides-pipeline' / region
    out.mkdir(parents=True, exist_ok=True)
    manifest, ok = {'sources': {}}, 0
    for s in sheets:
        pid = s['id']
        sid = next((f'{pid}-{k}' for k in ('pliego', 'doc') if f'{pid}-{k}' in known), None)
        if not sid:
            print(f'AGENT {pid}: no {pid}-pliego or {pid}-doc in content/sources.json')
            continue
        try:
            path, how = text_for(sid, known[sid], fetch)
        except Exception as e:  # a refused host or a bad answer: one line, the place goes to an agent
            path, how = None, f'{type(e).__name__}: {str(e)[:80]}'
        if not path:
            print(f'AGENT {pid} ({sid}): {how}')
            continue
        ext = out / f'{pid}.extract.txt'
        subprocess.run([sys.executable, str(ROOT / 'Tools/guides/extract.py'), str(path), str(ext)], check=True,
                       capture_output=True)
        manifest['sources'][sid] = str(path.relative_to(ROOT))
        pages = path.read_text(encoding='utf-8').count('\f') + 1
        kept = ext.read_text(encoding='utf-8').count('=== PAGE')
        print(f'ok    {pid} ({sid}): {how}, {path.name}, {pages} pages, kept {kept}')
        ok += 1
    (out / 'manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'{ok}/{len(sheets)} places ready in {out.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
