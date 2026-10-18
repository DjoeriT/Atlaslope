import { flushSync } from 'react-dom';

// Motion between screens (owner card, 17 Oct 2026: "Full set"). The browser's view transitions crossfade what changed; the card,
// the page and the cover photo carry names (app.css "Motion") so each gets its own move, and the cover photo travels from the card to
// the page. No motion under "reduce motion", and none in browsers without view transitions (the change simply happens).
type Doc = Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };

let running: Promise<void> | null = null;

/** Runs `fn` once the screen change in progress has finished, or now when none is. The map waits, so its flight and the card's
 *  move don't compete for the same frames (owner, 17 Oct 2026: "jittery and too fast"). */
export function afterMotion(fn: () => void) {
  // Without a transition, wait two frames so the sheet's new height has landed before the map measures it (PR #63 review).
  if (running) running.then(fn); else requestAnimationFrame(() => requestAnimationFrame(fn));
}

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Runs a state change as one view transition. `kind` lands on <html data-motion> for the CSS to pick the move. */
export function withMotion(change: () => void, kind: 'card' | 'page-open' | 'page-close' | 'step' = 'card') {
  const doc = document as Doc;
  if (!doc.startViewTransition || reduce() || document.visibilityState !== 'visible') { change(); return; }
  document.documentElement.dataset.motion = kind;
  const vt = doc.startViewTransition(() => flushSync(change));
  const done: Promise<void> = vt.finished.catch(() => {}).then(() => {
    if (document.documentElement.dataset.motion === kind) delete document.documentElement.dataset.motion;
    if (running === done) running = null;
  });
  running = done;
}
