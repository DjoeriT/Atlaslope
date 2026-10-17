import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadTree } from '../../src/tree';
import {
  afterAnswer, replay, reviewRound, roundKeys, studyPlan, studyRound, studySet, withSlip,
  type Answer, type LogEntry, type MemoryName, type Round,
} from '../../src/quiz';

const fixture = loadTree(JSON.parse(readFileSync('tests/fixtures/quiz-tree.json', 'utf8')));
const spain = loadTree(JSON.parse(readFileSync('data/places.json', 'utf8')));

const T0 = Date.parse('2026-10-01T09:00:00.000Z');
const DAY = 86_400_000;
const at = (days: number) => new Date(T0 + days * DAY).toISOString();
const now = (days: number) => new Date(T0 + days * DAY);
const intro = (place: string, days: number): LogEntry => ({ kind: 'intro', place, at: at(days) });
const answer = (place: string, days: number, right = true, memory: MemoryName = 'where'): Answer => ({
  kind: 'answer', place, memory, type: memory === 'what' ? 'fact' : 'find-it', right, at: at(days), seconds: 3,
});
/** A place whose where and what are both known by day 2. */
const known = (place: string): LogEntry[] => [
  intro(place, 0), answer(place, 0), answer(place, 1), answer(place, 1.1, true, 'what'), answer(place, 2, true, 'what'),
];
const questions = (r: Round) => r.items.filter((i) => i.kind === 'question');
const planOf = (log: LogEntry[], days: number, opts = {}) => studyPlan(fixture, replay(log), now(days), opts);

describe('Study intake', () => {
  it('takes five new places a day in course order: region order, then courseOrder, then northSouth', () => {
    expect(planOf([], 0).intake).toEqual(['north-a', 'north-c', 'north-b', 'south-a', 'south-b']);
  });

  it('takes new places from the focus first, then course order resumes', () => {
    expect(planOf([], 0, { focus: ['south'] }).intake).toEqual(['south-a', 'south-b', 'south-c', 'north-a', 'north-c']);
    expect(planOf([], 0, { focus: ['south-b'] }).intake).toEqual(['south-b', 'north-a', 'north-c', 'north-b', 'south-a']);
  });

  it('gives a sixth new place only through "Learn 5 more"', () => {
    const log = ['north-a', 'north-c', 'north-b', 'south-a', 'south-b'].map((p) => intro(p, 0));
    expect(planOf(log, 0.2).intake).toEqual([]);
    expect(planOf(log, 0.2, { learnMore: true }).intake).toEqual(['south-c']);
    expect(planOf(log, 1).intake).toEqual(['south-c']);
  });

  it('counts a place once on the day it is first seen', () => {
    const log = [intro('north-a', 0), answer('north-a', 0, false), intro('north-a', 0.1), answer('north-a', 0.1)];
    expect(planOf(log, 0.2).seenToday).toBe(1);
    expect(planOf(log, 0.2).intake).toEqual(['north-c', 'north-b', 'south-a', 'south-b']);
    expect(planOf(log, 1).seenToday).toBe(0);
  });

  it('uses the learner\'s day: utcOffsetMinutes moves midnight', () => {
    const log = [intro('north-a', 0)]; // 09:00Z
    expect(planOf(log, 0.6).seenToday).toBe(1); // 23:24Z, still the same day in UTC; the next day at UTC+2
    expect(planOf(log, 0.6, { utcOffsetMinutes: 120 }).seenToday).toBe(0);
    expect(planOf(log, 0.6, { utcOffsetMinutes: -120 }).seenToday).toBe(1);
  });

  it('keeps zones out until the parent\'s where and what are known, then takes them after the parent', () => {
    const others = ['north-c', 'north-b', 'south-a', 'south-b', 'south-c'].map((p) => intro(p, -5));
    const learning = [...others, intro('north-a', 0), answer('north-a', 0), answer('north-a', 1)];
    expect(planOf(learning, 3).intake).toEqual([]);
    expect(planOf([...others, ...known('north-a')], 3).intake).toEqual(['north-a-z1', 'north-a-z2']);
    expect(planOf([...known('north-a')], 3).intake).toEqual(['north-a-z1', 'north-a-z2', 'north-c', 'north-b', 'south-a']);
  });

  it('never takes a Vino de Calidad or a never-asked place into Study', () => {
    expect(studySet(fixture).map((p) => p.id)).toEqual(['north-a', 'north-a-z1', 'north-a-z2', 'north-c', 'north-b', 'south-a', 'south-b', 'south-c']);
    expect(studySet(spain)).toHaveLength(73);
    expect(studySet(spain).some((p) => p.quiz === 'vc' || p.quiz === 'none')).toBe(false);
  });
});

describe('Review set', () => {
  it('asks Vinos de Calidad the set holds, drops never-asked places, due first then new places with their intro', () => {
    const log = [intro('south-a', 0), answer('south-a', 0.5), intro('north-a', 0), answer('north-a', 0)];
    const r = reviewRound(fixture, ['south-a', 'south-vc', 'south-none', 'north-b', 'north-a'], log, now(2), { size: 10 });
    expect(r.items).toEqual([
      { kind: 'question', place: 'north-a', memory: 'where', type: 'find-it' },
      { kind: 'question', place: 'south-a', memory: 'where', type: 'find-it' },
      { kind: 'intro', place: 'north-b' },
      { kind: 'question', place: 'north-b', memory: 'where', type: 'what-is-this' },
      { kind: 'intro', place: 'south-vc' },
      { kind: 'question', place: 'south-vc', memory: 'where', type: 'what-is-this' },
    ]);
    expect(r.more).toBe(false);
  });

  it('also asks memories not yet due, and a right answer then moves nothing', () => {
    const log = [intro('north-a', 0), answer('north-a', 0)];
    const r = reviewRound(fixture, ['north-a'], log, now(0.5));
    expect(r.items).toEqual([{ kind: 'question', place: 'north-a', memory: 'where', type: 'find-it' }]);
    const before = replay(log).places['north-a'].where;
    const after = replay([...log, answer('north-a', 0.5)]).places['north-a'].where;
    expect([after.box, after.due]).toEqual([before.box, before.due]);
  });

  it('holds 10 questions when the learner picks 10', () => {
    const log = studySet(spain).slice(0, 30).flatMap((p, i) => [intro(p.id, -1), answer(p.id, -1 + i / 1440)]);
    expect(questions(reviewRound(spain, studySet(spain).map((p) => p.id), log, now(3), { size: 10 }))).toHaveLength(10);
  });
});

describe('Study rounds over data/places.json', () => {
  // 35 places seen and answered right two days ago; the later in course order, the earlier answered (so the more overdue).
  const seen = studySet(spain).slice(0, 35);
  const log = seen.flatMap((p, i) => [intro(p.id, -3), answer(p.id, -2 - i / 1440)]);
  const today = now(0);

  it('holds 20 questions, due memories first, most overdue first', () => {
    const r = studyRound(spain, log, today);
    expect(questions(r)).toHaveLength(20);
    expect(r.items.map((i) => i.place)).toEqual(seen.slice(15).reverse().map((p) => p.id));
    expect(r.items.every((i) => i.kind === 'question' && i.type === 'find-it')).toBe(true);
    expect(r.more).toBe(true);
  });

  it('Keep going builds the next 20 from what is left (due, then intake with intro first), then nothing is left', () => {
    const r1 = studyRound(spain, log, today);
    const r2 = studyRound(spain, log, today, { asked: roundKeys(r1) });
    expect(questions(r2)).toHaveLength(20);
    expect(r2.items.slice(0, 15).map((i) => i.place)).toEqual(seen.slice(0, 15).reverse().map((p) => p.id));
    const intake = r2.items.slice(15);
    expect(intake).toHaveLength(10);
    for (let i = 0; i < 10; i += 2) {
      expect(intake[i].kind).toBe('intro');
      expect(intake[i + 1]).toEqual({ kind: 'question', place: intake[i].place, memory: 'where', type: 'what-is-this' });
    }
    expect(r2.more).toBe(false);
    const r3 = studyRound(spain, log, today, { asked: [...roundKeys(r1), ...roundKeys(r2)] });
    expect(r3).toEqual({ items: [], more: false });
  });

  it('asks a miss once more at the end of the round, typed for its new state', () => {
    const r = studyRound(spain, log, today, { asked: roundKeys(studyRound(spain, log, today)) });
    const first = r.items.findIndex((i) => i.kind === 'intro');
    const q = r.items[first + 1];
    const missed = [...log, intro(q.place, 0), answer(q.place, 0.01, false)];
    const again = afterAnswer(r, first + 1, false, missed);
    expect(again.items).toHaveLength(r.items.length + 1);
    expect(again.items[again.items.length - 1]).toEqual({ kind: 'question', place: q.place, memory: 'where', type: 'find-it', reask: true });
    expect(afterAnswer(again, again.items.length - 1, false, missed)).toEqual(again);
    expect(afterAnswer(r, first + 1, true, log)).toEqual(r);
    expect(afterAnswer(r, first, false, log)).toEqual(r);
  });

  it('after a slip, the missed memory moves on as if right', () => {
    const p = seen[0].id;
    const slipped = withSlip([...log, answer(p, 0, false)]);
    expect(replay(slipped).places[p].where.box).toBe(2);
    const items = studyRound(spain, slipped, today).items.filter((i) => i.place === p);
    expect(items).toEqual([{ kind: 'question', place: p, memory: 'what', type: 'fact' }]); // where known now, so its fact question is due
  });
});
