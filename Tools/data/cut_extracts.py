#!/usr/bin/env python3
"""Cuts the source pack: one short extract per quizzed place, from the EU single document of its DOP.

Run: python3 -I Tools/data/cut_extracts.py   (reads Review/sources/fetched/, writes Review/sources/places/<id>.md and Review/sources/places/INDEX.md)
The single document («documento único») is the official summary of the pliego, in Spanish: wine categories, wine descriptions, delimited area,
main grape varieties, the link with the area (soil, climate, altitude) and the link to the full pliego. For each place the script takes the
newest eAmbrosia attachment or Official Journal notice that holds a full single document, and keeps those sections with their page numbers.
Writers read only the extract for their place. Extracts are working notes, not shipped data.
"""
import glob, html, json, re, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
F = ROOT / "Review/sources/fetched"
OUT = ROOT / "Review/sources/places"

SECTIONS = [  # (key, title, heading pattern); headings vary a little between documents and years
    ("categories", "Wine categories", r"CATEGOR[ÍI]AS DE PRODUCTOS VITIVIN[ÍI]COLAS"),
    ("wines", "Wine descriptions", r"DESCRIPCI[ÓO]N DEL? \(?(?:DE )?(?:LOS\)? )?VINO|DESCRIPCI[ÓO]N DE LOS VINOS|DESCRIPCI[ÓO]N DE LOS PRODUCTOS"),
    ("practices", None, r"PR[ÁA]CTICAS (?:VITIVIN[ÍI]COLAS|ENOL[ÓO]GICAS)"),
    ("area", "Delimited area", r"ZONA (?:GEOGR[ÁA]FICA )?DELIMITADA|DEMARCACI[ÓO]N DE (?:LA )?ZONA|DELIMITACI[ÓO]N DE LA ZONA|DELIMITACI[ÓO]N DEL [ÁA]REA|ZONA GEOGR[ÁA]FICA$"),
    ("yields", None, r"RENDIMIENTOS? M[ÁA]XIMOS?"),
    ("grapes", "Main grape varieties", r"(?:PRINCIPALES )?(?:UVAS|VARIEDADES?) DE (?:UVA DE )?VINIFICACI[ÓO]N|VARIEDADES? DE UVA|VARIEDADES? DE VID|VARIEDADES AUTORIZADAS|VARIEDAD O VARIEDADES|VARIEDADES VIN[ÍI]FERAS"),
    ("link", "Link with the area (soil, climate, altitude)", r"DESCRIPCI[ÓO]N DEL? \(?(?:DE )?(?:LOS\)? )?V[ÍI]NCULO|V[ÍI]NCULO CON LA ZONA|ELEMENTOS QUE APORTAN EL V[ÍI]NCULO|V[ÍI]NCULO$"),
    ("extra", None, r"CONDICIONES COMPLEMENTARIAS|REQUISITOS APLICABLES|OTROS DATOS|OTRAS CONDICIONES|DISPOSICIONES APLICABLES|VERIFICACI[ÓO]N DEL CUMPLIMIENTO|OTROS REQUISITOS"),
    ("pliego", "Link to the pliego", r"ENLACE AL PLIEGO|REFERENCIA A LA PUBLICACI[ÓO]N DEL PLIEGO"),
]
ANALYTIC = re.compile(r"Caracter[íi]sticas anal[íi]ticas|[Gg]rado alcoh|volum[ée]trico|[Aa]cidez|anh[íi]drido|Contenido m[áa]ximo|miliequivalentes|por litro|en % vol|gramos|ácido tartárico|sulfuroso|^\s*\(en|^\s*m[íi]nimo|^\s*m[áa]ximo|^\s*litro\)", re.I)
HEAD = re.compile(r"^\s*(?:[0-9]{1,2}\.\s*-?|[IVX]{1,3}\.|[A-Ha-h]\))?\s*(" + "|".join(f"(?P<{k}>{p})" for k, _, p in SECTIONS) + ")", re.I)


def text_of(path):
    t = unicodedata.normalize("NFC", path.read_text(encoding="utf-8", errors="replace"))
    if path.suffix == ".html":
        t = re.sub(r"(?s)<(script|style).*?</\1>", "", t)
        t = re.sub(r"<(?:br|/p|/tr|/div|/h\d)[^>]*>", "\n", t, flags=re.I)
        t = html.unescape(re.sub(r"<[^>]+>", " ", t))
        t = re.sub(r"[ \t]+", " ", t)
    return t


def cut(t):
    """Sections from the single document (or pliego) in t; tries every heading start and keeps the fullest cut."""
    starts = [m.start() for m in re.finditer(r"DOCUMENTO\s+[ÚU]NICO|PLIEGO DE CONDICIONES", t, re.I)]
    best = None
    for s0 in starts:
        secs = cut_from(t, s0)
        if secs and (not best or sum(len(v["text"]) for v in secs.values()) > sum(len(v["text"]) for v in best.values())):
            best = secs
    return best


def cut_from(t, s0):
    """Section text with the page it starts on; the first match of each section after s0 wins."""
    body = t[s0:]
    lines = body.split("\n"); found, cur = {}, None
    page = t[:s0].count("\f") + 1
    for line in lines:
        page += line.count("\f")
        m = HEAD.match(line.replace("\f", ""))
        if m:
            key = next(k for k, _, _ in SECTIONS if m.group(k))
            cur = key if key not in found else None
            if cur: found[cur] = {"page": page, "lines": []}
            continue
        if cur: found[cur]["lines"].append(line.replace("\f", ""))
    for v in found.values():
        txt = "\n".join(l.rstrip() for l in v["lines"])
        txt = re.sub(r"(?m)^\s*(EXPEDIENTE T[ÉE]CNICO|Ref\. Ares|N[úu]mero de expediente).*$", "", txt)
        txt = "\n".join(l.strip() for l in txt.split("\n"))
        v["text"] = re.sub(r"\n{3,}", "\n\n", txt).strip()
    return found if {"grapes", "area"} <= found.keys() else None


def _date_of(path):
    t = path.read_text(encoding="utf-8", errors="replace")
    d = re.search(r"Ares\((\d{4})\)\d+\s*-\s*(\d\d)/(\d\d)/(\d{4})", t)
    if d: return f"{d.group(4)}-{d.group(3)}-{d.group(2)}"
    m = re.search(r"_(\d{1,2})_(\d{1,2})_(\d{4})\.html$", path.name)
    if m: return f"{m.group(3)}-{int(m.group(2)):02d}-{int(m.group(1)):02d}"
    url = json.loads((F / "manifest.json").read_text()).get(path.name[:-4], {}).get("url", "")
    d = re.search(r"(\d{4})_(\d{2})_(\d{2})", url) or re.search(r"/(\d{4})-(\d{2})/", url)
    if d: return "-".join(d.groups())
    d = re.search(r"/(\d{2})(?:%20| )(\d{2})(?:%20| )(\d{2})", url)
    return f"20{d.group(1)}-{d.group(2)}-{d.group(3)}" if d else "undated"


def candidates(fn):
    for p in glob.glob(str(F / f"att-{fn}-*.txt")) + glob.glob(str(F / f"oj-{fn}-*.html")) + glob.glob(str(F / f"pliego-{fn}-*.txt")):
        p = Path(p); t = text_of(p); secs = cut(t)
        if not secs: continue
        date = re.search(r"Ares\((\d{4})\)\d+\s*-\s*(\d\d)/(\d\d)/(\d{4})", t)
        when = f"{date.group(4)}-{date.group(3)}-{date.group(2)}" if date else None
        if not when:
            if p.name.startswith("pliego-"): yield "0001", p, secs; continue  # dated later by _date_of
            m = re.search(r"_(\d{1,2})_(\d{1,2})_(\d{4})\.html$", p.name)
            when = f"{m.group(3)}-{int(m.group(2)):02d}-{int(m.group(1)):02d}" if m else "0000"
        yield when, p, secs


def main():
    tree = json.loads((ROOT / "data/places.json").read_text())
    manifest = json.loads((F / "manifest.json").read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    index = ["# Source pack: one extract per quizzed place", "", "Built by `Tools/data/cut_extracts.py` from the EU single documents in `Review/sources/fetched/`.", "",
             "| Place | Extract | Source document | Dated |", "|---|---|---|---|"]
    missing = []
    for p in tree["places"]:
        if p["quiz"] not in ("core", "vc"): continue
        best = max(candidates(p["euFile"]), key=lambda c: c[0], default=None)
        if not best:
            missing.append(p["id"]); index.append(f"| {p['name']} | none yet | | |"); continue
        _, path, secs = best
        when = _date_of(path)
        src = manifest.get(path.name.removesuffix(".txt") if path.suffix == ".txt" else path.name, {}).get("url", "")
        md = [f"# {p['name']} ({p['kind']}, {p['euFile']})", "",
              f"Source: {'pliego de condiciones' if path.name.startswith('pliego-') else 'EU single document'}, {path.name} ({src}), dated {when}. Spanish, quoted as published. Cite as «{'Pliego' if path.name.startswith('pliego-') else 'Documento único'} {p['euFile']}, p. N».", ""]
        for key, title, _ in SECTIONS:
            if title and key in secs and secs[key]["text"]:
                text = secs[key]["text"]
                if key == "wines":  # drop the analytical tables; keep the wine names and the tasting text
                    text = "\n".join(l for l in text.split("\n") if not (ANALYTIC.search(l) and len(l) < 70 and "Fase" not in l) and not re.fullmatch(r"\s*[\d,.\s]*", l))
                    text = re.sub(r"\n{3,}", "\n\n", text)
                if key == "area" and len(text) > 3000: text = text[:3000] + "\n[… cut; the full list is in the source document]"
                if key == "wines" and len(text) > 6000: text = text[:6000] + "\n[… cut; see the source document]"
                if key == "pliego": text = re.sub(r"\s*\n\s*", "", text) if "http" in text else text
                md += [f"## {title} (p. {secs[key]['page']})", "", text, ""]
        (OUT / f"{p['id']}.md").write_text("\n".join(md), encoding="utf-8")
        index.append(f"| {p['name']} | [{p['id']}.md]({p['id']}.md) | {path.name} | {when} |")
    index += ["", f"Missing: {', '.join(missing) or 'none'}."]
    (OUT / "INDEX.md").write_text("\n".join(index) + "\n", encoding="utf-8")
    print(f"extracts: {len([1 for l in index if '.md](' in l])}, missing: {missing}")


if __name__ == "__main__":
    main()
