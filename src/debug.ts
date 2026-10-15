// Debug-only query flags. Everything here is tree-shaken out of production builds (import.meta.env.DEV guard),
// and Tools/check.sh greps dist/ to make sure. List every flag in README.md "Commands".
export interface DebugFlags {
  fixture?: string; // ?fixture=<name>: load tests/fixtures/<name>.geojson instead of data/
  fresh?: boolean;  // ?fresh=1: clear stored progress on start
}

export function debugFlags(search: string): DebugFlags {
  if (!import.meta.env.DEV) return {};
  const q = new URLSearchParams(search);
  const flags: DebugFlags = {};
  const fixture = q.get('fixture');
  if (fixture) flags.fixture = fixture;
  if (q.get('fresh') === '1') flags.fresh = true;
  return flags;
}
