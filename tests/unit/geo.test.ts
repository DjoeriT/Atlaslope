import { describe, expect, it } from 'vitest';
import { inSpainBox } from '../../src/geo';

describe('inSpainBox', () => {
  it('accepts Logroño', () => expect(inSpainBox([-2.45, 42.47])).toBe(true));
  it('rejects Paris', () => expect(inSpainBox([2.35, 48.86])).toBe(false));
});
