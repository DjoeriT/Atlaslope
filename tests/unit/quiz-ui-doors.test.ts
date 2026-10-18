import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { replay, studyPlan, type LogEntry } from '../../src/quiz';
import { loadTree } from '../../src/tree';
import { dueByRegion, focusNames, listOf, missedToday, nextDue, practiseTree, sharedRegion, tickOf } from '../../src/quiz-ui/doors';

const tree = loadTree(JSON.parse(readFileSync('data/places.json', 'utf8')));
const core = tree.places.filter((p) => p.quiz === 'core');
const [a, b] = core;
const miss = (place: string, at: string, extra: object = {}): LogEntry => ({ kind: 'answer', place, memory: 'where', type: 'find-it', right: false, at, seconds: 2, ...extra });
const right = (place: string, at: string): LogEntry => ({ kind: 'answer', place, memory: 'where', type: 'find-it', right: true, at, seconds: 2 });

describe('missed today', () => {
  const now = new Date('2026-10-17T15:00:00Z');
  it('lists each place missed today once, and not slips or earlier days', () => {
    const log = [miss(a.id, '2026-10-16T10:00:00Z'), miss(b.id, '2026-10-17T09:00:00Z'), miss(b.id, '2026-10-17T10:00:00Z'), miss(core[2].id, '2026-10-17T11:00:00Z', { slip: true }), right(core[3].id, '2026-10-17T12:00:00Z')];
    expect(missedToday(log, now)).toEqual([b.id]);
  });
});

describe('next due', () => {
  it('names the first day with something due and counts its places', () => {
    const log = [right(a.id, '2026-10-17T10:00:00Z'), right(b.id, '2026-10-17T10:05:00Z')];
    const next = nextDue(tree, replay(log), new Date('2026-10-17T11:00:00Z'));
    expect(next?.places).toBe(2);
    expect(next?.day.toISOString().slice(0, 10)).toBe('2026-10-18');
  });
  it('is null with nothing scheduled', () => {
    expect(nextDue(tree, replay([]), new Date('2026-10-17T11:00:00Z'))).toBeNull();
  });
});

describe('due by region', () => {
  it('counts due memories per study region, biggest first', () => {
    const state = replay([right(a.id, '2026-10-01T10:00:00Z'), right(b.id, '2026-10-01T10:00:00Z')]);
    const due = studyPlan(tree, state, new Date('2026-10-20T10:00:00Z')).due;
    const by = dueByRegion(tree, due);
    expect(by.reduce((n, r) => n + r.count, 0)).toBe(due.length);
    expect(by[0].count).toBeGreaterThanOrEqual(by[by.length - 1].count);
  });
});

describe('names and lists', () => {
  it('writes a list in words', () => {
    expect(listOf([])).toBe('');
    expect(listOf(['Toro'])).toBe('Toro');
    expect(listOf(['Toro', 'Rueda', 'Rioja'])).toBe('Toro, Rueda and Rioja');
  });
  it('names the study region new places share, and nothing when they come from more than one', () => {
    const [r1, r2] = tree.regionsOf(tree.countries[0].id);
    const [p1, p2] = tree.placesInRegion(r1.id);
    expect(sharedRegion(tree, [p1.id, p2.id])).toBe(r1.name);
    expect(sharedRegion(tree, [p1.id, tree.placesInRegion(r2.id)[0].id])).toBeNull();
    expect(sharedRegion(tree, [])).toBeNull();
  });
  it('turns focus ids into region and place names', () => {
    const region = tree.regionsOf(tree.countries[0].id)[0];
    expect(focusNames(tree, [region.id, a.id])).toEqual([region.name, a.name]);
  });
});

describe('the practise tree', () => {
  const groups = practiseTree(tree);
  it('groups the askable places under their study region, with no places that are never asked', () => {
    expect(groups.length).toBeGreaterThan(1);
    const all = groups.flatMap((g) => g.places);
    expect(all.every((p) => p.quiz !== 'none')).toBe(true);
    expect(all.some((p) => p.quiz === 'vc')).toBe(true);
  });
  it('ticks a region as all, some or none of its places', () => {
    const ids = groups[0].places.map((p) => p.id);
    expect(tickOf(ids, new Set())).toBe('none');
    expect(tickOf(ids, new Set(ids))).toBe('all');
    expect(tickOf(ids, new Set(ids.slice(1)))).toBe(ids.length > 1 ? 'some' : 'none');
  });
});
