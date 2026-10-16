import { describe, expect, it } from 'vitest';
import { altitudeText, grapeLabel, koppenText, photosOf, sourceRefs, type Sources } from '../../src/facts';

const sources: Sources = {
  old: { title: 'Old document', url: 'https://example.org/old', date: '2014-06-30', kind: 'official' },
  fresh: { title: 'Fresh document', url: 'https://example.org/fresh', date: '2023', kind: 'official' },
};

describe('fact formatting', () => {
  it('shows a grape as local (usual name) only when they differ', () => {
    expect(grapeLabel({ local: 'Tinta de Toro', grape: 'Tempranillo' })).toBe('Tinta de Toro (Tempranillo)');
    expect(grapeLabel({ local: 'Albillo Real' })).toBe('Albillo Real');
  });
  it('writes Köppen shares in plain names', () => {
    expect(koppenText([{ code: 'BSk', name: '', share: 0.67 }, { code: 'Csa', name: '', share: 0.33 }])).toBe('Cold semi-arid 67%, hot-summer Mediterranean 33%');
  });
  it('rounds the measured altitude to 10 m', () => {
    expect(altitudeText({ p10: 652, median: 700, p90: 778, samples: 9 })).toBe('Most of the land between 650 and 780 m');
    expect(altitudeText({ p10: 590, median: 980, p90: 1470, samples: 9 })).toBe('Most of the land between 590 and 1,470 m');
  });
  it('gathers pages per source and dates only sources from before 2018', () => {
    const refs = sourceRefs(['old:p11', 'old:p12', 'old:p11', 'fresh', 'gone:p1'], sources);
    expect(refs).toEqual([
      { id: 'old', title: 'Old document', url: 'https://example.org/old', pages: 'p. 11, p. 12', year: '2014' },
      { id: 'fresh', title: 'Fresh document', url: 'https://example.org/fresh', pages: '', year: '' },
    ]);
  });
  it('gives a place at most three photos, in order, each with a credit', () => {
    const photos = photosOf('cebreros');
    expect(photos.map((p) => p.src)).toEqual(['photos/cebreros-1.webp', 'photos/cebreros-2.webp', 'photos/cebreros-3.webp']);
    for (const p of photos) expect(p.artist && p.licence && p.page).toBeTruthy();
    expect(photosOf('jerez')).toEqual([]);
  });
});
