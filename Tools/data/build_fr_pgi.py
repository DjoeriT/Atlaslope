#!/usr/bin/env python3
"""Adds the outlines of two PGIs, "pays-doc" (Pays d'Oc) and "cotes-de-gascogne" (Côtes de Gascogne), to data/countries/fr/areas.geojson.

Why: they are indications géographiques protégées, not in INAO's AOC parcel shapefile. The EU single documents (section 5, "Zone délimitée")
list the area as whole départements plus named communes. Boundaries: IGN ADMIN EXPRESS-COG-CARTO (Géoplateforme WFS; layers departement
and commune). Communes are matched by name within their département (accents, case, saint/sainte, hyphens ignored). Communes the
documents list as "partie ..." (Aire-sur-Adour, Lacquy, Sainte-Foy, Villeneuve-de-Marsan) are taken WHOLE.
Pays d'Oc: the STILL-wine area (Aude, Gard, Hérault, Pyrénées-Orientales and six Lozère communes); the sparkling-wine area is narrower.
Dissolved in Lambert-93, closed and simplified by size like build_fr_champagne.py (4 m per square root of km2, simplify capped at 300 m,
close capped at 400 m), written in WGS84. Only these two features are added or replaced.

Run: python3 Tools/data/build_fr_pgi.py   (needs ogr2ogr and network; raw files go to <raw folder>/countries/fr/ign-pgi-*.geojson)
"""
import json, re, subprocess, sys, tempfile, unicodedata, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from rawdir import RAW  # noqa: E402
RAW = RAW / "countries/fr"
OUT = ROOT / "data/countries/fr/areas.geojson"
UA = {"User-Agent": "Atlaslope data check"}
WFS = "https://data.geopf.fr/wfs/ows"

PGIS = {
    "pays-doc": {
        "name": "Pays d'Oc",
        "deps": {"11": "Aude", "30": "Gard", "34": "Hérault", "66": "Pyrénées-Orientales"},
        "communes": {"48": ["Ispagnac", "Montbrun", "Quézac", "Sainte-Enimie", "La Malène", "Les Vignes"]},
        "note": "Whole départements and communes; still-wine area of the EU single document (the sparkling-wine area is narrower)",
    },
    "cotes-de-gascogne": {
        "name": "Côtes de Gascogne",
        "deps": {"32": "Gers"},
        "communes": {
            "40": ["Aire-sur-Adour", "Arthez d'Armagnac", "Betbezer d'Armagnac", "Le Bourdalat", "Castandet", "Cazères-sur-Adour",
                   "Créon d'Armagnac", "Escalans", "Le Frêche", "Gabarret", "Hontanx", "Labastide d'Armagnac", "Lacquy", "Lagrange",
                   "Lussagnet", "Mauvezin d'Armagnac", "Montégut", "Parleboscq", "Perquie", "Sainte-Foy", "Saint-Gein",
                   "Saint-Julien d'Armagnac", "Saint-Justin", "Le Vignau", "Villeneuve-de-Marsan"],
            "47": ["Andiran", "Fieux", "Francescas", "Le Fréchou", "Lannes", "Lasserre", "Mézin", "Moncrabeau", "Nérac", "Poudenas",
                   "Réaup-Lisse", "Sainte-Maure-de-Peyriac", "Saint-Pé-Saint-Simon", "Sos"],
        },
        "note": "Whole départements and communes; PGI area from the EU single document (communes listed in part are taken whole)",
    },
}


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"\bsaint(e?)\b", r"st\1", s)
    s = re.sub(r"^(le|la|les|l)\b", "", s.strip())
    s = s.replace("l'adour", "adour")  # the register spells Aire-sur-l'Adour, the single document Aire-sur-Adour
    return re.sub(r"[^a-z0-9]", "", s)


def wfs(layer, cql):
    q = urllib.parse.urlencode({"service": "WFS", "version": "2.0.0", "request": "GetFeature", "outputFormat": "application/json",
                                "typeNames": f"ADMINEXPRESS-COG-CARTO.LATEST:{layer}", "srsName": "EPSG:4326", "cql_filter": cql})
    with urllib.request.urlopen(urllib.request.Request(f"{WFS}?{q}", headers=UA), timeout=300) as r:
        return json.load(r)["features"]


def cached(name, fn):
    path = RAW / name
    if not path.exists():
        RAW.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps({"type": "FeatureCollection", "features": fn()}, ensure_ascii=False))
    return json.loads(path.read_text())["features"]


def units(spec):
    """Returns (features, unit names, unmatched names)."""
    feats, names, missing = [], [], []
    for code, label in spec["deps"].items():
        feats += cached(f"ign-pgi-dep-{code}.geojson", lambda c=code: wfs("departement", f"code_insee='{c}'"))
        names.append(label)
    for code, wanted in spec["communes"].items():
        pool = cached(f"ign-pgi-communes-{code}.geojson", lambda c=code: wfs("commune", f"code_insee_du_departement='{c}'"))
        # communes merged since (Lozère: Gorges du Tarn Causses) are IGN's "communes deleguees": same names, own outlines
        pool += cached(f"ign-pgi-deleguees-{code}.geojson", lambda c=code: wfs("commune_associee_ou_deleguee", f"code_insee LIKE '{c}%'"))
        by = {norm(f["properties"]["nom_officiel"]): f for f in reversed(pool)}  # a commune wins over a delegated one of the same name
        for w in wanted:
            f = by.get(norm(w))
            if f:
                feats.append(f)
                names.append(f["properties"]["nom_officiel"])
            else:
                missing.append(f"{w} ({code})")
    return feats, names, missing


def ogr(*args):
    return subprocess.run(["ogr2ogr", *args], check=True, capture_output=True, text=True).stdout


def build(pid, spec, feats, names):
    with tempfile.TemporaryDirectory() as tmp:
        src = Path(tmp) / "in.geojson"
        src.write_text(json.dumps({"type": "FeatureCollection", "features": [{"type": "Feature", "properties": {}, "geometry": f["geometry"]} for f in feats]}))
        lam = Path(tmp) / "lam.geojson"
        ogr("-f", "GeoJSON", str(lam), str(src), "-t_srs", "EPSG:2154", "-nln", "u")
        raw = float(ogr("-f", "CSV", "/vsistdout/", str(lam), "-dialect", "sqlite", "-sql",
                        'SELECT SUM(ST_Area(geometry)) / 1e6 AS km2 FROM "u"').split()[-1])
        k = 4 * raw ** 0.5
        simplify, close = min(max(k, 80), 300), min(max(k, 150), 400)
        out = Path(tmp) / "cut.geojson"
        sql = (f"SELECT ST_Buffer(ST_Buffer(ST_Union(geometry), {close}), -{close}) AS geometry, "
               f"ST_Area(ST_Union(geometry)) / 1e6 AS km2 FROM \"u\"")
        ogr("-f", "GeoJSON", str(out), str(lam), "-dialect", "sqlite", "-sql", sql, "-simplify", str(simplify),
            "-t_srs", "EPSG:4326", "-lco", "COORDINATE_PRECISION=5")
        f = json.loads(out.read_text())["features"][0]
    deps = sorted(spec["deps"].values())
    f["properties"] = {"id": pid, "place": pid, "kind": "place", "parent": None, "app": spec["name"], "denom": spec["name"],
                       "km2": round(raw, 2), "departements": deps,
                       "communes": sorted(n for n in names if n not in deps), "note": spec["note"]}
    return f, simplify, close


def main():
    data = json.loads(OUT.read_text())
    for pid, spec in PGIS.items():
        feats, names, missing = units(spec)
        if missing:
            print(f"{pid}: UNMATCHED {missing}")
        f, s, c = build(pid, spec, feats, names)
        data["features"] = [x for x in data["features"] if x["properties"].get("id") != pid] + [f]
        print(f"{pid}: {len(feats)} units matched, {len(missing)} unmatched, {f['properties']['km2']} km2, simplify {s:.0f} m, "
              f"close {c:.0f} m, feature {len(json.dumps(f, separators=(',', ':'))) / 1024:.0f} KB")
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
    print(f"{OUT.relative_to(ROOT)} {OUT.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
