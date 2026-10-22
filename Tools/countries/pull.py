#!/usr/bin/env python3
"""Country data pull (issue #149, owner option B, 22 Oct 2026): the raw data layer for Portugal, France and Italy. Costs no tokens.

Usage: pull.py [--country pt|fr|it ...] [--step register|docs|outlines ...] [--limit N] [--from-file LIST.json]

register  one GET of the eAmbrosia list; keeps the country's wine entries (PDO and PGI) and writes
          data/countries/<cc>/register.json (facts only: file number, names, type, status, dates, attachment ids).
docs      downloads each entry's summary sheet (the EU single document) as PDF from the eAmbrosia attachments endpoint,
          and its text with `pdftotext -layout`, into data/raw/countries/<cc>/att/ (git-ignored). Skips files already there.
outlines  official area and admin outlines into data/raw/countries/<cc>/ (git-ignored): France INAO parcel delimitation
          (shapefile zip); Portugal CAOP2025 parishes and municipalities (OGC API, paged GeoJSON); Italy ISTAT
          municipality limits (generalised) and Piemonte DOC/DOCG areas.

Every file fetched is listed in data/countries/<cc>/manifest.json (url, bytes, sha256, date), which is committed, so the
raw folder can be rebuilt and checked. Sources and licences: data/SOURCES.md. One line of status per step; failures are
listed, never retried in a loop.
"""
import argparse
import datetime
import hashlib
import json
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
UA = "Atlaslope data check"
LIST = "https://webgate.ec.europa.eu/eambrosia-api/api/v1/geographical-indications"
ATT = "https://webgate.ec.europa.eu/eambrosia-api/api/v1/attachments/"
CAOP = "https://ogcapi.dgterritorio.gov.pt/collections/{}/items?f=json&limit=500&offset={}"
OUTLINES = {
    "fr": [("inao-delim-parcellaire-aoc-shp.zip",
            "https://static.data.gouv.fr/resources/delimitation-parcellaire-des-aoc-viticoles-de-linao/20261019-214156/"
            "2026-10-19-delim-parcellaire-aoc-shp.zip")],
    "it": [("istat-limiti-01012025-g.zip",
            "https://www.istat.it/storage/cartografia/confini_amministrativi/generalizzati/2025/Limiti01012025_g.zip"),
           ("piemonte-aree-vini-doc-docg.zip",
            "https://www.datigeo-piem-download.it/direct/Geoportale/RegionePiemonte/AGRICOLTURA/Aree_vini_DOC_DOCG/"
            "aree_produzione_vini.zip")],
    "pt": [],  # CAOP is paged, see caop()
}
TODAY = datetime.date.today().isoformat()


def get(url: str, timeout: int = 120) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def out_dir(cc: str) -> Path:
    return ROOT / "data" / "countries" / cc


def raw_dir(cc: str) -> Path:
    return ROOT / "data" / "raw" / "countries" / cc


class Manifest:
    def __init__(self, cc: str):
        self.path = out_dir(cc) / "manifest.json"
        self.files = json.loads(self.path.read_text())["files"] if self.path.exists() else {}

    def add(self, rel: str, url: str, data: bytes) -> None:
        self.files[rel] = {"url": url, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest(), "fetched": TODAY}

    def save(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        body = {"$comment": "Files fetched by Tools/countries/pull.py into data/raw/countries/ (git-ignored). "
                            "Sources in data/SOURCES.md.", "files": dict(sorted(self.files.items()))}
        self.path.write_text(json.dumps(body, ensure_ascii=False, indent=1) + "\n")


def entry(g: dict) -> dict:
    return {
        "fileNumber": g.get("fileNumber"),
        "giIdentifier": g.get("giIdentifier"),
        "names": g.get("protectedNames") or [],
        "type": g.get("giType"),
        "status": g.get("status"),
        "euProtectionDate": g.get("euProtectionDate"),
        "modificationDate": g.get("modificationDate"),
        "amendmentInProgress": bool(g.get("amendmentsInProgressFlag")),
        "productCategories": g.get("productCategories") or [],
        "summarySheets": [s.get("uri") for s in g.get("summarySheets") or [] if s.get("uri")],
        "publications": [{"text": p.get("text"), "uri": p.get("uri")} for p in g.get("publications") or []],
    }


def register(cc: str, raw: list) -> list:
    entries = sorted((entry(g) for g in raw if cc.upper() in (g.get("countries") or []) and g.get("productType") == "WINE"
                      and not g.get("removedFlag")), key=lambda e: e["fileNumber"] or "")
    path = out_dir(cc) / "register.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"$comment": f"EU register (eAmbrosia) wine entries for {cc.upper()}, written by "
                                            "Tools/countries/pull.py. Source in data/SOURCES.md.",
                                "fetched": TODAY, "entries": entries}, ensure_ascii=False, indent=1) + "\n")
    pdo = sum(e["type"] == "PDO" for e in entries)
    print(f"{cc} register: {len(entries)} wine entries ({pdo} PDO, {len(entries) - pdo} PGI)")
    return entries


def docs(cc: str, entries: list, man: Manifest, limit: int | None) -> None:
    d = raw_dir(cc) / "att"
    d.mkdir(parents=True, exist_ok=True)
    got = skipped = 0
    failed = []
    no_sheet = [e["fileNumber"] for e in entries if not e["summarySheets"]]
    for e in [e for e in entries if e["summarySheets"]][:limit]:
        uri = e["summarySheets"][-1]  # the last listed sheet is the current single document
        pdf = d / f"{uri}.pdf"
        if pdf.exists():
            skipped += 1
            continue
        try:
            data = get(ATT + uri)
            if not data.startswith(b"%PDF"):
                raise ValueError("not a PDF")
            pdf.write_bytes(data)
            man.add(f"att/{uri}.pdf", ATT + uri, data)
            subprocess.run(["pdftotext", "-layout", str(pdf), str(pdf.with_suffix(".txt"))], check=True,
                           capture_output=True)
            got += 1
            time.sleep(0.3)
        except Exception as x:  # one line per failure, no retry loop
            failed.append(f"{e['fileNumber']} att {uri}: {x}")
    print(f"{cc} docs: {got} fetched, {skipped} already there, {len(failed)} failed, {len(no_sheet)} without a sheet")
    for f in failed[:20]:
        print("  failed", f)
    if no_sheet:
        print("  no sheet:", " ".join(no_sheet[:20]))


def caop(man: Manifest) -> None:
    for coll in ("freguesias", "municipios"):
        feats, offset = [], 0
        while True:
            url = CAOP.format(coll, offset)
            page = json.loads(get(url))
            feats += page.get("features", [])
            if len(page.get("features", [])) < 500:
                break
            offset += 500
        data = json.dumps({"type": "FeatureCollection", "features": feats}, ensure_ascii=False).encode()
        rel = f"caop2025-{coll}.geojson"
        (raw_dir("pt") / rel).write_bytes(data)
        man.add(rel, CAOP.format(coll, "0").replace("&offset=0", ""), data)
        print(f"pt outlines: {rel} {len(feats)} features, {len(data) // 1_000_000} MB")


def outlines(cc: str, man: Manifest) -> None:
    raw_dir(cc).mkdir(parents=True, exist_ok=True)
    if cc == "pt":
        caop(man)
    for name, url in OUTLINES[cc]:
        path = raw_dir(cc) / name
        if path.exists():
            print(f"{cc} outlines: {name} already there")
            continue
        data = get(url, timeout=1800)
        path.write_bytes(data)
        man.add(name, url, data)
        print(f"{cc} outlines: {name} {len(data) // 1_000_000} MB")


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--country", nargs="+", default=["pt", "fr", "it"], choices=["pt", "fr", "it"])
    p.add_argument("--step", nargs="+", default=["register", "docs", "outlines"], choices=["register", "docs", "outlines"])
    p.add_argument("--limit", type=int, help="docs: at most N new documents per country (pilot)")
    p.add_argument("--from-file", help="use a saved eAmbrosia list instead of fetching it")
    a = p.parse_args()
    raw = json.loads(Path(a.from_file).read_text() if a.from_file else get(LIST))
    for cc in a.country:
        man = Manifest(cc)
        entries = register(cc, raw)
        try:
            if "docs" in a.step:
                docs(cc, entries, man, a.limit)
            if "outlines" in a.step:
                outlines(cc, man)
        except Exception as x:
            print(f"{cc} stopped: {x}", file=sys.stderr)
        man.save()


if __name__ == "__main__":
    main()
