// Tests make no tile requests. The UI-test build (--mode uitest) and any dev page opened with a fixture flag switch every tile source off.
// In the production build __DEBUG_FLAGS__ is false, so the function is always true there.
declare const __DEBUG_FLAGS__: boolean;

export function tilesEnabled(search: string = location.search): boolean {
  if (!__DEBUG_FLAGS__) return true;
  if (import.meta.env.MODE === 'uitest') return false;
  return new URLSearchParams(search).get('fixture') === null;
}
