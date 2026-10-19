import { readdirSync, readFileSync } from 'node:fs';
import { loadTree } from '../tree';

// The home page says how many places have a guide. It is plain HTML, so the number is filled in at build time from content/guides/
// (one JSON file per place), and new guides change it without touching the page (handoff 2026-10-19-home-refresh-build.md).
export const guideCount = (dir = 'content/guides'): number => readdirSync(dir).filter((f) => f.endsWith('.json')).length;

export const fillGuideCount = (html: string, n: number): string => html.replace(/(data-count="guides">)\d+(<)/g, `$1${n}$2`);

// The Guides page lists every guide the same way, so each release brings it up to date with no extra step (owner, 19 Oct 2026: it still said
// "4 of 79 places, all in Rioja" with 37 guides live). Order: study regions in course order, their places in course order, zones after their place.
export interface GuideRow { id: string; name: string; label: string; minutes: number }

const KIND: Record<string, string> = { DO: 'DO', DOCa: 'DOCa', VP: 'Vino de Pago', VC: 'Vino de Calidad' };
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const guideRows = (dir = 'content/guides', placesFile = 'data/places.json'): { rows: GuideRow[]; places: number; regions: number } => {
  const tree = loadTree(JSON.parse(readFileSync(placesFile, 'utf8')));
  const minutes = new Map<string, number>();
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const g = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')) as { id: string; minutes: number };
    minutes.set(g.id, g.minutes);
  }
  const rows: GuideRow[] = [];
  const regions = new Set<string>();
  for (const country of tree.countries) {
    for (const region of tree.regionsOf(country.id)) {
      for (const place of tree.placesInRegion(region.id)) {
        const zones = tree.children(place.id).filter((c): c is typeof place => 'kind' in c && c.kind === 'zone');
        for (const p of [place, ...zones]) {
          if (!minutes.has(p.id)) continue;
          regions.add(region.id);
          const label = p.kind === 'zone' ? `Zone of ${place.name}` : (KIND[p.kind] ?? p.kind);
          rows.push({ id: p.id, name: p.name.split(' / ')[0], label, minutes: minutes.get(p.id)! });
        }
      }
    }
  }
  const missing = [...minutes.keys()].filter((id) => !rows.some((r) => r.id === id));
  if (missing.length) throw new Error(`content/guides: no place in data/places.json for ${missing.join(', ')}`);
  return { rows, places: tree.places.length, regions: regions.size };
};

export const fillGuideList = (html: string, list: ReturnType<typeof guideRows>): string => {
  const { rows, places, regions } = list;
  const pct = Math.max(1, Math.round((rows.length / places) * 100));
  const where = regions === 1 ? 'in one region so far' : `across ${regions} regions so far`;
  const items = rows
    .map((r) => `              <li><a href="../atlas/#place=${esc(r.id)}&amp;page"><b>${esc(r.name)}</b><span>${esc(r.label)} · ${r.minutes}-minute read</span></a></li>`)
    .join('\n');
  const body = [
    `            <div class="progress"><span class="bar"><i style="width:${pct}%"></i></span><span>Terroir written for ${rows.length} of ${places} places, ${where}</span></div>`,
    '            <ul class="guide-list">',
    items,
    '            </ul>',
  ].join('\n');
  const marked = /(<!-- guide-list -->\n)[\s\S]*?(\n\s*<!-- \/guide-list -->)/;
  if (!marked.test(html)) throw new Error('guides/index.html: the <!-- guide-list --> markers are missing, so the list would ship empty');
  return html.replace(marked, `$1${body}$2`);
};
