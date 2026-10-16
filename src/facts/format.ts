import { strings } from '../strings';
import type { Cite, KoppenShare, MainGrape, Measures, Sources } from './types';

const t = strings.facts;

/** "Tinta de Toro (Tempranillo), Albillo Real" */
export const grapeLabel = (g: MainGrape) => (g.grape && g.grape !== g.local ? `${g.local} (${g.grape})` : g.local);

/** "Cold semi-arid 67%, hot-summer Mediterranean 33%". A code with no plain name keeps its code. */
export function koppenText(shares: KoppenShare[]): string {
  return shares
    .map((s, i) => {
      const name = t.koppenNames[s.code] ?? s.code;
      return `${i === 0 ? name.charAt(0).toUpperCase() + name.slice(1) : name} ${Math.round(s.share * 100)}%`;
    })
    .join(', ');
}

const round10 = (n: number) => Math.round(n / 10) * 10;

/** "Most of the land between 650 and 780 m": the 10th to 90th percentile, to the nearest 10 m. */
export function altitudeText(a: Measures['altitude']): string {
  const fmt = (n: number) => round10(n).toLocaleString('en');
  return t.altitudeMeasured(fmt(a.p10), fmt(a.p90));
}

export interface SourceRef {
  id: string;
  title: string;
  url: string;
  /** "p. 11, p. 12", or "" when no page is cited. */
  pages: string;
  /** The source's year, only when it is before 2018 so a reader can see the age; otherwise "". */
  year: string;
}

/** One reference per source, in the order first cited, with its pages gathered. A source id that is not in the registry is left out. */
export function sourceRefs(cites: Cite[], sources: Sources): SourceRef[] {
  const refs = new Map<string, { source: Sources[string]; pages: string[] }>();
  for (const c of cites) {
    const [id, page] = c.split(':');
    const source = sources[id];
    if (!source) continue;
    const entry = refs.get(id) ?? { source, pages: [] };
    if (page && !entry.pages.includes(page)) entry.pages.push(page);
    refs.set(id, entry);
  }
  return [...refs].map(([id, { source, pages }]) => {
    const year = parseInt(source.date, 10);
    return {
      id,
      title: source.title,
      url: source.url,
      pages: pages.map((p) => t.page(p.replace(/^p/, ''))).join(', '),
      year: year < 2018 ? String(year) : '',
    };
  });
}

/** "Reds: ruby. Whites: straw." becomes one line per colour, so a long tasting row scans like the famous styles list. Text that
 * does not start with a short label stays one unlabelled line before the labelled ones. */
export function tasteLines(text: string): Array<{ label?: string; text: string }> {
  return text
    .trim()
    .split(/(?<=\.)\s+(?=[A-ZÁÉÍÓÚ][^:.]{0,30}:\s)/)
    .filter(Boolean)
    .map((part) => {
      const m = /^([A-ZÁÉÍÓÚ][^:.]{0,30}):\s+(.*)$/s.exec(part);
      return m ? { label: m[1], text: m[2] } : { text: part };
    });
}
