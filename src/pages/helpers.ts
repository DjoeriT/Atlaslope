// Pure helpers for the teaser card and the full place page: which photos, which glance cells, how the two charts are drawn.
import { grapeLabel, STYLE_KINDS, type KoppenShare, type Measures, type ShownPhoto, type Sheet } from '../facts';
import { strings } from '../strings';
import type { Place, Region, Tree } from '../tree';

const t = strings.place;
const tf = strings.facts;

export type Pic = ShownPhoto;

/** The photos of a mosaic: the place's own first, then one per zone, no photo twice, at most five. */
export function mosaicPics(own: Pic[], zonePics: Pic[], max = 5): Pic[] {
  const seen = new Set<string>();
  const out: Pic[] = [];
  for (const p of [...own, ...zonePics]) {
    if (seen.has(p.src)) continue;
    seen.add(p.src);
    out.push(p);
  }
  return out.slice(0, max);
}

const round10 = (n: number) => Math.round(n / 10) * 10;
const fmt = (n: number) => round10(n).toLocaleString('en');

export interface GlanceCell {
  kind: 'grapes' | 'wine' | 'altitude';
  big: string;
  small: string;
}

/** The cells of the teaser's glance row and only those the sheet or the measures hold: main grapes, wine types, altitude. */
export function glanceCells(sheet?: Sheet, measures?: Measures): GlanceCell[] {
  const cells: GlanceCell[] = [];
  const main = sheet?.grapes.main ?? [];
  if (main.length > 0) {
    const usual = (g: (typeof main)[number]) => g.grape ?? g.local;
    const small = main.length === 1 ? t.glance.mainGrape : main.length === 2 ? t.glance.grapeAnd(usual(main[1])) : t.glance.grapeAndMore(main.length - 1);
    cells.push({ kind: 'grapes', big: usual(main[0]), small });
  }
  const kinds = sheet?.styles.kinds ?? [];
  if (kinds.length > 0) {
    const names = STYLE_KINDS.filter((k) => kinds.includes(k)).map((k) => tf.styleKinds[k]);
    cells.push({ kind: 'wine', big: names.map((n, i) => (i === 0 ? n : n.toLowerCase())).join(', '), small: t.glance.wineTypes });
  }
  if (measures) {
    const { p10, p90 } = measures.altitude;
    cells.push({ kind: 'altitude', big: `${fmt(p10)}–${fmt(p90)} m`, small: t.glance.mostOfTheLand });
  }
  return cells;
}

/** The main grapes by their local names with the usual name in brackets, for the page. */
export const mainGrapeLabels = (sheet?: Sheet) => (sheet?.grapes.main ?? []).map(grapeLabel);

export interface ClimateSegment {
  label: string;
  /** 0 to 100, exact; the label carries the rounded number. */
  pct: number;
}

/** The measured Köppen shares as bar segments: the three biggest, then "Other" for what is left (when it rounds to 1% or more). */
export function climateSegments(shares: KoppenShare[]): ClimateSegment[] {
  const sorted = [...shares].sort((a, b) => b.share - a.share);
  const name = (s: KoppenShare) => {
    const n = tf.koppenNames[s.code] ?? s.code;
    return n.charAt(0).toUpperCase() + n.slice(1);
  };
  const top = sorted.slice(0, 3).map((s) => ({ label: name(s), pct: s.share * 100 }));
  const rest = Math.max(0, 1 - top.reduce((sum, s) => sum + s.pct / 100, 0)) * 100;
  if (Math.round(rest) >= 1) top.push({ label: t.page.otherClimate, pct: rest });
  return top.map((s) => ({ ...s, label: `${s.label} ${Math.round(s.pct)}%` }));
}

/** A comparison row's climate in the place's own classes (same order, same tints), with everything else as "Other", so one legend reads
 * every row. */
export function compareShares(own: KoppenShare[], other: KoppenShare[]): ClimateSegment[] {
  const codes = [...own].sort((a, b) => b.share - a.share).slice(0, 3).map((s) => s.code);
  const rows = codes.map((c) => {
    const s = other.find((o) => o.code === c);
    const n = tf.koppenNames[c] ?? c;
    return { label: `${n.charAt(0).toUpperCase() + n.slice(1)} ${Math.round((s?.share ?? 0) * 100)}%`, pct: (s?.share ?? 0) * 100 };
  });
  const rest = Math.max(0, 100 - rows.reduce((sum, r) => sum + r.pct, 0));
  if (Math.round(rest) >= 1) rows.push({ label: `${t.page.otherClimate} ${Math.round(rest)}%`, pct: rest });
  return rows;
}

export interface AltitudeBar {
  /** Positions on the 0 to `max` m scale, in percent. */
  from: number;
  to: number;
  median: number;
  max: number;
  low: string;
  high: string;
  mid: string;
}

/** The 10th to 90th percentile as a bar on a fixed 0 to 2000 m scale (wider only when a place goes higher), so places compare at a glance. */
export function altitudeBar(a: Measures['altitude'], atLeast = 0): AltitudeBar {
  const max = Math.max(2000, atLeast, Math.ceil(a.p90 / 500) * 500);
  const at = (m: number) => Math.min(100, Math.max(0, (m / max) * 100));
  return { from: at(a.p10), to: at(a.p90), median: at(a.median), max, low: fmt(a.p10), high: fmt(a.p90), mid: fmt(a.median) };
}

/** The study region after this one in the course, if any. */
export function nextRegion(tree: Tree, regionId: string): Region | undefined {
  const region = tree.getRegion(regionId);
  if (!region) return undefined;
  const all = tree.regionsOf(region.country);
  return all[all.findIndex((r) => r.id === regionId) + 1];
}

/** The mosaic's wine swatch for a tasting line labelled "Reds", "Whites" or "Rosés". */
export function swatchOf(label?: string): 'red' | 'white' | 'rose' | undefined {
  const l = (label ?? '').toLowerCase();
  if (l.startsWith('red')) return 'red';
  if (l.startsWith('white')) return 'white';
  if (l.startsWith('ros')) return 'rose';
  return undefined;
}

export interface Alike { place: Place; why: string }

/** "If you like this, try" (owner, 19 Oct 2026): up to three other places with the same main grape, then the same main measured climate,
 *  from data the app already holds. Never the place's own zones or the place it is a zone of. Each card says what differs (#126: three
 *  identical "Tempranillo here too" lines): the height, then the climate, then the study region, and no two cards say the same thing. */
export function alikePlaces(tree: Tree, place: Place, sheetOf: (id: string) => Sheet | undefined, measuresOf: (id: string) => Measures | undefined): Alike[] {
  const usual = (s?: Sheet) => (s?.grapes.main ?? []).map((g) => g.grape ?? g.local);
  const own = usual(sheetOf(place.id));
  const top = (id: string) => measuresOf(id)?.koppen[0];
  const ownTop = top(place.id);
  const scored = tree.places
    .filter((p) => p.id !== place.id && p.quiz !== 'none' && p.parent !== place.id && place.parent !== p.id && sheetOf(p.id))
    .map((p) => {
      const theirs = usual(sheetOf(p.id));
      const grape = own.find((g) => theirs.includes(g));
      const first = !!grape && grape === own[0];
      const climate = !!ownTop && top(p.id)?.code === ownTop.code;
      const score = (first ? 4 : grape ? 2 : 0) + (climate ? 1 : 0);
      // Ties break on a stable shuffle of the two ids, so places with the same score do not all suggest the first one in the tree.
      return { place: p, grape, score, order: [...(place.id + p.id)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order);
  // Prefer one place per study region, so the three suggestions travel.
  const out: typeof scored = [];
  const regions = new Set<string>([place.region]);
  for (const x of scored) if (out.length < 3 && !regions.has(x.place.region)) { out.push(x); regions.add(x.place.region); }
  for (const x of scored) if (out.length < 3 && !out.includes(x)) out.push(x);
  // Each card takes a kind of reason no earlier card took, so the three lines read differently, not just with other numbers; a card
  // that could only repeat an earlier line is left out.
  const used = new Set<string>();
  const said = new Set<string>();
  const ownUp = measuresOf(place.id)?.altitude.median;
  const words = t.page.alike;
  return out.map(({ place: p, grape }) => {
    const lead = grape ?? (ownTop && words.climateLead[ownTop.code]) ?? words.sameClimate;
    const theirUp = measuresOf(p.id)?.altitude.median;
    const gap = ownUp === undefined || theirUp === undefined ? 0 : theirUp - ownUp;
    const rise = Math.sign(gap) * Math.round(Math.abs(gap) / 50) * 50; // same rounding up and down
    const theirTop = top(p.id);
    const summers = grape && theirTop && theirTop.code !== ownTop?.code ? words.climate[theirTop.code] : undefined;
    const regionName = p.region !== place.region ? tree.getRegion(p.region)?.name : undefined;
    const kinds: Array<[string, string]> = [
      ['height', Math.abs(rise) >= 150 ? words.height(lead, rise) : ''],
      ['climate', summers ? `${lead} ${summers}` : ''],
      ['region', regionName ? words.inRegion(lead, regionName) : ''],
    ].filter((k): k is [string, string] => !!k[1]);
    kinds.push(['height', Math.abs(rise) >= 50 ? words.height(lead, rise) : ''], ['too', words.too(lead)]);
    const fresh = kinds.filter(([, w]) => w && !said.has(w));
    const pick = fresh.find(([k]) => !used.has(k)) ?? fresh[0];
    if (!pick) return undefined;
    used.add(pick[0]);
    said.add(pick[1]);
    return { place: p, why: pick[1] };
  }).filter((a): a is Alike => !!a);
}
