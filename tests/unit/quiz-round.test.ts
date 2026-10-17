import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadTree } from '../../src/tree';
import {
  afterAnswer, MIN_DISTANCE, replay, reviewRound, roundKeys, roundSeed, studyPlan, studyRound, studySet, withSlip,
  type Answer, type LogEntry, type MemoryName, type Round, type RoundItem,
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
/** A place whose where and what are both known by day 2.1 (each memory right twice, a day apart). */
const known = (place: string): LogEntry[] => [
  intro(place, 0), answer(place, 0), answer(place, 1), answer(place, 1.1, true, 'what'), answer(place, 2.1, true, 'what'),
];
const questions = (r: Round) => r.items.filter((i) => i.kind === 'question');
const label = (i: RoundItem) => (i.kind === 'intro' ? `intro ${i.place}` : `${i.place}/${i.memory}/${i.type}`);
/** The closest two screens about the same place come in a round (Infinity when every place shows once). */
function closest(items: RoundItem[]): number {
  let min = Infinity;
  items.forEach((a, i) => items.slice(i + 1).forEach((b, j) => { if (a.place === b.place) min = Math.min(min, j + 1); }));
  return min;
}
/** Every new place's intro comes before its first question. */
const introsFirst = (items: RoundItem[]) => items.every((q, i) => q.kind !== 'question' || q.type !== 'what-is-this' || items.slice(0, i).some((x) => x.kind === 'intro' && x.place === q.place));
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
  it('asks Vinos de Calidad the set holds, drops never-asked places, due and new places with their intro', () => {
    const log = [intro('south-a', 0), answer('south-a', 0.5), intro('north-a', 0), answer('north-a', 0)];
    const r = reviewRound(fixture, ['south-a', 'south-vc', 'south-none', 'north-b', 'north-a'], log, now(2), { size: 10 });
    expect(r.items.map(label).sort()).toEqual([
      'intro north-b', 'intro south-vc', 'north-a/where/find-it', 'north-b/where/what-is-this', 'south-a/where/find-it', 'south-vc/where/what-is-this',
    ]);
    expect(introsFirst(r.items)).toBe(true);
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

  it('holds 20 questions: the 20 most overdue, not in the order they were learned', () => {
    const r = studyRound(spain, log, today);
    expect(questions(r)).toHaveLength(20);
    const places = r.items.map((i) => i.place);
    expect([...places].sort()).toEqual(seen.slice(15).map((p) => p.id).sort());
    expect(places).not.toEqual(seen.slice(15).reverse().map((p) => p.id));
    expect(r.items.every((i) => i.kind === 'question' && i.type === 'find-it')).toBe(true);
    expect(r.more).toBe(true);
  });

  it('gives the same order for the same seed and a different one for another seed', () => {
    expect(studyRound(spain, log, today, { seed: 3 })).toEqual(studyRound(spain, log, today, { seed: 3 }));
    expect(studyRound(spain, log, today, { seed: 3 }).items).not.toEqual(studyRound(spain, log, today, { seed: 4 }).items);
  });

  it('Keep going builds the next 20 from what is left: the other due memories and the intake, shown as a batch and asked later', () => {
    const r1 = studyRound(spain, log, today);
    const r2 = studyRound(spain, log, today, { asked: roundKeys(r1) });
    expect(questions(r2)).toHaveLength(20);
    const due = r2.items.filter((i) => i.kind === 'question' && i.type === 'find-it').map((i) => i.place);
    expect(due.sort()).toEqual(seen.slice(0, 15).map((p) => p.id).sort());
    const intros = r2.items.flatMap((i, at) => (i.kind === 'intro' ? [at] : []));
    expect(intros).toHaveLength(5);
    expect(intros[4] - intros[0]).toBe(4); // five intros in a row
    for (const at of intros) {
      const q = r2.items.findIndex((i) => i.kind === 'question' && i.place === r2.items[at].place);
      expect(r2.items[q]).toEqual({ kind: 'question', place: r2.items[at].place, memory: 'where', type: 'what-is-this' });
      expect(q - at).toBeGreaterThanOrEqual(MIN_DISTANCE);
    }
    expect(r2.more).toBe(false);
    const r3 = studyRound(spain, log, today, { asked: [...roundKeys(r1), ...roundKeys(r2)] });
    expect(r3).toEqual({ items: [], more: false });
  });

  it('never asks a new place on the screen after its intro, even on day one with nothing else to ask', () => {
    for (let seed = 0; seed < 20; seed++) {
      const r = studyRound(spain, [], today, { seed });
      expect(r.items.slice(0, 5).every((i) => i.kind === 'intro')).toBe(true);
      expect(introsFirst(r.items)).toBe(true);
      expect(closest(r.items)).toBeGreaterThanOrEqual(MIN_DISTANCE);
    }
  });

  it('keeps two screens about the same place at least MIN_DISTANCE apart, where and what of one place included', () => {
    // 12 places with where and what both due: 24 memories, 20 asked, so some places come twice.
    const both = studySet(spain).slice(0, 12).flatMap((p) => known(p.id).map((e) => ({ ...e, at: at(Date.parse(e.at) / DAY - T0 / DAY - 30) })));
    for (let seed = 0; seed < 200; seed++) {
      const r = studyRound(spain, both, today, { seed });
      expect(questions(r)).toHaveLength(20);
      expect(closest(r.items)).toBeGreaterThanOrEqual(MIN_DISTANCE);
    }
  });

  it('a Review round with more new places than one batch keeps every intro at least MIN_DISTANCE from its question (ReviewBot, PR #69)', () => {
    const ids = studySet(spain).map((p) => p.id);
    for (const n of [6, 7, 8, 11, 12, 16, 20]) {
      for (let seed = 0; seed < 30; seed++) {
        const r = reviewRound(spain, ids.slice(0, n), [], today, { seed });
        expect(introsFirst(r.items)).toBe(true);
        expect(closest(r.items)).toBeGreaterThanOrEqual(MIN_DISTANCE);
      }
    }
    const three = ids.slice(0, 3).flatMap((id) => [intro(id, -3), answer(id, -2)]);
    for (let seed = 0; seed < 30; seed++) expect(closest(reviewRound(spain, ids.slice(0, 20), three, today, { seed }).items)).toBeGreaterThanOrEqual(MIN_DISTANCE);
  });

  it('roundSeed differs by day and by log length, and is the same for the same moment', () => {
    expect(roundSeed(now(0), 4)).toBe(roundSeed(now(0.3), 4));
    expect(roundSeed(now(0), 4)).not.toBe(roundSeed(now(0), 5));
    expect(roundSeed(now(0), 4)).not.toBe(roundSeed(now(1), 4));
  });

  it('a Review round on one place still asks everything, farthest apart it can', () => {
    const r = reviewRound(fixture, ['north-a'], known('north-a'), now(40));
    expect(r.items.map(label).sort()).toEqual(['north-a/what/fact', 'north-a/where/find-it']);
  });

  it('asks a miss once more at the end of the round, typed for its new state', () => {
    const r = studyRound(spain, log, today, { asked: roundKeys(studyRound(spain, log, today)) });
    const at0 = r.items.findIndex((i) => i.kind === 'question' && i.type === 'what-is-this');
    const q = r.items[at0];
    const missed = [...log, intro(q.place, 0), answer(q.place, 0.01, false)];
    const again = afterAnswer(r, at0, false, missed);
    expect(again.items).toHaveLength(r.items.length + 1);
    expect(again.items[again.items.length - 1]).toEqual({ kind: 'question', place: q.place, memory: 'where', type: 'find-it', reask: true });
    expect(afterAnswer(again, again.items.length - 1, false, missed)).toEqual(again);
    expect(afterAnswer(r, at0, true, log)).toEqual(r);
    expect(afterAnswer(r, r.items.findIndex((i) => i.kind === 'intro'), false, log)).toEqual(r);
  });

  it('a miss on the last question is not asked again straight away; one on the question before last is, a screen later', () => {
    const r = studyRound(spain, log, today);
    const last = r.items.length - 1;
    const missed = (i: number) => [...log, answer(r.items[i].place, 0.01, false)];
    expect(afterAnswer(r, last, false, missed(last))).toEqual(r);
    const again = afterAnswer(r, last - 1, false, missed(last - 1));
    expect(again.items).toHaveLength(r.items.length + 1);
    expect(again.items[again.items.length - 1]).toMatchObject({ place: r.items[last - 1].place, reask: true });
  });

  it('after a slip, the missed memory moves on as if right', () => {
    const p = seen[0].id;
    const slipped = withSlip([...log, answer(p, 0, false)]);
    expect(replay(slipped).places[p].where.box).toBe(2);
    const items = studyRound(spain, slipped, today).items.filter((i) => i.place === p);
    expect(items).toEqual([{ kind: 'question', place: p, memory: 'what', type: 'fact' }]); // where known now, so its fact question is due
  });
});
