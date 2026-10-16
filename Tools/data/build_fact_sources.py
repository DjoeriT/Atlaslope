#!/usr/bin/env python3
"""content/sources.json: the sources fact sheets cite, from the extract headers (official documents), the Wikipedia grape extracts
and (release 4.1) the Wikipedia producer notes."""
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
        # Added by hand in release 4 for the Rioja zone sheets (Review/sources/fetched/rioja-pliego-riojawine.txt).
        "rioja-pliego": {"kind": "official", "title": "Pliego de condiciones DOCa Rioja (Consejo Regulador copy, amendments to AM10)", "url": "https://riojawine.com/wp-content/uploads/2023/07/pliego-de-condiciones-de-la-doca-rioja-en-vigor.pdf", "date": "2023-06-07"},
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
    # Release 4.1: producer notes, from the article's revision of 16 Oct 2026 (Tools/data/wiki_notes.py).
    notes = ROOT / "Review/sources/wikipedia-notes"
    for f in sorted(notes.glob("*.md")) if notes.exists() else []:
        m = WIKI.search(f.read_text())
        if not m: continue
        title, url, rev, date = m.groups()
        out[f"{f.stem}-wikinotes"] = {"kind": "wikipedia", "title": f"Wikipedia (es), «{title}», revision {rev}", "url": f"https://es.wikipedia.org/w/index.php?oldid={rev}", "date": date}
    # Release 4.1: producers from English Wikipedia, after the Spanish articles singled out almost none (owner card, 16 Oct 20:11Z).
    en = ROOT / "Review/sources/wikipedia-en"
    for f in sorted(en.glob("*.md")) if en.exists() else []:
        m = WIKI.search(f.read_text())
        if not m: continue
        title, url, rev, date = m.groups()
        out[f"{f.stem}-enwiki"] = {"kind": "wikipedia", "title": f"Wikipedia (en), «{title}», revision {rev}", "url": f"https://en.wikipedia.org/w/index.php?oldid={rev}", "date": date}
    # The release 4.1 Wikipedia ids ship only when a sheet cites them (they are bundled with the app).
    cited = set(re.findall(r'"([a-z0-9-]+?)(?::p\d+)?"', "".join(f.read_text() for f in (ROOT / "content/facts").glob("*.json"))))
    out = {k: v for k, v in out.items() if not k.endswith(("-wikinotes", "-enwiki")) or k in cited}
    (ROOT / "content").mkdir(exist_ok=True)
    (ROOT / "content/sources.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    print(len(out), "sources")


if __name__ == "__main__":
    main()
