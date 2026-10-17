import { describe, expect, it } from 'vitest';
import { parseQuizRoute, parseSelection, quizToHash } from '../../src/url';

describe('the quiz route', () => {
  it('reads #quiz and its reserved sub-routes', () => {
    expect(parseQuizRoute('#quiz')).toEqual({ sub: null });
    expect(parseQuizRoute('#quiz=practise')).toEqual({ sub: 'practise' });
    expect(parseQuizRoute('#quiz=focus')).toEqual({ sub: 'focus' });
    expect(parseQuizRoute('#quiz=progress-file')).toEqual({ sub: 'progress-file' });
  });
  it('treats an unknown sub-route as plain #quiz', () => {
    expect(parseQuizRoute('#quiz=nonsense')).toEqual({ sub: null });
  });
  it('is not the quiz for Explore hashes', () => {
    expect(parseQuizRoute('')).toBeNull();
    expect(parseQuizRoute('#place=toro')).toBeNull();
    expect(parseSelection('#quiz').id).toBe('spain');
  });
  it('writes the route, with the view when given', () => {
    expect(quizToHash({ sub: null })).toBe('#quiz');
    expect(quizToHash({ sub: 'practise' })).toBe('#quiz=practise');
    const view = { lng: -3, lat: 40, zoom: 5, bearing: 0, pitch: 0 };
    expect(quizToHash({ sub: null }, view)).toBe('#quiz&view=-3.0000,40.0000,5.00,0,0');
    expect(parseQuizRoute(quizToHash({ sub: 'focus' }, view))).toEqual({ sub: 'focus' });
  });
});

describe('the test-me route', () => {
  it('writes and reads #quiz=test&set=a,b', () => {
    expect(quizToHash({ sub: 'test', set: ['rioja', 'rioja-alta'] })).toBe('#quiz=test&set=rioja,rioja-alta');
    expect(parseQuizRoute('#quiz=test&set=rioja,rioja-alta')).toEqual({ sub: 'test', set: ['rioja', 'rioja-alta'] });
  });
  it('falls back to plain #quiz when the set is missing', () => {
    expect(parseQuizRoute('#quiz=test')).toEqual({ sub: null });
  });
});
