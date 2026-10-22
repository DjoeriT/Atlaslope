#!/usr/bin/env python3
"""Write and check guides outside the chat: one fresh headless `claude -p` run per helper (route "Run a region locally", step 3).

Usage: headless.py [--budget <M>] [--sheets] <region> <run dir> <id> [<id> ...]   (--sheets: a Sonnet run fills each empty fact sheet first)

Per place, one after another: a Sonnet writer (pack.py write, check_guide.py) and an Opus sentence checker (pack.py check) that
returns fact sheet disagreements as ready edits; the script applies the sure ones (oneshot.py's set_path) and logs all of them in
fact-sheet-fixes.md. The prompts follow region.workflow.js, its cloud twin. Each run's transcript is copied to <run dir>/agent-<n>.jsonl with a journal.jsonl beside it,
so `usage.py --budget <M> --places <N> <run dir>` measures it; each run's structured result goes to <run dir>/results.jsonl.
Prints one line per helper and stops (exit 1) when usage.py says the run is past 1.5x budget (--budget, default 0.8M per place).
Why: on the workflow route the session around the helpers re-read 10-21M tokens per region (Ebro, Mediterranean, 19 Oct 2026).
"""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROJECTS = Path.home() / '.claude/projects' / str(ROOT).replace('/', '-')
MODELS = {'sonnet': 'claude-sonnet-5-5', 'opus': 'claude-opus-5-5'}
TOOLS = ['Read', 'Write', 'Edit', 'Bash(python3 Tools/guides/pack.py:*)', 'Bash(python3 Tools/guides/check_guide.py:*)',
         'Bash(grep:*)']

SAFETY = ('Never put a name, email address or any personal detail in a request header, User-Agent or URL. '
          'Do not commit or push. Touch only the files this prompt names.')
FEW = ('Work in as few steps as you can: every step re-reads all you have seen, so take one long step instead of many short ones. '
       'Do not open other files or look anything up unless the pack lacks it.')

WRITE = {'type': 'object', 'required': ['ok', 'words', 'warnings', 'note'], 'properties': {
    'ok': {'type': 'boolean'}, 'words': {'type': 'number'}, 'warnings': {'type': 'number'}, 'note': {'type': 'string'}}}
CHECK = {'type': 'object', 'required': ['keep', 'fix', 'cut', 'ok', 'serious', 'sheet'], 'properties': {
    'keep': {'type': 'number'}, 'fix': {'type': 'number'}, 'cut': {'type': 'number'}, 'ok': {'type': 'boolean'},
    'serious': {'type': 'string'}, 'sheet': {'type': 'array', 'description': 'fact sheet fields the pliego contradicts, each as a ready edit',
        'items': {'type': 'object', 'required': ['path', 'value', 'cite', 'why', 'sure'], 'properties': {
            'path': {'type': 'string', 'description': 'dot path in the sheet entry, e.g. "climate.text" or "grapes.others"'},
            'value': {'type': 'string', 'description': "the new value as JSON text (a string in quotes, an array, an object), in the sheet's style"},
            'cite': {'type': 'string', 'description': 'JSON array of cites for the sibling "cite" field, e.g. ["<source>:p6"], or "" to leave it'},
            'why': {'type': 'string', 'description': 'sheet says X, pliego says Y, page'},
            'sure': {'type': 'boolean', 'description': 'false when the page does not plainly settle it'}}}}}}
FACTS = {'type': 'object', 'required': ['sheet', 'note'], 'properties': {
    'sheet': {'type': 'string', 'description': 'the whole fact sheet entry as JSON text, with "id" and every field of the example'},
    'note': {'type': 'string', 'description': 'one line: anything the spec left unclear'}}}


def facts_prompt(region, pid, src):
    return f'''Fill the fact sheet for "{pid}" (region {region}).
Step 1: run `python3 Tools/guides/pack.py facts {region} {pid} {src}`. It prints your brief, an example sheet and every page of the spec.
Step 2: return the sheet entry as JSON text in "sheet". Do not write any file. {FEW} {SAFETY}'''


def put_sheet(region: str, pid: str, text: str) -> None:
    """Puts a filled sheet in place of the empty one (Tools/data/pt_batch.py makes those); keys outside the example are refused."""
    fp = ROOT / f'content/facts/{region}.json'
    facts = json.loads(fp.read_text(encoding='utf-8'))
    new = json.loads(text)
    old = next(e for e in facts['sheets'] if e['id'] == pid)
    if new.get('id') != pid or set(new) - set(old):
        raise ValueError(f'sheet for {pid} has id {new.get("id")} or unknown keys {set(new) - set(old)}')
    facts['sheets'] = [new if e['id'] == pid else e for e in facts['sheets']]
    fp.write_text(json.dumps(facts, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')


def write_prompt(region, pid, src, manifest):
    return f'''Write the Terroir guide for "{pid}" (region {region}).
Step 1: run `python3 Tools/guides/pack.py write {region} {pid} {src}`. It prints your brief, the format rules, the example,
the fact sheet and the pliego. Step 2: write content/guides/{pid}.json in one write. Step 3: run
`python3 Tools/guides/check_guide.py {manifest} content/guides/{pid}.json` once and fix any ERROR in one edit.
Flights: a "place" id must exist in data/places.json (one grep for all of them), otherwise use a point. {FEW}
Write content/guides/{pid}.json and nothing else. {SAFETY}'''


def check_prompt(region, pid, src, manifest):
    return f'''Check content/guides/{pid}.json sentence by sentence (source id "{src}").
Step 1: run `python3 Tools/guides/pack.py check {region} {pid} {src}`. It prints your brief, the guide, every pliego page,
the fact sheet and the OpenStreetMap points for the flights. Step 2: decide every verdict, then write the corrected guide in one write
and write Review/guides-check/{pid}.md in one write. Step 3: run `python3 Tools/guides/check_guide.py {manifest} content/guides/{pid}.json`
once and fix any ERROR. Do not edit the fact sheet: return its disagreements in "sheet" as ready edits (a script applies the sure
ones), only what the page plainly says, in the sheet's existing style; a famous-style text stays at 15 words or fewer. {FEW} {SAFETY}'''


def run(run_dir: Path, n: int, label: str, model: str, prompt: str, schema: dict):
    cmd = ['claude', '-p', prompt, '--model', MODELS[model], '--output-format', 'json', '--json-schema', json.dumps(schema),
           '--permission-mode', 'acceptEdits', '--strict-mcp-config', '--allowedTools', *TOOLS]
    p = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=3600)
    try:
        out = json.loads(p.stdout)
    except json.JSONDecodeError:
        out = {'is_error': True, 'result': (p.stdout or p.stderr)[-300:]}
    sid = out.get('session_id')
    if sid and (PROJECTS / f'{sid}.jsonl').exists():
        shutil.copy(PROJECTS / f'{sid}.jsonl', run_dir / f'agent-{n}.jsonl')
    with open(run_dir / 'journal.jsonl', 'a') as j:
        j.write(json.dumps({'type': 'started', 'agentId': str(n), 'label': label}) + '\n')
    res = out.get('structured_output')
    with open(run_dir / 'results.jsonl', 'a') as r:
        r.write(json.dumps({'label': label, 'session': sid, 'turns': out.get('num_turns'), 'error': out.get('is_error'),
                            'result': res if res is not None else str(out.get('result'))[-300:]}, ensure_ascii=False) + '\n')
    short = json.dumps(res, ensure_ascii=False)[:160] if res is not None else f"NO RESULT: {str(out.get('result'))[-160:]}"
    print(f'{label}\tturns {out.get("num_turns")}\t{short}', flush=True)
    return res


def apply_sheet(region: str, pid: str, edits: list, gp: str) -> None:
    """The checker's sure fact sheet edits, applied by script (Meseta pilot, 19 Oct 2026: an Opus sheet run cost ~0.37M a place)."""
    from oneshot import set_path
    fp = ROOT / f'content/facts/{region}.json'
    facts = json.loads(fp.read_text(encoding='utf-8'))
    entry = next(e for e in facts['sheets'] if e['id'] == pid)
    lines = [f'\n## {pid}']
    for e in edits:
        try:
            if not e['sure']:
                raise ValueError('unsure')
            value = json.loads(e['value'])
            if e['path'] == 'grapes.main':  # main grapes are { local, grape? } objects, never plain names (Meseta batch 1)
                value = [g if isinstance(g, dict) else {'local': g} for g in value]
            set_path(entry, e['path'], value, json.loads(e['cite']) if e['cite'] else None)
            lines.append(f'- applied `{e["path"]}`: {e["why"]}')
        except (ValueError, KeyError, IndexError, TypeError, AttributeError) as err:  # one bad edit is logged, not fatal
            lines.append(f'- NOT applied ({err}) `{e.get("path")}`: {e.get("why")} -> {str(e.get("value"))[:200]}')
        print(f'  sheet {pid} {lines[-1][2:120]}')
    fp.write_text(json.dumps(facts, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    log = ROOT / gp / 'fact-sheet-fixes.md'
    log.write_text((log.read_text(encoding='utf-8') if log.exists() else f'# Fact sheet fixes, {region}\n') + '\n'.join(lines) + '\n',
                   encoding='utf-8')


def over_budget(run_dir: Path, budget: float, places: int) -> bool:
    p = subprocess.run([sys.executable, str(ROOT / 'Tools/guides/usage.py'), '--budget', str(budget), '--places', str(places),
                        str(run_dir)], capture_output=True, text=True)
    if p.returncode:
        print(p.stdout.strip().splitlines()[-1])
    return p.returncode != 0


def main() -> None:
    args = sys.argv[1:]
    budget = 0.8
    if args[:1] == ['--budget']:
        budget, args = float(args[1]), args[2:]
    sheets = args[:1] == ['--sheets']  # fill empty fact sheets first (a new country's places, Portugal batch 1)
    if sheets:
        args = args[1:]
    region, run_dir, ids = args[0], Path(args[1]), args[2:]
    run_dir.mkdir(parents=True, exist_ok=True)
    gp = f'Review/guides-pipeline/{region}'
    manifest = f'{gp}/manifest.json'
    sources = json.loads((ROOT / manifest).read_text())['sources']
    n = len(list(run_dir.glob('agent-*.jsonl')))
    for pid in ids:
        src = next(s for s in sources if s.rsplit('-', 1)[0] == pid)
        if sheets:
            n += 1
            f = run(run_dir, n, f'sheet {pid}', 'sonnet', facts_prompt(region, pid, src), FACTS)
            try:
                put_sheet(region, pid, f['sheet'])
            except (TypeError, ValueError, KeyError) as err:
                print(f'STOP {pid}: sheet not usable ({err})')
                sys.exit(1)
        n += 1
        w = run(run_dir, n, f'write {pid}', 'sonnet', write_prompt(region, pid, src, manifest), WRITE)
        if not w:
            print(f'STOP {pid}: writer returned nothing')
            sys.exit(1)
        n += 1
        c = run(run_dir, n, f'check {pid}', 'opus', check_prompt(region, pid, src, manifest), CHECK)
        if c and c.get('sheet'):
            apply_sheet(region, pid, c['sheet'], gp)
        done = sum(1 for l in open(run_dir / 'journal.jsonl') if '"label": "write ' in l)  # every place in the run dir
        if over_budget(run_dir, budget, done):
            print(f'STOP after {pid}: past 1.5x budget')
            sys.exit(1)
    print(f'done: {len(ids)} places, transcripts in {run_dir}')


if __name__ == '__main__':
    main()
