#!/usr/bin/env python3
"""Drop the French rule books' grape colour codes from France fact sheets and guides (France batches, 22 Oct 2026).

Usage: fr_clean.py <region> [<id> ...]   (no ids: every sheet in content/facts/<region>.json and its guides)

INAO cahiers and EU single documents name grapes with a colour code: "Melon B", "Pinot noir N", "Grolleau gris G". Writers and
sheet helpers copied them (Muscadet's guide said "Melon B" eight times; sheets had "Merlot N"). This strips the code from sheet grape
names and from guide text, capitalises sheet grape names, and prints what changed. Run it after headless.py, before the PR.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SUF = re.compile(r'\s+(B|N|G|Rs|Rg|R)$')
GRAPES = (r"Melon|Chenin(?: blanc)?|Chardonnay|Sauvignon(?: blanc| gris)?|Gamay|Pinot (?:[Nn]oir|[Gg]ris|[Bb]lanc|[Mm]eunier|d'Aunis)|"
          r"Cabernet[- ](?:[Ff]ranc|[Ss]auvignon)|Grolleau(?: gris)?|Merlot|Malbec|Cot|Côt|Syrah|Grenache(?: noir| blanc| gris)?|"
          r"Mourvèdre|Cinsaut|Viognier|Marsanne|Roussanne|Clairette|Muscat à petits grains(?: blancs| rouges)?|Sémillon|Muscadelle|"
          r"Folle blanche|Romorantin|Petit Verdot|Carmenère|Aligoté|Picpoul|Piquepoul|Carignan|Counoise|Bourboulenc|Vermentino|Rolle|"
          r"Tannat|Mauzac|Colombard|Ugni blanc|Riesling|Gewurztraminer|Sylvaner|Auxerrois|Meunier")
TEXT = re.compile(rf"\b({GRAPES}) (B|N|G|Rs|Rg)\b")


def grape(name: str) -> str:
    return ' '.join(w[:1].upper() + w[1:] for w in SUF.sub('', name.strip()).split(' '))


def main() -> None:
    region, only = sys.argv[1], set(sys.argv[2:])
    fp = ROOT / f'content/facts/{region}.json'
    facts = json.loads(fp.read_text(encoding='utf-8'))
    for s in facts['sheets']:
        if only and s['id'] not in only:
            continue
        g = s['grapes']
        for m in g['main']:
            m['local'] = grape(m['local'])
        g['others'] = [grape(o) for o in g['others']]
        for k in ('why', 'climate', 'soil', 'altitude', 'tastes', 'styles'):
            if isinstance(s.get(k), dict) and s[k].get('text'):
                s[k]['text'] = TEXT.sub(lambda m: m.group(1), s[k]['text'])
        gf = ROOT / f'content/guides/{s["id"]}.json'
        if gf.exists():
            raw = gf.read_text(encoding='utf-8')
            n = len(TEXT.findall(raw))
            if n:
                fixed = TEXT.sub(lambda m: m.group(1), raw)
                json.loads(fixed)
                gf.write_text(fixed, encoding='utf-8')
                print(f'{s["id"]}: {n} colour codes dropped from the guide')
    fp.write_text(json.dumps(facts, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'{fp.relative_to(ROOT)}: grape names cleaned')


if __name__ == '__main__':
    main()
