import { describe, expect, it } from 'vitest';
import { parseView, withView } from '../../src/url';

const view = { lng: -5.9333, lat: 40.3354, zoom: 5.4, bearing: 0, pitch: 0 };

describe('the camera view in the address', () => {
  it('keeps the screen the address names and swaps only the view', () => {
    expect(withView('#quiz=focus', view)).toBe('#quiz=focus&view=-5.9333,40.3354,5.40,0,0');
    expect(withView('#quiz=test&set=toro,rueda&view=1,2,3,0,0', view)).toBe('#quiz=test&set=toro,rueda&view=-5.9333,40.3354,5.40,0,0');
    expect(withView('#place=toro&view=1,2,3,0,0', view)).toBe('#place=toro&view=-5.9333,40.3354,5.40,0,0');
    expect(withView('#place=toro&page&at=soil', view)).toBe('#place=toro&page&at=soil&view=-5.9333,40.3354,5.40,0,0');
    expect(withView('#region=castilla-y-leon', view)).toBe('#region=castilla-y-leon&view=-5.9333,40.3354,5.40,0,0');
    expect(withView('#place=toro&fly=terroir.2', view)).toBe('#place=toro&fly=terroir.2&view=-5.9333,40.3354,5.40,0,0');
    expect(withView('#quiz=test', view)).toBe('#quiz&view=-5.9333,40.3354,5.40,0,0'); // as before: a test without places is the quiz home
    expect(parseView(withView('', view))).toEqual(view);
  });
});
