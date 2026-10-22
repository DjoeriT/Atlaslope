// The "Read with the map" card unfolds into the map mode and "Close the map" folds back (approved mock Review/mock-guide-redesign-r2/story.js,
// owner 22 Oct 2026). The card's photo grows from its box to the full screen (FLIP, 900 ms), the map mode opens under it, and the photo
// cross-fades away once the map has drawn. Reduced motion: no growing, a plain short cross-fade.
export const UNFOLD_MS = 900;
export const MAP_IDLE_EVENT = 'story-map-idle';
const EASE = 'cubic-bezier(.65,0,.2,1)';

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const fade = (el: Element, from: number, to: number, ms: number) =>
  el.animate([{ opacity: from }, { opacity: to }], { duration: reducedMotion() ? Math.min(ms, 250) : ms, easing: 'ease', fill: 'forwards' }).finished;

/** Grows a copy of the photo from its box over the whole screen. Resolves with a function that fades it away (call it once the map is drawn). */
export async function growFrom(img: HTMLImageElement): Promise<() => Promise<void>> {
  const r = img.getBoundingClientRect();
  const g = document.createElement('div');
  g.className = 'grow';
  const copy = document.createElement('img');
  copy.alt = '';
  copy.src = img.currentSrc || img.src;
  copy.style.objectPosition = getComputedStyle(img).objectPosition;
  g.append(copy);
  document.body.append(g);
  const from = { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, borderRadius: '6px' };
  const to = { left: '0px', top: '0px', width: `${innerWidth}px`, height: `${innerHeight}px`, borderRadius: '0px' };
  Object.assign(g.style, from);
  await g.animate([from, to], { duration: UNFOLD_MS, easing: EASE, fill: 'forwards' }).finished;
  return async () => {
    await new Promise<void>((res) => {
      const t = setTimeout(res, 2500);
      addEventListener(MAP_IDLE_EVENT, () => { clearTimeout(t); setTimeout(res, 150); }, { once: true });
    });
    await fade(g, 1, 0, 700);
    g.remove();
  };
}

/** A plain cross-fade of an element (the map mode opening with reduced motion, the page returning on fold-back). */
export const crossFade = (el: Element, ms: number) => fade(el, 0, 1, ms);
