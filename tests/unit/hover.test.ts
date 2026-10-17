import { describe, expect, it } from 'vitest';
import { hoverPlaces, hoverProps, onHoverPlaces } from '../../src/map/hover';

describe('hover channel', () => {
  it('passes a row\'s places to the map on enter and focus, and clears them on leave and blur', () => {
    const seen: Array<readonly string[] | null> = [];
    const stop = onHoverPlaces((ids) => seen.push(ids));
    const row = hoverProps(() => ['toro', 'rueda']);
    row.onMouseEnter();
    row.onMouseLeave();
    row.onFocus();
    row.onBlur();
    expect(seen).toEqual([['toro', 'rueda'], null, ['toro', 'rueda'], null]);
    stop();
    hoverPlaces(['toro']);
    expect(seen).toHaveLength(4);
  });
});
