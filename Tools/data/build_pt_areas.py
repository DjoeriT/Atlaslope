#!/usr/bin/env python3
"""Builds Portugal's place outlines from the parish lists in each spec (data/countries/pt/areas-spec.json) and DGT CAOP 2025.

A listed parish that is now part of a 2013 union ("União das freguesias de A e B") maps to that union; when the union also holds
parishes the spec does not list, the outline takes them in too and the script prints them, so the place's note can say so.
Writes data/countries/pt/areas.geojson: one feature per place and one per zone (id, place, municipalities, km2, overIncluded),
and puts each place's outline into data/added-boundaries.geojson, the map's file for outlines outside the 2014 Spain layer.

Run: python3 Tools/data/build_pt_areas.py   (needs data/raw/countries/pt/caop2025-freguesias.geojson from Tools/countries/pull.py, and ogr2ogr)
"""
import json, re, subprocess, sys, tempfile, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CAOP = ROOT / "data/raw/countries/pt/caop2025-freguesias.geojson"
SPEC = ROOT / "data/countries/pt/areas-spec.json"
OUT = ROOT / "data/countries/pt/areas.geojson"
SIMPLIFY = 0.0012  # degrees, about 120 m (was 40 m until Portugal batch 1 put the build over 2 MB, PR #214): the outline is read at region zoom, the 2 MB download limit counts it (decision #38)


def norm(s):
    return re.sub(r"[^a-z ]", "", unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()).strip()


def members(name):
    """The old parishes a CAOP name stands for: 'União das freguesias de A, B e C' and 'Lamego (Almacave e Sé)' -> [A, B, C]."""
    inner = re.sub(r"^União das freguesias de ", "", name)
    inner = re.sub(r"^.*\((.*)\)$", r"\1", inner)
    return [norm(x) for x in re.split(r", | e ", inner)]


def main():
    # --check <file>: match one spec fragment against CAOP and print what is missing, write nothing (Portugal batch 1, 22 Oct 2026)
    check = sys.argv[2] if sys.argv[1:2] == ["--check"] else None
    spec = {k: v for k, v in json.loads(Path(check or SPEC).read_text()).items() if not k.startswith("$")}
    feats = json.loads(CAOP.read_text())["features"]
    out = []
    for place, s in spec.items():
        if "file" in s:  # an area that is whole islands (Madeira, owner 22 Oct 2026): the outline comes ready-made from CAOP RAM, no parish list
            g = json.loads((ROOT / s["file"]).read_text())["features"][0]
            print(f"{place}: whole islands from {s['file']}, {g['properties']['km2']} km2")
            out.append({"type": "Feature", "properties": {"id": place, "place": place, "municipalities": s["municipalities"],
                                                          "km2": g["properties"]["km2"]}, "geometry": g["geometry"]})
            continue
        aliases = {norm(m): {norm(a): b for a, b in al.items()} for m, al in s.get("aliases", {}).items()}
        picked, over = {}, set()
        for zone, z in s["zones"].items():
            whole = {norm(m) for m in z["municipalities"]}
            districts = {norm(x) for x in z.get("districts", [])}
            skip = {norm(m): {norm(x) for x in ps} for m, ps in z.get("except", {}).items()}
            listed = {norm(m): {norm(x) for x in ps} for m, ps in z["parishes"].items()}
            for f in feats:
                p = f["properties"]
                m, fr = norm(p["municipio"]), p["freguesia"]
                if (m in whole or norm(p["distrito_ilha"]) in districts) and not ({norm(fr)} | set(members(fr))) & skip.get(m, set()):
                    picked[p["dtmnfr"]] = (zone, f)
                    continue
                want = listed.get(m, set())
                al = {a for a, b in aliases.get(m, {}).items() if b == fr}
                hit = (want & set(members(fr))) | (want & al) | ({norm(fr)} & want)
                if hit:
                    picked[p["dtmnfr"]] = (zone, f)
                    extra = set(members(fr)) - want if not al else set()
                    over |= {f"{p['municipio']}: {x}" for x in extra}
            seen = {norm(f["properties"]["municipio"]) for f in feats} | {norm(f["properties"]["distrito_ilha"]) for f in feats}
            for m in (whole | districts | set(skip)) - seen:
                print(f"NOT FOUND {place}/{zone}: municipality or district {m}")
            for m, ps in listed.items():
                for x in ps:
                    if not any(x in members(f["properties"]["freguesia"]) or x == norm(f["properties"]["freguesia"])
                               or aliases.get(m, {}).get(x) == f["properties"]["freguesia"]
                               for _, f in picked.values() if norm(f["properties"]["municipio"]) == m):
                        print(f"NOT FOUND {place}/{zone}: {m} {x}")
        if check:
            print(f"{place}: {len(picked)} CAOP parishes, {round(sum(f['properties']['area_ha'] for _, f in picked.values()) / 100)} km2, "
                  f"unlisted parishes taken in with a union: {', '.join(sorted(over)) or 'none'}")
            continue
        with tempfile.TemporaryDirectory() as tmp:
            src = Path(tmp) / "in.geojson"
            src.write_text(json.dumps({"type": "FeatureCollection", "features": [
                {"type": "Feature", "properties": {"zone": zone}, "geometry": f["geometry"]} for zone, f in picked.values()]}))
            for group, sql in ((place, "SELECT ST_Union(geometry) AS geometry FROM \"in\""),
                               (None, "SELECT zone, ST_Union(geometry) AS geometry FROM \"in\" GROUP BY zone")):
                dst = Path(tmp) / f"{group or 'zones'}.geojson"
                subprocess.run(["ogr2ogr", "-f", "GeoJSON", "-dialect", "sqlite", "-sql", sql, "-simplify", str(SIMPLIFY),
                                "-lco", "COORDINATE_PRECISION=5", str(dst), str(src)], check=True, capture_output=True)
                for g in json.loads(dst.read_text())["features"]:
                    zid = g["properties"].get("zone") or place
                    if group is None and zid == place:
                        continue  # a place with no zones of its own: its one "zone" is the place
                    rows = [f for z, f in picked.values() if zid in (place, z)]
                    out.append({"type": "Feature", "properties": {
                        "id": zid, "place": place, "municipalities": len({f["properties"]["municipio"] for f in rows}),
                        "km2": round(sum(f["properties"]["area_ha"] for f in rows) / 100, 1),
                        **({"overIncluded": sorted(over)} if zid == place and over else {})}, "geometry": g["geometry"]})
        print(f"{place}: {len(picked)} CAOP parishes, {len(over)} unlisted parishes taken in with a union: {', '.join(sorted(over))}")
    if check:
        return
    OUT.write_text(json.dumps({"type": "FeatureCollection", "features": out}, ensure_ascii=False, separators=(",", ":")) + "\n")
    put_added([f for f in out if f["properties"]["id"] in spec], spec)
    print(OUT.relative_to(ROOT), f"{OUT.stat().st_size // 1024} KB", [(f["properties"]["id"], f["properties"]["km2"]) for f in out])


def put_added(features, ids):
    """Puts outlines into data/added-boundaries.geojson, the map's file for outlines outside the 2014 Spain layer, replacing any with
    the same id in `ids`. One feature per line, as ogr2ogr wrote the file, so a rebuild only touches its own lines (also France's,
    Tools/data/build_fr_areas.py)."""
    added_path = ROOT / "data/added-boundaries.geojson"
    lines = [l for l in added_path.read_text().splitlines()
             if not any(l.startswith(f'{{ "type": "Feature", "properties": {{ "id": "{pid}"') for pid in ids)]
    end = len(lines) - 1 - lines[::-1].index("]")
    body = [l.rstrip(",") for l in lines[:end] if l.startswith('{ "type": "Feature"')]
    for f in features:
        props = ", ".join(f'"{k}": {json.dumps(f["properties"][k])}' for k in ("id", "municipalities", "km2"))
        body.append(f'{{ "type": "Feature", "properties": {{ {props} }}, "geometry": {json.dumps(f["geometry"], separators=(", ", ": "))} }}')
    head = [l for l in lines[:end] if not l.startswith('{ "type": "Feature"')]
    added_path.write_text("\n".join(head + [",\n".join(body)] + lines[end:]) + "\n")


if __name__ == "__main__":
    main()
