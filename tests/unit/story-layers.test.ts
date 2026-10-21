import { describe, expect, it } from 'vitest';
import { CLIMATE_GROUPS } from '../../src/map/climate';
import { legendClasses, nearNames } from '../../src/story/layerRules';
import { stopView } from '../../src/story/storyMap';
import type { StoryStep } from '../../src/story/format';

const pts = [
  { name: 'Haro', at: [-2.85, 42.58] as [number, number] },
  { name: 'Logroño', at: [-2.45, 42.47] as [number, number] },
  { name: 'Priorat peak', at: [0.8, 41.2] as [number, number] },
];
const view = (zoom: number, pitch = 0) => ({ center: [-2.85, 42.58] as [number, number], zoom, pitch });

describe('names near a stop', () => {
  it('keeps names within the visible half-width and drops the far ones', () => {
    expect(nearNames(pts, view(11), 1200)).toEqual(['Haro']);
    expect(nearNames(pts, view(8), 1200)).toEqual(['Haro', 'Logroño']);
    expect(nearNames(pts, view(2), 1200)).toEqual(['Haro', 'Logroño', 'Priorat peak']);
  });
  it('sees further when the view is tilted', () => {
    expect(nearNames(pts, view(10.3, 0), 1200)).toEqual(['Haro']);
    expect(nearNames(pts, view(10.3, 60), 1200)).toEqual(['Haro', 'Logroño']);
  });
  it('leaves out the names a step marker shows', () => {
    expect(nearNames(pts, view(8), 1200, ['Haro'])).toEqual(['Logroño']);
  });
  it('uses at least a 420 px half-width on a narrow map', () => {
    expect(nearNames(pts, view(8), 100)).toEqual(nearNames(pts, view(8), 840));
  });
});

describe('climate legend', () => {
  it('lists the classes under the outline in the app climate colours, largest share first', () => {
    const l = legendClasses('priorat');
    expect(l.length).toBeGreaterThan(0);
    for (const c of l) expect(CLIMATE_GROUPS.find((g) => g.id === c.id)?.color).toBe(c.color);
    expect(l[0].id).toBe('med-hot');
  });
  it('joins the three zones for the Rioja overview', () => {
    const ids = legendClasses('zones').map((c) => c.id);
    expect(ids).toContain('med-warm');
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('is empty for an outline with no measures', () => {
    expect(legendClasses('nowhere')).toEqual([]);
  });
});

describe('fact markers of a stop view', () => {
  const step = { id: 's', chapter: null, camera: {}, focus: 'rioja', facts: [
    { at: 'Haro', label: 'Haro', text: 't', cite: ['x'] },
    { at: 'Nowhere', label: 'N', text: 't', cite: ['x'] },
    { at: [1, 2] as [number, number], label: 'P', text: 't', cite: ['x'] },
  ] } as StoryStep;
  it('places a fact at a named point or a coordinate and drops an unknown name', () => {
    const v = stopView(step, { kind: 'view', center: [0, 0], zoom: 5, pitch: 0, bearing: 0 }, undefined, (n) => (n === 'Haro' ? [-2.85, 42.58] : undefined));
    expect(v.facts.map((f) => f.label)).toEqual(['Haro', 'P']);
  });
});
