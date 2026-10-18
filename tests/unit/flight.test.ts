import { describe, expect, it } from 'vitest';
import { cameraEase, flightMs } from '../../src/map/flight';

const spain = { lng: -3.7, lat: 40.2, zoom: 5.6 };
const rioja = { lng: -2.5, lat: 42.45, zoom: 9 };
const riojaAlta = { lng: -2.75, lat: 42.55, zoom: 10.5 };

describe('camera flight time (owner point 8)', () => {
  it('grows with distance and stays within calm bounds', () => {
    const hop = flightMs(rioja, riojaAlta);
    const far = flightMs(spain, riojaAlta);
    expect(hop).toBeGreaterThanOrEqual(800);
    expect(far).toBeGreaterThan(hop);
    expect(far).toBeLessThanOrEqual(2000);
    expect(flightMs(rioja, rioja)).toBe(800);
  });
  it('stretches with the motion strength', () => {
    expect(flightMs(spain, rioja, 1.25)).toBeGreaterThan(flightMs(spain, rioja));
  });
  it('eases in and out, from 0 to 1', () => {
    expect(cameraEase(0)).toBe(0);
    expect(cameraEase(1)).toBe(1);
    expect(cameraEase(0.5)).toBeCloseTo(0.5);
    expect(cameraEase(0.1)).toBeLessThan(0.1);
  });
});
