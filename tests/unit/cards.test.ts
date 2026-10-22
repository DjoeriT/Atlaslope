import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { focusFor, parentOf, selectionOf, validSelection } from '../../src/cards/nav';
import { boundsOf } from '../../src/map/focus';
import { loadTree } from '../../src/tree';
import { ATLAS, SPAIN, parseSelection, parseView, selectionToHash } from '../../src/url';

const tree = loadTree(JSON.parse(readFileSync('data/places.json', 'utf8')));

describe('url state', () => {
  it('round-trips a selection and a view', () => {
    const view = { lng: -5.4, lat: 41.5, zoom: 8.25, bearing: 0, pitch: 45 };
    const hash = selectionToHash({ kind: 'place', id: 'toro' }, view);
    expect(hash).toBe('#place=toro&view=-5.4000,41.5000,8.25,0,45');
    expect(parseSelection(hash)).toEqual({ kind: 'place', id: 'toro' });
    expect(parseView(hash)).toEqual(view);
  });
  it('keeps the region Rioja and the place Rioja apart', () => {
    expect(parseSelection('#region=rioja')).toEqual({ kind: 'region', id: 'rioja' });
    expect(parseSelection('#place=rioja')).toEqual({ kind: 'place', id: 'rioja' });
  });
  it('treats an empty hash as the atlas cover, and gives Spain its own address', () => {
    expect(selectionToHash(ATLAS)).toBe('');
    expect(parseSelection('')).toEqual(ATLAS);
    expect(selectionToHash(SPAIN)).toBe('#country=spain');
    expect(parseSelection('#country=spain')).toEqual(SPAIN);
    expect(parseSelection(selectionToHash(SPAIN, { lng: -3, lat: 40, zoom: 5, bearing: 0, pitch: 0 }))).toEqual(SPAIN);
    expect(validSelection(tree, ATLAS)).toEqual(ATLAS);
    expect(validSelection(tree, SPAIN)).toEqual(SPAIN);
    expect(validSelection(tree, { kind: 'country', id: 'atlantis' })).toEqual(SPAIN);
    expect(parseView('#view=1,2,3')).toBeNull();
    expect(parseView('#view=1,99,3,0,0')).toBeNull();
  });
  it('sends an unknown id to Spain', () => {
    expect(validSelection(tree, { kind: 'place', id: 'atlantis' })).toEqual(SPAIN);
    expect(validSelection(tree, { kind: 'region', id: 'toro-x' })).toEqual(SPAIN);
    expect(validSelection(tree, { kind: 'region', id: 'ebro' })).toEqual({ kind: 'region', id: 'ebro' });
    // the one-place Rioja region opens the Rioja place, card or page
    expect(validSelection(tree, { kind: 'region', id: 'rioja' })).toEqual({ kind: 'place', id: 'rioja' });
    expect(validSelection(tree, { kind: 'region', id: 'rioja', page: true })).toEqual({ kind: 'place', id: 'rioja', page: true });
  });
});

describe('card navigation', () => {
  it('walks Spain, region, place, zone and back up', () => {
    const trail = tree.breadcrumb('rioja-alta', 'place').map((c) => selectionOf(tree, c));
    expect(trail).toEqual([SPAIN, { kind: 'place', id: 'rioja' }, { kind: 'place', id: 'rioja-alta' }]);
    expect(parentOf(tree, { kind: 'place', id: 'rioja-alta' })).toEqual({ kind: 'place', id: 'rioja' });
    expect(parentOf(tree, { kind: 'place', id: 'rioja' })).toEqual(SPAIN);
    expect(parentOf(tree, { kind: 'place', id: 'toro' })).toEqual({ kind: 'region', id: 'castilla-y-leon' });
    expect(parentOf(tree, { kind: 'region', id: 'castilla-y-leon' })).toEqual(SPAIN);
  });
  it('tells the map what to show', () => {
    expect(focusFor(tree, SPAIN)).toEqual({ frame: null, country: 'spain', dimRegion: null, select: null, showZones: false });
    expect(focusFor(tree, { kind: 'region', id: 'rioja' })).toMatchObject({ frame: { region: 'rioja' }, dimRegion: 'rioja', select: null });
    expect(focusFor(tree, { kind: 'place', id: 'toro' })).toMatchObject({ frame: { place: 'toro' }, select: 'toro', showZones: false });
    expect(focusFor(tree, { kind: 'place', id: 'rioja' })).toMatchObject({ select: 'rioja', showZones: true });
    expect(focusFor(tree, { kind: 'place', id: 'rioja-alta' })).toMatchObject({ frame: { zone: 'rioja-alta' }, select: 'rioja-alta', showZones: true });
  });
  it('lists the ten study regions in course order', () => {
    expect(tree.regionsOf('spain').map((r) => r.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

describe('framing', () => {
  it('boxes every position of a multipolygon', () => {
    const f = { type: 'Feature' as const, properties: {}, geometry: { type: 'MultiPolygon', coordinates: [[[[0, 1], [2, 3], [0, 1]]], [[[-1, 0], [1, 5], [-1, 0]]]] } };
    expect(boundsOf([f])).toEqual([-1, 0, 2, 5]);
    expect(boundsOf([])).toBeNull();
  });
});

describe('a guide fly-there', () => {
  const fly = (chapter: string, index: number) => ({ kind: 'place' as const, id: 'rioja', fly: { chapter, index } });
  it('frames the place a pill names, as "Show on the map" would', () => {
    expect(focusFor(tree, fly('climate', 0))).toEqual(focusFor(tree, { kind: 'place', id: 'rioja-alta' }));
  });
  it('flies to a named point with a pin and keeps the guide place selected', () => {
    expect(focusFor(tree, fly('valley', 1))).toMatchObject({ frame: { point: [-2.62, 42.61], zoom: 9.8 }, pin: 'Sierra de Cantabria', select: 'rioja' });
  });
  it('drops a fly the guide does not have', () => {
    expect(validSelection(tree, fly('valley', 9))).toEqual({ kind: 'place', id: 'rioja' });
    expect(validSelection(tree, fly('valley', 1))).toEqual(fly('valley', 1));
  });
});
