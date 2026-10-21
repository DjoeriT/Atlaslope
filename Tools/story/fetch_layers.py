#!/usr/bin/env python3
"""Fetch official rivers (IGN/CNIG INSPIRE Hydrography WFS) and place names (IGN NGBE WFS) for the Rioja and Priorat
"Read with the map" story. Output: data/story/{rivers,names}-{rioja,priorat}.geojson (committed; see data/SOURCES.md).
Usage: python3 -I Tools/story/fetch_layers.py [rivers|names|all]
Raw pages are cached in .cache/layers (git-ignored, override with STORY_CACHE); re-runs reuse them. Geology (IGME WMS) is not fetched:
the app reads it as tiles."""
import json, math, os, re, sys, time, urllib.error, urllib.request
import xml.etree.ElementTree as ET

UA = "AtlaslopeDataBot/0.1 (https://github.com/DjoeriT/Atlaslope)"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "data/story")
CACHE = os.environ.get("STORY_CACHE", os.path.join(ROOT, ".cache/layers"))
BBOX = {"rioja": (-3.15, 42.05, -1.65, 42.70), "priorat": (0.65, 41.05, 1.00, 41.35)}  # lon/lat
HYDRO = "https://servicios.idee.es/wfs-inspire/hidrografia"
NGBE = "https://www.ign.es/wfs-inspire/ngbe"
MAIN = ("Río Ebro", "L'Ebre", "Río Oja", "Río Tirón", "Río Najerilla", "Río Iregua", "Riu de Siurana", "Riu de Montsant")
SIMPLIFY_DEG = 0.0002  # ~20 m, main rivers
SIMPLIFY_MINOR_DEG = 0.0012  # ~120 m, other rivers (download budget, 21 Oct 2026)
MIN_MINOR_DEG = 0.06  # other rivers spanning less than this (about 6 km) are left out
NS = {"wfs": "http://www.opengis.net/wfs/2.0", "gml": "http://www.opengis.net/gml/3.2",
      "hy-p": "http://inspire.ec.europa.eu/schemas/hy-p/4.0", "gn": "http://inspire.ec.europa.eu/schemas/gn/4.0"}


def get(url, tries=4):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            return urllib.request.urlopen(req, timeout=120).read()
        except (urllib.error.URLError, TimeoutError) as e:
            wait = 5 * (i + 1)
            print("  retry %d after %s (%ss)" % (i + 1, e, wait), flush=True)
            time.sleep(wait)
    raise RuntimeError("giving up: " + url[:120])


def bbox_param(b):  # WFS 2.0 with EPSG::4326 URN is lat,lon
    return "%s,%s,%s,%s,urn:ogc:def:crs:EPSG::4326" % (b[1], b[0], b[3], b[2])


def dp(pts, tol):
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy)
    best, idx = -1, 0
    for i in range(1, len(pts) - 1):
        x, y = pts[i]
        d = math.hypot(x - x1, y - y1) if L == 0 else abs(dy * x - dx * y + x2 * y1 - y2 * x1) / L
        if d > best:
            best, idx = d, i
    if best <= tol:
        return [pts[0], pts[-1]]
    return dp(pts[:idx + 1], tol)[:-1] + dp(pts[idx:], tol)


def rivers(guide):
    b = BBOX[guide]
    cdir = os.path.join(CACHE, "hydro-" + guide)
    os.makedirs(cdir, exist_ok=True)
    byname, start, count, segs = {}, 0, 500, 0
    while True:
        f = os.path.join(cdir, "%06d.gml" % start)
        if os.path.exists(f):
            data = open(f, "rb").read()
        else:
            url = ("%s?service=WFS&version=2.0.0&request=GetFeature&typeNames=hy-p:Watercourse&count=%d&startIndex=%d&bbox=%s"
                   % (HYDRO, count, start, bbox_param(b)))
            try:
                data = get(url)
            except RuntimeError:
                if count > 50:  # fall back to the small page size from the card
                    count = 50
                    continue
                raise
            open(f, "wb").write(data)
        root = ET.fromstring(data)
        members = root.findall("wfs:member", NS)
        for m in members:
            wc = m[0]
            segs += 1
            t = wc.find("hy-p:geographicalName//gn:text", NS)
            if t is None or not (t.text or "").strip():
                continue
            for pl in wc.findall("hy-p:geometry//gml:posList", NS):
                v = [float(x) for x in pl.text.split()]
                pts = [(v[i + 1], v[i]) for i in range(0, len(v) - 1, 2)]  # lat,lon -> lon,lat
                byname.setdefault(t.text.strip(), []).append(pts)
        print("  %s hydro start=%d got=%d" % (guide, start, len(members)), flush=True)
        if len(members) < count:
            break
        start += count
    feats = []
    for name, lines in sorted(byname.items()):
        if not (name.startswith(("Río ", "Riu ")) or name == "L'Ebre/Río Ebro"):
            continue
        main = name.startswith(MAIN)
        pts = [q for l in lines for q in l]
        if not main and max(max(q[0] for q in pts) - min(q[0] for q in pts), max(q[1] for q in pts) - min(q[1] for q in pts)) < MIN_MINOR_DEG:
            continue  # a short creek is invisible at story zoom
        ls = [[[round(x, 4), round(y, 4)] for x, y in dp(p, SIMPLIFY_DEG if main else SIMPLIFY_MINOR_DEG)] for p in lines]
        feats.append({"type": "Feature", "properties": dict({"name": name}, **({"main": True} if main else {})),
                      "geometry": {"type": "MultiLineString", "coordinates": ls}})
    path = os.path.join(OUT, "rivers-%s.geojson" % guide)
    json.dump({"type": "FeatureCollection", "features": feats}, open(path, "w"), separators=(",", ":"), ensure_ascii=False)
    print("%s rivers: %d segments, %d kept rivers, %d bytes" % (guide, segs, len(feats), os.path.getsize(path)))
    return sorted(byname)


# ---- names ----
KIND = {"Montaña": "peak", "Alineación montañosa": "range", "Depresión": "valley", "Valle": "valley",
        "Capital de municipio": "town", "Núcleos de población": "town"}
CAP = {"peak": 20, "range": 15, "town": 20}  # valleys dropped: mostly barrancos and clots
CONTENT_TOWNS = {
    "rioja": ["Haro", "Logroño", "Laguardia", "Elciego", "Briones", "Labastida", "Alfaro", "Nájera", "Ezcaray",
              "Navarrete", "Fuenmayor", "Cenicero", "San Vicente de la Sonsierra", "Samaniego", "Oyón", "Calahorra", "Ollauri"],
    "priorat": ["Gratallops", "Poboleda", "Porrera", "Torroja del Priorat", "Falset", "El Lloar", "La Morera de Montsant",
                "Escaladei", "Bellmunt del Priorat", "La Vilella Baixa", "La Vilella Alta", "Siurana", "Cornudella de Montsant",
                "Ulldemolins", "Marçà", "El Molar"],
}


# ranges named in the guides, kept even if NGBE files them under another local type
FORCE_RANGES = {"Sierra de Cantabria", "Sierra de la Demanda", "Montsant", "Serra de Montsant", "Sierra de Moncalvillo"}


def spread(items, n, first=()):
    """pick n items, forced ones first, then farthest-point sampling for an even spread."""
    chosen = [i for i in items if i["name"] in first]
    rest = [i for i in items if i not in chosen]
    while rest and len(chosen) < n:
        if not chosen:
            pick = rest[0]
        else:
            pick = max(rest, key=lambda r: min(math.hypot(r["x"] - c["x"], r["y"] - c["y"]) for c in chosen))
        chosen.append(pick)
        rest.remove(pick)
    return chosen[:max(n, len(first))]


def first_name(n):
    """NGBE 'name' is an object, or a list when a place has several names (first one is used)."""
    while isinstance(n, list):
        n = n[0] if n else {}
    n = n.get("GeographicalName", n)
    if isinstance(n, list):
        n = n[0]
    sp = n.get("spelling", {})
    if isinstance(sp, list):
        sp = sp[0]
    sp = sp.get("SpellingOfName", sp)
    if isinstance(sp, list):
        sp = sp[0]
    return (sp.get("text") or "").strip()


def names(guide):
    b = BBOX[guide]
    cdir = os.path.join(CACHE, "ngbe-" + guide)
    os.makedirs(cdir, exist_ok=True)
    start, count, cand, seen = 0, 2000, [], set()
    while True:
        f = os.path.join(cdir, "%06d.json" % start)
        if os.path.exists(f):
            data = open(f, "rb").read()
        else:
            url = ("%s?service=WFS&version=2.0.0&request=GetFeature&typeNames=gn:NamedPlace&count=%d&startIndex=%d"
                   "&outputFormat=application/geo%%2Bjson&bbox=%s" % (NGBE, count, start, bbox_param(b)))
            data = get(url)
            open(f, "wb").write(data)
        fs = json.loads(data)["features"]
        for ft in fs:
            p = ft["properties"]
            lt = p["localType"]["LocalisedCharacterString"]["value"]
            nm = first_name(p["name"])
            if not nm:
                continue
            forced = [t for t in re.findall(r'"text": "([^"]*)"', json.dumps(p["name"], ensure_ascii=False)) if t in FORCE_RANGES]
            if forced:
                nm = forced[0]
            kind = "range" if forced else KIND.get(lt)
            x, y = ft["geometry"]["coordinates"][:2]
            if kind and b[0] <= x <= b[2] and b[1] <= y <= b[3] and (kind, nm) not in seen:
                seen.add((kind, nm))
                cand.append({"name": nm, "kind": kind, "local_type": lt, "x": x, "y": y})
        print("  %s ngbe start=%d got=%d" % (guide, start, len(fs)), flush=True)
        if len(fs) < count:
            break
        start += count
    out = []
    for kind, cap in CAP.items():
        pool = [c for c in cand if c["kind"] == kind]
        out += spread(pool, cap, CONTENT_TOWNS[guide] if kind == "town" else FORCE_RANGES if kind == "range" else ())
    feats = [{"type": "Feature", "properties": {"name": c["name"], "kind": c["kind"]},
              "geometry": {"type": "Point", "coordinates": [round(c["x"], 5), round(c["y"], 5)]}} for c in out]
    path = os.path.join(OUT, "names-%s.geojson" % guide)
    json.dump({"type": "FeatureCollection", "features": feats}, open(path, "w"), separators=(",", ":"), ensure_ascii=False)
    kinds = {k: sum(1 for c in out if c["kind"] == k) for k in CAP}
    print("%s names: %d candidates, kept %d %s, %d bytes" % (guide, len(cand), len(feats), kinds, os.path.getsize(path)))


if __name__ == "__main__":
    what = sys.argv[1] if len(sys.argv) > 1 else "all"
    os.makedirs(OUT, exist_ok=True)
    for g in BBOX:
        if what in ("rivers", "all"):
            rivers(g)
        if what in ("names", "all"):
            names(g)
