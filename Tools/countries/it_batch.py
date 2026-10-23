#!/usr/bin/env python3
"""One Italy batch (a map group, decisions #70, #80) on the local route: empty sheets, guides, tree and map. Costs the guides' tokens.

Usage: it_batch.py <group> <run dir> [<id> ...]    e.g. it_batch.py it-piemonte runs/piemonte

The places are the group's places in data/countries/it/places.json that have no guide yet (or the ids given). Steps, each a script:
it_wset.py --content (sources and empty sheets; it_wset.py --sources has run for all 87), headless.py --sheets (one Sonnet sheet,
one Sonnet writer and one Opus checker per place, with its budget guard), then build_places.py (a place ships once its guide exists)
and build_it_areas.py --map. Stops at the first failing step and says which.
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def step(*cmd):
    print("+", " ".join(cmd), flush=True)
    if subprocess.run([sys.executable, *cmd], cwd=ROOT).returncode:
        raise SystemExit(f"STOP: {cmd[0]} failed")


def main():
    group, run_dir, ids = sys.argv[1], sys.argv[2], sys.argv[3:]
    places = json.loads((ROOT / "data/countries/it/places.json").read_text())["places"]
    ids = ids or [p["id"] for p in places if p["group"] == group and not (ROOT / f"content/guides/{p['id']}.json").exists()]
    print(f"{group}: {len(ids)} places: {' '.join(ids)}", flush=True)
    if not ids:
        return
    step("Tools/countries/it_wset.py", "--content", *ids)
    # Budget 1.0M a guide: Italy's measured rate (pilot, Piemonte, Tuscany, Veneto, North-East: 0.87-0.94M a guide over 50 guides,
    # 23 Oct 2026), not Portugal's 0.8M; the guard still stops a run past 1.5x of it.
    step("Tools/guides/headless.py", "--budget", "1.0", "--sheets", group, run_dir, *ids)
    step("Tools/data/build_places.py")
    step("-I", "Tools/data/build_it_areas.py", "--map")


if __name__ == "__main__":
    main()
