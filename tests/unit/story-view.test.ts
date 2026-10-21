import { describe, expect, it } from 'vitest';
import { flyLegs, pickStep, readingLine, stopOf, targetOf, type Cam } from '../../src/story/camera';
import { loadStory } from '../../src/story/load';
import { creditParts, locator, locatorBox, measureText, outside } from '../../src/story/view';
import { guideOf } from '../../src/facts';
import { parseSelection, selectionToHash } from '../../src/url';

const cam = (lng: number, lat: number, zoom: number, pitch = 0, bearing = 0): Cam => ({ center: [lng, lat], zoom, pitch, bearing });

describe('story fly legs', () => {
  it('flies a near stop in one leg of 2.5 to 4 s', () => {
    const legs = flyLegs(cam(-2.5, 42.3, 8), cam(-2.4, 42.35, 9, 45, 20));
    expect(legs).toHaveLength(1);
    expect(legs[0].duration).toBeGreaterThanOrEqual(2500);
    expect(legs[0].duration).toBeLessThanOrEqual(4000);
    expect(legs[0]).toMatchObject({ zoom: 9, pitch: 45, bearing: 20 });
  });

  it('flies a gap of more than 3.5 zoom levels in two legs, over at a mid zoom and then in', () => {
    const legs = flyLegs(cam(-2.5, 42.3, 6.7), cam(-2.7, 42.6, 11.7, 70, 180));
    expect(legs).toHaveLength(2);
    expect(legs[0].zoom).toBeCloseTo(8.5);
    expect(legs[0].pitch).toBe(35);
    expect(legs[1]).toMatchObject({ zoom: 11.7, pitch: 70, bearing: 180 });
  });

  it('flies more than 150 km in two legs, even at one zoom', () => {
    expect(flyLegs(cam(-2.5, 42.3, 9), cam(0.8, 41.2, 9))).toHaveLength(2);
  });

  it('pulls back first when the next stop is much wider', () => {
    const legs = flyLegs(cam(-2.85, 42.58, 14.2), cam(-2.5, 42.3, 8));
    expect(legs[0].zoom).toBeCloseTo(11.2);
  });
});

describe('story step on show', () => {
  it('is the last step whose top passed the reading line', () => {
    expect(pickStep([0, 400, 900], 450)).toBe(1);
    expect(pickStep([100, 400, 900], 50)).toBe(0);
    expect(pickStep([-900, -400, 200], 450)).toBe(2);
  });

  it('reads higher on a phone, under the map', () => {
    expect(readingLine(56, 856, false)).toBeCloseTo(56 + 800 * 0.45);
    expect(readingLine(400, 800, true)).toBeCloseTo(400 + 400 * 0.3);
  });
});

describe('story camera targets', () => {
  const story = loadStory('rioja')!;
  const guide = guideOf('rioja')!;
  const step = (id: string) => story.steps.find((s) => s.id === id)!;

  it('uses a fixed view as written', () => {
    expect(targetOf(step('intro'))).toMatchObject({ kind: 'view', center: [-2.5, 42.3], zoom: 6.7 });
  });

  it('frames a zone card on its place, pulled back for the tilt', () => {
    const s = step('z-rioja-alta');
    expect(targetOf(s, stopOf(guide, s))).toMatchObject({ kind: 'bounds', place: 'rioja-alta', pitch: 45, bearing: 270, zoomShift: -0.2 });
  });

  it('takes the stop\'s point when the step gives only a zoom', () => {
    const fly = stopOf(guide, step('sierra'))!;
    const s = { ...step('haro'), camera: { zoom: 12 } };
    expect(targetOf(s, fly)).toMatchObject({ kind: 'view', center: fly.point, zoom: 12 });
  });

  it('Haro\'s station quarter is centred on Haro and stays at a zoom the imagery shows sharply', () => {
    expect(targetOf(step('haro'))).toMatchObject({ kind: 'view', center: [-2.848, 42.58], zoom: 13.2 });
  });

  it('gives every step of both stories a camera', () => {
    for (const id of ['rioja', 'priorat']) {
      const st = loadStory(id)!, g = guideOf(id)!;
      for (const s of st.steps) expect(targetOf(s, stopOf(g, s)), `${id}/${s.id}`).not.toBeNull();
    }
  });
});

describe('story map parts', () => {
  it('fades the world outside the focus outlines', () => {
    const square = [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]];
    const g = outside([{ type: 'MultiPolygon', coordinates: [[square], [square]] }]);
    expect(g.coordinates).toHaveLength(3);
  });

  it('puts Rioja inside the locator and boxes the view', () => {
    const [x, y] = locator.at([-2.5, 42.3]);
    expect(x).toBeGreaterThan(0); expect(x).toBeLessThan(locator.width);
    expect(y).toBeGreaterThan(0); expect(y).toBeLessThan(locator.height);
    expect(locatorBox(-2.51, 42.29, -2.5, 42.3).w).toBe(2);
    expect(locator.path.startsWith('M')).toBe(true);
  });

  it('states the terrain height and names a layer only while it shows', () => {
    const plain = creditParts([], true).map((p) => p.long).join(' · ');
    expect(plain).toContain('Terrain ×1.5');
    expect(plain).not.toContain('IGME');
    expect(creditParts(['geology'], true).map((p) => p.long)).toContain('Source: IGME, MAGNA 50');
    expect(creditParts([], false).map((p) => p.long).join()).not.toContain('Esri');
  });

  it('writes measures as the mock did', () => {
    const m = { altitude: { p10: 360, median: 550, p90: 890, samples: 1 }, koppen: [], slope: { steepShare: 0.05 } };
    expect(measureText(m, 'top')).toBe('Half the land lies above 550 m. The highest tenth lies above 890 m.');
    expect(measureText(m, 'steep')).toBe('5% of the land is steeper than 30%.');
    expect(measureText(m, 'median', 'Rioja Alta')).toBe('In Rioja Alta, half the land lies above 550 m.');
  });
});

describe('story route', () => {
  it('round-trips #place=<id>&page&story', () => {
    const sel = parseSelection('#place=rioja&page&story');
    expect(sel).toEqual({ kind: 'place', id: 'rioja', page: true, story: true });
    expect(selectionToHash(sel)).toBe('#place=rioja&page&story');
  });

  it('needs the page: a story flag on a card is dropped', () => {
    expect(parseSelection('#place=rioja&story').story).toBeUndefined();
    expect(selectionToHash({ kind: 'place', id: 'rioja', story: true })).toBe('#place=rioja');
  });
});
