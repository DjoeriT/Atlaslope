import { describe, expect, it } from 'vitest';
import { makeClock, missesOf, progressOf, scoreOf, viewFor, withoutReask, type Outcome, type Outcomes } from '../../src/quiz-ui/helpers';
import { withoutSlip } from '../../src/quiz-ui/useQuiz';
import type { LogEntry, Round } from '../../src/quiz';

const q = (place: string, extra: object = {}) => ({ kind: 'question' as const, place, memory: 'where' as const, type: 'find-it' as const, ...extra });
const outcome = (place: string, extra: Partial<Outcome> = {}): Outcome => ({ place, memory: 'where', type: 'find-it', reask: false, right: true, slip: false, skipped: false, ...extra });

const round: Round = { items: [{ kind: 'intro', place: 'a' }, q('a'), q('b'), q('c')], more: true };

describe('the dots and numbers', () => {
  it('count questions only, never the intro', () => {
    const p = progressOf(round, {}, 0);
    expect(p.dots).toEqual(['todo', 'todo', 'todo']);
    expect(p.of).toBe(3);
    expect(p.n).toBe(0);
    expect(progressOf(round, {}, 1)).toMatchObject({ n: 1, of: 3, dots: ['cur', 'todo', 'todo'] });
  });
  it('show right, wrong and a slip as right', () => {
    const o: Outcomes = { 1: outcome('a'), 2: outcome('b', { right: false, slip: true }), };
    expect(progressOf(round, o, 3)).toMatchObject({ dots: ['ok', 'ok', 'cur'], right: 2, wrong: 0, n: 3 });
    expect(progressOf(round, { 1: outcome('a', { right: false }) }, 2).dots).toEqual(['bad', 'cur', 'todo']);
  });
});

describe('the re-ask', () => {
  const grown: Round = { items: [q('a'), q('b'), q('a', { reask: true })], more: false };
  it('goes when the miss is marked as a slip, and only that one', () => {
    expect(withoutReask(grown, 'a', 'where').items).toEqual([q('a'), q('b')]);
    expect(withoutReask(grown, 'b', 'where')).toBe(grown);
  });
});

describe('the score and the misses', () => {
  const o: Outcomes = {
    0: outcome('a'),
    1: outcome('b', { right: false, picked: 'x' }),
    2: outcome('c', { right: false, slip: true }),
    3: outcome('b', { reask: true }),
    4: outcome('d', { right: false, skipped: true }),
  };
  it('mark first asks only; a slip counts as right', () => {
    expect(scoreOf(o)).toEqual({ right: 2, of: 4 });
  });
  it('list first-ask misses that stayed misses, in order', () => {
    expect(missesOf(o).map((m) => m.place)).toEqual(['b', 'd']);
  });
});

describe('what the map is asked to show', () => {
  const base = { place: 'toro', zone: false, picked: null, revealed: false };
  it('hides names always and frames the place at its intro', () => {
    expect(viewFor({ ...base, type: 'intro' })).toMatchObject({ hideNames: true, select: 'toro', reveal: { answer: 'toro' } });
  });
  it('shows the tapped place while finding it, and the answer with the wrong pick after', () => {
    expect(viewFor({ ...base, type: 'find-it', picked: 'rueda' })).toMatchObject({ select: 'rueda', reveal: null, dimExcept: null });
    expect(viewFor({ ...base, type: 'find-it', picked: 'rueda', revealed: true })).toMatchObject({ select: 'toro', reveal: { answer: 'toro', picked: 'rueda' }, dimExcept: ['toro', 'rueda'] });
    expect(viewFor({ ...base, type: 'find-it', picked: null, revealed: true }).reveal).toEqual({ answer: 'toro' });
  });
  it('draws the zones only for a zone', () => {
    expect(viewFor({ ...base, type: 'find-it' }).showZones).toBe(false);
    expect(viewFor({ ...base, place: 'rioja-alta', zone: true, type: 'find-it' }).showZones).toBe(true);
  });
});

describe('the slip mark', () => {
  const miss: LogEntry = { kind: 'answer', place: 'a', memory: 'where', type: 'find-it', right: false, slip: true, at: '2026-10-17T10:00:00Z', seconds: 3 };
  it('comes off the last answer', () => {
    const [back] = withoutSlip([miss]);
    expect(back).toEqual({ ...miss, slip: undefined });
    expect('slip' in back!).toBe(false);
  });
  it('leaves a log with no slip alone', () => {
    const log: LogEntry[] = [{ ...miss, slip: undefined }];
    expect(withoutSlip(log)).toEqual(log);
  });
});

describe('the quiz clock', () => {
  it('is the real one without a fixed start', () => {
    expect(makeClock(null, () => 5000)().getTime()).toBe(5000);
    expect(makeClock('nonsense', () => 5000)().getTime()).toBe(5000);
  });
  it('starts at the fixed time and keeps counting', () => {
    let t = 1000;
    const clock = makeClock('2026-10-17T10:00:00Z', () => t);
    expect(clock().toISOString()).toBe('2026-10-17T10:00:00.000Z');
    t = 4000;
    expect(clock().toISOString()).toBe('2026-10-17T10:00:03.000Z');
  });
});
