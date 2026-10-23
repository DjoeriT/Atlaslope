// The app bundle carries only the photos it can show (virtual:photo-data, src/facts/photoData.ts; decision #38, 23 Oct 2026).
// These guard that trimming: a place keeps its first three, and every key a map tour names still resolves.
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { photoByKey, photosOf } from '../../src/facts';
import { photoData, shownKeys } from '../../src/facts/photoData';

const all = (JSON.parse(readFileSync('data/photos.json', 'utf8')) as { photos: Record<string, unknown> }).photos;

describe('photo data in the app bundle', () => {
  it('keeps the first three numbered photos of every prefix', () => {
    const byPrefix = new Map<string, number>();
    for (const k of Object.keys(all)) {
      const m = /^(.*)-\d+$/.exec(k);
      if (m) byPrefix.set(m[1], (byPrefix.get(m[1]) ?? 0) + 1);
    }
    for (const [prefix, n] of byPrefix) expect(photosOf(prefix).length, prefix).toBe(Math.min(3, n));
  });

  it('resolves every photo a map tour names', () => {
    const named = readdirSync('content/stories').flatMap((f) => [...readFileSync(`content/stories/${f}`, 'utf8').matchAll(/"photo":\s*"([^"]+)"/g)].map((m) => m[1]));
    expect(named.length).toBeGreaterThan(0);
    for (const k of named) expect(photoByKey(k), k).toBeDefined();
  });

  it('keeps a key only when it is shown or named, and drops the Commons title', () => {
    expect([...shownKeys(['a-1', 'a-2', 'a-3', 'a-4', 'b-10'], '"a-4"')].sort()).toEqual(['a-1', 'a-2', 'a-3', 'a-4', 'b-10']);
    expect([...shownKeys(['a-1', 'a-2', 'a-3', 'a-4'], '')]).not.toContain('a-4');
    expect(Object.values(photoData().photos).some((p) => 'title' in p)).toBe(false);
  });
});
