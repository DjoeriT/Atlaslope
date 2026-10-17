import { describe, expect, it } from 'vitest';
import { sentences } from '../../src/pages/sentence';
import { parseSelection, selectionToHash } from '../../src/url';
import { strings } from '../../src/strings';

describe('the region page route', () => {
  it('writes and reads #region=<id>&page', () => {
    expect(selectionToHash({ kind: 'region', id: 'rioja', page: true })).toBe('#region=rioja&page');
    expect(parseSelection('#region=rioja&page')).toEqual({ kind: 'region', id: 'rioja', page: true });
    expect(parseSelection('#region=rioja')).toEqual({ kind: 'region', id: 'rioja' });
  });

  it('keeps the view after the page flag', () => {
    const view = { lng: -2.4, lat: 42.3, zoom: 9, bearing: 0, pitch: 0 };
    expect(selectionToHash({ kind: 'region', id: 'rioja', page: true }, view)).toBe('#region=rioja&page&view=-2.4000,42.3000,9.00,0,0');
  });
});

describe('sentences', () => {
  const text = 'Limestone soils give fresh wines. A cold wind dries the vines. Rain is scarce all year.';
  it('cuts only at the end of a sentence', () => {
    expect(sentences(text, 70)).toBe('Limestone soils give fresh wines. A cold wind dries the vines.');
    expect(sentences(text, 200)).toBe(text);
  });
  it('keeps the first sentence whole even when it is long', () => {
    expect(sentences(text, 10)).toBe('Limestone soils give fresh wines.');
  });
  it('does not split on a number or a lower-case word after a full stop', () => {
    expect(sentences('Vines grow at about 460 m. above the river, and more. Next.', 30)).toBe('Vines grow at about 460 m. above the river, and more.');
  });
});

describe('the count under the region page title', () => {
  it('says "1 place to learn" for one and "places to learn" otherwise', () => {
    expect(strings.regionPage.placesToLearn(1)).toBe('place to learn');
    expect(strings.regionPage.placesToLearn(0)).toBe('places to learn');
    expect(strings.regionPage.placesToLearn(4)).toBe('places to learn');
  });
});
