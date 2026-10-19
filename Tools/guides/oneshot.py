#!/usr/bin/env python3
"""Write what the one-shot guide helpers returned (Tools/guides/oneshot.workflow.js), so helpers never touch files.

Usage: oneshot.py apply <region> <workflow transcript dir>

For every checked place: content/guides/<id>.json (the checker's corrected guide), Review/guides-check/<id>.md (its log), the sure
fact sheet edits applied to content/facts/<region>.json and logged in Review/guides-pipeline/<region>/fact-sheet-fixes.md, the
unsure ones listed for the thread. Then check_guide.py on the new guides, and every flight point against OpenStreetMap (a point
more than 5 km off is printed). Prints a short report only. Why: Baleares pilot, 19 Oct 2026; Cataluña's sheet helpers cost about
600K tokens each for 3 or 4 edits a script can make.
"""
import json
import math
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def results(wf: Path) -> dict:
    """label -> the agent's structured result, from the run's journal."""
    labels, out = {}, {}

    def find(v):
        if isinstance(v, dict):
            if 'guide' in v:
                return v
            for x in v.values():
                r = find(x)
                if r:
                    return r
        return None
    for line in (wf / 'journal.jsonl').read_text(encoding='utf-8').splitlines():
        d = json.loads(line)
        if d.get('type') == 'started':
            labels[d.get('agentId')] = d.get('label')
        r = find(d)
        if r and d.get('agentId') in labels:
            out[labels[d['agentId']]] = r
    return out


def set_path(entry: dict, path: str, value, cite):
    keys = path.split('.')
    node = entry
    for k in keys[:-1]:
        node = node.setdefault(k, {})
    node[keys[-1]] = value
    if cite and isinstance(node, dict) and keys[-1] != 'cite':
        node['cite'] = cite


def osm(label: str):
    url = 'https://nominatim.openstreetmap.org/search?' + urllib.parse.urlencode({'q': f'{label}, Spain', 'format': 'json', 'limit': 1})
    try:
        hit = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Atlaslope guide check'}), timeout=20))
        return (float(hit[0]['lon']), float(hit[0]['lat'])) if hit else None
    except Exception:
        return None
    finally:
        time.sleep(1.1)


def km(a, b):
    dx = (a[0] - b[0]) * 111.3 * math.cos(math.radians(a[1]))
    return math.hypot(dx, (a[1] - b[1]) * 111.3)


def main(region: str, wf: Path) -> None:
    got = results(wf)
    facts_p = ROOT / f'content/facts/{region}.json'
    facts = json.loads(facts_p.read_text(encoding='utf-8'))
    sheets = facts['sheets']
    fixes = [f'\n## One-shot run {wf.name}']
    written = []
    for label, c in sorted(got.items()):
        if not label.startswith('check '):
            continue
        pid = label[6:]
        guide = json.loads(c['guide'])
        gp = ROOT / f'content/guides/{pid}.json'
        gp.write_text(json.dumps(guide, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
        (ROOT / f'Review/guides-check/{pid}.md').write_text(c['log'].rstrip() + '\n', encoding='utf-8')
        written.append(str(gp.relative_to(ROOT)))
        entry = next(s for s in sheets if s.get('id') == pid) if isinstance(sheets, list) else sheets[pid]
        fixes.append(f'\n### {pid}')
        for e in c['sheet']:
            if not e['sure']:
                fixes.append(f'- UNSURE, not applied: `{e["path"]}`: {e["why"]}')
                print(f'UNSURE {pid} {e["path"]}: {e["why"]} -> {e["value"][:160]}')
                continue
            set_path(entry, e['path'], json.loads(e['value']), json.loads(e['cite']) if e['cite'] else None)
            fixes.append(f'- applied `{e["path"]}`: {e["why"]}')
            print(f'APPLIED {pid} {e["path"]}: {e["why"][:160]}')
        print(f'{pid}: KEEP {c["keep"]} FIX {c["fix"]} CUT {c["cut"]}; serious: {c["serious"]}')
        for ch in guide.get('chapters', []):
            for f in ch.get('fly', []) or []:
                if f.get('point'):
                    o = osm(f.get('label', ''))
                    d = km(f['point'], o) if o else None
                    if d is None or d > 5:
                        print(f'FLIGHT {pid} "{f.get("label")}" {f["point"]}: OSM {o} ({"no hit" if d is None else f"{d:.0f} km off"})')
    facts_p.write_text(json.dumps(facts, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    log = ROOT / f'Review/guides-pipeline/{region}/fact-sheet-fixes.md'
    log.write_text((log.read_text(encoding='utf-8') if log.exists() else f'# Fact sheet fixes, {region}\n') + '\n'.join(fixes) + '\n',
                   encoding='utf-8')
    manifest = f'Review/guides-pipeline/{region}/manifest.json'
    r = subprocess.run(['python3', 'Tools/guides/check_guide.py', manifest, *written], cwd=ROOT, capture_output=True, text=True)
    print((r.stdout + r.stderr).strip()[-3000:])


if __name__ == '__main__':
    if sys.argv[1:2] != ['apply'] or len(sys.argv) != 4:
        sys.exit(__doc__)
    main(sys.argv[2], Path(sys.argv[3]))
