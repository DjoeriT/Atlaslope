// Where each step of a map tour sits on the guide page (owner, 21 Oct 2026: the tour is folded into the guide, layout A).
// Scrolling follows the steps in reading order: a step with a guide fly link (or zone card) comes up when that link crosses the
// reading line; an overview keeps its chapter's top, and the opening view the lede, as anchor. Every step is reached, and "Stop n of N"
// counts 1, 2, 3 as the reader goes down. A click on a link still flies to its exact step. A link's index is the guide page's numbering: the chapter's
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

/** The attribute value the guide page puts on a fly link or zone card pill (PlacePage, `pill`). */
export const flyKey = (chapter: string, index: number): string => `${chapter}.${index}`;

/** The page element a step comes up at: its own fly link, else its chapter's block (an overview), else the guide's lede. */
export function anchorOf(guide: Guide, step: StoryStep): string {
  if (step.chapter === null) return '.pg-spine';
  const i = linkIndex(guide, step);
  return i === undefined ? `#terroir-${step.chapter}` : `[data-fly="${flyKey(step.chapter, i)}"]`;
}

/** The names a fly label gives a stop ("Haro to Alfaro, the whole valley": Haro, Alfaro), without the place's own name. */
function stopNames(label: string, placeId: string): string[] {
  const own = new Set(placeId.split('-'));
  return (label.match(/\p{Lu}[\p{L}-]{2,}/gu) ?? []).map((w) => w.replace(/'s$/, '')).filter((w) => !own.has(w.toLowerCase()));
}

/** Where each step comes up while reading (owner 22 Oct 2026: the map was late, it moved only when the link row under the text
 *  passed). A fly stop comes up at the paragraph that names it; its chapter's first stop at the chapter's start. Paragraphs only
 *  move forward within a chapter, so the steps stay in reading order. Zone cards, overviews and the lede keep anchorOf. */
export function anchorsOf(guide: Guide, story: Story): string[] {
  const at = new Map<string, number>();
  return story.steps.map((st) => {
    const ch = guide.chapters.find((c) => c.id === st.chapter);
    // A zone card names its stop at its top: the card, not the link at its foot.
    if (ch && st.card !== undefined) return `.pg-zguide > :has(${anchorOf(guide, st)})`;
    const fly = ch && st.fly !== undefined ? ch.fly?.[st.fly] : undefined;
    if (!ch || !fly) return anchorOf(guide, st);
    const from = at.get(ch.id);
    const names = stopNames(fly.label, guide.id);
    const start = from ?? 0;
    const hit = ch.paras.findIndex((p, i) => i >= start && names.some((n) => p.includes(n)));
    const i = hit < 0 ? start : hit;
    at.set(ch.id, i);
    return from === undefined && i === 0 ? `#terroir-${ch.id}` : `[data-b="${ch.id}.${i}"]`;
  });
}
