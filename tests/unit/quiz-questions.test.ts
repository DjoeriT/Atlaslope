import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadTree } from '../../src/tree';
import { askableFacts, makeQuestion, revealFact, seededRandom, type FactSource, type QuestionContext, type RoundItem } from '../../src/quiz';
import type { Measures, Sheet } from '../../src/facts/types';

const tree = loadTree(JSON.parse(readFileSync('tests/fixtures/quiz-tree.json', 'utf8')));

const grapes: Record<string, { local: string; grape?: string }[]> = {
  'south-a': [{ local: 'Alfa' }], 'south-b': [{ local: 'Beta', grape: 'Betina' }], 'south-c': [{ local: 'Gamma' }],
  'north-a': [{ local: 'Delta' }], 'north-b': [{ local: 'Epsilon' }], 'north-c': [{ local: 'Zeta' }],
};
const famous: Record<string, string[]> = { 'south-a': ['Crianza'], 'south-b': ['Fino'], 'north-a': ['Reserva'], 'north-b': ['Brut'], 'north-c': ['Joven'] };
const climate: Record<string, [string, number][]> = {
  'south-a': [['Hot', 0.4], ['Cold', 0.6]], 'south-b': [['Dry', 0.9]], 'south-c': [['Wet', 0.5]],
  'north-a': [['Mild', 0.7]], 'north-b': [['Snow', 0.5]], 'north-c': [['Rainy', 0.5]],
};
const facts: FactSource = {
  sheetOf: (id) => grapes[id] && ({
    id, grapes: { main: grapes[id] }, ...(famous[id] ? { famous: { styles: famous[id]!.map((name) => ({ name, text: '' })) } } : {}),
  } as unknown as Sheet),
  measuresOf: (id) => climate[id] && ({ koppen: climate[id]!.map(([name, share]) => ({ code: name, name, share })) } as unknown as Measures),
};
const ctx = (seed: number, extra: Partial<QuestionContext> = {}): QuestionContext => ({ tree, facts, rng: seededRandom(seed), ...extra });
const item = (place: string, type: 'what-is-this' | 'find-it' | 'fact'): RoundItem => ({ kind: 'question', place, memory: type === 'fact' ? 'what' : 'where', type });
const POOL = tree.places.filter((p) => p.quiz !== 'none').map((p) => p.id);

describe('what is this', () => {
  it('has four distinct places including the target, all from the askable pool', () => {
    for (let seed = 0; seed < 20; seed++) {
      const q = makeQuestion(item('north-b', 'what-is-this'), ctx(seed));
      if (q?.type !== 'what-is-this') throw new Error('expected what-is-this');
      expect(new Set(q.choices).size).toBe(4);
      expect(q.choices).toContain('north-b');
      expect(q.answer).toBe('north-b');
      for (const c of q.choices) expect(POOL).toContain(c);
      expect(q.choices).not.toContain('south-none');
    }
  });

  it('prefers neighbours in the same study region', () => {
    const southOthers = POOL.filter((id) => tree.getPlace(id)!.region === 'south' && id !== 'south-a');
    expect(southOthers.length).toBeGreaterThanOrEqual(3);
    for (let seed = 0; seed < 10; seed++) {
      const q = makeQuestion(item('south-a', 'what-is-this'), ctx(seed));
      if (q?.type !== 'what-is-this') throw new Error('expected what-is-this');
      expect(q.choices.filter((c) => c !== 'south-a').every((c) => southOthers.includes(c))).toBe(true);
    }
  });

  it('is only the target for find-it, and nothing for an intro', () => {
    expect(makeQuestion(item('south-a', 'find-it'), ctx(1))).toEqual({ type: 'find-it', place: 'south-a' });
    expect(makeQuestion({ kind: 'intro', place: 'south-a' }, ctx(1))).toBeUndefined();
  });

  it('gives the same order for the same seed', () => {
    expect(makeQuestion(item('south-a', 'what-is-this'), ctx(7))).toEqual(makeQuestion(item('south-a', 'what-is-this'), ctx(7)));
    expect(makeQuestion(item('south-a', 'fact'), ctx(7))).toEqual(makeQuestion(item('south-a', 'fact'), ctx(7)));
  });
});

describe('fact questions', () => {
  const trueOf = (kind: string, id: string): string[] => {
    if (kind === 'grape') return (grapes[id] ?? []).flatMap((x) => [x.local, x.grape ? `${x.local} (${x.grape})` : x.local]);
    if (kind === 'style') return famous[id] ?? [];
    return (climate[id] ?? []).map(([n]) => n);
  };

  it('has four distinct choices, one true of the place, each wrong one true of some other place', () => {
    const seen = new Set<string>();
    for (let seed = 0; seed < 60; seed++) {
      const q = makeQuestion(item('south-a', 'fact'), ctx(seed));
      if (q?.type !== 'fact') throw new Error('expected a fact question');
      seen.add(q.fact);
      expect(new Set(q.choices).size).toBe(4);
      expect(q.choices.filter((c) => trueOf(q.fact, 'south-a').includes(c))).toEqual([q.answer]);
      for (const wrong of q.choices.filter((c) => c !== q.answer)) {
        expect(POOL.some((id) => id !== 'south-a' && trueOf(q.fact, id).includes(wrong))).toBe(true);
      }
    }
    expect([...seen].sort()).toEqual(['climate', 'grape', 'style']);
  });

  it('asks climate as the class with the largest share', () => {
    const qs = Array.from({ length: 60 }, (_, s) => makeQuestion(item('south-a', 'fact'), ctx(s)));
    const climateQ = qs.find((x) => x?.type === 'fact' && x.fact === 'climate');
    expect(climateQ && climateQ.type === 'fact' && climateQ.answer).toBe('Cold');
  });

  it('never asks level: 68 of the 73 Study places are a DO, so "DO" was nearly always right (owner card, 17 Oct 2026)', () => {
    expect(askableFacts('south-a', ctx(1))).not.toContain('level');
    for (let seed = 0; seed < 30; seed++) {
      const q = makeQuestion(item('south-a', 'fact'), ctx(seed));
      expect(q?.type === 'fact' && q.fact).not.toBe('level');
    }
  });

  it('never asks the famous style of a place that has none', () => {
    expect(askableFacts('south-c', ctx(1))).not.toContain('style');
    for (let seed = 0; seed < 30; seed++) {
      const q = makeQuestion(item('south-c', 'fact'), ctx(seed));
      expect(q?.type === 'fact' && q.fact).not.toBe('style');
    }
  });

  it('returns nothing when no fact can be asked', () => {
    expect(makeQuestion(item('south-a', 'fact'), ctx(1, { pool: ['south-a'] }))).toBeUndefined();
  });
});

describe('revealFact', () => {
  it('shows the main grape as "local (usual)" when the names differ', () => {
    expect(revealFact('south-b', facts)).toBe('Beta (Betina)');
    expect(revealFact('south-a', facts)).toBe('Alfa');
    expect(revealFact('south-none', facts)).toBeUndefined();
  });
});

describe('style questions with spelling variants', () => {
  // The real names: three txakoli spellings, and a shared Tostado.
  const names: Record<string, string[]> = {
    'south-a': ['Txacolí blanco fermentado en barrica'], 'south-b': ['Txakoli blanco fermentado en barrica'], 'south-c': ['Txakolis blancos fermentados en barrica'],
    'north-a': ['Tostado del Ribeiro'], 'north-b': ['Tostado de Valdeorras'], 'north-c': ['Crianza'],
  };
  const f: FactSource = {
    sheetOf: (id) => ({ id, grapes: { main: grapes[id] ?? [] }, famous: { styles: names[id]!.map((name) => ({ name, text: '' })) } } as unknown as Sheet),
    measuresOf: facts.measuresOf,
  };
  it('never offers the same style as a wrong choice', () => {
    const key = (n: string) => (/tostado/i.test(n) ? 'tostado' : /txa/i.test(n) ? 'txakoli' : n);
    for (const id of Object.keys(names)) {
      for (let seed = 0; seed < 20; seed++) {
        const q = makeQuestion(item(id, 'fact'), { tree, facts: f, rng: seededRandom(seed) });
        if (q?.type !== 'fact' || q.fact !== 'style') continue;
        for (const c of q.choices.filter((c) => c !== q.answer)) expect(key(c)).not.toBe(key(q.answer));
      }
    }
  });
});
