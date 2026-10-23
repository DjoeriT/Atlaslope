#!/usr/bin/env python3
"""Apply the Opus checker's unsure fact sheet edits that LeadBot has reviewed (France batches, 22 Oct 2026).

Usage: apply_unsure.py <region> <run dir> [<id> ...]   (no ids: every unsure edit in the run)

headless.py applies the checker's sure edits and logs the unsure ones in Review/guides-pipeline/<region>/fact-sheet-fixes.md, with
the value cut to 200 characters. LeadBot reads each against the quoted page first; this script then applies the full value from the
run's results.jsonl the way headless.apply_sheet does, so no edit is retyped by hand.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'Tools/guides'))
from oneshot import set_path  # noqa: E402


def main() -> None:
    region, run_dir, only = sys.argv[1], Path(sys.argv[2]), set(sys.argv[3:])
    fp = ROOT / f'content/facts/{region}.json'
    facts = json.loads(fp.read_text(encoding='utf-8'))
    sheets = {s['id']: s for s in facts['sheets']}
    done = 0
    for line in open(run_dir / 'results.jsonl', encoding='utf-8'):
        r = json.loads(line)
        if not r.get('label', '').startswith('check ') or not r.get('result'):
            continue
        pid = r['label'][6:]
        if only and pid not in only:
            continue
        for e in r['result'].get('sheet', []):
            if e.get('sure'):
                continue
            value = json.loads(e['value'])
            if e['path'] == 'grapes.main':  # as headless.apply_sheet: main grapes are { local } objects
                value = [g if isinstance(g, dict) else {'local': g} for g in value]
            set_path(sheets[pid], e['path'], value, json.loads(e['cite']) if e['cite'] else None)
            done += 1
            print(f'applied {pid} {e["path"]}')
    fp.write_text(json.dumps(facts, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'{done} unsure edits applied to {fp.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
