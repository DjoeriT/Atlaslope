// Places coloured by climate (owner card 17 Oct 2026, "climate, plus region"): the Köppen class with the largest share of each place
// (data/place-measures.json, Beck et al. CC BY 4.0), in seven plain-word groups. Places not measured yet are grey.
import { measuresOf } from '../facts';

export interface ClimateGroup { id: string; label: string; note: string; codes: string[]; color: string }

// Names that differ in their first word, each with a short line on what sets it apart (owner, 18 Oct 2026: the old six were "very sec,
// and they resemble each other"). Names and lines follow the Köppen definitions; the codes show on hover.
export const CLIMATE_GROUPS: ClimateGroup[] = [
  { id: 'oceanic', label: 'Oceanic', note: 'rain all year, mild summers', codes: ['Cfb'], color: '#1F5F85' },
  { id: 'humid', label: 'Humid subtropical', note: 'rain all year, hot summers', codes: ['Cfa'], color: '#4FAE86' },
  { id: 'med-warm', label: 'Mild Mediterranean', note: 'dry, warm summers', codes: ['Csb'], color: '#D2D45A' },
  { id: 'med-hot', label: 'Hot Mediterranean', note: 'dry, hot summers', codes: ['Csa'], color: '#D1761C' },
  { id: 'steppe', label: 'Cold semi-arid', note: 'dry, cold winters', codes: ['BSk'], color: '#B4A2DB' },
  { id: 'arid', label: 'Hot semi-arid and desert', note: 'dry and hot', codes: ['BSh', 'BWh'], color: '#9E2A1B' },
  // Owner, 23 Oct 2026: Italy's Alpine places (Alto Adige, Trentino, Valtellina) were the first with a cold top class and showed grey.
  { id: 'cold', label: 'Cold', note: 'snowy winters, cool summers', codes: ['Dfb', 'Dfc', 'ET'], color: '#9CC7DA' },
];
export const NO_CLIMATE_COLOR = '#9A948A';
/** "Other" in the guide's climate chart: several small classes together, so none of the group colours. */
export const OTHER_CLIMATE_COLOR = '#D9D3C7';

/** A Köppen code's colour: the same on the map's climate layer, its legend and the guide's climate chart (owner, 21 Oct 2026). */
export const codeColor = (code: string): string => CLIMATE_GROUPS.find((g) => g.codes.includes(code))?.color ?? NO_CLIMATE_COLOR;

export function climateGroupOf(placeId: string): ClimateGroup | undefined {
  const shares = measuresOf(placeId)?.koppen ?? [];
  if (!shares.length) return undefined;
  const top = shares.reduce((a, b) => (b.share > a.share ? b : a));
  return CLIMATE_GROUPS.find((g) => g.codes.includes(top.code));
}

export const climateColor = (placeId: string): string => climateGroupOf(placeId)?.color ?? NO_CLIMATE_COLOR;
