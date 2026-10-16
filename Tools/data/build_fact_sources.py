#!/usr/bin/env python3
"""content/sources.json: the sources fact sheets cite, from the extract headers (official documents) and the Wikipedia index."""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HEAD = re.compile(r"^Source: (EU single document|pliego de condiciones), (\S+) \((\S+)\), dated ([\d-]+)\..*?Cite as «([^»]+?), p\. N»", re.M)
WIKI = re.compile(r"^Article: «([^»]+)», (\S+), revision (\d+) of ([\d-]+)\.", re.M)


def main():
    places = {p["id"]: p for p in json.loads((ROOT / "data/places.json").read_text())["places"]}
    out = {
        "measures": {"kind": "measured", "title": "Measured inside the boundary (Atlaslope, from Mapzen Terrarium elevation)", "url": "https://github.com/DjoeriT/Atlaslope/blob/main/data/SOURCES.md", "date": "2026-10-16"},
        "koppen": {"kind": "measured", "title": "Köppen-Geiger: Beck et al. 2023, CC BY 4.0, 1991–2020", "url": "https://figshare.com/articles/dataset/21789074", "date": "2023"},
        "mapa-list": {"kind": "official", "title": "MAPA, list of protected wine names", "url": "https://github.com/DjoeriT/Atlaslope/blob/main/data/SOURCES.md", "date": "2026-07-02"},
    }
    for f in sorted((ROOT / "Review/sources/places").glob("*.md")):
        m = HEAD.search(f.read_text())
        if not m: continue
        kind, _, url, date, cite = m.groups()
        name = places[f.stem]["name"] if f.stem in places else f.stem
        out[f"{f.stem}-doc"] = {"kind": "official", "title": f"{cite} ({'EU single document' if kind.startswith('EU') else 'pliego de condiciones'}, {name})", "url": url, "date": date}
    for f in sorted((ROOT / "Review/sources/wikipedia").glob("*.md")) if (ROOT / "Review/sources/wikipedia").exists() else []:
        m = WIKI.search(f.read_text())
        if not m: continue
        title, url, rev, date = m.groups()
        out[f"{f.stem}-wiki"] = {"kind": "wikipedia", "title": f"Wikipedia (es), «{title}», revision {rev}", "url": f"https://es.wikipedia.org/w/index.php?oldid={rev}", "date": date}
    (ROOT / "content").mkdir(exist_ok=True)
    (ROOT / "content/sources.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    print(len(out), "sources")


if __name__ == "__main__":
    main()
