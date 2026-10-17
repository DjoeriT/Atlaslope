import { describe, expect, it } from 'vitest';
import { parseSelection, parseView, selectionToHash } from '../../src/url';

describe('the place page route', () => {
  const view = { lng: -2.4, lat: 42.3, zoom: 9.1, bearing: 0, pitch: 45 };
  it('writes and reads #place=<id>&page', () => {
    expect(selectionToHash({ kind: 'place', id: 'rioja', page: true })).toBe('#place=rioja&page');
    expect(parseSelection('#place=rioja&page')).toEqual({ kind: 'place', id: 'rioja', page: true });
  });
  it('keeps the plain card plain', () => {
    expect(selectionToHash({ kind: 'place', id: 'rioja' })).toBe('#place=rioja');
    expect(parseSelection('#place=rioja')).toEqual({ kind: 'place', id: 'rioja' });
  });
  it('round-trips the page together with the view', () => {
    const hash = selectionToHash({ kind: 'place', id: 'rioja-alta', page: true }, view);
    expect(hash).toBe('#place=rioja-alta&page&view=-2.4000,42.3000,9.10,0,45');
    expect(parseSelection(hash)).toEqual({ kind: 'place', id: 'rioja-alta', page: true });
    expect(parseView(hash)).toEqual(view);
  });
  it('ignores page on regions and on Spain', () => {
    expect(selectionToHash({ kind: 'region', id: 'rioja', page: true })).toBe('#region=rioja');
    expect(parseSelection('#region=rioja&page')).toEqual({ kind: 'region', id: 'rioja' });
    expect(parseSelection('#page').id).toBe('spain');
  });
});
