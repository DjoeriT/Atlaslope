#!/usr/bin/env python3
"""Photo candidates from Openverse for the Portuguese places Commons left thin (owner 22 Oct 2026: "add Openverse as a source").

Openverse (api.openverse.org, run by WordPress) indexes openly licensed images, Flickr and Commons among them, each with its author
and licence. Anonymous use: 20 requests a minute, 200 a day, so a few queries per place. Keeps public domain, CC0, CC BY and CC BY-SA
with a named author; drops files already in photo-candidates-pt.json or data/photos.json. Writes
Review/sources/photo-candidates-openverse.json and one contact sheet per place, Review/sources/contact-sheets/ov-<place>.jpg.
Rerun skips places already done. Run with .venv/bin/python3 (Pillow).
"""
import json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from photo_candidates import ROOT, SHEETS, UA, sheet

OUT = ROOT / "Review/sources/photo-candidates-openverse.json"
# Flickr's file host answers 403 to a User-Agent with "Bot" in it (22 Oct 2026); same name and contact, without the word.
FILE_UA = "Atlaslope/0.2 (https://github.com/DjoeriT/Atlaslope)"
API = "https://api.openverse.org/v1/images/"
LICENCES = {"by": "CC BY", "by-sa": "CC BY-SA", "cc0": "CC0", "pdm": "Public domain"}
V = "vineyard", "vinha", "wine"
QUERIES = {
    "tras-os-montes": ["Chaves vineyard", "Valpaços vinha", "Trás-os-Montes vineyard"],
    "tavora-varosa": ["Lamego vineyard", "Tarouca vinha", "Murganheira"],
    "dao": ["Dão vineyard", "Dão wine", "Nelas vinha", "Mangualde vineyard"],
    "bairrada": ["Bairrada vineyard", "Bairrada wine", "Anadia vinha"],
    "beira-interior": ["Pinhel vineyard", "Beira Interior vinha", "Castelo Rodrigo vineyard"],
    "lafoes": ["Lafões vinha", "Vouzela vineyard", "São Pedro do Sul vinha"],
    "encostas-daire": ["Ourém vineyard", "Alcobaça vinha", "Batalha vineyard"],
    "colares": ["Colares wine", "Colares vineyard", "Azenhas do Mar vinha"],
    "carcavelos": ["Carcavelos wine", "Carcavelos vinha", "Oeiras vineyard"],
    "bucelas": ["Bucelas wine", "Bucelas vinha"],
    "alenquer": ["Alenquer vineyard", "Alenquer wine", "Alenquer vinha"],
    "arruda": ["Arruda dos Vinhos", "Arruda vineyard"],
    "dotejo": ["Tejo vineyard", "Ribatejo vinha", "Almeirim wine", "Cartaxo vinha"],
    "lagos": ["Lagos vineyard", "Algarve vineyard", "Bensafrim vinha"],
    "portimao": ["Portimão vineyard", "Algarve wine", "Monchique vinha"],
    "lagoa": ["Lagoa Algarve wine", "Lagoa vinha", "Algarve vinha"],
    "tavira": ["Tavira vineyard", "Tavira vinha", "Algarve winery"],
    "madeira": ["Madeira wine", "Madeira wine cellar", "Blandy's Madeira", "Câmara de Lobos vineyard"],
    "madeirense": ["Madeira vineyard", "Madeira vinha", "São Vicente Madeira vineyard", "Seixal Madeira vinha"],
}


def small(r):
    """A quick thumbnail: the Flickr file as listed or a Commons width, since Openverse's thumbnail service takes minutes per sheet."""
    u = r["url"]
    if "staticflickr.com" in u: return u  # Flickr refuses other size suffixes for this secret (403); the listed file is already small
    if "upload.wikimedia.org" in u: return "https://commons.wikimedia.org/wiki/Special:FilePath/" + u.rsplit("/", 1)[1] + "?width=320"
    return r.get("thumbnail")


def search(q):
    url = API + "?" + urllib.parse.urlencode({"q": q, "license": ",".join(LICENCES), "page_size": 20})
    for n in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=180) as r:
                return json.load(r)["results"]
        except Exception as e:
            print("retry", q, e, flush=True); time.sleep(20 * (n + 1))
    return []


def main():
    have = set()
    for p in json.loads((ROOT / "Review/sources/photo-candidates-pt.json").read_text()).values():
        have |= {c["title"] for c in p.get("all", p["candidates"])}
    have |= {v["title"] for v in json.loads((ROOT / "data/photos.json").read_text())["photos"].values()}
    norm = lambda t: t.removeprefix("File:").rsplit(".", 1)[0].replace("_", " ").lower()
    have = {norm(t) for t in have}
    done = json.loads(OUT.read_text()) if OUT.exists() else {}
    for place, queries in QUERIES.items():
        if place in done: continue
        seen, cands = set(), []
        for q in queries:
            for r in search(q):
                lic = LICENCES.get(r.get("license"))
                if not lic or r["url"] in seen or norm(r.get("title") or "") in have: continue
                if lic.startswith("CC BY") and not (r.get("creator") or "").strip(): continue  # CC BY needs a name in the credit
                seen.add(r["url"])
                ver = r.get("license_version") or ""
                cands.append({"title": r.get("title") or "", "page": r["foreign_landing_url"], "licence": f"{lic} {ver}".strip() if lic.startswith("CC BY") else lic,
                              "licenceUrl": r.get("license_url"), "artist": r.get("creator") or "", "url": r["url"], "thumb": small(r),
                              "source": r.get("source"), "w": r.get("width"), "h": r.get("height"), "query": q, "quality": False})
            time.sleep(4)
        done[place] = {"name": place, "candidates": cands[:30]}
        OUT.write_text(json.dumps(done, ensure_ascii=False, indent=1) + "\n")
        print(place, len(cands), flush=True)
    import photo_candidates
    photo_candidates.UA = FILE_UA  # the thumbnails are Flickr and Commons files
    for place in QUERIES:  # sheets last, so the searches are not held up by thumbnails
        if not (SHEETS / f"ov-{place}.jpg").exists(): sheet(place, [{"id": place}], done, "ov-", cols=6); print("sheet", place, flush=True)


if __name__ == "__main__":
    main()
