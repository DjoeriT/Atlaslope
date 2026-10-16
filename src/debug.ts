// Debug-only query flags. Everything here is tree-shaken out of production builds (import.meta.env.DEV guard),
// and Tools/check.sh greps dist/ to make sure. List every flag in README.md "Commands".
export interface DebugFlags {
  fixture?: string; // ?fixture=<name>: load tests/ui/fixtures/<name>.geojson instead of data/, with no remote sources
  fresh?: boolean;  // ?fresh=1: clear stored progress on start
}

export function debugFlags(search: string): DebugFlags {
  if (!import.meta.env.DEV) return {};
  const q = new URLSearchParams(search);
  const flags: DebugFlags = {};
  const fixture = q.get('fixture');
  if (fixture && /^[a-z0-9-]+$/.test(fixture)) flags.fixture = fixture;
  if (q.get('fresh') === '1') flags.fresh = true;
  return flags;
}

/** Fixture layer (already in the app's DopProps shape, so no overrides). Dev server only. */
export async function loadFixture(name: string): Promise<unknown> {
  if (!import.meta.env.DEV) throw new Error('fixtures are dev-only');
  const res = await fetch(`/tests/ui/fixtures/${name}.geojson`);
  if (!res.ok) throw new Error(`fixture ${name}: ${res.status}`);
  return res.json();
}

/** Lets UI tests reach the map (to project coordinates to pixels). Dev server only. */
export function exposeForTests(value: unknown): void {
  if (import.meta.env.DEV) (window as unknown as { __paraje: unknown }).__paraje = value;
}
