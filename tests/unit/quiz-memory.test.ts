import { describe, expect, it } from 'vitest';
import {
  BOX_GAPS_DAYS, placeShade, questionType, replay, withSlip,
  type Answer, type LogEntry, type MemoryName, type PlaceMemory,
} from '../../src/quiz';

const T0 = Date.parse('2026-10-01T09:00:00.000Z');
const DAY = 86_400_000;
/** ISO time `days` (may be fractional) after T0. */
const at = (days: number) => new Date(T0 + days * DAY).toISOString();
const answer = (days: number, right: boolean, memory: MemoryName = 'where', place = 'toro'): Answer => ({
  kind: 'answer', place, memory, type: memory === 'what' ? 'fact' : 'find-it', right, at: at(days), seconds: 4,
});
const mem = (log: LogEntry[], memory: MemoryName = 'where', place = 'toro') => replay(log).places[place][memory];

describe('boxes', () => {
  it('puts a memory in box 1 on its first right answer, due a day later', () => {
    const m = mem([answer(0, true)]);
    expect(m.box).toBe(1);
    expect(m.due).toBe(at(1));
  });

  it('moves a right answer on a due memory up one box, with the next gap', () => {
    const m = mem([answer(0, true), answer(1, true)]);
    expect(m.box).toBe(2);
    expect(m.due).toBe(at(1 + BOX_GAPS_DAYS[1]));
  });

  it('changes nothing for a right answer before the memory is due', () => {
    const m = mem([answer(0, true), answer(0.5, true)]);
    expect(m.box).toBe(1);
    expect(m.due).toBe(at(1));
  });

  it('drops a box on a miss, due after that box\'s gap', () => {
    const m = mem([answer(0, true), answer(1, true), answer(2, false)]);
    expect(m.box).toBe(1);
    expect(m.due).toBe(at(3));
    const out = mem([answer(0, true), answer(1, false)]);
    expect([out.box, out.due]).toEqual([0, at(2)]);
  });

  it('moves nothing when a miss is re-asked and answered right in the same round', () => {
    const missed = [answer(0, true), answer(1, true), answer(5, false)];
    const reasked = mem([...missed, answer(5.01, true)]);
    expect([reasked.box, reasked.due]).toEqual([mem(missed).box, mem(missed).due]);
    expect(mem([...missed, answer(6, true)]).box).toBe(2);
  });

  it('never goes above box 5 or below box 0', () => {
    const log: Answer[] = [answer(0, true)];
    let day = 0;
    for (const gap of [1, 3, 7, 14, 30, 30]) log.push(answer((day += gap), true));
    expect(mem(log).box).toBe(5);
    expect(mem(log).due).toBe(at(day + 30));
    expect(mem([answer(0, true), answer(1, false), answer(2, false)]).box).toBe(0);
  });

  it('keeps a memory out of the boxes until its first right answer', () => {
    expect(mem([answer(0, false)]).box).toBe(0);
    expect(mem([answer(0, false), answer(0.1, true)]).box).toBe(0);
    expect(mem([answer(0, false), answer(1, true)]).box).toBe(1);
  });
});

describe('shades', () => {
  it('is new before any answer, learning once asked', () => {
    const intro: LogEntry = { kind: 'intro', place: 'toro', at: at(0) };
    expect(mem([intro]).shade).toBe('new');
    expect(mem([intro, answer(0, true)]).shade).toBe('learning');
    expect(mem([answer(0, false)]).shade).toBe('learning');
  });

  it('is known after two right answers in a row', () => {
    expect(mem([answer(0, false), answer(0.1, true), answer(0.2, true)]).shade).toBe('known');
  });

  it('is solid after three rights in a row on three days, each a day apart', () => {
    expect(mem([answer(0, true), answer(1, true), answer(2, true)]).shade).toBe('solid');
    expect(mem([answer(0, true), answer(0.5, true), answer(1.2, true)]).shade).toBe('known');
    expect(mem([answer(0, true), answer(0.5, true), answer(1.2, true), answer(2, true)]).shade).toBe('known');
    expect(mem([answer(0, true), answer(0.5, true), answer(1.2, true), answer(2.2, true)]).shade).toBe('solid');
  });

  it('drops back to learning on any miss, from known or solid', () => {
    expect(mem([answer(0, true), answer(1, true), answer(1.5, false)]).shade).toBe('learning');
    expect(mem([answer(0, true), answer(1, true), answer(2, true), answer(5, false)]).shade).toBe('learning');
    expect(mem([answer(0, true), answer(1, true), answer(2, true), answer(5, false), answer(5.1, true), answer(5.2, true)]).shade).toBe('known');
  });

  it('gives a place the shade of where, capped by what: known only when both are, solid only when both are', () => {
    const where = [answer(0, true), answer(1, true), answer(2, true)];
    const shade = (log: LogEntry[]) => placeShade(replay(log).places.toro);
    expect(placeShade(undefined)).toBe('new');
    expect(shade([{ kind: 'intro', place: 'toro', at: at(0) }])).toBe('new');
    expect(shade([answer(0, true, 'what')])).toBe('new');
    expect(shade([answer(0, false)])).toBe('learning');
    expect(shade(where)).toBe('learning');
    expect(shade([...where, answer(2, true, 'what'), answer(3, true, 'what'), answer(4, true, 'what')])).toBe('solid');
    expect(placeShade(replay([...where, answer(2, true, 'what')]).places.toro)).toBe('learning');
    expect(placeShade(replay([...where, answer(2, true, 'what'), answer(3, true, 'what')]).places.toro)).toBe('known');
    expect(placeShade(replay([answer(0, true), answer(0.1, false), answer(0, true, 'what'), answer(1, true, 'what')]).places.toro)).toBe('learning');
  });
});

describe('question type by memory', () => {
  const place = (log: LogEntry[]): PlaceMemory | undefined => replay(log).places.toro;

  it('asks what is this for a new where, find it once asked', () => {
    expect(questionType(undefined, 'where')).toBe('what-is-this');
    expect(questionType(place([{ kind: 'intro', place: 'toro', at: at(0) }]), 'where')).toBe('what-is-this');
    expect(questionType(place([answer(0, false)]), 'where')).toBe('find-it');
    expect(questionType(place([answer(0, true), answer(1, true), answer(2, true)]), 'where')).toBe('find-it');
  });

  it('asks the fact question for what only once where is known', () => {
    expect(questionType(undefined, 'what')).toBeNull();
    expect(questionType(place([answer(0, true)]), 'what')).toBeNull();
    expect(questionType(place([answer(0, true), answer(1, true)]), 'what')).toBe('fact');
    expect(questionType(place([answer(0, true), answer(1, true), answer(1.5, false)]), 'what')).toBeNull();
  });
});

describe('that was a slip', () => {
  it('turns the last miss into a right for the schedule, and the log keeps both', () => {
    const log = withSlip([answer(0, true), answer(1, false)]);
    expect(log[1]).toEqual({ ...answer(1, false), slip: true });
    expect(mem(log)).toEqual(mem([answer(0, true), answer(1, true)]));
  });

  it('marks only a miss that is the last answer, once', () => {
    const right = [answer(0, true)];
    expect(withSlip(right)).toEqual(right);
    const once = withSlip([answer(0, false)]);
    expect(withSlip(once)).toEqual(once);
    expect(withSlip([])).toEqual([]);
  });
});

describe('replay', () => {
  it('gives the same state for the same log, every time', () => {
    const log: LogEntry[] = [
      { kind: 'intro', place: 'toro', at: at(0) }, answer(0, false), answer(0.1, true), answer(1, true), answer(1, true, 'what'),
      { kind: 'intro', place: 'bierzo', at: at(1) }, answer(1, true, 'where', 'bierzo'), answer(3, false, 'where', 'bierzo'),
    ];
    expect(replay(log)).toEqual(replay([...log]));
    expect(replay(log)).toEqual(replay(JSON.parse(JSON.stringify(log))));
  });

  it('starts both memories\' clock at the intro', () => {
    const p = replay([{ kind: 'intro', place: 'toro', at: at(0) }]).places.toro;
    expect(p.seenAt).toBe(at(0));
    expect(p.what.due).toBe(at(0));
    expect(p.what.answers).toBe(0);
  });
});
