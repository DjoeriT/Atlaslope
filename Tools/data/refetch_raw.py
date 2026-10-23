#!/usr/bin/env python3
"""Fetch again whatever is missing from the raw folder (Tools/rawdir.py: ~/Developer/Atlaslope-raw or $ATLASLOPE_RAW).

Why: the raw downloads are not in the repo, and on 22 Oct 2026 a committed data/raw link wiped them. Losing them must cost one command.

  python3 Tools/data/refetch_raw.py            fetch what is missing (network); items without a URL print the command that rebuilds them
  python3 Tools/data/refetch_raw.py --check    list missing or changed items, no network
  python3 Tools/data/refetch_raw.py --record   write size and sha256 of what is on disk into Tools/data/raw-manifest.json
  --only TEXT                                  act on the entries whose path contains TEXT

Tools/data/raw-manifest.json lists every raw file or folder of data/SOURCES.md ("Raw downloads"), with the way to get it back:
  url           one file from a URL                       ogc-features  an OGC API Features collection, paged by its "next" links
  files         several files, each from its own URL      pull          Tools/countries/pull.py, run for the country and steps given
  command       no plain URL: the command (or steps) that rebuild it, printed, not run
Folders end in "/". Their sha256 is taken over the sorted "relative path, file sha256" lines.
Licences and credits are in data/SOURCES.md; the "licence" field here is a short reminder.
"""
import argparse
import hashlib
import json
import os
import subprocess
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from rawdir import RAW  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = Path(__file__).with_name("raw-manifest.json")
UA = "Atlaslope data check"


def get(url: str, timeout: int = 1800) -> bytes:
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=timeout) as r:
        return r.read()


def save(dest: Path, data: bytes) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_name(dest.name + ".part")
    tmp.write_bytes(data)
    tmp.replace(dest)


def file_sha(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def measure(path: str):
    """(size, sha256) of a file or folder under RAW, or None when it is not there (or the folder is empty)."""
    p = RAW / path
    if path.endswith("/"):
        files = sorted(f for f in p.rglob("*") if f.is_file() and not f.name.endswith(".part")) if p.is_dir() else []
        if not files:
            return None
        h = hashlib.sha256()
        for f in files:
            h.update(f"{f.relative_to(p).as_posix()}\t{file_sha(f)}\n".encode())
        return sum(f.stat().st_size for f in files), h.hexdigest()
    return (p.stat().st_size, file_sha(p)) if p.is_file() else None


def present(path: str) -> bool:
    p = RAW / path
    return p.is_file() or (path.endswith("/") and p.is_dir() and any(p.iterdir()))


def fetch_ogc(url: str, dest: Path) -> None:
    feats, nxt = [], url
    while nxt:
        page = json.loads(get(nxt))
        feats += page.get("features", [])
        nxt = next((l["href"] for l in page.get("links", []) if l.get("rel") == "next"), None)
        print(f"  {len(feats)} features", end="\r")
    save(dest, json.dumps({"type": "FeatureCollection", "features": feats}, ensure_ascii=False).encode())
    print()


def fetch(e: dict) -> bool:
    """Fetch one entry that has a URL. Returns False for kinds that are printed instead."""
    k, dest = e["kind"], RAW / e["path"]
    if k == "url":
        save(dest, get(e["url"]))
    elif k == "files":
        for name, url in e["files"].items():
            if not (dest / name).exists():
                save(dest / name, get(url))
    elif k == "ogc-features":
        fetch_ogc(e["url"], dest)
    else:
        return False
    return True


def run_pull(todo: list) -> None:
    """pull.py (Tools/countries) already fetches the pt/fr/it files: run it once per country and set of steps."""
    jobs = {}
    for e in todo:
        jobs.setdefault(e["pull"]["country"], set()).update(e["pull"]["steps"])
    for cc, steps in sorted(jobs.items()):
        cmd = [sys.executable, str(ROOT / "Tools/countries/pull.py"), "--country", cc, "--step", *sorted(steps)]
        print("  $", " ".join(cmd[1:]))
        subprocess.run(cmd, check=False, env={**os.environ, "ATLASLOPE_RAW": str(RAW)})


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--check", action="store_true", help="list missing or changed items, no network")
    ap.add_argument("--record", action="store_true", help="write size and sha256 of what is on disk into the manifest")
    ap.add_argument("--only", help="entries whose path contains this text")
    a = ap.parse_args()
    man = json.loads(MANIFEST.read_text())
    items = [e for e in man["items"] if not a.only or a.only in e["path"]]
    print(f"raw folder: {RAW}")

    if a.record:
        for e in items:
            m = measure(e["path"])
            if m:
                e["bytes"], e["sha256"] = m
                print(f"recorded {e['path']} ({m[0]:,} bytes)")
            else:
                print(f"missing  {e['path']}")
        MANIFEST.write_text(json.dumps(man, ensure_ascii=False, indent=1) + "\n")
        return

    if a.check:
        bad = 0
        for e in items:
            m = measure(e["path"])
            if not m:
                state = "MISSING"
            elif "sha256" not in e:
                state = "present, not recorded"
            elif (m[0], m[1]) != (e["bytes"], e["sha256"]):
                state = "CHANGED"
            else:
                state = "ok"
            bad += state in ("MISSING", "CHANGED")
            print(f"{state:22} {e['path']}  [{e['kind']}]")
        print(f"{bad} missing or changed of {len(items)}")
        sys.exit(1 if bad else 0)

    missing = [e for e in items if not present(e["path"])]
    print(f"{len(missing)} of {len(items)} missing")
    pulls = [e for e in missing if e["kind"] == "pull"]
    if pulls:
        run_pull(pulls)
    for e in missing:
        if e["kind"] == "pull":
            continue
        print(f"{e['path']}  [{e['kind']}]")
        try:
            if not fetch(e):
                print("  cannot be fetched by URL; to rebuild it:")
                for line in e["command"]:
                    print("   ", line)
        except Exception as x:
            print(f"  failed: {x}")
    print("done; `--check` lists what is still missing, `--record` stores sizes and sha256")


if __name__ == "__main__":
    main()
