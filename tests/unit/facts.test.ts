import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { checkSheets, grapeNames, sheetFiles, sources, type Sheet, type SheetFile, type Sources } from '../../src/facts';
import { loadTree, type Place } from '../../src/tree';

const real: Place[] = JSON.parse(readFileSync('data/places.json', 'utf8')).places;

const place = (id: string, region: string, quiz: Place['quiz'] = 'core'): Place =>
  ({ id, name: id, kind: 'DO', level: 'place', parent: 'spain', region, quiz });
const places = [place('toro', 'castilla-y-leon'), place('rueda', 'castilla-y-leon'), place('rioja-x', 'rioja'), place('cava', 'rioja', 'none')];
const src: Sources = {
  'toro-doc': { title: 'Toro document', url: 'https://example.org/toro', date: '2014-01-01', kind: 'official' },
  'toro-wiki': { title: 'Wikipedia (es), «Toro (vino)», revision 1', url: 'https://example.org/wiki', date: '2026-10-16', kind: 'wikipedia' },
};

const sheet = (id: string, edit: (s: Sheet) => void = () => {}): Sheet => {
  const s: Sheet = {
    id,
    why: { text: 'Hot days and cold nights ripen Tinta de Toro slowly.', cite: ['toro-doc:p3'] },
    grapes: { main: [{ local: 'Tinta de Toro', grape: 'Tempranillo' }], cite: ['toro-doc:p4'], others: ['Garnacha'], othersCite: ['toro-doc'] },
    styles: { kinds: ['red'], text: 'Strong reds.', cite: ['toro-doc:p4'] },
    climate: { text: 'Continental.', cite: ['toro-doc:p2'] },
    soil: { text: 'Sandy loam.', cite: ['toro-doc:p2'] },
  };
  edit(s);
  return s;
};
const file = (region: string, ...sheets: Sheet[]): SheetFile => ({ region, sheets });
const toro = (edit?: (s: Sheet) => void) => checkSheets([file('castilla-y-leon', sheet('toro', edit), sheet('rueda'))], places, src);

describe('checkSheets', () => {
  it('passes a complete, cited region file', () => {
    expect(toro()).toEqual([]);
  });
  it('rejects an unknown place and a place that is not quizzed', () => {
    expect(checkSheets([file('rioja', sheet('rioja-x'), sheet('atlantis'))], places, src)).toEqual(['rioja: "atlantis" is not a place.']);
    expect(checkSheets([file('rioja', sheet('rioja-x'), sheet('cava'))], places, src)).toEqual(['rioja: cava is not quizzed, so it has no sheet.']);
  });
  it('rejects a sheet in the wrong region file', () => {
    const errors = checkSheets([file('rioja', sheet('rioja-x'), sheet('toro'))], places, src);
    expect(errors).toEqual(['toro is in the study region castilla-y-leon but its sheet is in the rioja file.']);
  });
  it('rejects a duplicate id', () => {
    const errors = checkSheets([file('castilla-y-leon', sheet('toro'), sheet('toro'), sheet('rueda'))], places, src);
    expect(errors).toEqual(['toro has more than one sheet.']);
  });
  it('rejects text, grapes or style kinds with no source', () => {
    expect(toro((s) => { s.climate.cite = []; })).toEqual(['toro, climate has no source.']);
    expect(toro((s) => { s.grapes.cite = []; })).toEqual(['toro, main grapes has no source.']);
    expect(toro((s) => { s.grapes.othersCite = []; })).toEqual(['toro, other grapes has no source.']);
    expect(toro((s) => { s.styles.text = ''; s.styles.cite = []; })).toEqual(['toro, styles has no source.']);
    expect(toro((s) => { s.why.cite = []; })).toEqual(['toro, the why line has no source.']);
    expect(toro((s) => { s.altitude = { text: 'Up to 800 m.', cite: [] }; })).toEqual(['toro, altitude has no source.']);
  });
  it('accepts an empty row with no source', () => {
    expect(toro((s) => { s.soil = { text: '', cite: [] }; s.grapes = { main: [], cite: [], others: [], othersCite: [] }; })).toEqual([]);
  });
  it('rejects a source that is not in sources.json or a page that is not p<digits>', () => {
    expect(toro((s) => { s.soil.cite = ['nowhere-doc:p1']; })).toEqual(['toro, soil: source "nowhere-doc" is not in content/sources.json.']);
    expect(toro((s) => { s.soil.cite = ['toro-doc:3']; })).toEqual(['toro, soil: source "toro-doc:3" is not "<source id>" or "<source id>:p<number>".']);
    expect(toro((s) => { s.soil.cite = ['toro-doc:p']; })).toHaveLength(1);
  });
  it('rejects an unknown style kind', () => {
    expect(toro((s) => { s.styles.kinds = ['red', 'orange' as never]; })).toEqual(['toro, styles: "orange" is not a style kind.']);
  });
  it('rejects an empty why line and one over 25 words', () => {
    expect(toro((s) => { s.why.text = '  '; })).toEqual(['toro, the why line is empty.']);
    expect(toro((s) => { s.why.text = Array(26).fill('word').join(' '); })).toEqual(['toro, the why line is 26 words; the limit is 25.']);
    expect(toro((s) => { s.why.text = Array(25).fill('word').join(' '); })).toEqual([]);
  });
  it('checks the release 4.1 rows: how it tastes, famous styles, producers', () => {
    const rows = (s: Sheet) => {
      s.tastes = { text: 'Deep cherry red; ripe black fruit; warm and tannic.', cite: ['toro-doc:p3'] };
      s.famous = { styles: [{ name: 'Crianza', text: 'At least two years old, six months in oak.' }], cite: ['toro-doc:p3'] };
      s.producers = { items: [{ name: 'Bodega A', wine: 'Wine A' }, { name: 'Bodega B' }], cite: ['toro-wiki'] };
    };
    expect(toro(rows)).toEqual([]);
    expect(toro((s) => { rows(s); s.tastes!.cite = []; })).toEqual(['toro, how it tastes has no source.']);
    expect(toro((s) => { rows(s); s.tastes!.text = Array(41).fill('word').join(' '); })).toEqual(['toro, how it tastes is 41 words; the limit is 40.']);
    expect(toro((s) => { rows(s); s.famous!.styles = Array(5).fill({ name: 'Joven', text: '' }); })).toEqual(['toro, famous styles has 5; the limit is 4.']);
    expect(toro((s) => { rows(s); s.famous!.cite = []; })).toEqual(['toro, famous styles has no source.']);
    expect(toro((s) => { rows(s); s.famous!.styles[0].text = Array(16).fill('word').join(' '); })).toEqual(['toro, famous styles: Crianza is 16 words; the limit is 15.']);
    expect(toro((s) => { rows(s); s.producers!.items = Array(4).fill({ name: 'Bodega' }); })).toEqual(['toro, producers has 4; the limit is 3.']);
    expect(toro((s) => { rows(s); s.producers!.cite = ['toro-doc:p3']; })).toEqual(['toro, producers: source "toro-doc" is not a Wikipedia article.']);
    expect(toro((s) => { rows(s); s.producers!.items = [{ name: ' ' }]; })).toEqual(['toro, producers has a producer with no name.']);
    expect(toro((s) => { rows(s); s.tastes = { text: '', cite: [] }; s.famous = { styles: [], cite: [] }; s.producers = { items: [], cite: [] }; })).toEqual([]);
  });
  it('rejects a region file with sheets for some of its quizzed places but not all', () => {
    expect(checkSheets([file('castilla-y-leon', sheet('toro'))], places, src)).toEqual(['castilla-y-leon has sheets for some places but not for rueda.']);
  });
  it('accepts a region file with no sheets yet', () => {
    expect(checkSheets([file('castilla-y-leon')], places, src)).toEqual([]);
  });
});

describe('the real content', () => {
  it('passes the check', () => {
    expect(checkSheets(sheetFiles, real, sources)).toEqual([]);
  });
  it('has a sheet for every quizzed place, in every study region', () => {
    const have = new Set(sheetFiles.flatMap((f) => f.sheets.map((s) => s.id)));
    const missing = real.filter((p) => p.quiz !== 'none' && !have.has(p.id)).map((p) => p.id);
    expect(missing).toEqual([]);
  });
  it('gives search the main grapes of Cebreros', () => {
    expect(grapeNames().cebreros).toEqual(['Garnacha Tinta', 'Albillo Real']);
  });
});

describe('grapes in search', () => {
  const tree = loadTree({ ...JSON.parse(readFileSync('data/places.json', 'utf8')) }, { cebreros: ['Garnacha Tinta', 'Albillo Real'], toro: ['Tinta de Toro', 'Tempranillo'] });
  it('finds a place by its main grape, after every name match', () => {
    const hits = tree.search('albillo');
    expect(hits.map((h) => h.id)).toEqual(['cebreros']);
    expect(hits[0].matchedGrape).toBe('Albillo Real');
  });
  it('ranks a name match above a grape match', () => {
    const t = loadTree(JSON.parse(readFileSync('data/places.json', 'utf8')), { cebreros: ['Toro Blanco'] });
    const hits = t.search('toro');
    expect(hits[0].id).toBe('toro');
    expect(hits.findIndex((h) => h.id === 'cebreros')).toBeGreaterThan(0);
    expect(hits.find((h) => h.id === 'toro')?.matchedGrape).toBeUndefined();
  });
});
