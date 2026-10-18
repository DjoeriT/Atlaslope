import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import photosFile from '../../data/photos.json';
import sizesFile from '../../data/photo-sizes.json';
import { photosOf } from '../../src/facts';

// The smaller copies and blur previews from Tools/data/photo_sizes.py must cover every shipped photo (polish pack, 18 Oct 2026).
const keys = Object.keys((photosFile as { photos: Record<string, unknown> }).photos);
const sizes = sizesFile as { sizes: number[]; photos: Record<string, { w: number; h: number; blur: string }> };

describe('photo sizes', () => {
  it('has a preview and every smaller copy for each shipped photo (rerun Tools/data/photo_sizes.py if not)', () => {
    const missing: string[] = [];
    for (const key of keys) {
      const s = sizes.photos[key];
      if (!s || !s.blur) { missing.push(`${key}: no entry`); continue; }
      for (const w of sizes.sizes) if (w < s.w && !existsSync(`public/photos/${w}/${key}.webp`)) missing.push(`${key}: ${w}`);
    }
    expect(missing).toEqual([]);
    expect(Object.keys(sizes.photos).sort()).toEqual([...keys].sort());
  });
  it('gives each photo a srcset from the small copies up to the full file', () => {
    const [p] = photosOf('cebreros');
    expect(p.srcSet).toBe('../photos/160/cebreros-1.webp 160w, ../photos/480/cebreros-1.webp 480w, ../photos/800/cebreros-1.webp 800w, ../photos/cebreros-1.webp 1200w');
    expect(p.blur).toMatch(/^UklGR/);
  });
});
