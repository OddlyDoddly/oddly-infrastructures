import { describe, it, expect } from 'vitest';
import exampleReducer, {
  selectItem,
  setFilterStatus,
  resetExampleState,
} from '../model/example.slice';
import type { ExampleState } from '../model/example.types';

describe('exampleSlice', () => {
  const initialState: ExampleState = {
    selectedItemId: null,
    filterStatus: 'all',
  };

  it('should return the initial state', () => {
    expect(exampleReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle selectItem', () => {
    const actual = exampleReducer(initialState, selectItem('item-123'));
    expect(actual.selectedItemId).toBe('item-123');
  });

  it('should handle setFilterStatus', () => {
    const actual = exampleReducer(initialState, setFilterStatus('active'));
    expect(actual.filterStatus).toBe('active');
  });

  it('should handle resetExampleState', () => {
    const modifiedState: ExampleState = {
      selectedItemId: 'item-123',
      filterStatus: 'active',
    };
    const actual = exampleReducer(modifiedState, resetExampleState());
    expect(actual).toEqual(initialState);
  });
});
