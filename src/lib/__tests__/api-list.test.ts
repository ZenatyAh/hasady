import { describe, expect, it } from 'vitest';
import { unwrapListItems, toApiNumber } from '@/lib/api-list';

describe('api-list helpers', () => {
  it('unwrapListItems returns arrays as-is', () => {
    expect(unwrapListItems([{ id: '1' }])).toEqual([{ id: '1' }]);
  });

  it('unwrapListItems reads items from paginated payloads', () => {
    expect(unwrapListItems({ items: [{ id: '1' }], total: 1 })).toEqual([{ id: '1' }]);
  });

  it('unwrapListItems reads data from alternate paginated payloads', () => {
    expect(unwrapListItems({ data: [{ id: '2' }] })).toEqual([{ id: '2' }]);
  });

  it('toApiNumber coerces numeric strings', () => {
    expect(toApiNumber('12.5')).toBe(12.5);
    expect(toApiNumber(undefined, 3)).toBe(3);
  });
});
