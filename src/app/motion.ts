import { useEffect, useState, type RefObject } from 'react';
import { flushSync } from 'react-dom';

// Motion between screens (owner card, 17 Oct 2026: "Full set"). The browser's view transitions crossfade what changed; the card,
// the page and the cover photo carry names (app.css "Motion") so each gets its own move, and the cover photo travels from the card to
// the page. No motion under "reduce motion", and none in browsers without view transitions (the change simply happens).
// Owner points 8 and 9 (18 Oct 2026) add the moves inside a guide (sections, charts) and between guides; the spec is
// Review/motion-spec.md and the moves live in styles/motion.css.
type Doc = Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void>; skipTransition?: () => void } };
export type Move = 'card' | 'page-open' | 'page-close' | 'page-step' | 'page-up' | 'step';

let running: Promise<void> | null = null;

/** Runs `fn` once the screen change in progress has finished, or now when none is. The map waits, so its flight and the card's
 *  move don't compete for the same frames (owner, 17 Oct 2026: "jittery and too fast"). */
export function afterMotion(fn: () => void) {
  // Without a transition, wait two frames so the sheet's new height has landed before the map measures it (PR #63 review).
  if (running) running.then(fn); else requestAnimationFrame(() => requestAnimationFrame(fn));
}

export const reduceMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// The last link or button pressed: a guide-to-guide move lets its photo travel to the next guide's header.
let tapped: { el: Element; at: number } | null = null;
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest?.('a,button');
    if (el) tapped = { el, at: performance.now() };
  }, true);
}
const tappedPhoto = () => (tapped && performance.now() - tapped.at < 1000 && tapped.el.isConnected ? tapped.el.querySelector('img') : null);

/** Runs a state change as one view transition. `kind` lands on <html data-motion> for the CSS to pick the move. */
export function withMotion(change: () => void, kind: Move = 'card') {
  const doc = document as Doc;
  if (!doc.startViewTransition || reduceMotion() || document.visibilityState !== 'visible') { change(); return; }
  const html = document.documentElement;
  html.dataset.motion = kind;
  // Between guides the tile's photo, when one was tapped, becomes the next header (the old header then steps aside: motion.css).
  const photo = kind === 'page-step' ? tappedPhoto() : null;
  if (photo instanceof HTMLElement) { photo.style.viewTransitionName = 'hero'; html.dataset.vtFrom = 'tile'; }
  const clear = () => { if (photo instanceof HTMLElement) photo.style.viewTransitionName = ''; delete html.dataset.vtFrom; };
  let applied = false;
  const apply = () => { if (applied) return; applied = true; clear(); flushSync(change); };
  let vt: { finished: Promise<void>; skipTransition?: () => void };
  try {
    vt = doc.startViewTransition(apply);
  } catch {
    clear(); delete html.dataset.motion; change(); return;
  }
  // Navigation never waits on a transition: when the browser has not captured the old screen within a beat (a busy device, the map
  // drawing behind a long guide; CI caught it stuck for seconds), the move is dropped and the change lands at once.
  setTimeout(() => { if (!applied) { vt.skipTransition?.(); apply(); } }, 400);
  const done: Promise<void> = vt.finished.catch(() => {}).then(() => {
    if (html.dataset.motion === kind) delete html.dataset.motion;
    if (running === done) running = null;
  });
  running = done;
}

/** Scrolls a section of a guide into view: a glide, not a jump (owner point 8), then focus lands on its heading. */
export function scrollToSection(id: string, focus: 'heading' | string = 'heading') {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' });
  const target = focus === 'heading' ? document.getElementById(`${id}-h`) ?? el.querySelector<HTMLElement>('h2') : document.getElementById(focus);
  target?.focus({ preventScroll: true });
  if (reduceMotion()) return;
  // The section marks its arrival once the glide has settled, so the eye finds where it landed. A second jump cancels the first's marks.
  arrival?.();
  el.removeAttribute('data-arrived');
  const root = el.closest('.pg') ?? window;
  let timer = 0;
  const settle = () => { clearTimeout(timer); timer = window.setTimeout(land, 120); };
  const land = () => {
    root.removeEventListener('scroll', settle);
    el.setAttribute('data-arrived', '');
    timer = window.setTimeout(() => el.removeAttribute('data-arrived'), 1400);
  };
  arrival = () => { clearTimeout(timer); root.removeEventListener('scroll', settle); el.removeAttribute('data-arrived'); };
  root.addEventListener('scroll', settle, { passive: true });
  settle();
}
let arrival: (() => void) | undefined;

/** True once the element has come into view (and stays true), so a chart draws itself once when it is first seen. */
export function useSeen<T extends Element>(ref: RefObject<T>): boolean {
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined' || reduceMotion());
  useEffect(() => {
    const el = ref.current;
    if (seen || !el) return;
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen]);
  return seen;
}

/** The section under the sticky jump bar as the reader scrolls, so the bar's marker follows the page. */
export function useSectionInView(ids: string[], root: RefObject<HTMLElement>, page = ''): string {
  const [current, setCurrent] = useState('');
  const key = `${page} ${ids.join(' ')}`;
  useEffect(() => {
    const scroller = root.current;
    if (!scroller) return;
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    let frame = 0;
    const pick = () => {
      frame = 0;
      const line = scroller.getBoundingClientRect().top + scroller.clientHeight * 0.3;
      let at = '';
      for (const el of els) if (el.getBoundingClientRect().top <= line) at = el.id;
      // At the very bottom the last section counts, even when it is too short to reach the line.
      if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4 && els.length) at = els[els.length - 1].id;
      setCurrent(at);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(pick); };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    pick();
    return () => { scroller.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [key, root]); // eslint-disable-line react-hooks/exhaustive-deps
  return current;
}

/** The jump bar's marker: one line that slides to the current section's tab instead of jumping between tabs (owner point 8). */
export function useJumpMarker(nav: RefObject<HTMLElement>, current: string) {
  useEffect(() => {
    const bar = nav.current;
    if (!bar) return;
    const place = () => {
      const a = bar.querySelector<HTMLElement>('a[aria-current]');
      if (!a) { delete bar.dataset.mark; return; }
      const pad = parseFloat(getComputedStyle(a).paddingLeft) || 0;
      const first = a === bar.firstElementChild;
      bar.style.setProperty('--mark-x', `${a.offsetLeft + (first ? 0 : pad)}px`);
      bar.style.setProperty('--mark-w', `${a.offsetWidth - (first ? 0 : pad) - (parseFloat(getComputedStyle(a).paddingRight) || 0)}px`);
      bar.dataset.mark = '';
      // On a phone the bar scrolls sideways: keep the current tab in sight.
      if (a.offsetLeft < bar.scrollLeft || a.offsetLeft + a.offsetWidth > bar.scrollLeft + bar.clientWidth) {
        bar.scrollTo({ left: a.offsetLeft - 16, behavior: reduceMotion() ? 'auto' : 'smooth' });
      }
    };
    place();
    // Fonts landing or the bar wrapping move the tabs: the marker follows.
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(place);
    ro?.observe(bar);
    window.addEventListener('resize', place);
    return () => { ro?.disconnect(); window.removeEventListener('resize', place); };
  }, [nav, current]);
}

/** How much longer or shorter camera moves run for the motion strength (design round 1; 1 is the shipped default). */
export const motionScale = () => {
  const level = typeof document === 'undefined' ? undefined : document.documentElement.dataset.motionLevel;
  return level === 'subtle' ? 0.8 : level === 'bold' ? 1.25 : 1;
};
