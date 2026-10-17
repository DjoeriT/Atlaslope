import type { GlanceCell } from '../pages/helpers';

const ICONS: Record<GlanceCell['kind'], string> = {
  grapes: 'M11.5 6.7V3.5M11.5 4.5c1.5-1.5 3.5-1.6 5-1M9 9m-2.3 0a2.3 2.3 0 1 0 4.6 0a2.3 2.3 0 1 0-4.6 0M14 9m-2.3 0a2.3 2.3 0 1 0 4.6 0a2.3 2.3 0 1 0-4.6 0M11.5 13m-2.3 0a2.3 2.3 0 1 0 4.6 0a2.3 2.3 0 1 0-4.6 0M9.3 17m-2.3 0a2.3 2.3 0 1 0 4.6 0a2.3 2.3 0 1 0-4.6 0M13.7 17m-2.3 0a2.3 2.3 0 1 0 4.6 0a2.3 2.3 0 1 0-4.6 0',
  wine: 'M7 3h10v5a5 5 0 0 1-10 0zM12 13v7M8.5 20.5h7M7 8h10',
  altitude: 'M2.5 19.5l6.5-11 4 6.5 2.5-3.5 6 8z',
};

/** The teaser's three-cell row: each cell a small line icon, a big word and a small caption. Only the cells that have data are passed in. */
export function Glance({ cells }: { cells: GlanceCell[] }) {
  if (cells.length === 0) return null;
  return (
    <div className="glance" style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}>
      {cells.map((c) => (
        <div key={c.kind}>
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[c.kind]} /></svg>
          <b>{c.big}</b><small>{c.small}</small>
        </div>
      ))}
    </div>
  );
}
