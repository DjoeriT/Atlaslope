import type { KoppenShare, Measures } from '../facts';
import { strings } from '../strings';
import { altitudeBar, climateSegments, compareShares } from './helpers';

const t = strings.place.page;

const TINTS = ['var(--tint1)', 'var(--tint2)', 'var(--tint3)', 'var(--tint4)'];

function Stack({ pcts, label }: { pcts: number[]; label: string }) {
  let x = 0;
  return (
    <svg className="pg-stack" viewBox="0 0 100 4" preserveAspectRatio="none" role="img" aria-label={label}>
      {pcts.map((pct, i) => {
        const rect = <rect key={i} x={x} y="0" width={Math.max(0, pct - 0.4)} height="4" fill={TINTS[i]} />;
        x += pct;
        return rect;
      })}
    </svg>
  );
}

/** Measured climate as one stacked bar, and under it the same classes for the comparison rows (owner point 10, 18 Oct 2026: a number
 * next to a number it can be read against). The words are the legend and the bar's label; the colours are tints of the accent only. */
export function ClimateBar({ name, shares, compare = [] }: { name?: string; shares: KoppenShare[]; compare?: Array<{ label: string; shares: KoppenShare[] }> }) {
  const segments = climateSegments(shares);
  const own = <Stack pcts={segments.map((s) => s.pct)} label={t.climateChart(segments.map((s) => s.label).join(', '))} />;
  return (
    <>
      {compare.length === 0 ? own : (
        <dl className="pg-compare">
          <div className="own"><dt>{name}</dt><dd>{own}</dd></div>
          {compare.map((c) => {
            const rows = compareShares(shares, c.shares);
            return (
              <div key={c.label}>
                <dt>{c.label}</dt>
                <dd><Stack pcts={rows.map((r) => r.pct)} label={t.climateChart(`${c.label}: ${rows.map((r) => r.label).join(', ')}`)} /></dd>
              </div>
            );
          })}
        </dl>
      )}
      <ul className="pg-legend" aria-hidden="true">
        {segments.map((s, i) => <li key={s.label}><i style={{ background: TINTS[i] }} />{s.label}</li>)}
        {/* A comparison row can hold an "Other" the place itself has none of: it still gets its key (PR #92 review). */}
        {compare.some((c) => compareShares(shares, c.shares).length > segments.length) && <li><i style={{ background: TINTS[segments.length] }} />{t.otherClimate}</li>}
      </ul>
    </>
  );
}

function Range({ altitude, max }: { altitude: Measures['altitude']; max: number }) {
  const bar = altitudeBar(altitude, max);
  return (
    <div className="pg-range" role="img" aria-label={t.altitudeRange(bar.low, bar.high, bar.mid)}>
      <svg viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
        <rect x="0" y="0" width="100" height="4" className="track" />
        <rect x={bar.from} y="0" width={Math.max(0.8, bar.to - bar.from)} height="4" className="fill" />
        <line x1={bar.median} x2={bar.median} y1="-2" y2="6" className="tick" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="mid" style={{ left: `${bar.median}%` }}>{t.medianAt(bar.mid)}</span>
      <span className="lo" style={{ right: `${100 - bar.from}%` }}>{bar.low} m</span>
      <span className="hi" style={{ left: `${bar.to}%` }}>{bar.high} m</span>
    </div>
  );
}

/** Altitude as a range bar: 10th to 90th percentile of the land, a tick at the median, the numbers printed on it. With comparison rows,
 * each gets its own bar on the same scale, so the place reads against its study region and Spain. */
export function AltitudeRange({ name, altitude, compare = [] }: { name?: string; altitude: Measures['altitude']; compare?: Array<{ label: string; altitude: Measures['altitude'] }> }) {
  const max = Math.max(altitudeBar(altitude).max, ...compare.map((c) => altitudeBar(c.altitude).max));
  if (compare.length === 0) return <Range altitude={altitude} max={max} />;
  return (
    <dl className="pg-compare">
      <div className="own"><dt>{name}</dt><dd><Range altitude={altitude} max={max} /></dd></div>
      {compare.map((c) => <div key={c.label}><dt>{c.label}</dt><dd><Range altitude={c.altitude} max={max} /></dd></div>)}
    </dl>
  );
}
