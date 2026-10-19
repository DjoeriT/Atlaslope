// Debug-only query flags. __DEBUG_FLAGS__ is false in the production build, so everything below is removed from it
// (Tools/check.sh greps dist/ to prove it). Flags: ?fixture=<name> (card 4 picks a test dataset), ?fresh=1 (forget first run),
// ?motion=subtle|bold (motion strength, design round 1), ?noguide=<id> (that place shows as having no guide).
declare const __DEBUG_FLAGS__: boolean;

export const STORAGE_KEYS = ['atlaslope-first-run'];

export interface DebugFlags {
  fixture: string | null;
}

export function applyDebugFlags(search: string = location.search): DebugFlags {
  if (!__DEBUG_FLAGS__) return { fixture: null };
  const params = new URLSearchParams(search);
  // ?motion=subtle|bold: the motion strength for design round 1 (owner points 8 and 9); the build ships "balanced".
  const level = params.get('motion');
  if (level === 'subtle' || level === 'bold') document.documentElement.dataset.motionLevel = level;
  if (params.get('fresh') === '1') {
    try { STORAGE_KEYS.forEach((k) => localStorage.removeItem(k)); } catch { /* storage blocked: nothing to reset */ }
  }
  return { fixture: params.get('fixture') };
}

/** `?noguide=<id>`: that place shows as having no guide, so the UI tests keep a "no guide" page once every place has one (Meseta batch 3,
 * 19 Oct 2026). Null in the production build. */
export function debugNoGuide(): string | null {
  if (!__DEBUG_FLAGS__ || typeof location === 'undefined') return null;
  return new URLSearchParams(location.search).get('noguide');
}

/** `?now=<ISO time>`: a fixed start for the quiz clock (it keeps counting from there), so a test can plan and log at a known time. Null in the production build. */
export function debugNow(search: string = location.search): string | null {
  if (!__DEBUG_FLAGS__) return null;
  return new URLSearchParams(search).get('now');
}

/** Debug builds only: `window.__quizPick(id)` does what a tap on that place on the map does in quiz mode (the UI tests cannot aim at the canvas). */
export function exposeQuizPick(pick: (id: string) => void): void {
  if (__DEBUG_FLAGS__) (window as unknown as { __quizPick?: (id: string) => void }).__quizPick = pick;
}
