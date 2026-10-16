// What the address bar says: which card is open and where the map is looking. It lives in the hash, so the page is static-host
// friendly and the debug query flags stay out of the way.  #place=toro   #region=rioja   #place=rioja-alta&view=-2.4,42.3,9.1,0,45
import type { NodeKind } from './tree';

export interface Selection {
  kind: NodeKind;
  id: string;
}

export interface View {
  lng: number;
  lat: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

export const SPAIN: Selection = { kind: 'country', id: 'spain' };

export function selectionToHash(sel: Selection, view?: View | null): string {
  const p = new URLSearchParams();
  if (sel.kind === 'place') p.set('place', sel.id);
  else if (sel.kind === 'region') p.set('region', sel.id);
  if (view) p.set('view', viewToText(view));
  const text = p.toString().replace(/%2C/g, ',');
  return text ? `#${text}` : '';
}

/** The selection a hash names, as written; the caller checks the id exists (an unknown one means Spain). */
export function parseSelection(hash: string): Selection {
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  const place = p.get('place');
  const region = p.get('region');
  if (place) return { kind: 'place', id: place };
  if (region) return { kind: 'region', id: region };
  return SPAIN;
}

export function viewToText(v: View): string {
  return [v.lng.toFixed(4), v.lat.toFixed(4), v.zoom.toFixed(2), v.bearing.toFixed(0), v.pitch.toFixed(0)].join(',');
}

export function parseView(hash: string): View | null {
  const text = new URLSearchParams(hash.replace(/^#/, '')).get('view');
  if (!text) return null;
  const n = text.split(',').map(Number);
  if (n.length !== 5 || n.some((x) => !Number.isFinite(x))) return null;
  const [lng, lat, zoom, bearing, pitch] = n;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180 || zoom < 0 || zoom > 24 || pitch < 0 || pitch > 85) return null;
  return { lng, lat, zoom, bearing, pitch };
}
