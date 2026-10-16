import type { Crumb } from './types';

/** Lower case, accents dropped, anything that is not a letter or digit turned into a single space. */
export function fold(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export interface Entry {
  hit: Crumb;
  /** Every name the entry answers to, folded. */
  names: string[];
  /** Main grapes of a place (as written); a match here ranks after every name match. */
  grapes?: string[];
  /** Ties: regions (0) before places (1). */
  rank: number;
  /** Ties after rank: course order. */
  order: number;
}

// 0 exact, 1 starts with the query, 2 a word starts with it, 3 contains it; null when it does not match.
function score(name: string, q: string): number | null {
  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  if (name.includes(' ' + q)) return 2;
  if (name.includes(q)) return 3;
  return null;
}

export function makeSearch(entries: Entry[]): (query: string, limit?: number) => Crumb[] {
  return (query, limit = 10) => {
    const q = fold(query);
    if (!q) return [];
    const hits: Array<{ entry: Entry; tier: number; score: number; grape?: string }> = [];
    for (const entry of entries) {
      const scores = entry.names.map((n) => score(n, q)).filter((s): s is number => s !== null);
      if (scores.length) { hits.push({ entry, tier: 0, score: Math.min(...scores) }); continue; }
      let best: { grape: string; score: number } | undefined;
      for (const grape of entry.grapes ?? []) {
        const s = score(fold(grape), q);
        if (s !== null && (!best || s < best.score)) best = { grape, score: s };
      }
      if (best) hits.push({ entry, tier: 1, score: best.score, grape: best.grape });
    }
    hits.sort((a, b) => a.tier - b.tier || a.score - b.score || a.entry.rank - b.entry.rank || a.entry.order - b.entry.order);
    return hits.slice(0, limit).map((h) => (h.grape ? { ...h.entry.hit, matchedGrape: h.grape } : h.entry.hit));
  };
}
