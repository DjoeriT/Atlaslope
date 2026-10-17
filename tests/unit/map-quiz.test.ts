import { describe, expect, it } from 'vitest';
import type { Collection } from '../../src/map/boundaries';
import { nearestPlace, revealBox, revealPadding, type Shape } from '../../src/map/quiz';

// A 100 px square at (100,100)-(200,200), and a small one at (300,100)-(310,110).
const square = (id: string, x: number, y: number, size: number): Shape => ({
  id, polygons: [[[[x, y], [x + size, y], [x + size, y + size], [x, y + size], [x, y]]]],
});
const shapes = [square('big', 100, 100, 100), square('tiny', 300, 100, 10)];

describe('the nearest-place tap', () => {
  it('picks a place when the tap is inside it', () => {
    expect(nearestPlace([150, 150], shapes)).toBe('big');
  });
  it('picks a place 20 px outside its boundary and none at 30 px', () => {
    expect(nearestPlace([220, 150], shapes)).toBe('big');
    expect(nearestPlace([230, 150], shapes)).toBeNull();
  });
  it('gives a tiny place a 44 px tap area', () => {
    expect(nearestPlace([330, 105], shapes)).toBe('tiny');
  });
  it('picks the nearer of two places', () => {
    expect(nearestPlace([245, 150], [square('a', 100, 100, 100), square('b', 250, 100, 100)])).toBe('b');
  });
  it('does not pick a place through its hole', () => {
    const ring = square('ring', 0, 0, 100).polygons[0][0];
    const hole = square('h', 40, 40, 20).polygons[0][0];
    expect(nearestPlace([50, 50], [{ id: 'ring', polygons: [[ring, hole]] }], 5)).toBeNull();
  });
});

const feature = (id: string, box: [number, number, number, number]) => ({
  type: 'Feature', properties: { id },
  geometry: { type: 'Polygon', coordinates: [[[box[0], box[1]], [box[2], box[1]], [box[2], box[3]], [box[0], box[3]], [box[0], box[1]]]] },
}) as unknown as Collection['features'][number];

describe('the reveal frame', () => {
  const fs = [feature('toro', [-5.6, 41.4, -5.2, 41.7]), feature('rueda', [-4.9, 41.2, -4.6, 41.5]), feature('cava', [1, 41, 2, 42])];
  it('contains the answer and the pick, and nothing else', () => {
    expect(revealBox(fs, { answer: 'toro', picked: 'rueda' })).toEqual([-5.6, 41.2, -4.6, 41.7]);
  });
  it('frames the answer alone when nothing was picked', () => {
    expect(revealBox(fs, { answer: 'toro' })).toEqual([-5.6, 41.4, -5.2, 41.7]);
  });
  it('leaves room left of the card on wide screens and above it under 900 px', () => {
    const wide = revealPadding({ width: 1280, height: 800 }, { right: 440, top: 70 });
    expect(wide.left).toBeGreaterThan(440);
    const narrow = revealPadding({ width: 800, height: 1000 }, { right: 800, top: 520 });
    expect(narrow.bottom).toBeGreaterThan(1000 - 520);
  });
});
