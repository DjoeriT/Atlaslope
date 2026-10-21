// One fetch per data file per page load: the atlas map and the story map both need the same GeoJSON, and each used to ask for it.
const loads = new Map<string, Promise<unknown>>();

export function loadJson<T>(url: string): Promise<T> {
  let p = loads.get(url) as Promise<T> | undefined;
  if (!p) {
    p = fetch(url).then((r) => { if (!r.ok) throw new Error(`${url}: ${r.status}`); return r.json() as Promise<T>; });
    loads.set(url, p);
    p.catch(() => loads.delete(url)); // a failed load is tried again by the next caller
  }
  return p;
}
