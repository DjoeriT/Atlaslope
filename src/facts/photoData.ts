// What of data/photos.json and data/photo-sizes.json the app can show, for the virtual module `virtual:photo-data` (vite.config.ts).
// photosOf shows a place's first three photos; photoByKey shows a photo a map tour or the atlas cover names. The rest of a place's
// photos are for the Home, Guides and country pages, which are written at build time from the full files, and the Commons file title
// is for the paper trail only. Leaving both out of the app bundle keeps the first load under 2 MB (decision #38; owner 23 Oct 2026,
// after the Portugal photos took it to 2,008,937 bytes).
import { readdirSync, readFileSync } from 'node:fs';
import type { Photo } from './types';

interface Sizes { sizes: number[]; photos: Record<string, { w: number; h: number; blur: string }> }

/** The keys the app can show: the first three numbered photos per prefix, and any key named in a map tour or in src/. */
export function shownKeys(keys: string[], named: string): Set<string> {
  const byPrefix = new Map<string, string[]>();
  for (const key of keys) {
    const m = /^(.*)-(\d+)$/.exec(key);
    if (m) byPrefix.set(m[1], [...(byPrefix.get(m[1]) ?? []), key]);
  }
  const first = [...byPrefix.values()].flatMap((ks) => ks.sort((a, b) => a.localeCompare(b, 'en', { numeric: true })).slice(0, 3));
  return new Set([...first, ...keys.filter((k) => named.includes(`"${k}"`) || named.includes(`'${k}'`))]);
}

const filesIn = (dir: string, ext: RegExp): string[] =>
  readdirSync(dir, { recursive: true, withFileTypes: true }).filter((f) => f.isFile() && ext.test(f.name)).map((f) => `${f.parentPath}/${f.name}`);

/** The photo credits and sizes the app bundle carries. */
export function photoData(): { photos: Record<string, Photo>; sizes: Sizes } {
  const all = (JSON.parse(readFileSync('data/photos.json', 'utf8')) as { photos: Record<string, Photo & { title?: string }> }).photos;
  const sizes = JSON.parse(readFileSync('data/photo-sizes.json', 'utf8')) as Sizes;
  const named = [...filesIn('content/stories', /\.json$/), ...filesIn('src', /\.tsx?$/)].map((f) => readFileSync(f, 'utf8')).join('\n');
  const keep = shownKeys(Object.keys(all), named);
  const photos = Object.fromEntries([...keep].filter((k) => all[k]).map((k) => {
    const { title: _title, ...p } = all[k];
    return [k, p];
  }));
  return { photos, sizes: { sizes: sizes.sizes, photos: Object.fromEntries(Object.entries(sizes.photos).filter(([k]) => keep.has(k))) } };
}
