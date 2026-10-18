// Release 8, light only since 18 Oct 2026: every text and background token pair in src/styles/app.css meets 4.5:1 (Review/visual-style.md, "Colour").
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('../../src/styles/app.css', import.meta.url), 'utf8');

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector}{`);
  const body = css.slice(start + selector.length + 1, css.indexOf('}', start));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2]]));
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const ratio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const pairs: [string, string][] = [
  ['ink', 'paper'], ['ink2', 'paper'], ['ink3', 'paper'],
  ['ink', 'paper2'], ['ink2', 'paper2'], ['ink3', 'paper2'],
  ['accent', 'paper'], ['accent-ink', 'accent'],
  ['ink', 'fill'], ['ink2', 'fill'], ['ink3', 'fill'], ['accent', 'fill'],
  ['ok', 'paper'], ['bad', 'paper'], ['focus', 'paper'],
  ['foil', 'band'], ['foil-ink', 'paper'], ['foil-ink', 'paper2'],
];

describe('theme contrast', () => {
  for (const [name, theme] of [['light', block(':root')]] as const) {
    for (const [fg, bg] of pairs) {
      it(`${name}: ${fg} on ${bg} is at least 4.5:1`, () => {
        expect(theme[fg], `--${fg}`).toBeDefined();
        expect(theme[bg], `--${bg}`).toBeDefined();
        expect(ratio(theme[fg], theme[bg])).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});

// Owner point 4, 18 Oct 2026: no credit text on photos any more; the card's credits are one small line under the cover
// (src/styles/app.css .cover-credits), which still has to clear 4.5:1 on the white card.
describe('photo credit line', () => {
  it('the cover credits colour on white is at least 4.5:1', () => {
    const colour = /\.cover-credits\{[^}]*color:var\(--(\w+)\)/.exec(css)?.[1];
    const hex = new RegExp(`--${colour}:(#[0-9A-Fa-f]{6})`).exec(css)?.[1];
    expect(hex).toBeTruthy();
    expect(ratio(hex!, '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
  });
});
