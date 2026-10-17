import type { KoppenShare, Measures } from '../facts';
import { strings } from '../strings';
import { altitudeBar, climateSegments } from './helpers';

const t = strings.place.page;

const TINTS = ['var(--tint1)', 'var(--tint2)', 'var(--tint3)', 'var(--tint4)'];

/** Measured climate as one stacked bar. The words are the legend and the bar's label; the colours are tints of the accent only. */
export function ClimateBar({ shares }: { shares: KoppenShare[] }) {
  const segments = climateSegments(shares);
  let x = 0;
  return (
    <>
      <svg className="pg-stack" viewBox="0 0 100 4" preserveAspectRatio="none" role="img" aria-label={t.climateChart(segments.map((s) => s.label).join(', '))}>
        {segments.map((s, i) => {
          const rect = <rect key={s.label} x={x} y="0" width={Math.max(0, s.pct - 0.4)} height="4" fill={TINTS[i]} />;
          x += s.pct;
          return rect;
        })}
      </svg>
      <ul className="pg-legend" aria-hidden="true">
        {segments.map((s, i) => <li key={s.label}><i style={{ background: TINTS[i] }} />{s.label}</li>)}
      </ul>
    </>
  );
}

/** Altitude as a range bar: 10th to 90th percentile of the land, a tick at the median, the numbers printed on it. */
export function AltitudeRange({ altitude }: { altitude: Measures['altitude'] }) {
  const bar = altitudeBar(altitude);
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
