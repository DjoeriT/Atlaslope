// Search over DO names, accent- and case-insensitive. Entries with a polygon carry its code; polygon-less DOPs do not.
export interface Entry { name: string; code?: string }

export const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

/** Names that start with the query come first, then names containing it; at most `limit`. */
export function search(entries: Entry[], query: string, limit = 8): Entry[] {
  const q = fold(query.trim());
  if (!q) return [];
  const starts: Entry[] = [], contains: Entry[] = [];
  for (const e of entries) {
    const n = fold(e.name);
    if (n.startsWith(q) || n.split(/[\s-]+/).some((w) => w.startsWith(q))) starts.push(e);
    else if (n.includes(q)) contains.push(e);
  }
  const byName = (a: Entry, b: Entry) => a.name.localeCompare(b.name, 'es');
  return [...starts.sort(byName), ...contains.sort(byName)].slice(0, limit);
}
