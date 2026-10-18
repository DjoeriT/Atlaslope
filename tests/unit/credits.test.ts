import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { creditName, oneEach } from '../../src/cards/Credit';

const photo = (artist: string, licence = 'CC BY 2.0', page = artist) => ({ alt: '', artist, licence, licenceUrl: '', page, title: '' });

// Premium feel review, 18 Oct 2026: "Unknown authorUnknown author" and "Bertrand GRONDIN → (Talk)" in live credit lines.
describe('photo credits', () => {
  it('credits Wikimedia Commons when Commons names no author', () => {
    expect(creditName('Unknown')).toBe('Wikimedia Commons');
    expect(creditName('Juanedc')).toBe('Juanedc');
  });
  it('names an author and licence once per credit line', () => {
    const line = oneEach([photo('Juanedc', 'CC BY 2.0', 'a'), photo('Juanedc', 'CC BY 2.0', 'b'), photo('Juanedc', 'CC BY-SA 4.0', 'c')]);
    expect(line.map((p) => p.page)).toEqual(['a', 'c']);
  });
  it('ships no run-on or doubled author names', () => {
    const artists: string[] = [];
    JSON.stringify(JSON.parse(readFileSync('data/photos.json', 'utf8')), (k, v) => { if (k === 'artist') artists.push(v); return v; });
    expect(artists.length).toBeGreaterThan(100);
    const bad = artists.filter((a) => /Credit information|&amp;|^Photograph by|[→←]|\((?:[Tt]alk|[Cc]ontribs?)\)|\bfrom [A-ZÁÉÍÓÚa-z]+, |(Unknown author){2}/.test(a) || /^(.{4,})\1$/.test(a));
    expect(bad).toEqual([]);
  });
});
