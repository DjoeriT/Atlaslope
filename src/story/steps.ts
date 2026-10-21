// Where each step of a map tour sits on the guide page (owner, 21 Oct 2026: the tour is folded into the guide, layout A).
// Scrolling follows chapters: while a chapter is in view the map shows that chapter's first step (the lede shows the opening view).
// The guide's own fly links and zone cards fly to their exact step. A link's index is the guide page's numbering: the chapter's
// fly[] first, then its cards[] (PlacePage, `pill`).
import type { Guide } from '../facts';
import type { Story, StoryStep } from './format';

/** The index the guide page gives this step's fly link, or undefined for a step without one (an overview). */
export function linkIndex(guide: Guide, step: StoryStep): number | undefined {
  const ch = guide.chapters.find((c) => c.id === step.chapter);
  if (!ch) return undefined;
  if (step.fly !== undefined) return step.fly;
  if (step.card !== undefined) return (ch.fly?.length ?? 0) + step.card;
  return undefined;
}

/** The step a guide fly link (chapter, link index) flies to; -1 when the tour has no step for it. */
export function stepOfLink(guide: Guide, story: Story, chapter: string, index: number): number {
  return story.steps.findIndex((s) => s.chapter === chapter && linkIndex(guide, s) === index);
}

/** The sections the map follows, in reading order: the lede (chapter null) and each chapter the tour visits, with the step it shows. */
export function sectionSteps(story: Story): Array<{ chapter: string | null; step: number }> {
  const out: Array<{ chapter: string | null; step: number }> = [];
  story.steps.forEach((s, i) => { if (!out.some((o) => o.chapter === s.chapter)) out.push({ chapter: s.chapter, step: i }); });
  return out;
}

/** The page element a section's map step starts at: the guide's lede, or the chapter's block. */
export const sectionSelector = (chapter: string | null): string => (chapter === null ? '.pg-spine' : `#terroir-${chapter}`);
