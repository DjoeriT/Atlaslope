// The ten study-region colours: the map legend and the Spain card (approved mock 15-explore-spain.html).
export const REGION_COLORS: Record<string, string> = {
  'green-spain': '#6B9A6E',
  'castilla-y-leon': '#A26A88',
  rioja: '#AE4656',
  ebro: '#C79A48',
  cataluna: '#D4845F',
  mediterranean: '#D8B36E',
  meseta: '#B3A48C',
  andalucia: '#A86E4E',
  baleares: '#6E98B5',
  canarias: '#4F7FA3',
};

/** Neutral grey for a region with no colour yet (a second country, say). */
export const NO_REGION_COLOR = '#8A7F72';

export const regionColor = (regionId: string): string => REGION_COLORS[regionId] ?? NO_REGION_COLOR;
