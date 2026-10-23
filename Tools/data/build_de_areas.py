#!/usr/bin/env python3
"""Builds Germany's pilot outlines (issue #149, decisions #71-#78, #93) from the LWK Rheinland-Pfalz wine layers.

Mosel: the union of the `gu` (geschuetzte Ursprungsbezeichnung) features whose BEZ names the Mosel, repaired (ST_MakeValid, polygons only: 23 of the 186 features are invalid in the source), closed at
CLOSE metres (buffer out, then back in) and simplified at SIMPLIFY metres, all in the source's EPSG:3035. The layer is the vineyard land
itself, in thousands of parcel-sized parts, not a municipal envelope, so the closed outline is larger than the vineyards and marked
approximate; `vineyardKm2` is the dissolved land, `km2` the closed outline. The Saarland part of the Mosel is not in the RLP layer.
Zones: the Mosel's Einzellagen from `weinlagen_recht` (layer wl), simplified to ZONE_SIMPLIFY metres. The six single-vineyard PDOs (#93)
are zones of their Anbaugebiet; only Uhlen (three PDOs) is in the Mosel, and the layer holds it as one Einzellage "Uhlen" (the three PDO
names have no outline of their own), so that zone carries them as `singleVineyardPdos`. Rheingau (wave 1, 23 Oct 2026): Hessen's ALKIS
WFS answered after all; its vineyard land use inside the spec's 32 Gemarkungen, closed the same way (rheingau() below).
Raw inputs (outside the repo, <raw folder>/countries/de/, Tools/rawdir.py, Tools/data/raw-manifest.json): m/gu.gpkg, m/wl.gpkg,
he/gemarkungen.geojson, he/reben.geojson.
Writes data/countries/de/areas.geojson and data/countries/de/zones-<id>.geojson (one per RLP place). Both load on demand (first load is full, #38).
The outline is also copied into data/added-boundaries.geojson, which the build splits into one file per country that loads on demand
(src/map/outlines.ts), so Germany's 74 KB reaches the map only when the view is over Germany. The zones stay in their own file.
Run: python3 -I Tools/data/build_de_areas.py
     python3 -I Tools/data/build_de_areas.py --map   (only the copy into the map's file; no raw files needed)
"""
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from rawdir import RAW as RAW_ROOT  # noqa: E402  raw downloads live outside the repo (22 Oct 2026)
RAW = RAW_ROOT / "countries/de/m"
HE = RAW_ROOT / "countries/de/he"  # Rheingau inputs from Hessen (Tools/data/fetch_de_rheingau.py)
OUT_DIR = ROOT / "data/countries/de"
CLOSE = 150          # metres: gaps between vineyard parcels closed (buffer +CLOSE, -CLOSE); 86 KB, 208 parts measured 22 Oct 2026
SIMPLIFY = 40        # metres, as Portugal, France and Italy: the outline is read at region zoom
ZONE_SIMPLIFY = 40   # metres, as the outline: 462 Einzellagen in 2,027 parts; 368 KB (76 KB gzipped), 328 KB at 60 m, so not coarser
ZONE_DECIMALS = 4    # about 11 m, the size of the simplification; 5 decimals cost 418 KB
# The three Uhlen PDOs (decision #93) sit inside the Einzellage Uhlen (Winningen, Kobern-Gondorf). The other three single-vineyard PDOs
# (Buergstadter Berg, Monzinger Niederberg, Wuerzburger Stein-Berg) lie in Franken and Nahe: noted in the tree, not drawn.
UHLEN_PDOS = ["Uhlen Blaufüsser Lay", "Uhlen Laubach", "Uhlen Roth Lay"]
# Wave 1 (23 Oct 2026): the rest of Rheinland-Pfalz. `gu` holds Mosel, Mittelrhein, Nahe and Pfalz; Ahr and Rheinhessen are not in it, so
# their outline is the union of their Einzellagen in `wl` (the same official LWK service, the registered sites rather than the PDO land:
# for the four places in both, wl is 1.5-1.9x gu). Both are closed and simplified the same way and marked approximate.
# Monzinger Niederberg (Nahe, #93) has no Einzellage of its own in wl: noted in the guide, not drawn. Only the RLP parts are drawn: the
# Saarland part of the Mosel and the NRW part of the Mittelrhein (Siebengebirge) are not in the layers.
PLACES = [("mosel", "Mosel", "gu"), ("ahr", "Ahr", "wl"), ("mittelrhein", "Mittelrhein", "gu"), ("nahe", "Nahe", "gu"),
          ("rheinhessen", "Rheinhessen", "wl"), ("pfalz", "Pfalz", "gu")]
ROUTES = {"gu": "lwk-gu", "wl": "lwk-wl"}


def ogr(*args):
    subprocess.run(["ogr2ogr", *args], check=True, capture_output=True)


def one(path):
    return json.loads(Path(path).read_text())["features"]


def write(path, feats):
    path.write_text(json.dumps({"type": "FeatureCollection", "features": feats}, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(f"wrote {path.relative_to(ROOT)}: {len(feats)} features, {path.stat().st_size / 1024:.0f} KB")


def ha(s):
    """The layer's area as text, "14,4" (hectares) or "k. A." (no figure)."""
    try:
        return float((s or "").replace(",", "."))
    except ValueError:
        return None


def outline(tmp, pid, name, layer):
    """One place's approximate outline: the union of its vineyard land, repaired, closed at CLOSE metres and simplified."""
    src, table, where = (RAW / "gu.gpkg", "gu", f"BEZ LIKE '%g.U. {name}%'") if layer == "gu" else \
                        (RAW / "wl.gpkg", "wl", f"anbaugebiet = '{name}'")
    land = f"ST_Union(ST_CollectionExtract(ST_MakeValid(geom), 3))"
    raw = tmp / f"{pid}-raw.geojson"
    ogr("-f", "GeoJSON", str(raw), str(src), "-dialect", "sqlite", "-sql", f"SELECT ST_Area({land}) AS m2 FROM {table} WHERE {where}")
    closed = tmp / f"{pid}-closed.geojson"
    ogr("-f", "GeoJSON", str(closed), str(src), "-dialect", "sqlite", "-sql",
        f"SELECT ST_Area(c) AS m2, c AS geometry FROM (SELECT ST_Buffer(ST_Buffer({land}, {CLOSE}), -{CLOSE}) AS c FROM {table} WHERE {where})")
    feats = one(closed)
    if len(feats) != 1:
        raise SystemExit(f"{name}: expected one outline, got {len(feats)}")
    wgs = tmp / f"{pid}.geojson"
    ogr("-f", "GeoJSON", str(wgs), str(closed), "-simplify", str(SIMPLIFY), "-t_srs", "EPSG:4326",
        "-lco", "COORDINATE_PRECISION=5", "-select", "")
    geom = one(wgs)[0]["geometry"]
    parts = len(geom["coordinates"]) if geom["type"] == "MultiPolygon" else 1
    props = {"id": pid, "place": pid, "route": ROUTES[layer], "approximate": True, "closedMetres": CLOSE, "parts": parts,
             "km2": round(feats[0]["properties"]["m2"] / 1e6, 1),
             "vineyardKm2": round((one(raw)[0]["properties"]["m2"] or 0) / 1e6, 1)}
    print(f"{pid}: {props['km2']} km2 closed at {CLOSE} m ({props['vineyardKm2']} km2 vineyards, {layer}), {parts} parts")
    return {"type": "Feature", "properties": props, "geometry": geom}


def zones(tmp, pid, name):
    """The place's Einzellagen from `weinlagen_recht` (layer wl), simplified to ZONE_SIMPLIFY metres. Written to zones-<id>.geojson."""
    path = tmp / f"{pid}-zones.geojson"
    ogr("-f", "GeoJSON", str(path), str(RAW / "wl.gpkg"), "-where", f"anbaugebiet = '{name}'", "-simplify", str(ZONE_SIMPLIFY),
        "-t_srs", "EPSG:4326", "-lco", f"COORDINATE_PRECISION={ZONE_DECIMALS}", "-select", "wlg_nr,wlg_name,gemeinde,grosslage,bereich,rebflaeche")
    out = []
    for f in sorted(one(path), key=lambda f: int(f["properties"]["wlg_nr"])):
        p = f["properties"]
        zp = {"id": f"{pid}-{p['wlg_nr']}", "name": p["wlg_name"], "gemeinde": p["gemeinde"],
              "grosslage": p["grosslage"], "bereich": (p["bereich"] or "").removeprefix("Bereich "), "ha": ha(p["rebflaeche"])}
        if pid == "mosel" and p["wlg_name"] == "Uhlen":
            zp["singleVineyardPdos"] = UHLEN_PDOS
        out.append({"type": "Feature", "properties": zp, "geometry": f["geometry"]})
    write(OUT_DIR / f"zones-{pid}.geojson", out)


def rheingau(tmp):
    """Rheingau from Hessen's ALKIS (Tools/data/fetch_de_rheingau.py): the land use "Rebfläche" inside the 32 Gemarkungen of the
    amended spec, closed and simplified as the RLP outlines, in EPSG:25832. No Einzellagen: Hessen publishes no Lagen layer."""
    gpkg = tmp / "he.gpkg"
    # Felsberg-Boeddiger (Gemarkung 1878, 3 parcels) lies 150 km north, near Kassel: drawn, it put the outline's frame and centre over
    # empty land (wave 1 shots, 23 Oct 2026). It stays in the spec and the guide; the map draws the Rheingau itself.
    ogr("-f", "GPKG", str(gpkg), str(HE / "gemarkungen.geojson"), "-nln", "gem", "-where", "schluessel <> '061878'")
    ogr("-f", "GPKG", "-update", str(gpkg), str(HE / "reben.geojson"), "-nln", "reb", "-spat", "400000", "5500000", "470000", "5560000")
    land = ("ST_Intersection(ST_Union(ST_CollectionExtract(ST_MakeValid(reb.geom), 3)), "
            "(SELECT ST_Union(ST_MakeValid(geom)) FROM gem))")
    raw = tmp / "rg-raw.geojson"
    ogr("-f", "GeoJSON", str(raw), str(gpkg), "-dialect", "sqlite", "-sql", f"SELECT ST_Area({land}) AS m2 FROM reb")
    closed = tmp / "rg-closed.geojson"
    ogr("-f", "GeoJSON", str(closed), str(gpkg), "-dialect", "sqlite", "-sql",
        f"SELECT ST_Area(c) AS m2, c AS geometry FROM (SELECT ST_Buffer(ST_Buffer({land}, {CLOSE}), -{CLOSE}) AS c FROM reb)",
        "-a_srs", "EPSG:25832")
    wgs = tmp / "rheingau.geojson"
    ogr("-f", "GeoJSON", str(wgs), str(closed), "-simplify", str(SIMPLIFY), "-t_srs", "EPSG:4326",
        "-lco", "COORDINATE_PRECISION=5", "-select", "")
    geom = one(wgs)[0]["geometry"]
    parts = len(geom["coordinates"]) if geom["type"] == "MultiPolygon" else 1
    props = {"id": "rheingau", "place": "rheingau", "route": "hessen-alkis", "approximate": True, "closedMetres": CLOSE, "parts": parts,
             "km2": round(one(closed)[0]["properties"]["m2"] / 1e6, 1),
             "vineyardKm2": round((one(raw)[0]["properties"]["m2"] or 0) / 1e6, 1)}
    print(f"rheingau: {props['km2']} km2 closed at {CLOSE} m ({props['vineyardKm2']} km2 vineyards, ALKIS), {parts} parts")
    return {"type": "Feature", "properties": props, "geometry": geom}


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        feats = [outline(tmp, pid, name, layer) for pid, name, layer in PLACES] + [rheingau(tmp)]
        for pid, name, _ in PLACES:
            zones(tmp, pid, name)
    write(OUT_DIR / "areas.geojson", feats)
    to_map()


def to_map():
    """The outline goes into the map's outline file, as France's and Italy's do. Keeps the approximate flag, so the map can say so."""
    sys.path.insert(0, str(Path(__file__).parent))  # -I leaves the script's folder off the path
    from build_pt_areas import put_added
    feats = json.loads((OUT_DIR / "areas.geojson").read_text())["features"]
    put_added(feats, {f["properties"]["id"] for f in feats})
    print("data/added-boundaries.geojson:", len(feats), "Germany outline")


if __name__ == "__main__":
    to_map() if "--map" in sys.argv else main()
