import { describe, expect, it } from 'vitest';
import { guideOf, type Guide } from '../../src/facts';
import { loadStory, storyIds } from '../../src/story/load';
import { pickStep, spreadRows } from '../../src/story/camera';
import { anchorOf, anchorsOf, linkIndex, stepOfLink } from '../../src/story/steps';
import type { Story } from '../../src/story/format';

const rioja = loadStory('rioja') as Story;
const guide = guideOf('rioja') as Guide;
const stepId = (id: string) => rioja.steps.findIndex((s) => s.id === id);

describe('tour steps on the guide page', () => {
  it('every step has its own anchor: the lede, its chapter (an overview) or its own fly link', () => {
    expect(rioja.steps.map((st) => anchorOf(guide, st))).toEqual([
      '.pg-spine', '[data-fly="valley.0"]', '[data-fly="valley.1"]', '#terroir-climate',
      '[data-fly="climate.0"]', '[data-fly="climate.1"]', '[data-fly="climate.2"]', '[data-fly="soils.0"]', '#terroir-barrel', '[data-fly="barrel.0"]',
    ]);
  });

  it('while reading, a stop comes up at the paragraph that names it, a chapter\u2019s first stop at the chapter start (owner 22 Oct 2026)', () => {
    expect(anchorsOf(guide, rioja)).toEqual([
      '.pg-spine', '#terroir-valley', '[data-b="valley.0"]', '#terroir-climate',
      '.pg-zguide > :has([data-fly="climate.0"])', '.pg-zguide > :has([data-fly="climate.1"])', '.pg-zguide > :has([data-fly="climate.2"])',
      '#terroir-soils', '#terroir-barrel', '[data-b="barrel.1"]',
    ]);
  });

  it('scrolling down the page shows every step once, in order (Stop 1, 2, 3 ...)', () => {
    // Anchors laid down the page in reading order, 300 px apart; the reading line moves down through them.
    const tops = (y: number) => rioja.steps.map((_, i) => i * 300 - y);
    const seen: number[] = [];
    for (let y = 0; y <= 9 * 300; y += 30) {
      const i = pickStep(tops(y), 100);
      if (seen[seen.length - 1] !== i) seen.push(i);
    }
    expect(seen).toEqual(rioja.steps.map((_, i) => i));
  });

  it('links sharing a row of the page are spread in reading order, so each is reached on its own', () => {
    // Rioja on a laptop: the two valley links share a row, the three zone cards share another.
    const raw = [-900, 400, 400, 900, 1300, 1300, 1300, 1700, 2300, 2500];
    const tops = spreadRows(raw);
    expect(tops).toEqual([-900, 400, 412, 900, 1300, 1312, 1324, 1700, 2300, 2500]);
    expect(spreadRows([5, Infinity, 5.5])).toEqual([5, Infinity, 17]);
  });

  it('an overview keeps its chapter top until the chapter’s first link crosses the line; above everything shows the lede', () => {
    expect(pickStep([-500, -200, 150, 600], 100)).toBe(1);
    expect(pickStep([300, 600], 100)).toBe(0);
  });

  it('a fly link flies to its own step; zone cards count after the chapter’s fly links', () => {
    expect(stepOfLink(guide, rioja, 'valley', 1)).toBe(stepId('sierra'));
    const flies = guide.chapters.find((c) => c.id === 'climate')?.fly?.length ?? 0;
    expect(stepOfLink(guide, rioja, 'climate', flies + 2)).toBe(stepId('z-rioja-oriental'));
    expect(stepOfLink(guide, rioja, 'barrel', 0)).toBe(stepId('haro'));
    expect(stepOfLink(guide, rioja, 'barrel', 5)).toBe(-1);
  });

  it('an overview step has no fly link', () => {
    expect(linkIndex(guide, rioja.steps[0])).toBeUndefined();
    expect(linkIndex(guide, rioja.steps[stepId('barrel')])).toBeUndefined();
  });

  it('every tour: each step’s chapter is on the page and its link index is one the page draws', () => {
    for (const id of storyIds()) {
      const story = loadStory(id) as Story;
      const g = guideOf(id) as Guide;
      for (const s of story.steps.filter((x) => x.chapter !== null)) {
        const ch = g.chapters.find((c) => c.id === s.chapter);
        expect(ch, `${id}/${s.id}`).toBeDefined();
        const k = linkIndex(g, s);
        if (k !== undefined) expect(k, `${id}/${s.id}`).toBeLessThan((ch?.fly?.length ?? 0) + (ch?.cards?.length ?? 0));
      }
    }
  });

  it('every fly link of a tour guide has a tour step, so a click in tour mode always flies the map', () => {
    for (const id of storyIds()) {
      const story = loadStory(id) as Story;
      const g = guideOf(id) as Guide;
      for (const ch of g.chapters) {
        const n = (ch.fly?.length ?? 0) + (ch.cards?.length ?? 0);
        for (let k = 0; k < n; k++) expect(stepOfLink(g, story, ch.id, k), `${id}/${ch.id}#${k}`).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
