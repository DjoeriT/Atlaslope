export const SPAIN_CENTER: [number, number] = [-3.7, 40.2];
export const SPAIN_ZOOM = 5.3;

/** Rough bounds check used by tests and the quiz: is a point inside mainland Spain's bounding box? */
export function inSpainBox([lng, lat]: [number, number]): boolean {
  return lng >= -9.5 && lng <= 3.5 && lat >= 35.9 && lat <= 43.9;
}
