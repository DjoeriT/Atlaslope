import { describe, expect, it } from 'vitest';
import { altitudeText, grapeLabel, koppenText, pageText, photosOf, shortTitle, sourceRefs, type Sources } from '../../src/facts';

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
      { id: 'old', title: 'Old document', url: 'https://example.org/old', pages: 'pp. 11–12', year: '2014', short: 'Old document' },
      { id: 'fresh', title: 'Fresh document', url: 'https://example.org/fresh', pages: '', year: '', short: 'Fresh document' },
    ]);
  });
  it('writes one page mark: a run as a range', () => {
    expect(pageText(['5'])).toBe('p. 5');
    expect(pageText(['6', '5'])).toBe('pp. 5–6');
    expect(pageText(['5', '6', '8'])).toBe('pp. 5–6, 8');
    expect(pageText(['5', '8'])).toBe('pp. 5, 8');
    expect(pageText([])).toBe('');
  });
  // Owner card, 18 Oct 2026: a guide tags each fact with a short source name; the full title is listed once under Sources.
  it('gives each kind of source a short tag', () => {
    expect(shortTitle('Pliego de condiciones DOCa Rioja (Consejo Regulador copy, amendments to AM10)')).toBe('Pliego');
    expect(shortTitle('Documento único PDO-ES-A0975 (EU single document, Abona)')).toBe('EU single document');
    expect(shortTitle('Modificación normal PDO-ES-N1876-AM01 (EU Official Journal C/2026/713, Bolandin)')).toBe('EU amendment');
    expect(shortTitle('Wikipedia (es), «Abona», revision 1')).toBe('Wikipedia');
    expect(shortTitle('Köppen-Geiger: Beck et al. 2023, CC BY 4.0, 1991–2020')).toBe('Köppen-Geiger');
    expect(shortTitle('MAPA, list of protected wine names')).toBe('MAPA list');
    expect(shortTitle('Some other report (2020)')).toBe('Some other report');
  });
  it('gives a place at most three photos, in order, each with a credit', () => {
    const photos = photosOf('cebreros');
    expect(photos.map((p) => p.src)).toEqual(['../photos/cebreros-1.webp', '../photos/cebreros-2.webp', '../photos/cebreros-3.webp']);
    for (const p of photos) expect(p.artist && p.licence && p.page).toBeTruthy();
    expect(photosOf('txakoli-alava')).toEqual([]);
  });
});

describe('tasteLines', () => {
  it('splits a row into one line per labelled colour', async () => {
    const { tasteLines } = await import('../../src/facts');
    expect(tasteLines('Reds: ruby; red fruit. Whites: pale straw.')).toEqual([{ label: 'Reds', text: 'ruby; red fruit.' }, { label: 'Whites', text: 'pale straw.' }]);
    expect(tasteLines('Clear, light wines. Sparkling: fresh, creamy.')).toEqual([{ text: 'Clear, light wines.' }, { label: 'Sparkling', text: 'fresh, creamy.' }]);
    expect(tasteLines('Pale gold; flor aromas.')).toEqual([{ text: 'Pale gold; flor aromas.' }]);
  });
});
