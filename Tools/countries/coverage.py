#!/usr/bin/env python3
"""Coverage of the country data pull (issue #149): what the raw data holds per country, measured. Costs no tokens.

Usage: coverage.py [--json]

Reads data/countries/<cc>/register.json and data/raw/countries/<cc>/ (from Tools/countries/pull.py) and prints, per country:
names by type; single documents fetched and how many are scans with no text layer; how many entries have
Official Journal items after the single document (later amendments); and which register names an official outline file
names (France: INAO parcel delimitation, field `denom`; Italy: Regione Piemonte DOC/DOCG areas, field `denominazi`).
Names match after lower case, accents and punctuation are dropped, so a miss is a lead to check, not proof.
"""
import csv
import io
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "data" / "raw" / "countries"
OUTLINES = {
    "fr": ("/vsizip/fr/inao-delim-parcellaire-aoc-shp.zip/2026-10-19_delim-parcellaire-aoc-shp.shp", "denom",
           "type_prod = 'Vins'"),
    "it": ("/vsizip/it/piemonte-aree-vini-doc-docg.zip/aree_produzione_vini.shp", "denominazi", None),
}
SCAN = 1500  # bytes of pdftotext output below which a sheet is taken as a scan without a text layer


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def year(text: str | None) -> int | None:
    m = re.search(r"(?:\((\d{4})\)|C/(\d{4})/|(\d{4}))", text or "")
    return int(next(g for g in m.groups() if g)) if m else None


def outline_names(cc: str) -> set[str]:
    if cc not in OUTLINES:
        return set()
    path, field, where = OUTLINES[cc]
    sql = f"SELECT DISTINCT {field} FROM \"{Path(path).stem}\"" + (f" WHERE {where}" if where else "")
    out = subprocess.run(["ogr2ogr", "-f", "CSV", "/vsistdout/", path, "-dialect", "sqlite", "-sql", sql],
                         cwd=RAW, capture_output=True, text=True, check=True).stdout
    return {norm(r[field]) for r in csv.DictReader(io.StringIO(out)) if r.get(field)}


def country(cc: str) -> dict:
    entries = json.loads((ROOT / "data" / "countries" / cc / "register.json").read_text())["entries"]
    att = RAW / cc / "att"
    outl = outline_names(cc)
    r = {"names": len(entries), "pdo": sum(e["type"] == "PDO" for e in entries), "sheets": 0, "scans": [],
         "laterOJ": 0, "noSheet": [], "outlineMatched": 0, "outlineMissing": [],
         "outlineNames": len(outl)}
    for e in entries:
        if e["summarySheets"]:
            uri = e["summarySheets"][-1]
            txt = att / f"{uri}.txt"
            if (att / f"{uri}.pdf").exists():
                r["sheets"] += 1
                if not txt.exists() or txt.stat().st_size < SCAN:
                    r["scans"].append(e["fileNumber"])
        else:
            r["noSheet"].append(e["fileNumber"])
        pub_years = [y for y in (year(p["text"]) for p in e["publications"]) if y]
        if pub_years:
            r["laterOJ"] += 1
        if outl:
            if any(norm(n) in outl for n in e["names"]):
                r["outlineMatched"] += 1
            elif e["type"] == "PDO":
                r["outlineMissing"].append(e["names"][0])
    return r


def main() -> None:
    res = {cc: country(cc) for cc in ("pt", "fr", "it")}
    if "--json" in sys.argv:
        print(json.dumps(res, ensure_ascii=False, indent=1))
        return
    for cc, r in res.items():
        print(f"{cc}: {r['names']} names ({r['pdo']} PDO); {r['sheets']} sheets, {len(r['scans'])} scans without text; "
              f"{len(r['noSheet'])} without a sheet; {r['laterOJ']} with later OJ items; outline file names "
              f"{r['outlineNames']}, register names matched {r['outlineMatched']}, PDO not matched {len(r['outlineMissing'])}")
        if r["outlineMissing"]:
            print("  PDO not in outline file:", "; ".join(r["outlineMissing"][:40]))


if __name__ == "__main__":
    main()
