#!/usr/bin/env python3
"""One Germany wave (issue #149) on the local route: sources, empty sheets, guides, tree and map. Costs the guides' tokens.

Usage: de_batch.py <run dir> <id> [<id> ...]    e.g. de_batch.py runs/de-wave1 ahr mittelrhein nahe rheinhessen pfalz

Each place is its own group (de-<id>), so headless.py runs once per place. Steps, each a script: de_wset.py --sources and --content
(spec text, source entry, empty sheet), headless.py --sheets (one Sonnet sheet, one Sonnet writer and one Opus checker per place, with
its budget guard), then build_places.py (a place ships once its guide exists) and build_de_areas.py --map. A place with a guide already
is skipped. Stops at the first failing step and says which.
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def step(*cmd):
    print("+", " ".join(cmd), flush=True)
    if subprocess.run([sys.executable, *cmd], cwd=ROOT).returncode:
        raise SystemExit(f"STOP: {cmd[0]} failed")


def main():
    run_dir, ids = sys.argv[1], [i for i in sys.argv[2:] if not (ROOT / f"content/guides/{i}.json").exists()]
    print(f"germany: {len(ids)} places: {' '.join(ids)}", flush=True)
    if not ids:
        return
    step("Tools/countries/de_wset.py", "--sources", *ids)
    step("Tools/countries/de_wset.py", "--content", *ids)
    for pid in ids:
        # Budget 1.0M a guide: the Germany pilot measured 0.73-0.90M (PR #245) and Italy 0.97M; the guard stops a run past 1.5x of it.
        step("Tools/guides/headless.py", "--budget", "1.0", "--sheets", f"de-{pid}", f"{run_dir}/{pid}", pid)
    step("Tools/data/build_places.py")
    step("-I", "Tools/data/build_de_areas.py", "--map")


if __name__ == "__main__":
    main()
