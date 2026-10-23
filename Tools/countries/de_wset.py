#!/usr/bin/env python3
"""Germany pilot sources and empty fact sheets (issue #149, decisions #71-#78, #93). Costs no tokens.

Usage: de_wset.py --sources | --content [<id> ...]     (no ids: every place below)

The guide source is each place's current product specification, from the BLE (Bundesanstalt fuer Landwirtschaft und Ernaehrung):
Mosel AM04 (12 pp, 23 Sep 2025), Rheingau 2019 (16 pp; the 2026 amendment is a proposal and not the current text); wave 1 (23 Oct 2026)
adds Ahr, Mittelrhein, Nahe, Pfalz and Rheinhessen, each the PDF the BLE page links on 23 Oct 2026. The PDFs are in
$ATLASLOPE_RAW/countries/de/ (data/SOURCES.md). --sources writes the page text to Review/sources/fetched/spec-<id>.txt, cuts it with
Tools/guides/extract.py (every page stays: no German marker applies) and lists "<id>-spec" in the group's manifest.json.
--content adds the source to content/sources.json and an empty fact sheet to content/facts/<group>.json for `headless.py --sheets`.
"""
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW = Path(os.environ.get("ATLASLOPE_RAW", Path.home() / "Developer/Atlaslope-raw")) / "countries/de"
BLE = "https://www.ble.de/eu-qualitaetskennzeichen-wein"
PLACES = [
    {"id": "mosel", "name": "Mosel", "group": "de-mosel", "pdf": "spec-Mosel.pdf", "file": "PDO-DE-A1270",
     "title": "Mosel PDO-DE-A1270: Produktspezifikation (BLE, German, standard amendment AM04, approved 5 Dec 2025)"},
    {"id": "rheingau", "name": "Rheingau", "group": "de-rheingau", "pdf": "spec-Rheingau.pdf", "file": "PDO-DE-A1273",
     "title": "Rheingau PDO-DE-A1273: Produktspezifikation (BLE, German, text of April 2019; the 2026 amendment is a proposal)"},
    {"id": "ahr", "name": "Ahr", "group": "de-ahr", "pdf": "spec-Ahr.pdf", "file": "PDO-DE-A0867",
     "title": "Ahr PDO-DE-A0867: Produktspezifikation (BLE, German, 16 pp, as linked on 23 Oct 2026)"},
    {"id": "mittelrhein", "name": "Mittelrhein", "group": "de-mittelrhein", "pdf": "spec-Mittelrhein.pdf", "file": "PDO-DE-A1269",
     "title": "Mittelrhein PDO-DE-A1269: Produktspezifikation (BLE, German, 11 pp, as linked on 23 Oct 2026)"},
    {"id": "nahe", "name": "Nahe", "group": "de-nahe", "pdf": "spec-Nahe.pdf", "file": "PDO-DE-A1271",
     "title": "Nahe PDO-DE-A1271: Produktspezifikation (BLE, German, 14 pp, as linked on 23 Oct 2026)"},
    {"id": "rheinhessen", "name": "Rheinhessen", "group": "de-rheinhessen", "pdf": "spec-Rheinhessen.pdf", "file": "PDO-DE-A1274",
     "title": "Rheinhessen PDO-DE-A1274: Produktspezifikation (BLE, German, 10 pp, as linked on 23 Oct 2026)"},
    {"id": "pfalz", "name": "Pfalz", "group": "de-pfalz", "pdf": "spec-Pfalz.pdf", "file": "PDO-DE-A1272",
     "title": "Pfalz PDO-DE-A1272: Produktspezifikation (BLE, German, 10 pp, as linked on 23 Oct 2026)"},
]
STUB = {"why": {"text": "", "cite": []}, "grapes": {"main": [], "cite": [], "others": [], "othersCite": []},
        "styles": {"kinds": [], "text": "", "cite": []}, "climate": {"text": "", "cite": []}, "soil": {"text": "", "cite": []},
        "altitude": {"text": "", "cite": []}, "tastes": {"text": "", "cite": []}, "famous": {"styles": [], "cite": []},
        "producers": {"items": [], "cite": []}}


def dump(path: Path, doc) -> None:
    path.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


def chosen(ids):
    return [p for p in PLACES if not ids or p["id"] in ids]


def sources(ids) -> None:
    for p in chosen(ids):
        txt = ROOT / f"Review/sources/fetched/spec-{p['id']}.txt"
        subprocess.run(["pdftotext", "-layout", str(RAW / p["pdf"]), str(txt)], check=True)
        gp = ROOT / "Review/guides-pipeline" / p["group"]
        gp.mkdir(parents=True, exist_ok=True)
        subprocess.run([sys.executable, str(ROOT / "Tools/guides/extract.py"), str(txt), str(gp / f"{p['id']}.extract.txt")],
                       check=True, capture_output=True)
        dump(gp / "manifest.json", {"sources": {f"{p['id']}-spec": str(txt.relative_to(ROOT))}})
        print(f"sources: {gp.relative_to(ROOT)}")


def content(ids) -> None:
    src_path = ROOT / "content/sources.json"
    known = json.loads(src_path.read_text(encoding="utf-8"))
    for p in chosen(ids):
        known.setdefault(f"{p['id']}-spec", {"kind": "official", "url": BLE, "date": "2026-10-23", "title": p["title"]})
        fp = ROOT / f"content/facts/{p['group']}.json"
        doc = json.loads(fp.read_text(encoding="utf-8")) if fp.exists() else {"region": p["group"], "sheets": []}
        if p["id"] not in {s["id"] for s in doc["sheets"]}:
            doc["sheets"].append({"id": p["id"], **json.loads(json.dumps(STUB))})
        dump(fp, doc)
        print(f"content: {p['id']} -> {fp.relative_to(ROOT)}")
    dump(src_path, known)


if __name__ == "__main__":
    {"--sources": sources, "--content": content}[sys.argv[1]](sys.argv[2:])
