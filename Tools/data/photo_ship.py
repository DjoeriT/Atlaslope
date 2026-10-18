#!/usr/bin/env python3
"""Ship the picked photos: Review/sources/photo-picks.json -> public/photos/<placeId>-<n>.webp and data/photos.json.

Runs in GitHub Actions (data-photos-ship workflow; Commons throttles the cloud container). Needs Pillow.
Each photo is fetched as Commons' own 1200 px rendition and saved once as WebP (quality 72, about 150 KB; decision #44).
"""
import io, json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
API = "https://commons.wikimedia.org/w/api.php"
UA = "AtlaslopeDataBot/0.2 (https://github.com/DjoeriT/Atlaslope)"
OUT = ROOT / "public/photos"


def clean_artist(raw):
    """The author as a credit names them: Commons' Artist field minus its extras (owner review, 18 Oct 2026: "Unknown authorUnknown
    author" on a card). "Unknown" when Commons names nobody; the card then credits Wikimedia Commons, as CC asks only for a name supplied."""
    a = re.sub(r"\s+", " ", raw.replace("&amp;", "&")).strip()
    a = re.split(r"\s*Credit information\b", a)[0]                # Commons' credit template text run on after the name
    a = re.sub(r"^Photograph by\s+|\s*\((?:www\.|https?://)[^)]*\)\.?$", "", a)
    a = re.sub(r"\s+from\s+[^,()]+(?:,\s*[^,()]+)?$", "", a)       # Flickr's "Name from City, Country"
    a = a.strip()
    if not a or re.fullmatch(r"(?:Unknown(?: author)?)+", a, re.I) or re.fullmatch(r"(Unknown author)+", a, re.I):
        return "Unknown"
    return a[:80]


def fetch(url, tries=8):
    for attempt in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == tries - 1: raise
            time.sleep(4 + 4 * attempt)


def rendition(title):
    q = urllib.parse.urlencode({"action": "query", "titles": title, "prop": "imageinfo", "iiprop": "url", "iiurlwidth": 1200, "format": "json", "formatversion": "2"})
    return json.loads(fetch(f"{API}?{q}"))["query"]["pages"][0]["imageinfo"][0]["thumburl"]


def alt(c):
    t = re.sub(r"^File:|\.(jpe?g|png)$", "", c["title"], flags=re.I)
    t = re.sub(r"\s*[-_(]*\s*(panoramio|\d{6,}|IMG[\s_]\d+)[)\s]*", " ", t, flags=re.I)
    return re.sub(r"\s+", " ", t).strip(" -_,")


def main():
    picks = json.loads((ROOT / "Review/sources/photo-picks.json").read_text())["picks"]
    OUT.mkdir(parents=True, exist_ok=True)
    photos_path = ROOT / "data/photos.json"
    doc = json.loads(photos_path.read_text())
    for pid, items in picks.items():
        for n, c in enumerate(items, 1):
            key = f"{pid}-{n}"
            if doc["photos"].get(key, {}).get("title") == c["title"] and (OUT / f"{key}.webp").exists(): continue  # a reorder or swap re-fetches
            try:
                img = Image.open(io.BytesIO(fetch(rendition(c["title"])))).convert("RGB")
            except Exception as e:
                print(key, "error:", e, flush=True); continue
            img.thumbnail((1200, 1200))
            img.save(OUT / f"{key}.webp", "WEBP", quality=72, method=6)
            artist = clean_artist(c.get("artist") or "")
            doc["photos"][key] = {"alt": alt(c), "artist": artist, "licence": c["licence"], "licenceUrl": c.get("licenceUrl"), "page": c["page"], "title": c["title"]}
            print(key, (OUT / f"{key}.webp").stat().st_size // 1024, "KB", flush=True)
            photos_path.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n")
            time.sleep(1)
    wanted = {f"{pid}-{n}" for pid, items in picks.items() for n in range(1, len(items) + 1)}
    for key in [k for k in doc["photos"] if k not in wanted]:  # a place that now has fewer picks
        (OUT / f"{key}.webp").unlink(missing_ok=True)
        del doc["photos"][key]
    photos_path.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n")


if __name__ == "__main__":
    sys.exit(main())
