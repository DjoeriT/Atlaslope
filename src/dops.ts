// The DO layer (data/dops.geojson) is the ministry's 2014 file. data/dop-overrides.json carries today's names, levels and
// study regions, plus the DOPs that have no polygon yet. Everything the app shows goes through applyOverrides().
export type Kind = 'DOCa' | 'DO' | 'VP' | 'VC';

export interface DopProps {
  code: string;
  name: string;
  kind: Kind;
  region: string; // key into Overrides.regions
  note?: string;
}

export interface Overrides {
  regions: Record<string, string>;
  byCode: Record<string, Partial<Pick<DopProps, 'name' | 'kind' | 'region' | 'note'>>>;
  missing: Array<{ name: string; kind: Kind; region: string; since: number }>;
}

interface Feature { type: 'Feature'; properties: Record<string, unknown>; geometry: unknown }
interface Collection { type: 'FeatureCollection'; features: Feature[] }

/** Returns a copy of the layer with corrected properties. Throws if an override names a code the layer lacks, or a region that isn't defined. */
export function applyOverrides(layer: Collection, o: Overrides): Collection {
  const codes = new Set(layer.features.map((f) => String(f.properties.code)));
  for (const code of Object.keys(o.byCode)) {
    if (!codes.has(code)) throw new Error(`dop-overrides: unknown code ${code}`);
  }
  const features = layer.features.map((f) => {
    const code = String(f.properties.code);
    const fix = o.byCode[code] ?? {};
    const region = fix.region ?? String(f.properties.region ?? '');
    if (!(region in o.regions)) throw new Error(`dop-overrides: ${code} has no study region`);
    const props: DopProps = {
      code,
      name: fix.name ?? String(f.properties.name),
      kind: (fix.kind ?? normaliseKind(String(f.properties.kind))) as Kind,
      region,
      ...(fix.note ? { note: fix.note } : {}),
    };
    return { ...f, properties: props };
  });
  return { type: 'FeatureCollection', features };
}

/** The 2014 layer labels the all-islands VC as "DOP"; everything else uses the four kinds. */
function normaliseKind(kind: string): Kind {
  return kind === 'DOP' ? 'VC' : (kind as Kind);
}

export function countByKind(layer: Collection, o: Overrides): Record<Kind, number> {
  const counts: Record<Kind, number> = { DOCa: 0, DO: 0, VP: 0, VC: 0 };
  for (const f of applyOverrides(layer, o).features) counts[(f.properties as unknown as DopProps).kind]++;
  for (const m of o.missing) counts[m.kind]++;
  return counts;
}
