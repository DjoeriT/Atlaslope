import { describe, expect, it } from 'vitest';
import { stripZoomShift } from '../../src/story/camera';
import { rockKey } from '../../src/story/layerRules';

describe('stripZoomShift', () => {
  it('leaves the desktop column alone', () => { expect(stripZoomShift(660, 836)).toBe(0); });
  it('backs off on the 390 x 300 phone strip', () => { expect(stripZoomShift(390, 300)).toBeLessThan(-0.6); expect(stripZoomShift(390, 300)).toBeGreaterThan(-1.2); });
});

describe('rockKey', () => {
  it("names the rock types the soils stops describe, in IGME's own unit names", () => {
    expect(rockKey('rioja').map((r) => r.label)).toEqual(['Sands, calcareous sandstones and ochre clays (Haro facies)', 'Siltstones and red clays', 'Alluvium and floodplain']);
    expect(rockKey('priorat').map((r) => r.label)).toEqual(['Hornfelsed slates']);
    expect(rockKey('nowhere')).toEqual([]);
  });
});
