import type { RootState } from '@/app/store';

/**
 * Example Selectors
 * 
 * Selectors are the ONLY way UI components should access Redux state.
 * This enforces encapsulation and makes refactoring easier.
 */

export const selectSelectedItemId = (state: RootState) => state.example.selectedItemId;

export const selectFilterStatus = (state: RootState) => state.example.filterStatus;
