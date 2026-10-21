import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { guideOf } from '../../src/facts';
import {
  afterAnswer, COURSES, findsIt, questionType, replay, revealWhy, studyPlan, studyRound, studySet, type LogEntry, type Round,
} from '../../src/quiz';
import { loadTree } from '../../src/tree';

const spain = loadTree(JSON.parse(readFileSync('data/places.json', 'utf8')));
const curriculum = JSON.parse(readFileSync('content/curriculum.json', 'utf8')).wset.levels as Record<string, string[]>;
const ids = (course: (typeof COURSES)[number]) => studySet(spain, course).map((p) => p.id);
const T0 = Date.parse('2026-10-01T09:00:00.000Z');
const DAY = 86_400_000;
const at = (days: number) => new Date(T0 + days * DAY).toISOString();

describe('My course: which places Study asks', () => {
  it('no course asks every core place and zone, as before', () => {
    expect(ids('none')).toEqual(studySet(spain).map((p) => p.id));
    expect(new Set(studySet(spain).map((p) => p.quiz))).toEqual(new Set(['core', 'zone']));
  });

  it('WSET Level 2 and 3 ask exactly the places their specification names', () => {
    expect([...ids('wset-2')].sort()).toEqual([...curriculum['2']].sort());
    expect([...ids('wset-3')].sort()).toEqual([...curriculum['3']].sort());
  });

  it('Wine Scholar asks every core place, without the zones, in course order', () => {
    expect(ids('wine-scholar')).toEqual(ids('none').filter((id) => spain.getPlace(id)!.quiz === 'core'));
  });

  it('the intake and a round take new places from the course only', () => {
    const plan = studyPlan(spain, replay([]), new Date(T0), { course: 'wset-2' });
    expect(plan.intake).toHaveLength(5);
    for (const id of plan.intake) expect(curriculum['2']).toContain(id);
    const round = studyRound(spain, [], new Date(T0), { course: 'wset-2', learnMore: true });
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
    for (const id of noMap) expect(ids('none')).toContain(id);
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
    expect(ids('none').filter((id) => !revealWhy(id, guideOf))).toEqual([]);
  });
});
