#!/usr/bin/env python3
"""Photo candidates from Wikimedia Commons for every place the quiz asks (and the Rioja zones).

Runs in GitHub Actions (data-photos workflow; Commons throttles the cloud container). Writes Review/sources/photo-candidates.json; about 5 requests per place)
For each place: a text search of Commons files ("<name>" with wine words) plus a geosearch within 10 km of the centroid, kept only when the
licence is public domain, CC0, CC BY or CC BY-SA and the image is at least 1600 px wide. Ranked: Commons quality flags first (featured,
quality, valued), then a wine word in the title or description, then size. The top nine per place are kept (three slots, three candidates each),
with the credit and licence the SOURCES.md entry needs. Release 4 picks from these on contact sheets.
"""
import json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
API = "https://commons.wikimedia.org/w/api.php"
UA = "AtlaslopeDataBot/0.1 (https://github.com/DjoeriT/Paraje)"
OK = re.compile(r"^(public domain|pd\b|cc0|cc by(-sa)? ?\d)", re.I)
WINE = re.compile(r"vi[nñ]|wine|vino|vi[ñn]edo|vineyard|bodega|uva|grape|cellar|celler|adega|viña|vendimia|txakol", re.I)
FLAGS = {"Featured pictures on Wikimedia Commons": 3, "Quality images": 2, "Valued images sorted by promotion date": 1}


def get(params):
    params = {**params, "format": "json", "formatversion": "2"}
    url = API + "?" + urllib.parse.urlencode(params)
    for attempt in range(8):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 7: raise
            time.sleep(2 + 2 * attempt)


def titles_for(place):
    name = place["name"].split(" / ")[0]
    found = []
    q = f'"{name}" (viñedo OR vineyard OR vino OR wine OR viña OR bodega)'
    r = get({"action": "query", "list": "search", "srnamespace": 6, "srlimit": 40, "srsearch": q})
    found += [s["title"] for s in r["query"]["search"]]
    if place.get("centroid"):
        lon, lat = place["centroid"]
        r = get({"action": "query", "list": "geosearch", "gsnamespace": 6, "gslimit": 100, "gsradius": 10000, "gscoord": f"{lat}|{lon}"})
        found += [g["title"] for g in r["query"]["geosearch"]]
    return list(dict.fromkeys(found))


def info(titles):
    out = []
    for i in range(0, len(titles), 40):
        r = get({"action": "query", "titles": "|".join(titles[i:i + 40]), "prop": "imageinfo|categories", "clshow": "!hidden",
                 "cllimit": "max", "iiprop": "url|size|extmetadata|mime", "iiurlwidth": 640})
        for p in r["query"].get("pages", []):
            ii = (p.get("imageinfo") or [None])[0]
            if not ii or ii.get("mime") not in ("image/jpeg", "image/png"): continue
            m = ii.get("extmetadata", {})
            lic = m.get("LicenseShortName", {}).get("value", "")
            if not OK.match(lic) or ii["width"] < 1600: continue
            cats = {c["title"].split(":", 1)[1] for c in p.get("categories", [])}
            desc = re.sub("<[^>]+>", "", m.get("ImageDescription", {}).get("value", ""))[:300]
            out.append({"title": p["title"], "page": ii["descriptionurl"], "thumb": ii.get("thumburl"), "width": ii["width"], "height": ii["height"],
                        "licence": lic, "licenceUrl": m.get("LicenseUrl", {}).get("value"),
                        "artist": re.sub("<[^>]+>", "", m.get("Artist", {}).get("value", "")).strip(),
                        "credit": re.sub("<[^>]+>", "", m.get("Credit", {}).get("value", "")).strip()[:200], "description": desc,
                        "quality": max([FLAGS.get(c, 0) for c in cats] or [0]), "wine": bool(WINE.search(p["title"] + " " + desc))})
    return out


def main():
    tree = json.loads((ROOT / "data/places.json").read_text())
    out_path = ROOT / "Review/sources/photo-candidates.json"
    done = json.loads(out_path.read_text()) if out_path.exists() else {}
    for p in tree["places"]:
        if p["quiz"] == "none" or p["id"] in done: continue
        cands = info(titles_for(p))
        cands.sort(key=lambda c: (-c["quality"], -c["wine"], -c["width"] * c["height"]))
        done[p["id"]] = {"name": p["name"], "candidates": cands[:9], "seen": len(cands)}
        print(p["id"], len(cands), flush=True)
        out_path.write_text(json.dumps(done, ensure_ascii=False, indent=1) + "\n")
        time.sleep(1)


if __name__ == "__main__":
    sys.exit(main())
