// Debug-only query flags. __DEBUG_FLAGS__ is false in the production build, so everything below is removed from it
// (Tools/check.sh greps dist/ to prove it). Flags: ?fixture=<name> (card 4 picks a test dataset), ?fresh=1 (forget first run and theme).
declare const __DEBUG_FLAGS__: boolean;

export const STORAGE_KEYS = ['atlaslope-first-run', 'atlaslope-theme'];

export interface DebugFlags {
  fixture: string | null;
}

export function applyDebugFlags(search: string = location.search): DebugFlags {
  if (!__DEBUG_FLAGS__) return { fixture: null };
  const params = new URLSearchParams(search);
  if (params.get('fresh') === '1') {
    try { STORAGE_KEYS.forEach((k) => localStorage.removeItem(k)); } catch { /* storage blocked: nothing to reset */ }
  }
  return { fixture: params.get('fixture') };
}
