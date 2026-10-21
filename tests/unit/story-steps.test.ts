import { describe, expect, it } from 'vitest';
import { guideOf, type Guide } from '../../src/facts';
import { loadStory, storyIds } from '../../src/story/load';
import { linkIndex, sectionSteps, stepOfLink } from '../../src/story/steps';
import type { Story } from '../../src/story/format';

const rioja = loadStory('rioja') as Story;
const guide = guideOf('rioja') as Guide;
const stepId = (id: string) => rioja.steps.findIndex((s) => s.id === id);

describe('tour steps on the guide page', () => {
  it('scrolling follows the lede and each chapter, showing the chapter’s first step', () => {
    expect(sectionSteps(rioja).map((s) => `${s.chapter}:${rioja.steps[s.step].id}`))
      .toEqual(['null:intro', 'valley:valley', 'climate:climate', 'soils:soils', 'barrel:barrel']);
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
});
