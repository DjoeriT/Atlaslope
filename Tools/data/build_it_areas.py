#!/usr/bin/env python3
"""Builds Italy's pilot place outlines (decision #62) from data/countries/it/areas-spec.json.

Two routes: 'piemonte' takes the region's official DOC/DOCG polygon; 'istat' unions the municipalities the spec names from ISTAT's
generalised limits. Partial municipalities are taken whole, so an 'istat' outline is marked approximate and carries the official
area next to its own. Raw inputs (<raw folder>/countries/it/) are the two zips listed in data/SOURCES.md.
Writes data/countries/it/areas.geojson. Run: python3 -I Tools/data/build_it_areas.py
"""
import json, re, subprocess, tempfile, unicodedata, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from rawdir import RAW  # noqa: E402
RAW = RAW / "countries/it"
SPEC = ROOT / "data/countries/it/areas-spec.json"
OUT = ROOT / "data/countries/it/areas.geojson"
SIMPLIFY = 40  # metres in the source's UTM 32N, as Portugal's ~40 m: the outline is read at region zoom (decision #38)


def norm(s):
    return re.sub(r"[^a-z ]", "", unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()).strip()


def ogr(*args):
    subprocess.run(["ogr2ogr", *args], check=True, capture_output=True)


def main():
    spec = {k: v for k, v in json.loads(SPEC.read_text()).items() if not k.startswith("$")}
    out = []
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        zipfile.ZipFile(RAW / "piemonte-aree-vini-doc-docg.zip").extractall(tmp / "pie")
        zipfile.ZipFile(RAW / "istat-limiti-01012025-g.zip").extractall(tmp / "istat")
        pie = next((tmp / "pie").rglob("*.shp"))
        com = next((tmp / "istat").rglob("Com*_WGS84.shp"))
        names = {norm(f["properties"]["COMUNE"]): f["properties"]["COMUNE"] for f in json.loads(subprocess.run(
            ["ogr2ogr", "-f", "GeoJSON", "/vsistdout/", str(com), "-select", "COMUNE", "-nlt", "NONE"],
            capture_output=True, text=True, check=True).stdout)["features"]}
        for place, s in spec.items():
            union = tmp / f"{place}-utm.geojson"
            props = {"id": place, "place": place, "route": s["route"]}
            if s["route"] == "piemonte":
                ogr("-f", "GeoJSON", str(union), str(pie), "-dialect", "sqlite", "-sql",
                    f"SELECT ST_Area(geometry) AS m2, geometry FROM \"{pie.stem}\" WHERE codice = '{s['codice']}'")
            else:
                want = s["whole"] + s["partial"]
                istat = []
                for m in want:
                    n = names.get(norm(s.get("renamed", {}).get(m, m)))
                    if not n:
                        print(f"NOT FOUND {place}: municipality {m}")
                    elif n not in istat:
                        istat.append(n)
                part = {s.get("renamed", {}).get(m, m) for m in s["partial"]}
                inlist = ", ".join("'" + n.replace("'", "''") + "'" for n in istat)
                ogr("-f", "GeoJSON", str(union), str(com), "-dialect", "sqlite", "-sql",
                    f"SELECT ST_Area(ST_Union(geometry)) AS m2, ST_Union(geometry) AS geometry FROM \"{com.stem}\" WHERE COMUNE IN ({inlist})")
                core = tmp / f"{place}-core.geojson"
                whole = ", ".join("'" + names[norm(m)].replace("'", "''") + "'" for m in s["whole"])
                ogr("-f", "GeoJSON", str(core), str(com), "-dialect", "sqlite", "-sql",
                    f"SELECT ST_Area(ST_Union(geometry)) AS m2 FROM \"{com.stem}\" WHERE COMUNE IN ({whole})")
                props |= {"approximate": True, "municipalities": len(istat), "partial": sorted(part),
                          "wholeKm2": round(json.loads(core.read_text())["features"][0]["properties"]["m2"] / 1e6, 1),
                          "officialKm2": s["officialKm2"]}
            feats = json.loads(union.read_text())["features"]
            if len(feats) != 1:
                raise SystemExit(f"{place}: expected one outline, got {len(feats)}")
            props["km2"] = round(feats[0]["properties"]["m2"] / 1e6, 1)
            wgs = tmp / f"{place}.geojson"
            ogr("-f", "GeoJSON", str(wgs), str(union), "-t_srs", "EPSG:4326", "-simplify", str(SIMPLIFY),
                "-lco", "COORDINATE_PRECISION=5", "-select", "")
            out.append({"type": "Feature", "properties": props, "geometry": json.loads(wgs.read_text())["features"][0]["geometry"]})
            print(f"{place}: {props['route']}, {props['km2']} km2" + (f" (official {s['officialKm2']}, whole municipalities only "
                  f"{props['wholeKm2']})" if s["route"] == "istat" else ""))
    OUT.write_text(json.dumps({"type": "FeatureCollection", "features": out}, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(f"wrote {OUT.relative_to(ROOT)}, {OUT.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
