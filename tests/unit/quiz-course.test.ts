import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { guideOf } from '../../src/facts';
import {
  afterAnswer, COURSES, courseOf, createStore, findsIt, inCourse, NO_COURSE, questionType, readCourse, replay, revealWhy, studyPlan, studyRound, studySet,
  type LogEntry, type Round,
} from '../../src/quiz';
import { nextDue, practiseTree } from '../../src/quiz-ui/doorsModel';
import { loadTree } from '../../src/tree';

const spain = loadTree(JSON.parse(readFileSync('data/places.json', 'utf8')));
const curriculum = JSON.parse(readFileSync('content/curriculum.json', 'utf8')).wset.levels as Record<string, string[]>;
const ids = (course: string) => studySet(spain, course).map((p) => p.id);
const T0 = Date.parse('2026-10-01T09:00:00.000Z');
const DAY = 86_400_000;
const at = (days: number) => new Date(T0 + days * DAY).toISOString();

describe('Learning for: which places Learn asks', () => {
  it('no course asks every core place and zone, as before', () => {
    expect(ids('all-es')).toEqual(studySet(spain).map((p) => p.id));
    expect(new Set(studySet(spain).map((p) => p.quiz))).toEqual(new Set(['core', 'zone']));
  });

  it('WSET Level 2 and 3 ask exactly the places their specification names', () => {
    expect([...ids('wset-2-es')].sort()).toEqual([...curriculum['2']].sort());
    expect([...ids('wset-3-es')].sort()).toEqual([...curriculum['3']].sort());
  });

  it('Wine Scholar asks every core place, without the zones, in course order', () => {
    expect(ids('wine-scholar-es')).toEqual(ids('all-es').filter((id) => spain.getPlace(id)!.quiz === 'core'));
  });

  it('the intake and a round take new places from the course only', () => {
    const plan = studyPlan(spain, replay([]), new Date(T0), { course: 'wset-2-es' });
    expect(plan.intake).toHaveLength(5);
    for (const id of plan.intake) expect(curriculum['2']).toContain(id);
    const round = studyRound(spain, [], new Date(T0), { course: 'wset-2-es', learnMore: true });
    for (const i of round.items) expect(curriculum['2']).toContain(i.place);
  });
});

describe('Cava and Catalunya: in Study, never "find it"', () => {
  const noMap = spain.places.filter((p) => !findsIt(p)).map((p) => p.id).sort();
  const whereKnown = (place: string): LogEntry[] => [
    { kind: 'intro', place, at: at(0) },
    { kind: 'answer', place, memory: 'where', type: 'what-is-this', right: true, at: at(0), seconds: 3 },
    { kind: 'answer', place, memory: 'where', type: 'what-is-this', right: true, at: at(1), seconds: 3 },
  ];

  it('are the places flagged in the data, and Study asks them', () => {
    expect(noMap).toEqual(['catalunya', 'cava']);
    for (const id of noMap) expect(ids('all-es')).toContain(id);
  });

  it('a known "where" is asked again as what is this, and unlocks the fact question', () => {
    const log = noMap.flatMap(whereKnown);
    const state = replay(log);
    for (const id of noMap) {
      expect(questionType(state.places[id], 'where', findsIt(spain.getPlace(id)))).toBe('what-is-this');
      expect(questionType(state.places[id], 'what', findsIt(spain.getPlace(id)))).toBe('fact');
    }
    let asked = 0;
    for (let day = 2; day < 60; day += 3) {
      const round = studyRound(spain, log, new Date(T0 + day * DAY), { size: 200 });
      for (const i of round.items) {
        if (i.kind !== 'question' || !noMap.includes(i.place)) continue;
        asked++;
        expect(i.type).not.toBe('find-it');
      }
    }
    expect(asked).toBeGreaterThan(0);
  });

  it('a missed question is re-asked as what is this, not find it', () => {
    const log: LogEntry[] = [...whereKnown('cava'), { kind: 'answer', place: 'cava', memory: 'where', type: 'what-is-this', right: false, at: at(2), seconds: 3 }];
    const round: Round = { more: false, items: [
      { kind: 'question', place: 'cava', memory: 'where', type: 'what-is-this' },
      ...['rioja', 'toro', 'jerez', 'bierzo'].map((place) => ({ kind: 'intro' as const, place })),
    ] };
    expect(afterAnswer(round, 0, false, log, spain).items.at(-1)).toMatchObject({ place: 'cava', type: 'what-is-this', reask: true });
  });
});

describe("the answer reveal: the guide's why line", () => {
  it("is the place guide's own why line (its lede)", () => {
    const rioja = JSON.parse(readFileSync('content/guides/rioja.json', 'utf8'));
    expect(revealWhy('rioja', guideOf)).toBe(rioja.lede.text);
    expect(revealWhy('nowhere', guideOf)).toBeUndefined();
  });

  it('exists for every place Study asks', () => {
    expect(ids('all-es').filter((id) => !revealWhy(id, guideOf))).toEqual([]);
  });
});

describe('the course list (content/curriculum.json "courses")', () => {
  it('lists All of Spain first, then the courses, each with the fields the menu and the scope line need', () => {
    expect(COURSES.map((c) => c.id)).toEqual(['all-es', 'wine-scholar-es', 'wset-3-es', 'wset-2-es']);
    expect(NO_COURSE).toBe('all-es');
    expect(courseOf('wset-3-es').label).toBe('WSET Level 3 · Spain');
    for (const c of COURSES) {
      expect(c.country).toBe('es');
      expect(c.onFile.length).toBeGreaterThan(0);
      expect(['all', 'core', 'wset']).toContain(c.rule);
      if (c.rule === 'wset') expect(curriculum[c.level!]).toBeDefined();
    }
  });

  it('counts 75, 72, 19 and 8 places', () => {
    expect(COURSES.map((c) => ids(c.id).length)).toEqual([75, 72, 19, 8]);
  });

  it('reads the ids stored before the list, and anything unknown as All of Spain', () => {
    expect(['none', 'wset-2', 'wset-3', 'wine-scholar'].map(readCourse)).toEqual(['all-es', 'wset-2-es', 'wset-3-es', 'wine-scholar-es']);
    expect(readCourse('wset-3-es')).toBe('wset-3-es');
    expect(readCourse('french-wine-scholar')).toBe('all-es');
    expect(readCourse(undefined)).toBe('all-es');
  });

  it('loads a record saved with an old id under its new id', () => {
    const mem = new Map<string, string>();
    const storage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k) } as unknown as Storage;
    mem.set('atlaslope.quiz', JSON.stringify({ version: 1, log: [], focus: [], course: 'wset-3', savedAt: '' }));
    expect(createStore(storage, () => new Date(T0)).load().course).toBe('wset-3-es');
  });
});

describe('the course filters practice and the next-due line', () => {
  it('the practice picker offers only the course places, and every Review place with no course', () => {
    const picked = (course?: string) => practiseTree(spain, course).flatMap((g) => g.places.map((p) => p.id));
    expect([...picked('wset-3-es')].sort()).toEqual([...curriculum['3']].sort());
    expect(picked()).toEqual(picked('all-es'));
    expect(picked().length).toBeGreaterThan(ids('all-es').length);
  });

  it('counts only the course places due next', () => {
    const intro = (place: string): LogEntry => ({ kind: 'intro', place, at: at(0) });
    const outside = ids('all-es').find((id) => !curriculum['2'].includes(id))!;
    const state = replay([intro('rioja'), intro(outside)]);
    const now = new Date(T0 - 60_000);
    expect(nextDue(spain, state, now)!.places).toBe(2);
    expect(nextDue(spain, state, now, 'wset-2-es')!.places).toBe(1);
    expect(inCourse('wset-2-es', spain.getPlace(outside)!)).toBe(false);
  });
});
