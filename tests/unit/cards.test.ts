import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { focusFor, parentOf, selectionOf, validSelection } from '../../src/cards/nav';
import { boundsOf } from '../../src/map/focus';
import { loadTree } from '../../src/tree';
import { SPAIN, parseSelection, parseView, selectionToHash } from '../../src/url';

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
  it('treats an empty or broken hash as Spain with no view', () => {
    expect(selectionToHash(SPAIN)).toBe('');
    expect(parseSelection('')).toEqual(SPAIN);
    expect(parseView('#view=1,2,3')).toBeNull();
    expect(parseView('#view=1,99,3,0,0')).toBeNull();
  });
  it('sends an unknown id to Spain', () => {
    expect(validSelection(tree, { kind: 'place', id: 'atlantis' })).toEqual(SPAIN);
    expect(validSelection(tree, { kind: 'region', id: 'rioja' })).toEqual({ kind: 'region', id: 'rioja' });
  });
});

describe('card navigation', () => {
  it('walks Spain, region, place, zone and back up', () => {
    const trail = tree.breadcrumb('rioja-alta', 'place').map((c) => selectionOf(tree, c));
    expect(trail).toEqual([SPAIN, { kind: 'region', id: 'rioja' }, { kind: 'place', id: 'rioja' }, { kind: 'place', id: 'rioja-alta' }]);
    expect(parentOf(tree, { kind: 'place', id: 'rioja-alta' })).toEqual({ kind: 'place', id: 'rioja' });
    expect(parentOf(tree, { kind: 'place', id: 'rioja' })).toEqual({ kind: 'region', id: 'rioja' });
    expect(parentOf(tree, { kind: 'region', id: 'rioja' })).toEqual(SPAIN);
  });
  it('tells the map what to show', () => {
    expect(focusFor(tree, SPAIN)).toEqual({ frame: null, dimRegion: null, select: null, showZones: false });
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
