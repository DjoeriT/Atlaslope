import { describe, expect, it } from 'vitest';
import { measuresOf, sheetOf } from '../../src/facts';
import { altitudeBar, climateSegments, glanceCells, mosaicPics, swatchOf, type Pic } from '../../src/pages/helpers';

const pic = (n: string): Pic => ({ src: `photos/${n}.webp`, alt: n, artist: 'A', licence: 'CC', page: 'https://commons.wikimedia.org/' });

describe('mosaic photos', () => {
  it('puts the place first, then one per zone, without repeats, at most five', () => {
    expect(mosaicPics([pic('a'), pic('b')], [pic('b'), pic('c')]).map((p) => p.alt)).toEqual(['a', 'b', 'c']);
    expect(mosaicPics([pic('a'), pic('b'), pic('c')], [pic('d'), pic('e'), pic('f')])).toHaveLength(5);
    expect(mosaicPics([], [])).toEqual([]);
  });
});

describe('glance cells', () => {
  it('holds only what the sheet or measures hold', () => {
    expect(glanceCells(undefined, undefined)).toEqual([]);
    const cells = glanceCells(sheetOf('rioja'), measuresOf('rioja'));
    expect(cells.map((c) => c.kind)).toEqual(['grapes', 'wine', 'altitude']);
    expect(cells[0]).toMatchObject({ big: 'Tempranillo' });
    expect(cells[2]).toMatchObject({ big: '360–890 m' });
  });
  it('leaves out the altitude of a place with no measures', () => {
    expect(glanceCells(sheetOf('rioja'), undefined).map((c) => c.kind)).not.toContain('altitude');
  });
});

describe('climate segments', () => {
  it('names the three biggest shares and rounds what is left into Other', () => {
    const segs = climateSegments(measuresOf('rioja')!.koppen);
    expect(segs.map((s) => s.label)).toEqual(['Warm-summer Mediterranean 40%', 'Oceanic 32%', 'Humid subtropical 24%', 'Other 4%']);
    expect(segs.reduce((n, s) => n + s.pct, 0)).toBeCloseTo(100, 5);
  });
  it('has no Other when the shares fill the bar', () => {
    expect(climateSegments([{ code: 'Csa', name: '', share: 1 }]).map((s) => s.label)).toEqual(['Hot-summer Mediterranean 100%']);
  });
});

describe('altitude bar', () => {
  it('places the 10th to 90th percentile on a fixed 0 to 2000 m scale', () => {
    const bar = altitudeBar({ p10: 360, median: 550, p90: 890, samples: 9 });
    expect(bar).toMatchObject({ from: 18, to: 44.5, max: 2000, low: '360', high: '890', mid: '550' });
    expect(bar.median).toBeCloseTo(27.5, 5);
  });
  it('widens the scale for a place that goes higher', () => {
    expect(altitudeBar({ p10: 1000, median: 1500, p90: 2300, samples: 9 }).max).toBe(2500);
  });
});

describe('swatches', () => {
  it('colours reds, whites and rosés only', () => {
    expect([swatchOf('Reds'), swatchOf('Whites'), swatchOf('Rosés'), swatchOf('Sparkling'), swatchOf()]).toEqual(['red', 'white', 'rose', undefined, undefined]);
  });
});
