import { describe, expect, it } from 'vitest';
import { pointsFit, fitView, holdSteps, projectPoint, type Cam } from '../../src/story/camera';
import { GEOLOGY_MINZOOM } from '../../src/story/layerRules';

// Rioja's rough outline: Haro in the north-west to Alfaro in the south-east.
const RIOJA: Array<[number, number]> = [[-3.1, 42.65], [-2.6, 42.7], [-1.75, 42.25], [-1.9, 42.2], [-2.7, 42.4]];
const VALLEY: Cam = { center: [-2.3, 42.37], zoom: 8.6, pitch: 55, bearing: -65 };

describe('fitting a place into a tilted view', () => {
  it('the centre of the map is the centre of the view, at any pitch', () => {
    const p = projectPoint(VALLEY, VALLEY.center, 375, 300)!;
    expect(p[0]).toBeCloseTo(187.5, 3);
    expect(p[1]).toBeCloseTo(150, 3);
  });

  it('ground ahead of a tilted view lands higher on screen than ground behind it', () => {
    const cam: Cam = { center: [-2.5, 42.4], zoom: 9, pitch: 60, bearing: 0 };
    const north = projectPoint(cam, [-2.5, 42.6], 640, 760)!, south = projectPoint(cam, [-2.5, 42.2], 640, 760)!;
    expect(north[1]).toBeLessThan(380);
    expect(south[1]).toBeGreaterThan(380);
  });

  it('a phone strip backs the valley view off until Haro to Alfaro is all in; the desktop column keeps the zoom it has', () => {
    const pad = { top: 60, bottom: 40, left: 30, right: 60 };
    const phone = fitView({ ...VALLEY, zoom: VALLEY.zoom - 0.8 }, RIOJA, 375, 300, pad);
    expect(pointsFit(phone, RIOJA, 375, 300, pad)).toBe(true);
    expect(phone.zoom).toBeLessThan(VALLEY.zoom - 0.8);
    const desk = fitView({ ...VALLEY, center: [-2.43, 42.45], zoom: 7.4 }, RIOJA, 640, 760, { top: 70, bottom: 70, left: 64, right: 94 });
    expect(desk.zoom).toBe(7.4);
  });

  it('a view that already fits is returned as it is', () => {
    const cam: Cam = { center: [-2.43, 42.45], zoom: 7, pitch: 0, bearing: 0 };
    expect(fitView(cam, RIOJA, 640, 760, { top: 10, bottom: 10, left: 10, right: 10 })).toBe(cam);
  });
});

describe('each step holds some scroll', () => {
  it('two links 40 px apart give the first 120 px, order kept', () => {
    expect(holdSteps([-900, 400, 440, 1300], 120)).toEqual([-900, 400, 520, 1300]);
  });
  it('the push carries on down a run of close links, and gaps already wide are left alone', () => {
    expect(holdSteps([0, 12, 24, 500], 120)).toEqual([0, 120, 240, 500]);
    expect(holdSteps([0, 130, Infinity, 300], 120)).toEqual([0, 130, Infinity, 300]);
  });
});

describe('the geology layer', () => {
  it('starts at the zoom where the MAGNA service draws', () => {
    expect(GEOLOGY_MINZOOM).toBe(10);
  });
});
