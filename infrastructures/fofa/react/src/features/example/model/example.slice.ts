import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ExampleState } from './example.types';

/**
 * Initial State
 */
const initialState: ExampleState = {
  selectedItemId: null,
  filterStatus: 'all',
};

/**
 * Example Slice
 * 
 * Redux slice for managing example feature client state.
 * Server state (items list) is managed by RTK Query in the api layer.
 */
export const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    selectItem: (state, action: PayloadAction<string | null>) => {
      state.selectedItemId = action.payload;
    },
    setFilterStatus: (
      state,
      action: PayloadAction<'all' | 'active' | 'inactive' | 'pending'>
    ) => {
      state.filterStatus = action.payload;
    },
    resetExampleState: () => initialState,
  },
});

export const { selectItem, setFilterStatus, resetExampleState } = exampleSlice.actions;

export default exampleSlice.reducer;
