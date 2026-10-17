// Places coloured by climate (owner card 17 Oct 2026, "climate, plus region"): the Köppen class with the largest share of each place
// (data/place-measures.json, Beck et al. CC BY 4.0), in six plain-word groups. Places not measured yet are grey.
import { measuresOf } from '../facts';

export interface ClimateGroup { id: string; label: string; codes: string[]; color: string }

export const CLIMATE_GROUPS: ClimateGroup[] = [
  { id: 'oceanic', label: 'Oceanic', codes: ['Cfb'], color: '#1F5F85' },
  { id: 'humid', label: 'Humid, hot summers', codes: ['Cfa'], color: '#4FAE86' },
  { id: 'med-warm', label: 'Mediterranean, warm summers', codes: ['Csb'], color: '#D2D45A' },
  { id: 'med-hot', label: 'Mediterranean, hot summers', codes: ['Csa'], color: '#D1761C' },
  { id: 'steppe', label: 'Dry, cold winters', codes: ['BSk'], color: '#B4A2DB' },
  { id: 'arid', label: 'Hot and dry', codes: ['BSh', 'BWh'], color: '#9E2A1B' },
];
export const NO_CLIMATE_COLOR = '#9A948A';

export function climateGroupOf(placeId: string): ClimateGroup | undefined {
  const shares = measuresOf(placeId)?.koppen ?? [];
  if (!shares.length) return undefined;
  const top = shares.reduce((a, b) => (b.share > a.share ? b : a));
  return CLIMATE_GROUPS.find((g) => g.codes.includes(top.code));
}

export const climateColor = (placeId: string): string => climateGroupOf(placeId)?.color ?? NO_CLIMATE_COLOR;
