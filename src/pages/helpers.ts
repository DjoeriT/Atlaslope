// Pure helpers for the teaser card and the full place page: which photos, which glance cells, how the two charts are drawn.
import { grapeLabel, STYLE_KINDS, type KoppenShare, type Measures, type ShownPhoto, type Sheet } from '../facts';
import { strings } from '../strings';
import type { Region, Tree } from '../tree';

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
export function altitudeBar(a: Measures['altitude']): AltitudeBar {
  const max = Math.max(2000, Math.ceil(a.p90 / 500) * 500);
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
