// What the address bar says: which card is open and where the map is looking. It lives in the hash, so the page is static-host
// friendly and the debug query flags stay out of the way.  #place=toro   #region=rioja   #place=rioja-alta&view=-2.4,42.3,9.1,0,45
import type { NodeKind } from './tree';

export interface Selection {
  kind: NodeKind;
  id: string;
  /** The full page of a place or region (#place=toro&page, #region=rioja&page) instead of its card. */
  page?: boolean;
  /** A fly-there from a guide (#place=rioja&fly=valley.1): the chapter id and the pill's number in it. */
  fly?: { chapter: string; index: number };
  /** The guide chapter the page opens scrolled to (#place=rioja&page&at=valley), after "Back to the guide". */
  at?: string;
  /** The guide read with the map (#place=rioja&page&story): the guide page with its map tour column open. */
  story?: boolean;
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
  if (sel.fly && sel.kind === 'place') p.set('fly', `${sel.fly.chapter}.${sel.fly.index}`);
  if (sel.page && sel.kind !== 'country') p.set('page', '');
  if (sel.at && sel.page && sel.kind === 'place') p.set('at', sel.at);
  if (sel.story && sel.page && sel.kind === 'place') p.set('story', '');
  if (view) p.set('view', viewToText(view));
  // `page` and `story` are flags, written bare rather than as page=
  const text = p.toString().replace(/%2C/g, ',').replace(/(^|&)(page|story)=(?=&|$)/g, '$1$2');
  return text ? `#${text}` : '';
}

/** The selection a hash names, as written; the caller checks the id exists (an unknown one means Spain). */
export function parseSelection(hash: string): Selection {
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  const place = p.get('place');
  const region = p.get('region');
  const page = p.has('page') || undefined;
  if (place) {
    const sel: Selection = { kind: 'place', id: place };
    const fly = /^(.+)\.(\d+)$/.exec(p.get('fly') ?? '');
    if (fly && !page) sel.fly = { chapter: fly[1], index: Number(fly[2]) };
    if (page) sel.page = page;
    const at = p.get('at');
    if (page && at) sel.at = at;
    if (page && p.has('story')) sel.story = true;
    return sel;
  }
  if (region) return page ? { kind: 'region', id: region, page } : { kind: 'region', id: region };
  return SPAIN;
}

/** The Study route (the code keeps the name quiz): #study, with #study=practise, #study=focus and #study=progress-file for the screens, and
 *  #study=test&set=a,b which starts a review round of 10 on those places at once. Links from before the rename (#quiz=...) still open it, and so does #learn (the name users see since 21 Oct 2026). */
export type QuizSub = 'practise' | 'focus' | 'progress-file' | 'test' | null;
export interface QuizRoute { sub: QuizSub; /** The places of a `test` round. */ set?: string[] }
const QUIZ_SUBS = ['practise', 'focus', 'progress-file', 'test'] as const;

/** The Study route a hash names, or null when it names the atlas. An unknown sub-route means plain #study. */
export function parseQuizRoute(hash: string): QuizRoute | null {
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  const key = ['study', 'learn', 'quiz'].find((k) => p.has(k));
  if (!key) return null;
  const sub = p.get(key);
  const found = QUIZ_SUBS.find((s) => s === sub) ?? null;
  if (found !== 'test') return { sub: found };
  const set = (p.get('set') ?? '').split(',').filter(Boolean);
  return set.length ? { sub: 'test', set } : { sub: null };
}

export function quizToHash(route: QuizRoute, view?: View | null): string {
  const parts = [route.sub ? `study=${route.sub}` : 'study'];
  if (route.sub === 'test' && route.set?.length) parts.push(`set=${route.set.join(',')}`);
  if (view) parts.push(`view=${viewToText(view)}`);
  return `#${parts.join('&')}`;
}

/** The same address with a new camera view. Built from the address itself, not from app state: a new card or quiz screen is in
 *  the address before its state lands (the motion runs the change a frame later), and rewriting from state put the old screen
 *  back over it (release 17 publish runs: "#quiz=focus" became "#quiz", Escape from a page went back to the region). */
export function withView(hash: string, view: View): string {
  const route = parseQuizRoute(hash);
  return route ? quizToHash(route, view) : selectionToHash(parseSelection(hash), view);
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
