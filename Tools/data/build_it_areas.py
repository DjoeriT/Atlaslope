#!/usr/bin/env python3
"""Builds Italy's pilot place outlines (decision #62) from data/countries/it/areas-spec.json.

Two routes: 'piemonte' takes the region's official DOC/DOCG polygon (its sub-zone rows unioned); 'istat' unions the municipalities
and whole provinces the spec names from ISTAT's generalised limits. Partial municipalities are taken whole, so an 'istat' outline is
marked approximate and carries the official area next to its own. 'candiago' takes the PDO polygon traced from the rulebook's boundary
text by Candiago et al. 2022 (CC0), for zones the rulebook draws along roads and streams instead of naming municipalities. A municipality name shared by two provinces takes the province's
two-letter code in brackets, e.g. "Castro (LE)". Raw inputs (outside the repo, <raw folder>/countries/it/, Tools/rawdir.py) are the zips,
rulebook archives and Candiago file listed in data/SOURCES.md.
Writes data/countries/it/areas.geojson. The shipped places (IT_SHIP) are copied into data/added-boundaries.geojson for the map.
Run: python3 -I Tools/data/build_it_areas.py
     python3 -I Tools/data/build_it_areas.py --map   (only the copy into the map's file; no raw files needed)
"""
import json, os, re, subprocess, sys, tempfile, unicodedata, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from rawdir import RAW as RAW_ROOT  # noqa: E402  raw downloads live outside the repo (22 Oct 2026)
RAW = RAW_ROOT / "countries/it"
SPEC = ROOT / "data/countries/it/areas-spec.json"
OUT = ROOT / "data/countries/it/areas.geojson"
SIMPLIFY = 40  # metres in the source's UTM 32N, as Portugal's ~40 m: the outline is read at region zoom (decision #38)


def norm(s):
    return re.sub(r"[^a-z ]", "", unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()).strip()


def ogr(*args):
    subprocess.run(["ogr2ogr", *args], check=True, capture_output=True)


def rows(shp, fields):
    return json.loads(subprocess.run(["ogr2ogr", "-f", "GeoJSON", "/vsistdout/", str(shp), "-select", fields, "-nlt", "NONE"],
                                     capture_output=True, text=True, check=True).stdout)["features"]


def main():
    spec = {k: v for k, v in json.loads(SPEC.read_text()).items() if not k.startswith("$")}
    out = []
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        zipfile.ZipFile(RAW / "piemonte-aree-vini-doc-docg.zip").extractall(tmp / "pie")
        zipfile.ZipFile(RAW / "istat-limiti-01012025-g.zip").extractall(tmp / "istat")
        pie = next((tmp / "pie").rglob("*.shp"))
        com = next((tmp / "istat").rglob("Com*_WGS84.shp"))
        prov = next((tmp / "istat").rglob("ProvCM*_WGS84.shp"))
        sigla = {f["properties"]["COD_PROV"]: f["properties"]["SIGLA"] for f in rows(prov, "COD_PROV,SIGLA")}
        provcode = {norm(f["properties"]["DEN_UTS"]): f["properties"]["COD_PROV"] for f in rows(prov, "COD_PROV,DEN_UTS")}
        names = {}  # normalised name -> [(PRO_COM, COMUNE, province code)]
        for f in rows(com, "PRO_COM,COMUNE,COD_PROV"):
            q = f["properties"]
            names.setdefault(norm(q["COMUNE"]), []).append((q["PRO_COM"], q["COMUNE"], sigla[q["COD_PROV"]]))

        def code(m):
            m = s.get("renamed", {}).get(m, m)
            hint = re.match(r"(.*) \(([A-Z]{2})\)$", m)
            hits = names.get(norm(hint[1] if hint else m), [])
            hits = [h for h in hits if not hint or h[2] == hint[2]]
            if len(hits) != 1:
                print(f"{'NOT FOUND' if not hits else 'AMBIGUOUS'} {place}: municipality {m}")
                return None
            return hits[0][0]
        for place, s in spec.items():
            union = tmp / f"{place}-utm.geojson"
            props = {"id": place, "place": place, "route": s["route"]}
            if s["route"] == "candiago":
                ogr("-f", "GeoJSON", str(union), str(RAW / "candiago/EU_PDO.gpkg"), "-t_srs", "EPSG:32632", "-dialect", "sqlite", "-sql",
                    f"SELECT ST_Area(ST_Transform(Shape, 32632)) AS m2, Shape FROM EU_PDO WHERE PDOid = '{s['pdo']}'")
            elif s["route"] == "piemonte":
                ogr("-f", "GeoJSON", str(union), str(pie), "-dialect", "sqlite", "-sql",
                    f"SELECT ST_Area(ST_Union(geometry)) AS m2, ST_Union(geometry) AS geometry FROM \"{pie.stem}\" "
                    f"WHERE codice = '{s['codice']}'")
            else:
                whole = {c for c in map(code, s["whole"]) if c}
                part = {c for c in map(code, s["partial"]) if c} - whole
                provs = []
                for pn in s.get("wholeProvinces", []):
                    if norm(pn) not in provcode:
                        print(f"NOT FOUND {place}: province {pn}")
                    else:
                        provs.append(provcode[norm(pn)])
                inprov = f"COD_PROV IN ({', '.join(map(str, provs)) or 'NULL'})"
                where = lambda codes: f"(PRO_COM IN ({', '.join(map(str, sorted(codes))) or 'NULL'}) OR {inprov})"
                ogr("-f", "GeoJSON", str(union), str(com), "-dialect", "sqlite", "-sql",
                    f"SELECT ST_Area(ST_Union(geometry)) AS m2, ST_Union(geometry) AS geometry FROM \"{com.stem}\" WHERE {where(whole | part)}")
                core = tmp / f"{place}-core.geojson"
                ogr("-f", "GeoJSON", str(core), str(com), "-dialect", "sqlite", "-sql",
                    f"SELECT ST_Area(ST_Union(geometry)) AS m2 FROM \"{com.stem}\" WHERE {where(whole)}")
                n = json.loads(subprocess.run(["ogrinfo", "-q", "-ro", "-dialect", "sqlite", "-sql",
                    f"SELECT COUNT(*) AS n FROM \"{com.stem}\" WHERE {where(whole | part)}", str(com)],
                    capture_output=True, text=True, check=True).stdout.split("n (Integer) = ")[1].split()[0])
                props |= {"approximate": True, "municipalities": n,
                          "partial": sorted({s.get("renamed", {}).get(m, m) for m in s["partial"]}),
                          "wholeKm2": round((json.loads(core.read_text())["features"][0]["properties"]["m2"] or 0) / 1e6, 1),
                          "officialKm2": s.get("officialKm2")}
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
    to_map()


def to_map():
    """The shipped places (IT_SHIP in Tools/data/build_places.py) go into the map's outline file, as France's do. An ISTAT outline
    keeps its approximate flag, so the map can say so."""
    sys.path.insert(0, str(Path(__file__).parent))  # -I leaves the script's folder off the path
    from build_places import IT_SHIP
    from build_pt_areas import put_added
    feats = json.loads(OUT.read_text())["features"]
    shipped = [{**f, "properties": {k: f["properties"][k] for k in ("id", "municipalities", "km2", "approximate") if k in f["properties"]}}
               for f in feats if f["properties"]["place"] in IT_SHIP]
    put_added(shipped, {f["properties"]["id"] for f in shipped})
    print("data/added-boundaries.geojson:", len(shipped), "Italy outlines")


if __name__ == "__main__":
    # --map: only copy the shipped outlines from areas.geojson into the map's file (no raw download needed).
    to_map() if "--map" in sys.argv else main()
