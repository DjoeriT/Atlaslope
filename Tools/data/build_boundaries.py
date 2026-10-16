#!/usr/bin/env python3
"""Boundaries for places the 2014 ministry layer lacks: the union of the municipalities their pliego lists (data/added-municipalities.json).

Runs in GitHub Actions (data-build workflow; IGN's service does not answer the cloud container). For each place it pages IGN's
administrative units inside the place's box, matches every listed name to one municipality of the right province (articles and
accents ignored), and fails loudly on a name it cannot match. Writes data/raw/build/munis-<id>.geojson; remote_build.sh dissolves them.
"""
import json, re, sys, unicodedata, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
API = "https://api-features.ign.es/collections/administrativeunit/items"
UA = "AtlaslopeDataBot/0.1 (https://github.com/DjoeriT/Paraje)"


def norm(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"^(.*), (el|la|los|las)$", r"\2 \1", s.strip())
    s = re.sub(r"^(el|la|los|las) ", "", s)
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def units(bbox):
    url = f"{API}?f=json&limit=500&bbox={','.join(map(str, bbox))}"
    while url:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=120) as r:
            page = json.load(r)
        yield from page["features"]
        url = next((l["href"] for l in page.get("links", []) if l.get("rel") == "next"), None)


def main():
    cfg = json.loads((ROOT / "data/added-municipalities.json").read_text())["places"]
    out = ROOT / "data/raw/build"; out.mkdir(parents=True, exist_ok=True)
    report, bad = {}, []
    for pid, c in cfg.items():
        cands = {}
        for f in units(c["bbox"]):
            p = f["properties"]
            if p.get("nationallevelname") != "Municipio" or p["nationalcode"][-5:-3] != c["province"]: continue
            cands.setdefault(norm(p["nameunit"]), []).append(f)
        feats, rows = [], []
        for name in c["municipalities"]:
            hit = cands.get(norm(name), [])
            if len(hit) != 1: bad.append(f"{pid}: {name} -> {len(hit)} matches"); continue
            f = hit[0]; feats.append({"type": "Feature", "properties": {"place": pid}, "geometry": f["geometry"]})
            rows.append({"listed": name, "ine": f["properties"]["nationalcode"][-5:], "ign_name": f["properties"]["nameunit"]})
        (out / f"munis-{pid}.geojson").write_text(json.dumps({"type": "FeatureCollection", "features": feats}))
        report[pid] = rows
        print(pid, len(feats), "of", len(c["municipalities"]))
    (out / "munis-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=1))
    if bad: sys.exit("unmatched: " + "; ".join(bad))


if __name__ == "__main__":
    main()
