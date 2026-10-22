#!/usr/bin/env python3
"""Boundaries for places whose pliego delimits them by cadastral parcels (data/added-parcels.json): the parcels from the Catastro.

Runs in GitHub Actions (data-build workflow; the Catastro does not answer the cloud container). For each place it looks up the
Catastro's own municipality code, fetches every listed parcel from the Catastro's INSPIRE parcel service in ETRS89 / UTM 30N
(EPSG:25830), and fails loudly on a parcel it cannot fetch. Writes <raw folder>/build/parcels-<id>.geojson (EPSG:25830);
remote_build.sh dissolves them and reprojects.
"""
import json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from rawdir import RAW  # noqa: E402
CALLEJERO = "https://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaMunicipio"
WFS = "https://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx"
UA = "AtlaslopeDataBot/0.1 (https://github.com/DjoeriT/Atlaslope)"


def get(url):
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=120) as r:
                return r.read().decode("utf-8", "replace")
        except Exception as e:  # the Catastro throttles bursts; back off and retry
            print("retry", attempt + 1, url, e, flush=True); time.sleep(5 * (attempt + 1))
    raise SystemExit(f"failed: {url}")


def catastro_code(province, municipality):
    xml = get(CALLEJERO + "?" + urllib.parse.urlencode({"Provincia": province, "Municipio": municipality}))
    m = re.search(r"<locat>\s*<cd>(\d+)</cd>\s*<cmc>(\d+)</cmc>", xml)
    if not m: raise SystemExit(f"no Catastro code for {municipality}: {xml[:300]}")
    return f"{int(m.group(1)):02d}{int(m.group(2)):03d}"


def rings(gml):
    # one parcel can have several surfaces and holes; each posList is one ring of x y pairs in EPSG:25830
    out = []
    for pl in re.findall(r"<gml:posList[^>]*>([^<]+)</gml:posList>", gml):
        v = list(map(float, pl.split()))
        out.append([[v[i], v[i + 1]] for i in range(0, len(v), 2)])
    return out


def main():
    cfg = json.loads((ROOT / "data/added-parcels.json").read_text())["places"]
    out = RAW / "build"; out.mkdir(parents=True, exist_ok=True)
    for pid, c in cfg.items():
        code = catastro_code(c["province_name"], c["municipality"])
        feats = []
        for n in c["parcels"]:
            ref = f"{code}A{int(c['polygon']):03d}{int(n):05d}"
            gml = get(WFS + "?" + urllib.parse.urlencode({"service": "WFS", "version": "2.0.0", "request": "GetFeature",
                       "STOREDQUERIE_ID": "GetParcel", "refcat": ref, "srsname": "EPSG::25830"}))
            rs = rings(gml)
            if not rs: raise SystemExit(f"{pid}: parcel {ref} not found: {gml[:300]}")
            # every ring becomes its own polygon, so a hole in a parcel is filled when the parcels are dissolved; at atlas scale that is invisible
            feats.append({"type": "Feature", "properties": {"refcat": ref},
                          "geometry": {"type": "MultiPolygon", "coordinates": [[r] for r in rs]}})
            time.sleep(0.5)
        json.dump({"type": "FeatureCollection", "crs": {"type": "name", "properties": {"name": "EPSG:25830"}}, "features": feats},
                  open(out / f"parcels-{pid}.geojson", "w"))
        print(pid, "catastro code", code, "parcels", len(feats), "of", len(c["parcels"]), flush=True)


if __name__ == "__main__":
    main()
