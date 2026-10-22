#!/usr/bin/env python3
"""Italy first-wave sources and empty fact sheets (decisions #70, #80). Costs no tokens.

Usage: it_wset.py --sources <id> ... | all     then     it_wset.py --content <id> ...

Reads data/countries/it/places.json (87 places by map group). The guide source is each place's national rulebook (MASAF
disciplinare, current text; many EU single documents are older than the last national change, Italy plan "Context"), taken
from the DOP archives in $ATLASLOPE_RAW/countries/it/disc/x/ (default ~/Developer/Atlaslope-raw; data/SOURCES.md).
--sources writes its text to Review/sources/fetched/disc-<id>.txt, cuts it with Tools/guides/extract.py into
Review/guides-pipeline/<group>/<id>.extract.txt and lists "<id>-disc" in that group's manifest.json.
--content adds "<id>-disc" to content/sources.json and an empty fact sheet to content/facts/<group>.json, as fr_wset.py does,
so `headless.py --sheets <group> <run> <id>` can fill it.
"""
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW = Path(os.environ.get("ATLASLOPE_RAW", Path.home() / "Developer/Atlaslope-raw")) / "countries/it"
PLACES = ROOT / "data/countries/it/places.json"
MASAF = "https://www.masaf.gov.it/flex/cm/pages/ServeBLOB.php/L/IT/IDPagina/4625"
STUB = {"why": {"text": "", "cite": []}, "grapes": {"main": [], "cite": [], "others": [], "othersCite": []},
        "styles": {"kinds": [], "text": "", "cite": []}, "climate": {"text": "", "cite": []}, "soil": {"text": "", "cite": []},
        "altitude": {"text": "", "cite": []}, "tastes": {"text": "", "cite": []}, "famous": {"styles": [], "cite": []},
        "producers": {"items": [], "cite": []}}


ART = re.compile(r"^\s*art(icolo|\.)\s*(\d+)\b", re.I)
TAIL = re.compile(r"^\s*allegato\b", re.I)


def trim(text: str, art3=60, tail=40, art=150) -> str:
    """Cuts what the guide does not need and every step would re-read (Tuscany batch, 22 Oct 2026: Chianti's 146 KB extract
    cost 1.7M tokens, past the 1.5x guard): article 3 after its first lines (long boundary descriptions; the outline is built
    elsewhere), and whatever follows the main text (annexes, a second rulebook) after its first lines. Page markers stay, so
    "p<n>" cites still match the PDF; each cut leaves a note the writer and checker see."""
    lines = text.split("\n")
    keep = lambda chunk, n, what: chunk[:n] + [m for m in chunk[n:] if m.startswith("=== PAGE")] + \
        ([f"[{len(chunk) - n} lines of {what} cut by it_wset.py; see the rulebook]"] if len(chunk) > n else [])
    heads = [(i, int(m[2])) for i, l in enumerate(lines) if (m := ART.match(l))]
    a3 = next((i for i, n in heads if n == 3), None)
    a4 = next((i for i, n in heads if n == 4 and a3 is not None and i > a3), None)
    if a3 is not None and a4 is not None and a4 - a3 > art3:
        lines = lines[:a3] + keep(lines[a3:a4], art3, "article 3 (zone boundaries)") + lines[a4:]
        heads = [(i, int(m[2])) for i, l in enumerate(lines) if (m := ART.match(l))]
    for n in sorted({n for _, n in heads if n != 3}, reverse=True):  # any other article past `art` lines (North-East batch, 23 Oct 2026:
        # Alto Adige's per-type tasting notes in article 6 kept its extract at 69 KB and the guide at 2.1M tokens)
        heads = [(i, int(m[2])) for i, l in enumerate(lines) if (m := ART.match(l))]
        s = next((i for i, k in heads if k == n), None)
        e = next((i for i, k in heads if s is not None and i > s and k != n), None)
        if s is not None and e is not None and e - s > art:
            lines = lines[:s] + keep(lines[s:e], art, f"article {n}") + lines[e:]
    heads = [(i, int(m[2])) for i, l in enumerate(lines) if (m := ART.match(l))]
    last = max((n for _, n in heads), default=0)
    end_main = next((i for i, n in heads if n == last), None)
    after = next((i for i, l in enumerate(lines) if end_main is not None and i > end_main and
                  (TAIL.match(l) or (ART.match(l) and int(ART.match(l)[2]) == 1))), None)
    if after is not None:
        lines = lines[:after] + keep(lines[after:], tail, "annexes after the main text")
    return "\n".join(lines)


def dump(path: Path, doc) -> None:
    path.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


def sources(places: list) -> None:
    pdfs = {p.stem.strip(): p for p in (RAW / "disc/x").rglob("*.pdf")}
    manifests = {}
    for p in places:
        pdf = pdfs.get(p["rulebook"])
        if not pdf:
            print(f"no rulebook: {p['id']} ({p['rulebook']})")
            continue
        txt = ROOT / f"Review/sources/fetched/disc-{p['id']}.txt"
        subprocess.run(["pdftotext", "-layout", str(pdf), str(txt)], check=True)
        gp = ROOT / "Review/guides-pipeline" / p["group"]
        gp.mkdir(parents=True, exist_ok=True)
        subprocess.run([sys.executable, str(ROOT / "Tools/guides/extract.py"), str(txt), str(gp / f"{p['id']}.extract.txt")],
                       check=True, capture_output=True)
        ex = gp / f"{p['id']}.extract.txt"
        ex.write_text(trim(ex.read_text(encoding="utf-8")), encoding="utf-8")
        manifests.setdefault(gp, {})[f"{p['id']}-disc"] = str(txt.relative_to(ROOT))
    for gp, m in manifests.items():
        mp = gp / "manifest.json"
        old = json.loads(mp.read_text())["sources"] if mp.exists() else {}
        dump(mp, {"sources": old | m})
        print(f"sources: {gp.relative_to(ROOT)}: {len(m)} places")


def content(places: list) -> None:
    src_path = ROOT / "content/sources.json"
    known = json.loads(src_path.read_text(encoding="utf-8"))
    for p in places:
        known.setdefault(f"{p['id']}-disc", {"kind": "official", "url": MASAF, "date": "2026-10-22",
                                             "title": f"{p['name']} {p['fileNumber']}: disciplinare di produzione (MASAF, Italian, "
                                                      f"file \"{p['rulebook']}\" in the DOP archive)"})
        fp = ROOT / f"content/facts/{p['group']}.json"
        doc = json.loads(fp.read_text(encoding="utf-8")) if fp.exists() else {"region": p["group"], "sheets": []}
        if p["id"] not in {s["id"] for s in doc["sheets"]}:
            doc["sheets"].append({"id": p["id"], **json.loads(json.dumps(STUB))})
        dump(fp, doc)
        print(f"content: {p['id']} -> {fp.relative_to(ROOT)}, {p['id']}-disc")
    dump(src_path, known)


def main() -> None:
    places = json.loads(PLACES.read_text(encoding="utf-8"))["places"]
    flag, ids = sys.argv[1], sys.argv[2:]
    pick = places if ids == ["all"] else [p for p in places if p["id"] in ids]
    if len(pick) != (len(places) if ids == ["all"] else len(ids)):
        raise SystemExit(f"unknown ids: {set(ids) - {p['id'] for p in places}}")
    {"--sources": sources, "--content": content}[flag](pick)


if __name__ == "__main__":
    main()
