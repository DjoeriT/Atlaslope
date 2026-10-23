#!/usr/bin/env python3
"""Fetches the Rheingau's inputs from Hessen's ALKIS (vereinfacht) WFS (issue #149, decisions #73, #93). Costs no tokens.

The amended spec (BAnz AT 09.06.2026 B7, section 4) delimits the PDO as the vineyard land ("Rebflaechen") of 32 Gemarkungen. Hessen has no
Lagen layer, so the route is ALKIS: the 32 Gemarkungen (KatasterBezirk, art Gemarkung) and the land use Nutzung with bez "Rebfläche"
(filtered on the server) in three boxes: the Rheingau itself (Lorchhausen to Massenheim), Frankfurt-Seckbach and Felsberg-Boeddiger, the
two outliers the spec lists. Licence: open by law, no conditions (section 18 HVGG, quoted in the service's capabilities); a source line,
if given, says the data was changed. Pages of 5,000 features as GML, converted to GeoJSON with ogr2ogr (EPSG:25832 kept).
Writes <raw>/countries/de/he/gemarkungen.geojson and reben.geojson; build_de_areas.py reads them.
Run: python3 -I Tools/data/fetch_de_rheingau.py
"""
import json, subprocess, sys, tempfile, urllib.parse, urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from rawdir import RAW as RAW_ROOT  # noqa: E402

OUT = RAW_ROOT / "countries/de/he"
WFS = "https://www.gds.hessen.de/wfs2/aaa-suite/cgi-bin/alkis/vereinf/wfs"
UA = "Atlaslope/0.2 (https://github.com/DjoeriT/Atlaslope)"
BOXES = [(49.97, 7.75, 50.12, 8.47), (50.13, 8.69, 50.17, 8.76), (51.10, 9.37, 51.18, 9.47)]  # lat/lon: Rheingau, Seckbach, Boeddiger
# Section 4 of the amended spec, Gemarkung numbers as printed (Hessen keys are "06" + these). The spec prints 0681 for both Oestrich and
# Winkel, so Winkel is matched by its name.
KEYS = {"0618", "0620", "0631", "0660", "0687", "1878", "0534", "0559", "0512", "0625", "0642", "0536", "0544", "0647", "0656", "0657",
        "0629", "0662", "0681", "0602", "0603", "0617", "0690", "0673", "0680", "0574", "0575", "0577", "0582", "0587", "0589"}
NS = ('xmlns:fes="http://www.opengis.net/fes/2.0" xmlns:gml="http://www.opengis.net/gml/3.2" '
      'xmlns:ave="http://repository.gdi-de.org/schemas/adv/produkt/alkis-vereinfacht/2.0"')
PAGE = 5000


def filt(prop, value, box):
    s, w, n, e = box
    return (f'<fes:Filter {NS}><fes:And><fes:PropertyIsEqualTo><fes:ValueReference>ave:{prop}</fes:ValueReference>'
            f'<fes:Literal>{value}</fes:Literal></fes:PropertyIsEqualTo><fes:BBOX><fes:ValueReference>ave:geometrie</fes:ValueReference>'
            f'<gml:Envelope srsName="urn:ogc:def:crs:EPSG::4326"><gml:lowerCorner>{s} {w}</gml:lowerCorner>'
            f'<gml:upperCorner>{n} {e}</gml:upperCorner></gml:Envelope></fes:BBOX></fes:And></fes:Filter>')


def fetch(typename, prop, value, tmp):
    """Every feature matching prop = value in the boxes, deduplicated by oid, as GeoJSON features."""
    seen, feats = set(), []
    for b, box in enumerate(BOXES):
        start = 0
        while True:
            q = urllib.parse.urlencode({"SERVICE": "WFS", "VERSION": "2.0.0", "REQUEST": "GetFeature", "TYPENAMES": typename,
                                        "COUNT": PAGE, "STARTINDEX": start, "FILTER": filt(prop, value, box)})
            gml = tmp / f"{b}-{start}.gml"
            with urllib.request.urlopen(urllib.request.Request(f"{WFS}?{q}", headers={"User-Agent": UA}), timeout=300) as r:
                gml.write_bytes(r.read())
            js = tmp / f"{b}-{start}.geojson"
            subprocess.run(["ogr2ogr", "-f", "GeoJSON", str(js), str(gml)], check=True, capture_output=True)
            page = json.loads(js.read_text())["features"] if js.stat().st_size else []
            for f in page:
                if f["properties"]["oid"] not in seen:
                    seen.add(f["properties"]["oid"]); feats.append(f)
            print(f"{typename} box {b} from {start}: {len(page)}", flush=True)
            if len(page) < PAGE:
                break
            start += PAGE
    return feats


def write(name, feats):
    OUT.mkdir(parents=True, exist_ok=True)
    doc = {"type": "FeatureCollection", "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:EPSG::25832"}}, "features": feats}
    (OUT / name).write_text(json.dumps(doc, ensure_ascii=False))
    print(f"wrote {OUT / name}: {len(feats)} features")


def main():
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        gem = [f for f in fetch("ave:KatasterBezirk", "art", "Gemarkung", tmp)
               if f["properties"]["schluessel"][2:] in KEYS - {"0681"} or f["properties"]["name"] in ("Oestrich", "Winkel")]
        names = sorted(f["properties"]["name"] for f in gem)
        if len(gem) != 32:
            raise SystemExit(f"expected 32 Gemarkungen, got {len(gem)}: {names}")
        write("gemarkungen.geojson", gem)
        (tmp / "r").mkdir()
        write("reben.geojson", fetch("ave:Nutzung", "bez", "Rebfläche", tmp / "r"))


if __name__ == "__main__":
    main()
